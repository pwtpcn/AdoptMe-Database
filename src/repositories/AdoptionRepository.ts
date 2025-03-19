import { adoption } from "@prisma/client";
import db from "./Database";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


class AdoptionRepository{

	public async getAll(): Promise<adoption[]> {
		return await db.adoption.findMany();
	}

	public async getById(id: number): Promise<adoption | null> {
		return await db.adoption.findUnique({
			where: { id: id },
		});
	}

	public async getByPetId(id: number): Promise<adoption | null> {
		return await db.adoption.findUnique({
			where: { id: id },
		});
	}

	public async createAdoption({
		pet_id,
		user_id,
	}: {
		pet_id: number;
		user_id: string;
	}): Promise<adoption> {
		return await db.adoption.create({
			data: {
				pet_id: pet_id,
				user_id: user_id,
			},
		});
	}

	public async updateAdoption({
		id,
		adoption,
	}: {
		id: number;
		adoption: Partial <adoption>;
	}): Promise<adoption | null> {
		return await db.adoption.update({
			where: { id: id },
			data: adoption,
		});
	}

	public async deleteAdoption(id: number): Promise<adoption> {
		return await db.adoption.delete({
			where: { id: id },
		});
	}

}


export default AdoptionRepository;
