'use strict';
const Item       = require('../../models/Item');
const schema     = require('../../util/schema');
const httpStatus = require('../../util/httpStatus');
const validation = require('../../util/validation');

const doCallback = (status, data) => {
  return context.succeed({
      "statusCode": status,
      "headers": { "Content-type": "application/json" },
      "body": JSON.stringify(data)
  });
}

module.exports.create = (event, context, callback) => {

  validation.validateEvent(event, context, schema.createItem);

  Item.configure(event, context);
  let item = new Item(event.body);

  item.save()
    .then(data => {
      doCallback(200, data);
    })
    .catch(err => {
      doCallback(400, err);
    });
};

module.exports.update = (event, context, callback) => {
  validation.validateEvent(event, context, schema.updateItem);

  Item.configure(event, context);
  const oldItem = Item.getItem();
  let newItem = new Item(oldItem);
  newItem.idade = 50;

  item.update(newItem)
    .then(data => {
      doCallback(200, data);
    })
    .catch(err => {
      doCallback(400, err);
    });
};