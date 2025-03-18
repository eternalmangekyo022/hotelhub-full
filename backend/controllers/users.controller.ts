import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as model from '../models/users.model';
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "../.env" });
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await model.login(email, password);

    const accessToken = jwt.sign(
      { email: user.email, id: user.id },
      
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ accessToken, user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const newUser = await model.register(req.body);

    const accessToken = jwt.sign(
      { email: newUser.email, id: newUser.id },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { email: newUser.email, id: newUser.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ accessToken, user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const accessToken = await model.refresh(refreshToken);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw { message: 'Invalid user ID', code: 400 };

    await model.deleteUser(id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function patchUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw { message: 'Invalid user ID', code: 400 };

    const userData = req.body;
    await model.patchUser({ ...userData, id });
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await model.getUsers();
    const usersWithoutPasswords = users.map(user => {
      const { password, ...rest } = user;
      return rest;
    });
    res.json(usersWithoutPasswords);
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw { message: 'Invalid user ID', code: 400 };

    const user = await model.getUserById(id); // Pass single number
    if (!user) throw { message: 'User not found', code: 404 };

    const { password: _, ...rest } = user;
    res.json(rest);
  } catch (err) {
    next(err);
  }
}
