import Joi, { number } from "joi";

const createContactValidation = Joi.object({
    nama_depan : Joi.string().max(100).required(),
    nama_belakang : Joi.string().max(100).optional(),
    email : Joi.string().email().max(200).optional(),
    phone : Joi.string().max(20).optional(),
});

const getContactValidation = Joi.number().positive().required();

const updateContactValidation = Joi.object({
    id : Joi.number().positive().required(),
    nama_depan : Joi.string().max(100).required(),
    nama_belakang : Joi.string().max(100).optional(),
    email : Joi.string().email().max(200).optional(),
    phone : Joi.string().max(20).optional(),
});

const searcheContactValidation = Joi.object({
    page: Joi.number().positive().min(1).default(1), //halaman ke berapa
    size : Joi.number().positive().min(5).max(100).default(10), //jumlah item
    name : Joi.string().optional(),
    email : Joi.string().optional(),
    phone : Joi.string().optional(),
});

export {
    createContactValidation,
    getContactValidation,
    updateContactValidation,
    searcheContactValidation
}