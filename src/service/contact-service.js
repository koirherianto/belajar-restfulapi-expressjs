import { error } from "winston";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { createContactValidation, getContactValidation, updateContactValidation } from "../validation/contact-validation.";
import { getUserValidation } from "../validation/user-validation";
import { validate } from "../validation/validate";

const create = async (user, request) => {
    const contactRequest = validate(createContactValidation, request);

    contactRequest.username = user.username;

    const contact = await prismaClient.contact.create({
        data: contactRequest,
        select: {
            id: true,
            nama_depan: true,
            nama_belakang: true,
            phone: true,
            email: true,
        }
    });

    return contact;
};

const get = async (user, contactId) => {
    const contadIdRequest = validate(getContactValidation, contactId);

    const contactDB = await prismaClient.contact.findFirst({
        where: {
            id: contadIdRequest,
            username: user.username
        },
        select: {
            id: true,
            nama_depan: true,
            nama_belakang: true,
            email: true,
            phone: true,
        }
    });

    if (!contactDB) {
        throw new ResponseError(404, 'Contact Not Founde');
    }

    return contactDB;
};

const update = async (user, request) => {
    console.log('masuk ke model');
    const contactValidasi = validate(updateContactValidation, request);
    console.log('masuk ke model');

    const countContact = await prismaClient.contact.count({
        where: {
            id: contactValidasi.id,
            username: user.username
        },
    });

    if (countContact !== 1) {
        throw new ResponseError(404, "contact is not found");
    }

    const contact = await prismaClient.contact.update({
        where: {
            id: contactValidasi.id,
            // username : user.username gak perlu karna sudah di validasi di atas
        },
        data: {
            nama_depan: contactValidasi.nama_depan,
            nama_belakang: contactValidasi.nama_belakang,
            phone: contactValidasi.phone,
            email: contactValidasi.email,
        },
        select: {
            id: true,
            nama_depan: true,
            nama_belakang: true,
            phone: true,
            email: true,
        }
    });

    return contact;
};

const remove = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId);

    countContact = await prismaClient.contact.count({
        where : {
            username : user.username,
            id : contactId
        }
    });

    if (countContact !== 1) {
        throw new ResponseError(404, 'Contact Not Found');
    }

    await prismaClient.contact.delete({
        where : {
            id : contactId
        }
    });
};

export default {
    create,
    get,
    update,
    remove
}