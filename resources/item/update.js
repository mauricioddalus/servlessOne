'use strict';
const Item       = require('../../models/Item');
const schema     = require('../../util/schema');
const httpStatus = require('../../util/httpStatus');
const validation = require('../../util/validation');

module.exports.main = (event, context, callback) => {
  validation.validateEvent(event, context, schema.updateItem);

  const doCallback = (status, data) => {
    return context.succeed({
        "statusCode": status,
        "headers": { "Content-type": "application/json" },
        "body": JSON.stringify(data)
    });
  };

  Item.configure(event, context);
  Item.getItem().then(oldItem => {
    let newItem = new Item(oldItem);
    newItem.idade = 50;
    newItem.update(newItem)
      .then(data => {
        doCallback(200, data);
      })
      .catch(err => {
        doCallback(400, err);
      });
  }).catch(err => {
    doCallback(400, err);
  });  
};