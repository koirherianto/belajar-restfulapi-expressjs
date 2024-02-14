import Joi from "joi";

const registerUserValidation = Joi.object({
    username : Joi.string().min(3).max(100).required(),
    name : Joi.string().min(3).max(100).required(),
    password : Joi.string().min(6).max(100).required()
});

const loginUserValidation = Joi.object({
    username : Joi.string().max(100).required(),
    password : Joi.string().max(100).required()
});

const getUserValidation = Joi.string().max(100).required();

const updateUserValidation = Joi.object({
    username : Joi.string().max(100).required(),
    name : Joi.string().min(3).max(100).optional(),
    password : Joi.string().min(6).max(100).optional(0)
});

export {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation
}