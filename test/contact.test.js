import supertest from "supertest";
import { web } from "../src/application/web.js";
import {
    createTestUser,
    getTestUser,
    removeTestUser,
    removeAllTestContact,
    getTestContact,
    createTestContact,
    createManyTestContact,
} from "./util.test.js";

describe("POST /api/contacts", () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it("shoult create contact", async () => {
        const result = await supertest(web)
            .post("/api/contacts")
            .set("Authorization", "test")
            .send({
                nama_depan: "test",
                nama_belakang: "test",
                email: "test@pzn.com",
                phone: "08090000000",
            });

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.nama_depan).toBe("test");
        expect(result.body.data.nama_belakang).toBe("test");
        expect(result.body.data.email).toBe("test@pzn.com");
        expect(result.body.data.phone).toBe("08090000000");
    });

    it("shoult create contact invalid", async () => {
        const result = await supertest(web)
            .post("/api/contacts")
            .set("Authorization", "test")
            .send({
                nama_depan: "",
                nama_belakang: "test",
                email: "testm",
                phone: "080900000746546467467465345356435400",
            });

        console.log(result.body);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe("GET /api/contacts/:contactId", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it("shoult Get contact", async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .get("/api/contacts/" + testContact.id)
            .set("Authorization", "test");

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.nama_depan).toBe("test");
        expect(result.body.data.nama_belakang).toBe("test");
        expect(result.body.data.email).toBe("test@gmail.com");
        expect(result.body.data.phone).toBe("08090000000");
    });

    it("shoult Get contact not found", async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .get("/api/contacts/" + (testContact.id + 1))
            .set("Authorization", "test");

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe("PUT /api/contacts/:contactId", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it("should update existing contact", async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .put("/api/contacts/" + testContact.id)
            .set("Authorization", "test")
            .send({
                nama_depan: "testcoy",
                nama_belakang: "testcoy",
                email: "testcoy@pzn.com",
                phone: "080900000009",
            });

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.nama_depan).toBe("testcoy");
        expect(result.body.data.nama_belakang).toBe("testcoy");
        expect(result.body.data.email).toBe("testcoy@pzn.com");
        expect(result.body.data.phone).toBe("080900000009");
    });

    it("should reject if request invalid", async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .put("/api/contacts/" + testContact.id)
            .set("Authorization", "test")
            .send({
                nama_depan: "",
                nama_belakang: "",
                email: "testcoy",
                phone: "080900034634633634636400009",
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject if contact not found", async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .put("/api/contacts/" + (testContact.id + 1))
            .set("Authorization", "test")
            .send({
                nama_depan: "testcoy",
                nama_belakang: "testcoy",
                email: "testcoy@pzn.com",
                phone: "080900000009",
            });

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe("DELETE /api/contacts/:contactId", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it("should Delete existing contact", async () => {
        let testContact = await getTestContact();
        const result = await supertest(web)
            .delete("/api/contacts/" + testContact.id)
            .set("Authorization", "test");

        expect(result.status).toBe(200);
        expect(result.body.success).toBe(true);

        testContact = await getTestContact();
        expect(testContact).toBeNull();
    });

    it("should reject if contact is not found", async () => {
        let testContact = await getTestContact();
        const result = await supertest(web)
            .delete("/api/contacts/" + (testContact.id + 1))
            .set("Authorization", "test");

        expect(result.status).toBe(404);
    });
});

describe("GET /api/contacts", () => {
    beforeEach(async () => {
        await createTestUser();
        await createManyTestContact();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it("should can search contact without parameter", async () => {
        const result = await supertest(web)
            .get("/api/contacts")
            .set("Authorization", "test");

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it("should can search page 2", async () => {
        const result = await supertest(web)
            .get("/api/contacts")
            .set("Authorization", "test")
            .query({
                page: 2
            });

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it("should can search using name", async () => {
        const result = await supertest(web)
            .get("/api/contacts")
            .set("Authorization", "test")
            .query({
                name: 'Test 1'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it("should can search using email", async () => {
        const result = await supertest(web)
            .get("/api/contacts")
            .set("Authorization", "test")
            .query({
                email: 'test1'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it("should can search using phone", async () => {
        const result = await supertest(web)
            .get("/api/contacts")
            .set("Authorization", "test")
            .query({
                phone: '080900000001'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });
});
