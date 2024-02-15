import supertest from "supertest";
import { web } from "../src/application/web.js";
import { createTestUser, getTestUser, removeTestUser, removeAllTestContact, getTestContact, createTestContact } from "./util.test.js";

describe('POST /api/contacts', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it('shoult create contact', async () => {
        const result = await supertest(web)
            .post("/api/contacts")
            .set("Authorization", "test")
            .send({
                nama_depan: "test",
                nama_belakang: "test",
                email: "test@pzn.com",
                phone: "08090000000"
            });

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.nama_depan).toBe('test');
        expect(result.body.data.nama_belakang).toBe('test');
        expect(result.body.data.email).toBe('test@pzn.com');
        expect(result.body.data.phone).toBe('08090000000');
    });

    it('shoult create contact invalid', async () => {
        const result = await supertest(web)
            .post("/api/contacts")
            .set("Authorization", "test")
            .send({
                nama_depan: "",
                nama_belakang: "test",
                email: "testm",
                phone: "080900000746546467467465345356435400"
            });

        console.log(result.body);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it('shoult Get contact', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .get("/api/contacts/" + testContact.id)
            .set("Authorization", "test");

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.nama_depan).toBe('test');
        expect(result.body.data.nama_belakang).toBe('test');
        expect(result.body.data.email).toBe('test@gmail.com');
        expect(result.body.data.phone).toBe('08090000000');
    });

    it('shoult Get contact not found', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .get("/api/contacts/" + (testContact.id + 1))
            .set("Authorization", "test");

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});