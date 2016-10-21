'use strict';
const db         = require('../util/db');
const schema     = require('../util/schema');
const validation = require('../util/validation');

const table_item;
const context;
const event;

class Item {
  static configure(evnt, cont){
    context    = cont;
    event      = evnt;
    table_item = evnt['stageVariables'].db_test;
  }

  constructor(body) {
    validation.validateBody(body, context, schema.item);

    this.nome  = body.nome;
    this.idade = body.idade;
  };

  static list(){
    return db.listItems(table_item);
  }

  static get() {
    return db.getItem(table_item, event['pathParameters'].id);
  }

  update(newBody){
    validation.validateBody(newBody, context, schema.item);
    const old_body = this;
    this.name = newBody.name;
    this.idade = newBody.idade;

    return new Promise((resolve, reject) => {
      db.getItem(table_item, event['pathParameters'].id)
        .then(data => resolve(data))
        .catch(err => {
          this.name  = old_body.name;
          this.idade = old_body.idade;
          reject(err);
        })
    });
  }

  save(){
    return db.createItem(table_item, this);
  }
}

module.exports = Item;