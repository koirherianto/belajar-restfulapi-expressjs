import { prismaClient } from "../application/database.js";
import { loginUserValidation, registerUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validate.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (countUser === 1) {
        throw new ResponseError(400, "Username already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true
        }
    });
};

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    let userDb = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            username: true,
            password: true,
            token: true
        }
    });

    if (!userDb) {
        throw new ResponseError(401, 'Username or password wrong');
    }

    // jika apakah passwordnya
    const isPasswordValid = await bcrypt.compare(loginRequest.password, userDb.password);

    if (isPasswordValid) { //jika password tidak sesuai
        throw new ResponseError(401, 'Username or password wrong');
    }

    const token = uuid().toString();

    userDb = await prismaClient.user.update({
        where: {
            username: userDb.username
        },
        data: {
            token: token
        },
        select: {
            token: true,
            username: true,
            name: true
        }
    });

    return userDb;
};

export default {
    register,
    login
};