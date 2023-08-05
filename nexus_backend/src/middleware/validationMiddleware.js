const { responseModel } = require('../responses');

let joivalidate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body ? req.body : {});
        const valid = error == null;

        if (valid) {
            next();
        } else {
            const { details } = error;
            const name = details.map((i) => i.path).join(',');
            const value = details.map((i) => i.message).join(',');
            const message = { [name]: value };
            res.status(422).json(responseModel.failResponse('Validation failed', message).data);
        }
    };
};

module.exports = {
    joivalidate,
};