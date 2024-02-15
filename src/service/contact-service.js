import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { createContactValidation, getContactValidation } from "../validation/contact-validation.";
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

export default {
    create,
    get
}