/*
 * Http Status
 */
module.exports = {
    badRequest: function(errMsg){
        errMsg = errMsg || this.badRequestMsg;
        return {
            "statusCode": 400,
            "errCode": "BadRequest",
            "errMsg": errMsg
        };
    },
    badRequestMsg: "A requisição está mal formada",

    forbidden: function(errMsg){
        errMsg = errMsg || this.forbiddenMsg;
        return {
            "statusCode": 403,
            "errCode": "Forbidden",
            "errMsg": errMsg
        };
    },
    forbiddenMsg: "O cliente não tem direitos de acesso",
    
    notFound: function(errMsg){
        errMsg = errMsg || this.notFoundMsg;
        return {
            "statusCode": 404,
            "errCode": "NotFound",
            "errMsg": errMsg
        };
    },
    notFoundMsg: "O recurso não foi encontrado",
    
    conflict: function(errMsg){
        errMsg = errMsg || this.conflictMsg;
        return {
            "statusCode": 409,
            "errCode": "Conflict",
            "errMsg": errMsg
        };
    },
    conflictMsg: "A requisição não pôde ser concluída devido a um conflito",

    preconditionFailed: function(errMsg){
        errMsg = errMsg || this.preconditionFailedMsg;
        return {
            "statusCode": 412,
            "errCode": "PreconditionFailed",
            "errMsg": errMsg
        };
    },
    preconditionFailedMsg: "O cliente indicou pré-condições em seu cabeçalho que o servidor não satisfaz.",
    
    internalServerError: function(errMsg){
        errMsg = errMsg || this.internalServerErrorMsg;
        return {
            "statusCode": 500,
            "errCode": "InternalServerError",
            "errMsg": errMsg
        };
    },
    internalServerErrorMsg: "Erro ao executar este serviço"
};