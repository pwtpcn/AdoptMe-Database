import { Elysia, t } from "elysia";
import crypto from "crypto";
import db from "./db";
import { Prisma, userRole } from "@prisma/client";

const app = new Elysia({ prefix: "/user" });
app.get("/", () => "Hello Elysia");

app.get(
  "/getAllUser",
  async () => {
    try {
      const userList = await db.user.findMany({
        select: {
          user_id: true,
          username: true,
          email: true,
          first_name: true,
          last_name: true,
          phone_number: true,
          photo_url: true,
          salary: true,
          role: true,
        },
      });

      return userList;
    } catch (error) {
      console.error("Error fetching users: ", error);
      return { error: "Failed to fetch users" };
    }
  },
  {
    detail: {
      tags: ["User"],
    },
  }
);

app.post(
  "/getUserByID",
  async ({ body }) => {
    try {
      const user = await db.user.findUnique({
        where: { user_id: body.user_id },
        select: {
          username: true,
          email: true,
          first_name: true,
          last_name: true,
          phone_number: true,
          photo_url: true,
          salary: true,
          role: true,
        },
      });

      if (!user) {
        return { message: "User not found" };
      } else {
        console.log("Get user by ID successfully: ", user);
        return user;
      }
    } catch (error) {
      console.error("Error fetching user: ", error);
      return { message: "Failed to fetch user" };
    }
  },
  {
    body: t.Object({
      user_id: t.String(),
    }),
    detail: {
      tags: ["User"],
    },
  }
);

app.post(
  "/login",
  async ({ body }) => {
    const encryptWithSalt = (password: string, salt: string): string => {
      const hashedPassword = crypto
        .createHash("sha256")
        .update(password + salt)
        .digest("hex");
      return hashedPassword;
    };

    const username = body.username;

    interface Authenticate {
      salt: string;
      password: string;
    }

    const authen: Authenticate[] = await db.$queryRaw`
      SELECT "salt", "password" FROM "user" WHERE "username" = ${username} LIMIT 1
      `;

    const hashedPassword = encryptWithSalt(body.password, authen[0].salt);

    if (authen[0].password === hashedPassword) {
      return db.$queryRaw`
        SELECT "username", "role" FROM "user" WHERE "username" = ${username} LIMIT 1
        `;
    } else {
      return JSON.stringify({
        username: "Error authen failed",
        role: "Unknown",
      });
    }
  },
  {
    body: t.Object({
      username: t.String(),
      password: t.String(),
    }),
    detail: {
      tags: ["User"],
    },
  }
);

app.post(
  "/post",
  async ({ body }) => {
    try {
      const generateSalt = (length: number = 16): string => {
        return crypto
          .randomBytes(Math.ceil(length / 2))
          .toString("hex")
          .slice(0, length);
      };

      const encryptWithSalt = (password: string, salt: string): string => {
        const hashedPassword = crypto
          .createHash("sha256")
          .update(password + salt)
          .digest("hex");
        return hashedPassword;
      };

      const salt = generateSalt();
      const hashedPassword = encryptWithSalt(body.password, salt);
      const photoUrl = body.photo_url ? body.photo_url : "default_photo";
      const role: userRole = body.role;

      const insertedUser = await db.$queryRaw`
      INSERT INTO "user" ("username", "password", "salt", "email", "first_name", "last_name", "phone_number", "photo_url", "salary", "role")
      VALUES (
        ${body.username},
        ${hashedPassword},
        ${salt},
        ${body.email},
        ${body.first_name},
        ${body.last_name},
        ${body.phone_number},
        ${photoUrl},
        ${body.salary},
        ${Prisma.sql`${body.role}::"userRole"`}
      )
      RETURNING "user_id", "username", "password", "salt", "email", "first_name", "last_name", "phone_number", "photo_url", "salary", "role"
      `;
      console.log("User inserted successfully: ", insertedUser);
      return insertedUser;
    } catch (error) {
      console.error("Error inserting user: ", error);
      return { error: "Failed to insert user" };
    }
  },
  {
    body: t.Object({
      username: t.String(),
      password: t.String(),
      email: t.String(),
      first_name: t.String(),
      last_name: t.String(),
      phone_number: t.String(),
      photo_url: t.Optional(t.String()),
      salary: t.Number({
        minimum: 0,
      }),
      role: t.Enum({user:"user", admin:"admin"}),
    }),
    detail: {
      tags: ["User"],
    },
  }
);

app.put(
  "/updateUserByID",
  async ({ body }) => {
    try {
      const generateSalt = (length: number = 16): string => {
        return crypto
          .randomBytes(Math.ceil(length / 2))
          .toString("hex")
          .slice(0, length);
      };

      const encryptWithSalt = (password: string, salt: string): string => {
        const hashedPassword = crypto
          .createHash("sha256")
          .update(password + salt)
          .digest("hex");
        return hashedPassword;
      };

      const updateData: any = {};

      if (body.username !== undefined) updateData.username = body.username;
      if (body.email !== undefined) updateData.email = body.email;
      if (body.first_name !== undefined) updateData.first_name = body.first_name;
      if (body.last_name !== undefined) updateData.last_name = body.last_name;
      if (body.phone_number !== undefined) updateData.phone_number = body.phone_number;
      if (body.photo_url !== undefined) updateData.photo_url = body.photo_url;
      if (body.salary !== undefined) updateData.salary = body.salary;
      if (body.role !== undefined) updateData.role = body.role;

      if (body.password !== undefined) {
        const salt = generateSalt();
        const hashedPassword = encryptWithSalt(body.password, salt);
        updateData.password = hashedPassword;
        updateData.salt = salt;
      }

      const updatedUser = await db.user.update({
        where: {
          user_id: body.user_id,
        },
        data: updateData,
      });

      console.log("User updated successfully:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user: ", error);
      return { error: "Failed to update user" };
    }
  },
  {
    body: t.Object({
      user_id: t.String(),
      username: t.Optional(t.String()),
      email: t.Optional(t.String()),
      password: t.Optional(t.String()),
      first_name: t.Optional(t.String()),
      last_name: t.Optional(t.String()),
      phone_number: t.Optional(t.String()),
      photo_url: t.Optional(t.String()),
      salary: t.Optional(
        t.Number({
          minimum: 0,
        })
      ),
      role: t.Optional(t.Enum(userRole)),
    }),
    detail: {
      tags: ["User"],
    },
  }
);

app.delete(
  "/deleteUserByID",
  async ({ body }) => {
    try {
      const deletedUser = await db.user.delete({
        where: {
          user_id: body.user_id,
        },
      });

      console.log("User deleted successfully: ", deletedUser);
      return {
        message: "User deleted successfully",
        deleted_user: deletedUser,
      };
    } catch (error) {
      console.error("Error deleting user: ", error);
      return { error: "Failed to delete user" };
    }
  },
  {
    body: t.Object({
      user_id: t.String(),
    }),
    detail: {
      tags: ["User"],
    },
  }
);

export default app;
