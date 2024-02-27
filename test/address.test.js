import { createTestContact, createTestUser, getTestContact, removeAllTestAddress, removeAllTestContact, removeTestUser } from "./util.test.js";
import { web } from "../src/application/web.js";
import supertest from "supertest";

describe('Post /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestAddress();
        await removeAllTestContact();
        await removeTestUser();
    });

    it("Should Can Create new Address", async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .post("/api/contacts/" + testContact.id + "/addresses")
            .set("Authorization", "test")
            .send({
                street: "test",
                city: "test",
                province: "test",
                county: "test",
                postal_code: "test",
            });

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);

        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe('test');
        expect(result.body.data.city).toBe('test');
        expect(result.body.data.province).toBe('test');
        expect(result.body.data.county).toBe('test');
        expect(result.body.data.postal_code).toBe('test');
    });

    it("Should reject if address request is invalid", async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .post("/api/contacts/" + testContact.id + "/addresses")
            .set("Authorization", "test")
            .send({
                street: "",
                city: "",
                province: "",
                county: "",
                postal_code: "",
            });

        expect(result.status).toBe(400);
    });

    it("Should reject if contact not found", async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .post("/api/contacts/" + (testContact.id + 1)+ "/addresses")
            .set("Authorization", "test")
            .send({
                street: "test",
                city: "test",
                province: "test",
                county: "test",
                postal_code: "test",
            });

        expect(result.status).toBe(404);
    });
});