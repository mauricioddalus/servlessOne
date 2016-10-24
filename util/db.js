'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB();
const _ = require('underscore');
const uuid = require("node-uuid");
const attr = require('dynamodb-data-types').AttributeValue;

/**
 * @param {(Object|Array<Object>)} items
 * @returns {Object}
 */
function toJson(items){
    let result;
    if(Array.isArray(items)){
        result = [];
        items.forEach(item => {
            result.push(toJson(item));
        });
    }else{
        result = attr.unwrap(items);
        //result.etag = `"${result.etag}"`;
        //result.active = (result.active === 'true' ? true : false);
    }
    return result;
}

/**
 * @param   {string} tableName
 * @param   {string} itemId
 * @returns {Object}
 */
exports.getItem = (tableName, itemId, categoryId) => {
    return new Promise((resolve, reject) => {
        let params = {
            TableName: tableName,
            Key: {
                "id": {"S": itemId}
            }
        };
        dynamo.getItem(params, function(err, data){
            if(err){
                reject(err);
            }else{
                resolve((data.Item ? toJson(data.Item) : data));
            }
        });
    });
};

/**
 * @param   {string} tableName
 * @param   {Object} item
 * @returns {Object}
 */
exports.createItem = (tableName, item) => {
    let resource = _.clone(item);
    resource.id  = uuid.v4();
    resource     = attr.wrap(resource);

    return new Promise((resolve, reject) => {
        let params = {
            TableName: tableName,
            ConditionExpression: "attribute_not_exists(id)",
            Item: resource
        };
        dynamo.putItem(params, function(err, data){
            if(err){
                reject(err);
            }else{
                resolve(toJson(resource));
            }
        });
    });
};

/**
 * @param {string} tableName
 * @returns {Array<Object>}
 */
exports.listItems = (tableName) => {
    return new Promise((resolve, reject) => {
        let params = {};
        params.TableName = tableName;

        dynamo.scan(params, (err, data) => {
            if(err){
                reject(err);
            }else{
                let itemList = [];
                data.Items.map(item => {
                    itemList.push(toJson(item));
                });
                resolve(itemList);
            }
        });
    });
};

/**
 * @param {string} tableName
 * @param {string} itemId
 * @returns {Promise<{}>}
 */
exports.deleteItem = (tableName, itemId) => {
    return new Promise((resolve, reject) => {
        let params = {};
        params.TableName = tableName;
        params.Key = {
            "id": attr.wrap1(itemId)
        };
        params.ReturnValues = "ALL_OLD";
        //console.log('params: ' + JSON.stringify(params, null, '\t'));
        dynamo.deleteItem(params, function (err, data) {
            if (err) {
                //console.log('err: ', err);
                reject(err);
            } else {
                console.log('data: ', data);
                resolve((_.isEmpty(data) ? data : toJson(data.Attributes)));
            }
        });
    });
};