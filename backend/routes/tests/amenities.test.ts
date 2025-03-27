import { describe, expect, test } from '@jest/globals'
import axios from 'axios'

describe("/amenities", async () => {
    test("correct", async () => {
        const { status } = await axios.get("http://localhost:3000/api/v1/amenities/1");
        expect(status).toBe(200);
    })

    test("not found", async () => {
        try {
            await axios.get("http://localhost:3000/api/v1/amenities/-1");
        } catch (e) {
            expect((e as { status: number }).status).toBe(404);
        }
    })
})