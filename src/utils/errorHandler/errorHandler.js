import EnumErrors from "./enum.js";

export default (error, req, res, next) => {

    console.log(error.cause);

    switch (error.code) {

        case EnumErrors.ROUTING_ERROR:
            res.send({status: 'error', error: error.message});
        break;

        case EnumErrors.INVALID_TYPES_ERROR:
            res.send({status: 'error', error: error.message});
        break;

        case EnumErrors.DATABASE_ERROR:
            res.send({status: 'error', error: error.message});
        break;

        case EnumErrors.INVALID_FIELDS_VALUE_ERROR:
            res.send({status: 'error', error: error.message});
        break;

        case EnumErrors.INVALID_BODY_STRUCTURE_ERROR:
            res.send({status: 'error', error: error.message});
        break;

        case EnumErrors.NOT_FOUND_ENTITY_ID_ERROR:
            res.send({status: 'error', error: error.message});
        break;

        case EnumErrors.UNIQUE_KEY_VIOLATION_ERROR:
            res.send({status: 'error', error: error.message});
        break;

        case EnumErrors.INVALID_PROGRAM_DATA_ERROR:
            res.send({status: 'error', error: error.message});
        break;

        case EnumErrors.BUSSINESS_TRANSACTION_ERROR:
            res.send({status: 'error', error: error.message});
        break;

        default:
            res.send({status: 'error', error: 'Internal Server Error'});
    }
};