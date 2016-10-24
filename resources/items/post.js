'use strict';
const Item       = require('../../models/Item');
const schema     = require('../../util/schema');
const httpStatus = require('../../util/httpStatus');
const validation = require('../../util/validation');

module.exports.main = (event, context, callback) => {
  validation.validateEvent(event, context, schema.createItem);

  const doCallback = (status, data) => {
    return context.succeed({
        "statusCode": status,
        "headers": { "Content-type": "application/json" },
        "body": JSON.stringify(data)
    });
  }

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