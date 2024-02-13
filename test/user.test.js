import supertest from "supertest";
import { web } from "../src/application/web";
import { prismaClient } from "../src/application/database.js";
import { logger } from "../src/application/logging.js";

describe('POST /api/users', () => {

    afterEach(async () => {
        await prismaClient.user.deleteMany({
            where : {
                username : 'koirherianto',
            }
        });
    });

    it('should can register new user', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'koirherianto',
                password: '123456',
                name: 'koir herianto'
            })

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('koirherianto');
        expect(result.body.data.name).toBe('koir herianto');
        expect(result.body.data.password).toBeUndefined();
    });

    it('should rejected if request invalid', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: '',
                password: '',
                name: ''
            })

        logger.info(result.body);
        console.log(result.body);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if username already registered', async () => {
        let result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: 'rahasia',
                name: 'test'
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("test");
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: 'rahasia',
                name: 'test'
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});