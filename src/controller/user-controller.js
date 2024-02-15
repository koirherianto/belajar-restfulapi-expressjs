
import userService from "../service/user-service.js";
const register = async (req, res, next) => {

    try {
        const result = await userService.register(req.body);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
};

const login = async (req, res, next) => {

    try {
        const result = await userService.login(req.body);

        res.status(200).json({
            success: true,
            token: result.token,
            data: {
                name: result.username,
                username: result.username
            }
        });
    } catch (e) {
        next(e);
    }
};

const get = async (req, res, next) => {
    try {
        const username = req.user.username;
        const result = await userService.get(username);

        res.status(200).json({
            success: true,
            data: {
                username: result.username,
                name: result.name
            }
        });
    } catch (e) {
        next(e);
    }
};

const update = async (req, res, next) => {
    try {

        const requestBody = req.body;
        const username = req.user.username;
        requestBody.username = username;

        const result = await userService.update(requestBody);

        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (e) {
        next(e);
    }
};

const logout = async (req, res, next) => {
    try {
        const username = req.user.username;
        const result = await userService.logout(username);

        res.status(200).json({
            "success" : true,
        });

    } catch (e) {
        next(e)
    }
};

export default {
    register,
    login,
    get,
    update,
    logout
}