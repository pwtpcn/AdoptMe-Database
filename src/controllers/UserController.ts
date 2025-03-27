import { Elysia, t } from "elysia";
import { password } from "bun";
import UserRepository from "../repositories/UserRepository";
import { Priority, Prisma } from "@prisma/client";

const UserController = new Elysia({
	prefix: "/api/user",
	tags: ["User"],
});

async function encryptPassword(password: string): Promise<{ hash: string; salt: string; }> {
	const salt = Math.random().toString(36).substring(2, 12);
	const hash = await Bun.password.hash(password + salt, "bcrypt");
	return { hash, salt };
}

UserController.get(
	"/getAll",
	async () => {
		const userRepository = new UserRepository();
		const user = await userRepository.getAll();
		return user ?? { error: "User not found" };
	},
	{
		detail: {
			summary: "Get all users",
			description: "Get all users",
		}
	}
)

UserController.post(
	"/getById",
	async ({ body: { user_id } }) => {
		const userRepository = new UserRepository();
		const user = await userRepository.getById(user_id);
		return user ?? { error: "User not found" };
	},
	{
		body: t.Object({
			user_id: t.String(),
		}),
		detail: {
			summary: "Get user by id",
			description: "Get user by id",
		}
	}
)

UserController.post(
	"/getByUsername",
	async ({ body: { username } }) => {
		const userRepository = new UserRepository();
		const user = await userRepository.getByUsername(username);
		return user ?? { error: "User not found" };
	},
	{
		body: t.Object({
			username: t.String(),
		}),
		detail: {
			summary: "Get user by id",
			description: "Get user by id",
		}
	}
)

UserController.post(
	"/login",
	async ({ body: { username, password } }) => {
		const userRepository = new UserRepository();
		const user = await userRepository.getByUsername(username);
		if (!user) {
			return { error: "User not found" };
		}
		const isMatch = await Bun.password.verify(password + user.salt, user.password);
		if (!isMatch) {
			return { error: "Invalid password" };
		}
		return user;
	}, {
	body: t.Object({
		username: t.String(),
		password: t.String(),
	}),
	detail: {
		summary: "Login",
		description: "Login",
	}
	}
)

UserController.post(
	"/register",
	async ({ body: { username, password, email, first_name, last_name, phone_number, photo_url, salary } }) => {
		const userRepository = new UserRepository();
		const { hash, salt } = await encryptPassword(password);
		const user = await userRepository.createUser({
			username,
			password: hash,
			salt,
			email,
			first_name,
			last_name,
			phone_number,
			photo_url,
			salary,
		});
		return user;
	}, {
	body: t.Object({
		username: t.String(),
		password: t.String(),
		email: t.String(),
		first_name: t.String(),
		last_name: t.String(),
		phone_number: t.String(),
		photo_url: t.String(),
		salary: t.Number(),
	}),
	detail: {
		summary: "Create user",
		description: "Create user",
	}
}
)

UserController.patch(
	"/update",
	async ({ body }) => {
		const userRepository = new UserRepository();
		const user = await userRepository.updateUser({
			id: body.user_id,
			user: {
				...body,
				salary: body.salary ? new Prisma.Decimal(body.salary) : undefined,
			}
		});
		return user;
	}, {
		body: t.Object({
			user_id: t.String(),
			username: t.Optional(t.String()),
			email: t.Optional(t.String()),
			first_name: t.Optional(t.String()),
			last_name: t.Optional(t.String()),
			phone_number: t.Optional(t.String()),
			photo_url: t.Optional(t.String()),
			salary: t.Optional(t.Number()),
			createdAt: t.Optional(t.Date()),
			updatedAt: t.Optional(t.Date()),
			priority: t.Optional(t.Enum(Priority))
		}),
		detail: {
			summary: "Update user",
			description: "Update user",
		}
	}
)

UserController.delete(
	"/delete",
	async ({ body: { user_id } }) => {
		const userRepository = new UserRepository();
		const user = await userRepository.deleteUser(user_id);
		return user;
	}, {
		body: t.Object({
			user_id: t.String(),
		}),
		detail: {
			summary: "Delete user",
			description: "Delete user",
		}
	}
)

export default UserController;
