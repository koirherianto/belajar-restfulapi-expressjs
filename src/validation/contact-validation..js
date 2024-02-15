import Joi from "joi";

const createContactValidation = Joi.object({
    nama_depan : Joi.string().max(100).required(),
    nama_belakang : Joi.string().max(100).optional(),
    email : Joi.string().email().max(200).optional(),
    phone : Joi.string().max(20).optional(),
});

export {
    createContactValidation
}