'use strict';
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// STAGE VARIABLES
exports.stageVariables = {
    "id": "/StageVariables",
    "type": "object",
    "properties": {
        "db_test": {"type": "string"}
    },
    "required": ["db_test"],
    "additionalProperties": true
};

//ITEM
exports.item = {
    "id": "/Item",
    "type": "object",
    "properties": {
        "nome" : {"type": "string"},
        "idade": {"type": "integer"},
    },
    "required" : ["nome","idade"],
    "additionalProperties": false
};

exports.getItems = {
    "id"  : "/GetItems",
    "type": "object",
    "properties": {
        "header": {
            "type": "object",
            "properties":{
                "Content-Type": {"type": "string","pattern":"application/json"}
            }
        },
        "stageVariables": {"$ref": "/StageVariables"}
    },
    "required": ["stageVariables"],
    "additionalProperties": true
};

exports.getItem = {
    "id"  : "/GetItem",
    "type": "object",
    "properties": {
        "header": {
            "type": "object",
            "properties":{
                "Content-Type": {"type": "string","pattern":"application/json"}
            }
        },
        "pathParameters":{
            "type": "object",
            "properties":{
                "id": {"type": "string", "pattern":uuidPattern}
            }
        },
        "stageVariables": {"$ref": "/StageVariables"}
    },
    "required": ["stageVariables"],
    "additionalProperties": true
};

exports.deleteItem = {
    "id"  : "/GetItem",
    "type": "object",
    "properties": {
        "header": {
            "type": "object",
            "properties":{
                "Content-Type": {"type": "string","pattern":"application/json"}
            }
        },
        "pathParameters":{
            "type": "object",
            "properties":{
                "id": {"type": "string", "pattern":uuidPattern}
            },
            "required": ["id"]
        },
        "stageVariables": {"$ref": "/StageVariables"}
    },
    "required": ["stageVariables","pathParameters"],
    "additionalProperties": true
};

exports.updateItem = {
    "id"  : "/updateItem",
    "type": "object",
    "properties": {
        "header": {
            "type": "object",
            "properties":{
                "Content-Type": {"type": "string","pattern":"application/json"}
            }
        },
        "pathParameters":{
            "type": "object",
            "properties":{
                "id": {"type": "string", "pattern":uuidPattern}
            },
            "required": ["id"]
        },
        "stageVariables": {"$ref": "/StageVariables"}
    },
    "required": ["stageVariables","pathParameters"],
    "additionalProperties": true
};

exports.createItem = {
    "id"  : "/CreateItem",
    "type": "object",
    "properties": {
        "header": {
            "type": "object",
            "properties":{
                "Content-Type": {"type": "string","pattern":"application/json"}
            }
        },
        "stageVariables": {"$ref": "/StageVariables"}
    },
    "required": ["stageVariables","pathParameters"],
    "additionalProperties": true
};