import { expect, describe, it } from '@jest/globals'
import ax from 'axios'
import jwt from 'jsonwebtoken'
import db from '../../models/db';

const mockToken = jwt.sign({ email: "test", id: 1 }, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });

const axios = ({ cookie }: { cookie: boolean }) => ax.create({
    baseURL: "http://localhost:3000/api/v1/hotels",
    headers: {
        "Content-Type": "application/json",
        ...(cookie ? { cookie: `accessToken=${mockToken}` } : {})
    }
})

describe("/hotels", async () => {
    it("should return 200", async () => {
        const { status } = await axios({ cookie: false }).get("/");
        expect(status).toBe(200);
    })

    describe("/:hotelId", () => {

        it("should return 200", async () => {
            const { status } = await axios({ cookie: false }).get("/id/1");
            expect(status).toBe(200);
        })

        it("should return 404 not found", async () => {
            try {
                await axios({ cookie: false }).get("/id/-1");
            } catch (e) {
                expect((e as { status: number }).status).toBe(404);
            }
        })
    })

    describe("/unison", async () => {
        const correctIds = (await db.select<{ id: number }>("select id from hotels limit 10")).map(i => i.id);
        const wrongIds = (await db.select<{ id: number }>("select id from hotels limit 10")).map(i => i.id * -1);

        it("should return 200", async () => {
            const { status } = await axios({ cookie: false }).get(`/unison?ids=${correctIds.join(",")}`);
            expect(status).toBe(200);
        })

        it("should return 404 not found", async () => {
            try {
                await axios({ cookie: false }).get(`/unison?ids=${wrongIds.join(",")}`);
            } catch (e) {
                expect((e as { status: number }).status).toBe(404);
            }
        })
    })

    describe("/price-range", () => {
        it("should return 200", async () => {
            const { status, data } = await axios({ cookie: false }).get<{ price: { min: number, max: number } }>("/price-range");
            expect(status).toBe(200);
            expect(data).toHaveProperty("price");
            expect(data.price).toHaveProperty("min");
            expect(data.price).toHaveProperty("max");
        })
    })
})