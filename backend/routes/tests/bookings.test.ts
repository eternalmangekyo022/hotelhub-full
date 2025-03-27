import { test, expect, describe } from '@jest/globals'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import db from '../../models/db'

const mockToken = jwt.sign({ email: "test", id: 1 }, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });

const withCookie = (cookie: boolean) => axios.create({
    baseURL: "http://localhost:3000/api/v1",
    headers: {
        common: {
            "Content-Type": "application/json"
        },
        ...(cookie ? { cookie: `accessToken=${mockToken}` } : {})
    }
})

async function deleteBooking(id: number) {
    await db.delete("delete from bookings where ?", { id })
}

const mockBooking = {
    user_id: 1,
    hotel_id: 1,
    booked: new Date().toISOString().split('T')[0],
    checkin: new Date().toISOString().split('T')[0],
    checkout: new Date().toISOString().split('T')[0],
    payment_id: 1,
    participants: 1
} satisfies Omit<Booking, "id">;

async function insertBooking() {
    return await withCookie(true).post<{ insertId: number }>("/bookings", mockBooking);
}

describe("/bookings", async () => {
    const user = await db.selectOne<Pick<User, "email" | "id">>("select email, id from users limit 1")

    describe("get", () => {
        test("all", async () => {
            const { status } = await withCookie(true).get("/bookings");
            expect(status).toBe(200);
        })

        test("not found", async () => {
            try {
                await withCookie(true).get("/bookings/-1");
            } catch (e) {
                expect((e as { status: number }).status).toBe(404);
            }
        })
    })

    describe("post", () => {
        test("add", async () => {
            const { status, data } = await insertBooking();
            expect(status).toBe(201);
            await deleteBooking(data.insertId)
        })
    })

    describe("/rate/:bookingId", () => {
        test("update", async () => {
            const { data: { insertId } } = await insertBooking();
            const { status } = await withCookie(true).put(`/rate/${insertId}`, {
                rating: 5
            });
            expect(status).toBe(200);
            await deleteBooking(insertId)
        })
    })
});