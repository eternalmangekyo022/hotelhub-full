import axios from 'axios';
import { describe, expect, test, afterAll } from '@jest/globals'
import db from '../../models/db';
import jwt from "jsonwebtoken"

async function deleteUser(email: string) {
    await db.delete("delete from users where ?", { email })
}

describe("/login", async () => {
    test("correct", async () => {
        const { data: { user }, status } = await axios.post<{ user: User }>("http://localhost:3000/api/v1/login", {
            email: "benezoltancime@gmail.com",
            password: "admin123"
        });
        expect(status).toBe(200);
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("firstname");
        expect(user).toHaveProperty("lastname");
        expect(user).toHaveProperty("permissionId");
        expect(user).toHaveProperty("phone");
        expect(user).toHaveProperty("email");
        expect(user).toHaveProperty("registered");
        expect(user).toHaveProperty("password");
    })

    test("wrong credentials", async () => {
        try {
            await axios.post<{ user: User }>("http://localhost:3000/api/v1/login", {
                email: "benezoltancime@gmail.com",
                password: "admin123456"
            });
        } catch (e) {
            expect((e as { status: number }).status).toBe(401);
        }
    })

    test("user not found", async () => {
        try {
            await axios.post<{ user: User }>("http://localhost:3000/api/v1/login", {
                email: "benezlatancime@gmail.com",
                password: "admin123456"
            });
        } catch (e) {
            expect((e as { status: number }).status).toBe(404);
        }
    })
})

describe("/logout", async () => {
    test("logout", async () => {
        try {
            const { status } = await axios.delete("http://localhost:3000/api/v1/logout");
            expect(status).toBe(200);
        } catch (e) {
            console.log(e)
        }
    })
})
describe("/register", async () => {
    test("user already exists", async () => {
        try {
            await axios.post<{ user: User }>("http://localhost:3000/api/v1/register", {
                firstname: "John",
                lastname: "Doe",
                phone: "1234567890",
                email: "john.doe@example.com",
                password: "password123"
            });
        } catch (e) {
            expect((e as { status: number }).status).toBe(409);
        }
    })

    test("correct", async () => {
        const testingMail = "users.routes.testing@jest.com";
        await axios.post<{ user: User }>("http://localhost:3000/api/v1/register", {
            firstname: "John",
            lastname: "Doe",
            phone: "1234567890",
            email: testingMail,
            password: "password123"
        });
        await deleteUser(testingMail);
    })
})

describe("/check", async () => {
    const accessToken = jwt.sign({ email: "benezoltancime@gmail.com", id: 1 }, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ email: "benezoltancime@gmail.com", id: 1 }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
    test("no tokens at all", async () => {
        const { status } = await axios.post("http://localhost:3000/api/v1/check");
        expect(status).toBe(204);
    })

    test("refresh token only", async () => {
        const { status } = await axios.post("http://localhost:3000/api/v1/check", {}, {
            headers: {
                cookie: `refreshToken=${refreshToken}`
            }
        });
        expect(status).toBe(200);
    })
    test("both tokens", async () => {
        const { status } = await axios.post("http://localhost:3000/api/v1/check", {}, {
            headers: {
                cookie: `refreshToken=${refreshToken}; accessToken=${accessToken}`
            }
        });
        expect(status).toBe(200);
    })
})

describe("/users/:userId", async () => {
    const testingMail = "users.routes.users@jest.com";
    const user = await db.selectOne<User>("select * from users where ?", { email: testingMail })
    let insertId;
    if (!user) {
        const { data } = await axios.post<User>("http://localhost:3000/api/v1/register", {
            firstname: "John",
            lastname: "Doe",
            phone: "1234567890",
            email: testingMail,
            password: "password123"
        });
        insertId = data.id;
    } else insertId = user.id;

    describe("delete", async () => {
        test("correct with token", async () => {
            const accessToken = jwt.sign({ email: testingMail, id: insertId }, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });
            const { status } = await axios.delete(`http://localhost:3000/api/v1/users/${insertId}`, {
                headers: {
                    cookie: `accessToken=${accessToken}`,
                }
            });
            expect(status).toBe(204);
        })

        test("incorrect without token", async () => {
            try {
                await axios.delete(`http://localhost:3000/api/v1/users/${insertId}`);
            } catch (e) {
                expect((e as { status: number }).status).toBe(401);
            }
        })
    })

    describe("patch", async () => {
        let mockUser: { id: number };
        try {
            const res = await db.insert("insert into users (firstname, lastname, phone, email, password) values (?, ?, ?, ?, ?)", ["John", "Doe", "1234567890", testingMail + 'patch', "password123"])
            mockUser = { id: res.insertId }
        } catch (e) {
            mockUser = await db.selectOne<{ id: number }>("select id from users where email = ?", [testingMail + 'patch'])
        }
        const mockToken = jwt.sign({ email: testingMail + 'patch', id: mockUser.id }, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });
        test("correct", async () => {
            const { data } = await axios.patch<User>(`http://localhost:3000/api/v1/users/${mockUser.id}`, {
                password: "password124"
            }, {
                headers: {
                    cookie: `accessToken=${mockToken}`
                }
            });

            console.log(data)
        })

        test("no credentials", async () => {
            try {
                await axios.patch<User>(`http://localhost:3000/api/v1/users/${mockUser.id}`, { phone: "+36202343343" });
            } catch (e) {
                expect((e as { status: number }).status).toBe(401);
            }
        })

        afterAll(async () => {
            await deleteUser(testingMail + 'patch');
        })
    })

    describe("get", async () => {
        let mockUser: { id: number };
        try {
            const res = await db.insert("insert into users (firstname, lastname, phone, email, password) values (?, ?, ?, ?, ?)", ["John", "Doe", "1234567890", testingMail + 'get', "password123"])
            mockUser = { id: res.insertId }
        } catch (e) {
            mockUser = await db.selectOne<{ id: number }>("select id from users where email = ?", [testingMail + 'get'])
        }
        const mockToken = jwt.sign({ email: testingMail + 'get', id: mockUser.id }, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });
        test("correct", async () => {
            const { data } = await axios.get<User>(`http://localhost:3000/api/v1/users/${mockUser.id}`, {
                headers: {
                    cookie: `accessToken=${mockToken}`
                }
            });

            expect(data.id).toBe(mockUser.id);
        })

        test("not found", async () => {
            try {
                await axios.get<User>('http://localhost:3000/api/v1/users/-1', {
                    headers: {
                        cookie: `accessToken=${mockToken}`
                    }
                });
            } catch (e) {
                expect((e as { status: number }).status).toBe(404);
            }
        })

        afterAll(async () => {
            await deleteUser(testingMail + 'get');
        })
    })

    describe("change password", async () => {
        let mockUser: { id: number };
        try {
            const res = await db.insert("insert into users (firstname, lastname, phone, email, password) values (?, ?, ?, ?, md5(?))", ["John", "Doe", "1234567890", testingMail + 'change', "password123"])
            mockUser = { id: res.insertId }
        } catch (e) {
            mockUser = await db.selectOne<{ id: number }>("select id from users where email = ?", [testingMail + 'change'])
        }
        const mockToken = jwt.sign({ email: testingMail + 'change', id: mockUser.id }, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });
        test("correct", async () => {
            const { status } = await axios.put<User>(`http://localhost:3000/api/v1/users/${mockUser.id}/change-password`, {
                currentPassword: "password123",
                newPassword: "password124"
            }, {
                headers: {
                    cookie: `accessToken=${mockToken}`
                }
            });

            expect(status).toBe(200);
        })

        test("no credentials", async () => {
            try {
                await axios.put<User>(`http://localhost:3000/api/v1/users/${mockUser.id}/change-password`, { currentPassword: "password123", newPassword: "password124" });
            } catch (e) {
                expect((e as { status: number }).status).toBe(401);
            }
        })

        test("user not found", async () => {
            try {
                await axios.put<User>(`http://localhost:3000/api/v1/users/-1/change-password`, { currentPassword: "password123", newPassword: "password124" }, {
                    headers: {
                        cookie: `accessToken=${mockToken}`
                    }
                });
            } catch (e) {
                expect((e as { status: number }).status).toBe(404);
            }
        })

        afterAll(async () => {
            await deleteUser(testingMail + 'change');
        })
    })
})