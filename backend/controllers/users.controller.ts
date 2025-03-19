/**
 * Handles user authentication and authorization
 * @namespace controllers/users
 */

import * as model from "../models/users.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { type Response, type Request } from "express";

dotenv.config({ path: "./.env" });

/**
 * @function login
 * @description Handles user login
 */
export async function login(
  req: Req<{ email: string; password: string }>,
  res: Response
) {
  const user = await model.login(req.body.email, req.body.password);

  const accessToken = jwt.sign(
    { email: user.email, id: user.id },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "15m" } // Short expiry for access token
  );

  const refreshToken = jwt.sign(
    { email: user.email, id: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" } // Longer expiry for refresh token
  );

  // Optionally store refresh token in a secure location (e.g., database or cache)

  res.cookie("accessToken", accessToken, {
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    maxAge: 900 * 1000, // 1 hour
    httpOnly: true,
  });

  res.cookie("refreshToken", refreshToken, {
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    maxAge: 24 * 60 * 60 * 1000, // 1 week
    httpOnly: true,
  });

  res.json({ user });
}

/**
 * @function register
 * @description Handles user registration
 */
export async function register(
  {
    body: { firstname, lastname, phone, email, password },
  }: Req<{
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    password: string;
  }>,
  res: Res
) {
  const user = await model.register({
    firstname,
    lastname,
    phone,
    email,
    password,
  });
  res.json(user);
}

/**
 * @function refresh
 * @description Handles token refresh
 */
export async function refresh(
  { body: { refreshToken } }: Req<{ refreshToken: string }>,
  res: Res
) {
  if (!refreshToken) throw { message: "Missing refresh token", code: 400 };
  res.cookie("accessToken", await model.refresh(refreshToken), {
    httpOnly: true,
    maxAge: 900 * 1000,
    secure: process.env.NODE_ENV === "production",
  });
  res.send();
}

/**
 * @function deleteUser
 * @description Handles user deletion
 */
export async function deleteUser(
  req: Req<{ params: { userId: string } }>,
  res: Res
) {
  const {
    params: { userId },
  } = req;
  // Check if the userId in the request matches the userId in the JWT
  if (userId !== req.user?.id.toString())
    throw { message: "Unauthorized", code: 401 };
  // Call the deleteUser function from the model
  await model.deleteUser(parseInt(userId));
  // Send a 204 response with an empty body
  res.status(204).header("Content-Length", "0").send();
}

export async function patchUser(
  req: Req<{ params: { userId: string }; body: Omit<UserPut, "id"> }>,
  res: Res
) {
  const {
    params: { userId },
    body,
  } = req;
  // Check if the userId in the request matches the userId in the JWT
  if (userId !== req.user?.id.toString())
    throw { message: "Unauthorized", code: 401 };
  // Call the patchUser function from the model
  await model.patchUser({ ...body, id: parseInt(userId) });
  // Send a 204 response with an empty body
  res.status(204).header("Content-Length", "0").send();
}

// FOR DEVELOPMENT ONLY
export async function getUsers(req: Req, res: Res) {
  const users = await model.getUsers();
  res.json(users);
}


export async function check(req: Request, res: Response) {
  res.json(await model.getUserById(req.user?.id as number));
}

export async function logout(req: Request, res: Response) {
  res.cookie("accessToken", "", {
    maxAge: 0,
    httpOnly: true,
    path: "/",
  });
  res.cookie("refreshToken", "", {
    maxAge: 0,
    httpOnly: true,
    path: "/",
  });
  res.send();
}

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;

  // Validate the ID
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await model.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
