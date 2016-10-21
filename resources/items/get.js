'use strict';

const Item       = require('../../models/Item');
const schema     = require('../../util/schema');
const httpStatus = require('../../util/httpStatus');
const validation = require('../../util/validation');

module.exports.main = (event, context, callback) => {
  validation.validateEvent(event, context, schema.item);

  Item.configure(event['stageVariables'].db_test);
  Item.list()
    .then(data => {
      return context.succeed({
          "statusCode": 200,
          "headers": { "Content-type": "application/json" },
          "body": JSON.stringify(data)
      });
    })
    .catch(err => {
      return context.succeed({
          "statusCode": 500,
          "headers": { "Content-type": "application/json" },
          "body": JSON.stringify(err)
      });
    });
};