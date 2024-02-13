import supertest from "supertest";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging.js";
import { createTestUser, removeTestUser } from "./util.test.js";

describe('POST /api/users', () => {

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can register new user', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: '123456',
                name: 'test'
            })

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('test');
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
                password: '123456',
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
                password: '123456',
                name: 'test'
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('POST /api/users/login', () => {

    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can login', async () => {
        const resultTest = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'test',
                password: '123456',
            });

        console.log('------------------------------ coba login selesai');
        logger.info(resultTest.body);

        expect(resultTest.status).toBe(200);
        expect(resultTest.body.success).toBe(true);
        expect(resultTest.body.data.name).toBe('test');
        expect(resultTest.body.data.username).toBe('test');
        expect(resultTest.body.token).not.toBe('test'); //saat login serahrunya bukan test lagi tokenya
    });

    it('should rejected login if request login password is wrong', async () => {
        const resultTest = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'test',
                password: 'salahco',
            });

        logger.info(resultTest.body);

        expect(resultTest.status).toBe(401);
        expect(resultTest.body.errors).toBeDefined()
    });

    it('should rejected login if request login username is wrong', async () => {
        const resultTest = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'salah',
                password: 'salah',
            });

        logger.info(resultTest.body);

        expect(resultTest.status).toBe(401);
        expect(resultTest.body.errors).toBeDefined()
    });
});