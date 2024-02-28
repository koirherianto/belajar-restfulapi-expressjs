import { error } from "winston";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { validate } from "../validation/validate";
import { createAddressValidation, getAddressValidation } from "../validation/address-validation";
import { getContactValidation } from "../validation/contact-validation.";

const checkContactMustExist = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId);

    const totalContactInDB = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contactId,
        },
    });

    if (totalContactInDB !== 1) {
        throw new ResponseError(404, "Contact Not Founde");
    }

    return contactId;
}

const create = async (user, contactId, request) => {
    contactId = await checkContactMustExist(user, contactId);

    const addressRequest = validate(createAddressValidation, request);
    addressRequest.contact_id = contactId;

    const address = await prismaClient.address.create({
        data: addressRequest,
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            county: true,
            postal_code: true,
        },
    });

    return address;
};

const get = async (user, contactId, addressId) => {
    contactId = await checkContactMustExist(user, contactId);
    addressId = validate(getAddressValidation, addressId);

    const address = await prismaClient.address.findFirst({
        where: {
            contact_id: contactId,
            id: addressId
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            county: true,
            postal_code: true,
        },
    });

    if (!address) {
        throw new ResponseError(404, 'Address Not Found');
    }

    return address;
};

export default {
    create,
    get
};
