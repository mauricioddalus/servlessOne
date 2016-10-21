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

module.exports.main = (event, context, callback) => {
  validation.validateEvent(event, context, schema.updateItem);

  Item.configure(event, context);
  Item.getItem()
    .then(data => {
      doCallback(200, data);
    })
    .catch(err => {
      doCallback(400, err);
    });
};