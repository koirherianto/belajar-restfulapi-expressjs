
import Joi from "joi";

const createAddressValidation = Joi.object({
    street : Joi.string().max(255).optional(),
    city : Joi.string().max(100).optional(),
    province : Joi.string().max(100).optional(),
    county : Joi.string().max(100).required(),
    postal_code : Joi.string().max(100).required(),
});

export {
    createAddressValidation
}