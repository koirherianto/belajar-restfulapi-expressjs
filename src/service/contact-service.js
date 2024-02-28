import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
    createContactValidation,
    getContactValidation,
    searcheContactValidation,
    updateContactValidation,
} from "../validation/contact-validation.js";
import { validate } from "../validation/validate.js";

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
        },
    });

    return contact;
};

const get = async (user, contactId) => {
    const contadIdRequest = validate(getContactValidation, contactId);

    const contactDB = await prismaClient.contact.findFirst({
        where: {
            id: contadIdRequest,
            username: user.username,
        },
        select: {
            id: true,
            nama_depan: true,
            nama_belakang: true,
            email: true,
            phone: true,
        },
    });

    if (!contactDB) {
        throw new ResponseError(404, "Contact Not Founde");
    }

    return contactDB;
};

const update = async (user, request) => {
    console.log("masuk ke model");
    const contactValidasi = validate(updateContactValidation, request);
    console.log("masuk ke model");

    const countContact = await prismaClient.contact.count({
        where: {
            id: contactValidasi.id,
            username: user.username,
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
        },
    });

    return contact;
};

const remove = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId);

    const countContact = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contactId,
        },
    });

    if (countContact !== 1) {
        throw new ResponseError(404, "Contact Not Found");
    }

    await prismaClient.contact.delete({
        where: {
            id: contactId,
        },
    });
};

const search = async (user, request) => {
    request = validate(searcheContactValidation, request);

    // rumus skip
    // 1(page) = (page - 1) * size(jumlah item) = 0
    // 2 = (page - 1) * size = 10
    const skip = (request.page - 1) * request.size;

    // filter
    const filters = [];

    filters.push({
        username: user.username
    });

    if (request.name) {
        filters.push({
            OR: [
                {
                    nama_depan: {
                        contains: request.name,
                    },
                },
                {
                    nama_belakang: {
                        contains: request.name,
                    },
                },
            ],
        });
    }

    if (request.email) {
        filters.push({
            email: {
                contains: request.email,
            },
        });
    }

    if (request.phone) {
        filters.push({
            phone: {
                contains: request.phone,
            },
        },);
    }

    const contacts = await prismaClient.contact.findMany({
        where: {
            AND: filters
        },
        take: request.size,
        skip: skip
    });

    const totalItems = await prismaClient.contact.count({
        where: {
            AND: filters
        }
    });

    return {
        data: contacts,
        paging: {
            page: request.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / request.size)
        }
    }

};

export default {
    create,
    get,
    update,
    remove,
    search,
};
