
import userService from "../service/user-service.js";
const register = async (req, res, next) => {

    try {
        const result = await userService.register(req.body);
        res.status(200).json({
            success : true,
            data : result
        });
    } catch (e) {
        next(e);
    }
};

export default {
    register
}