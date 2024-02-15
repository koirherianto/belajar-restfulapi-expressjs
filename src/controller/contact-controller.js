import contactService from "../service/contact-service.js";

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

export default {
    create
}