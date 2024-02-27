import { error } from "winston";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { validate } from "../validation/validate";
import { createAddressValidation } from "../validation/address-validation";
import { getContactValidation } from "../validation/contact-validation.";

const create = async (user, contactId, request) => {
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

export default {
    create,
};
