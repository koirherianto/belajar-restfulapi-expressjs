import Joi from "joi";

const createContactValidation = Joi.object({
    first_name : Joi.string().min(3).max(100).required(),
    last_name : Joi.string().min(3).max(100).optional(),
    contact : Joi.string().min(3).max(100).optional(),
});