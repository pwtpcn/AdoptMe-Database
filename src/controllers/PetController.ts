import Elysia, { t } from "elysia";
import PetRepository from "../repositories/PetRepository";

const PetController = new Elysia({
	prefix: "/api/pet",
	tags: ["Pet"],
})

PetController.get(
	"/getAll",
	async () => {
		const petRepository = new PetRepository();
		const pet = await petRepository.getAll();
		return pet ?? { error: "Pet not found" };
	},
	{
		detail: {
			summary: "Get all pets",
			description: "Get all pets",
		}
	}
)

PetController.get(
	"/getById/:id",
	async ({ params: { id } }) => {
		const petRepository = new PetRepository();
		const pet = await petRepository.getById(id);
		return pet ?? { error: "Pet not found" };
	},
	{
		params: t.Object({
			id: t.Number(),
		}),
		detail: {
			summary: "Get pet by id",
			description: "Get pet by id",
		}
	}
)

PetController.post(
	"/createPet",
	async ({ body: { pet_name, age_years, age_months, species, breed, weight, photo_url, sex, adopted, spayed, description, color } }) => {
		const petRepository = new PetRepository();
		const pet = await petRepository.createPet({
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
		});
		return pet;
	}, {
	body: t.Object({
		pet_name: t.String(),
		age_years: t.Number(),
		age_months: t.Number(),
		species: t.String(),
		breed: t.String(),
		weight: t.Number(),
		photo_url: t.String(),
		sex: t.Enum({
			MALE: "MALE",
			FEMALE: "FEMALE",
			UNKNOW: "UNKNOWN",
		}),
		adopted: t.Boolean(),
		spayed: t.Boolean(),
		description: t.String(),
		color: t.String(),
	}),
	detail: {
		summary: "Create pet",
		description: "Create pet",

	}
}
)

PetController.patch(
	"/updatePet",
	async ({ body }) => {
		const petRepository = new PetRepository();
		const updatedPet = await petRepository.updatePet({
			id: body.id,
			pet: body,
		});
		return updatedPet;
	},
	{
		body: t.Object({
			id: t.Number(),
			pet_name: t.Optional(t.String()),
			age_years: t.Optional(t.Number()),
			age_months: t.Optional(t.Number()),
			species: t.Optional(t.String()),
			breed: t.Optional(t.String()),
			weight: t.Optional(t.Number()),
			photo_url: t.Optional(t.String()),
			createAt: t.Optional(t.Date()),
			updatedAt: t.Optional(t.Date()),
			sex: t.Optional(t.Enum({
				MALE: "MALE",
				FEMALE: "FEMALE",
				UNKNOW: "UNKNOWN",
			})),
		}),
		detail: {
			summary: "Update pet",
			description: "Update pet",
		}
	}
)


PetController.delete(
	"/delete",
	async ({ body: { pet_id } }) => {
		const petRepository = new PetRepository();
		const pet = await petRepository.deletePet(pet_id);
		return pet;
	},
	{
		body: t.Object({
			pet_id: t.Number(),
		}),
			detail: {
			summary: "Delete pet",
			description: "Delete pet",
		}
	}
)

export default PetController;
