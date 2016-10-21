'use strict';
const Validator = require('jsonschema').Validator;
//const Logger = require('allied-lib').Logger;
const httpStatus = require('./httpStatus');
const _ = require('underscore');
const schema = require('./schema');

const internalServerErrorMsg = 'Erro ao executar este serviço';
const badRequestMsg = 'A requisição está mal formada';
const preconditionFailedMsg = 'O cliente indicou pré-condições em seu cabeçalho que o servidor não satisfaz';

exports.validateEvent = (event, context, validationSchema) => {
    const v = new Validator();
    v.addSchema(schema.stageVariables, '/StageVariables');
    let validation = v.validate(event, validationSchema);

    let status;
    validation.errors.every(err => {

        //console.log('err: ', err);
        if(err.property.includes('instance.') && err.message.includes('is not of a type(s)')){
            let prop = err.property.split('.').pop();
            status = httpStatus.badRequest(`O tipo da propriedade ${prop} não está correto`);
        // console.log('err: ', err);
        }else if(err.property.includes('instance.') && err.message.includes('instance when not allowed')){
            let prop = /"(.*)"/.exec(err.message)[1];
            status = httpStatus.badRequest(`A propriedade "${prop}" não é permitida`);
        // STAGEVARS
        }else if(err.property.includes('instance.stageVariables') && err.message.includes('requires property "ALLIED_DB_CATEGORIES"')){
            status = httpStatus.internalServerError(internalServerErrorMsg);
        // STAGEVARS
        }else if(err.property.includes('instance.stageVariables') && err.message.includes('requires property "APISTORE_HOST"')){
            status = httpStatus.internalServerError(internalServerErrorMsg);
        }else if(err.property.includes("instance.") && err.message.includes("requires property")){
            let prop = /"(.*)"/.exec(err.message)[1];
            status = httpStatus.badRequest(`A propriedade ${prop} é obrigatória`);
        }else if(err.property.includes("instance.") && err.message.includes("does not match pattern")){
            let prop = err.property.split('.').pop();
            status = httpStatus.badRequest(`A propriedade ${prop} está mal formada`);                                                                                            
        }else if(err.property.includes("instance") && err.message.includes("is not exactly one from")){
            status = httpStatus.badRequest(err);
        }else{
            status = httpStatus.badRequest(err);
        }
        return status !== null && status !== undefined;
    });
    
    if(status !== null && status !== undefined){
        return context.succeed({
            "statusCode": status.statusCode,
            "headers": { "Content-type": "application/json" },
            "body": JSON.stringify(status)
        });
    }

    return true;

};

exports.validateBody = (item, context, validationSchema) => {
    let body = null;

    try {
        body = item;
    } catch (error) {
        let status = httpStatus.badRequest(badRequestMsg);
        return context.succeed({
            "statusCode": status.statusCode,
            "headers": { "Content-type": "application/json" },
            "body": JSON.stringify(status)
        });
    }

    const v = new Validator();
    v.addSchema(schema.stageVariables, '/StageVariables');

    let validation = v.validate(body, validationSchema);
    let fields = _.keys(validationSchema.properties);
    let status;

    validation.errors.every(err => {
        //console.log('err: ', err);
        if(err.property.includes('instance.') && err.message.includes('is not of a type(s) object')){
            status = httpStatus.badRequest(badRequestMsg);
        }else if(err.property.includes('instance.') && err.message.includes('instance when not allowed')){
            let prop = /"(.*)"/.exec(err.message)[1];
            status = httpStatus.badRequest(`A propriedade "${prop}" não é permitida`);
        }

        fields.some((prop) => {
            //console.log('prop:', prop);
            if(err.property.includes('instance') && err.message.includes(`requires property "${prop}"`)){
                status = httpStatus.badRequest(`A propriedade ${prop} é obrigatória`);
            }else if(err.property.includes(`instance.${prop}`) && err.message.includes('is not of a type')){
                status = httpStatus.badRequest(`O tipo da propriedade ${prop} não está correto`);
            }else if(err.property.includes(`instance.${prop}`) && err.message.includes('does not match pattern')){
                status = httpStatus.badRequest(`A propriedade ${prop} está mal formada`);
            }else if(err.property.includes(`instance.${prop}`) && err.message.includes('does not meet minimum length of')){
                let num = err.message.match(/does not meet minimum length of \d+/)[0];
                status = httpStatus.badRequest(`A propriedade ${prop} não atende o comprimento mínimo de ${num} caracteres`);
            }else if(err.property.includes(`instance.${prop}`) && err.message.includes('does not meet maximum length of')){
                let num = err.message.match(/does not meet maximum length of \d+/)[0];
                status = httpStatus.badRequest(`A propriedade ${prop} não atende o comprimento máximo de ${num} caracteres`);
            }
            return status !== null && status !== undefined;
        });
    });

    if(status !== null && status !== undefined){
        return context.succeed({
            "statusCode": status.statusCode,
            "headers": { "Content-type": "application/json" },
            "body": JSON.stringify(status)
        });
    }
    return true;
};
