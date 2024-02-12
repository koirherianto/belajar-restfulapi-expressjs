import { prismaClinet } from "../application/database.js";
import { registerUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validate.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    countUser = prismaClinet.user.count({
        where: {
            username: user.username
        }
    });

    if (countUser == 1) {
        throw new ResponseError(400, "Username Already Exists");
    }

    user.password = await bcrypt.hash(user.password, 10);

    const result = await prismaClinet.user.create({
        data: user,
        select: {
            username: true,
            name: true
        }
    });

    return result;
};

export default {
    register
};