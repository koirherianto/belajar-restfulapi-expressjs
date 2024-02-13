import { prismaClient } from "../src/application/database";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: 'test',
        }
    });
};

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: 'test',
            password: await bcrypt.hash('123456',10),
            name: 'test',
            token: 'test'
        }
    });

    console.log('------------------ buat user selesai');
};
