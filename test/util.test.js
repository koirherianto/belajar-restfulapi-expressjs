import { prismaClient } from "../src/application/database";

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
            password: '123456',
            name: 'test',
            token: 'test'
        }
    });
};
