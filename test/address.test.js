import { createTestAddress, createTestContact, createTestUser, getTestAddress, getTestContact, removeAllTestAddress, removeAllTestContact, removeTestUser } from "./util.test.js";
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
            .post("/api/contacts/" + (testContact.id + 1) + "/addresses")
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

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddress();
        await removeAllTestContact();
        await removeTestUser();
    });

    it('should can get contact', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
            .set("Authorization", "test");

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);

        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe('test');
        expect(result.body.data.city).toBe('test');
        expect(result.body.data.province).toBe('test');
        expect(result.body.data.county).toBe('test');
        expect(result.body.data.postal_code).toBe('test');
    });


    it('should reject if contact is notfound', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get("/api/contacts/" + (testContact.id + 1) + "/addresses/" + testAddress.id)
            .set("Authorization", "test");

        expect(result.status).toBe(404);
    });

    it('should reject if address is notfound', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get("/api/contacts/" + testContact.id + "/addresses/" + (testAddress.id + 1))
            .set("Authorization", "test");

        expect(result.status).toBe(404);
    });
});

describe('PUT api/contact/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddress();
        await removeAllTestContact();
        await removeTestUser();
    });


    it("Should Can Update Address", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
            .set("Authorization", "test")
            .send({
                street: "test2",
                city: "test2",
                province: "test2",
                county: "test2",
                postal_code: "test2",
            });

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);

        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe('test2');
        expect(result.body.data.city).toBe('test2');
        expect(result.body.data.province).toBe('test2');
        expect(result.body.data.county).toBe('test2');
        expect(result.body.data.postal_code).toBe('test2');
    });

    it("Should Reject if data invalid", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
            .set("Authorization", "test")
            .send({
                street: "test2",
                city: "test2",
                province: "test2",
                county: "",
                postal_code: "",
            });

        expect(result.status).toBe(400);
    });

    it("Should Reject if contactId Invalid", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put("/api/contacts/" + (testContact.id + 1) + "/addresses/" + testAddress.id)
            .set("Authorization", "test")
            .send({
                street: "test2",
                city: "test2",
                province: "test2",
                county: "test2",
                postal_code: "test2",
            });

        expect(result.status).toBe(404);
    });


    it("Should Reject if addressesId Invalid", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put("/api/contacts/" + testContact.id + "/addresses/" + (1 + testAddress.id))
            .set("Authorization", "test")
            .send({
                street: "test2",
                city: "test2",
                province: "test2",
                county: "test2",
                postal_code: "test2",
            });

        expect(result.status).toBe(404);
    });
});

describe('DELETE api/contact/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddress();
        await removeAllTestContact();
        await removeTestUser();
    });

    it('should can romove address', async () => {
        const testContact = await getTestContact();
        let testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
            .set("Authorization", "test");

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);

        testAddress = await getTestAddress();

        expect(testAddress).toBeNull();
    });

    it('should reject if address not found', async () => {
        const testContact = await getTestContact();
        let testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete("/api/contacts/" + testContact.id + "/addresses/" + (testAddress.id + 1))
            .set("Authorization", "test");

        expect(result.status).toBe(404);
    });

    it('should reject if contacts not found', async () => {
        const testContact = await getTestContact();
        let testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete("/api/contacts/" + (testContact.id + 1) + "/addresses/" + testAddress.id)
            .set("Authorization", "test");

        expect(result.status).toBe(404);
    });
});