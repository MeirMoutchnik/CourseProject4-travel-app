import type { User1 } from "../types/Users";
import sql from "../db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
}

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await sql`SELECT * FROM users1 ORDER BY user_id ASC`;
    res.json(users as User1[]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get users" });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const user = await sql`SELECT * FROM users1 WHERE user_id = ${userId}`;
    res.json(user[0] as User1);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get user" });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const user = req.body as User1;
    const hashedPassword = await bcrypt.hash(user.user_password, 10);

    const result = await sql`
        INSERT INTO users1 (user_name, user_email, user_password, user_role)
        VALUES (${user.user_name}, ${user.user_email}, ${hashedPassword}, ${user.user_role})
        RETURNING *
        `;
    res
      .status(201)
      .json({ message: "User created successfully", user: result[0] as User1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const user = req.body as User1;
    const hashedPassword = await bcrypt.hash(user.user_password, 10);
    const result = await sql`
      UPDATE users1
      SET
        user_name = ${user.user_name},
        user_email = ${user.user_email},
        user_password = ${hashedPassword},
        user_role = ${user.user_role}
      WHERE user_id = ${userId}
      RETURNING *
    `;
    res.json({
      message: "User updated successfully",
      user: result[0] as User1,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user" });
  }
}

export async function patchUser(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const user = req.body as User1;
    const hasUserName = user.user_name !== undefined;
    const hasUserEmail = user.user_email !== undefined;
    const hasUserPassword = user.user_password !== undefined;
    const hasUserRole = user.user_role !== undefined;

    if (!hasUserName && !hasUserEmail && !hasUserPassword && !hasUserRole) {
      res
        .status(400)
        .json({ error: "At least one field to update is required" });
      return;
    }

    const hashedPassword = hasUserPassword
      ? await bcrypt.hash(user.user_password, 10)
      : null;

    const result = await sql`
      UPDATE users1
      SET
        user_name = COALESCE(${user.user_name}, user_name),
        user_email = COALESCE(${user.user_email}, user_email),
        user_password = COALESCE(${hashedPassword}, user_password),
        user_role = COALESCE(${user.user_role}, user_role)
      WHERE user_id = ${userId}
      RETURNING *
    `;
    res.json({
      message: "User patched successfully",
      user: result[0] as User1,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to patch user" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const result = await sql`DELETE FROM users1 WHERE user_id = ${userId}`;
    res.json({
      message: "User deleted successfully",
      user: result[0] as User1,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { user_email, user_password } = req.body as User1;
    const result =
      await sql`SELECT * FROM users1 WHERE user_email = ${user_email}`;
    const found = result[0] as User1 | undefined;

    if (!found) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(user_password, found.user_password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { userId: found.user_id, user_role: found.user_role },
      getJwtSecret(),
      { expiresIn: "1h" },
    );
    res.json({
      message: "User logged in successfully",
      user: found,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to login user" });
  }
}
