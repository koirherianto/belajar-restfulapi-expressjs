import { prismaClient } from "../application/database";
import { createContactValidation } from "../validation/contact-validation.";
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

export default {
    create
}