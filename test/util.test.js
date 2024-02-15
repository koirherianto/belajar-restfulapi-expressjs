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

    console.log('--------- buat user selesai ---------');
};

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "test"
        }
    });
}

export const removeAllTestContact = async () => {
    await prismaClient.contact.deleteMany({
        where : {
            username : 'test'
        }
    });

    console.log('--------- deleteAllContact selesai ---------');
};

export const createTestContact = async () => {
    await prismaClient.contact.create({
        data : {
            username : 'test',
            nama_depan : 'test',
            nama_belakang : 'test',
            phone : '08090000000',
            email : 'test@gmail.com',
        }
    });

    console.log('--------- createTestContact selesai ---------');
};

export const getTestContact = async () => {
    return await prismaClient.contact.findFirst({
        where : {
            username : 'test'
        }
    });
};