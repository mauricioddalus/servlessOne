'use strict';
const _          = require('underscore');
const Item       = require('../../models/Item');
const schema     = require('../../util/schema');
const httpStatus = require('../../util/httpStatus');
const validation = require('../../util/validation');

module.exports.main = (event, context, callback) => {
  validation.validateEvent(event, context, schema.deleteItem);

  const doCallback = (status, data) => {
    return context.succeed({
        "statusCode": status,
        "headers": { "Content-type": "application/json" },
        "body": JSON.stringify(data)
    });
  };

  Item.configure(event, context);
  Item.delete()
    .then(data => {
      if (_.isEmpty(data)) doCallback(404, httpStatus.notFound());
      else                 doCallback(200, data);
    })
    .catch(err => {
      doCallback(400, err);
    });
};