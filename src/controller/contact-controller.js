import contactService from "../service/contact-service.js";
import userService from "../service/user-service.js";

const create = async (req, res, next) => {
    try {
        const request = req.body;
        const user = req.user;
        const result = await contactService.create(user, request);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
};

const get = async (req, res, next) => {
    try {
        const user = req.user;
        const contactId = req.params.contactId;
        const result = await contactService.get(user, contactId);
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        request.id = req.params.contactId;

        const result = await contactService.update(user, request);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
};

const remove = async (req, res, next) => {
    try {
        const user = req.user;
        const contactId = req.params.id;
        await contactService.remove(user, contactId);

        res.status(200).json({
            success: true
        });
    } catch (e) {
        next(e);
    }
};

export default {
    create,
    get,
    update,
    remove
}