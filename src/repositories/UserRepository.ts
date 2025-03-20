import { user } from "@prisma/client";
import db from "./Database";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

class UserRepository {

	public async getAll(): Promise<Partial<user>[]> {
		return await db.user.findMany({
			select: {
				user_id: true,
				username: true,
				email: true,
				first_name: true,
				last_name: true,
				phone_number: true,
				photo_url: true,
				salary: true,
				priority: true
			}
		});
	}

	public async getByUsername(username: string): Promise< {user_id: string, salt: string, password: string, priority : string, username: string} | null> {
		return await db.user.findUnique({
			where: { username},
			select: {
				user_id: true,
				username: true,
				salt: true,
				password: true,
				priority: true,
			}
		});
	}

	public async getById(user_id: string): Promise<Partial<user | null>> {
		return await db.user.findUnique({
			where: { user_id: user_id },
			select: {
				user_id: true,
				username: true,
				email: true,
				first_name: true,
				last_name: true,
				phone_number: true,
				photo_url: true,
				salary: true,
			}
		});
	}

	public async createUser({
		username,
		password,
		salt,
		email,
		first_name,
		last_name,
		phone_number,
		photo_url,
		salary,
	}:{
		username: string,
		password: string,
		salt: string,
		email: string,
		first_name: string,
		last_name: string,
		phone_number: string,
		photo_url: string,
		salary: number
	}): Promise<user> {
		try {
			const respone = await db.user.create({
				data: {
					username,
					password,
					salt,
					email,
					first_name,
					last_name,
					phone_number,
					photo_url,
					salary,
				},
			});
			return respone;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError){
				switch (error.code){
					case 'P2002':
						throw  JSON.stringify({ error: 'Username already exists' });
					default :
						throw JSON.stringify({ error: error.code + error.message });
				}
			}
			else  {
				throw JSON.stringify({ error: 'Unexpected error'});
			}
		}
	}

	public async updateUser({
		id,
		user
	}: {
		id: string,
		user: Partial<user>
	}): Promise<user | null>{
		try {
			const response = await db.user.update({
				where: { user_id: id },
				data: user,
			});
			return response;
		} catch (error){
			if (error instanceof PrismaClientKnownRequestError){
				switch (error.code){
					case 'P2002':
						throw  JSON.stringify({ error: 'Username already exists' });
					default :
						throw JSON.stringify({ error: error.code + error.message });
				}
			}
			else  {
				throw JSON.stringify({ error: 'Unexpected error'});
			}
		}
	}

	public async deleteUser(user_id: string): Promise<user | null> {
		return db.user.delete({
			where: { user_id: user_id },
		});
	}

}

export default UserRepository;
