import { pet, sex } from "@prisma/client";
import db from "./Database";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

class PetRepository {

	public async getAll(): Promise<pet[]> {
		return await db.pet.findMany();
	}

	public async getById(pet_id: number): Promise<pet | null> {
		return await db.pet.findUnique({
			where: { pet_id: pet_id },
		});
	}

	public async createPet({
		pet_name,
		age_years,
		age_months,
		species,
		breed,
		weight,
		photo_url,
		sex,
		adopted,
		spayed,
		description,
		color,
	}: {
		pet_name: string;
		age_years: number;
		age_months: number;
		species: string;
		breed: string;
		weight: number;
		photo_url: string;
		sex: sex;
		adopted: boolean;
		spayed: boolean;
		description: string;
		color: string;
	}): Promise<pet> {
		try {
			const respone = await db.pet.create({
				data: {
					pet_name: pet_name,
					age_years: age_years,
					age_months: age_months,
					species: species,
					breed: breed,
					weight: weight,
					photo_url: photo_url,
					sex: sex,
					adopted: adopted,
					spayed: spayed,
					description: description,
					color: color,
				},
			});
			return respone;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				throw JSON.stringify({error: error.message});
			}
			throw JSON.stringify({error: "Internal Server Error"});
		}
	}

	public async updatePet({
		id,
		pet
	}: {
		id : number,
		pet : Partial<pet>
	}): Promise<pet | null>{
		try {
			const response = await db.pet.update({
				where: { pet_id: id },
				data: pet,
			});
			return response;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				throw JSON.stringify({error: error.message});
			}
			throw JSON.stringify({error: "Internal Server Error"});
		}
	}

	public async deletePet(pet_id: number): Promise<pet | null> {
		return db.pet.delete({
			where: { pet_id: pet_id },
		});
	}
}

export default PetRepository;
