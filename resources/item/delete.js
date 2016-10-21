'use strict';

module.exports.main = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({message: 'deletando um item', input: event })
  };
  callback(null, response);
};