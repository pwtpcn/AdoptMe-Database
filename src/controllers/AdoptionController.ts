import Elysia, { t } from "elysia";
import AdoptionRepository from "../repositories/AdoptionRepository";

const AdpotionsController = new Elysia({
	prefix: "/api/adoption",
	tags: ["Adoption"],
})

AdpotionsController.get(
	"/getAll",
	async () => {
		const adoptionsRepository = new AdoptionRepository();
		const adoptions = await adoptionsRepository.getAll();
		return adoptions ?? { error: "Adoptions not found" };
	},
	{
		detail: {
			summary: "Get all adoptions",
			description: "Get all adoptions",
		}
	}
)


AdpotionsController.get(
	"/getById:id",
	async ({ params: { id } }) => {
		const adoptionsRepository = new AdoptionRepository();
		const adoption = await adoptionsRepository.getById(id);
		return adoption ?? { error: "Adoption not found" };
	},
	{
		params: t.Object({
			id: t.Number(),
		}),
		detail: {
			summary: "Get adoption by id",
			description: "Get adoption by id",
		}
	}
)


AdpotionsController.post(
	"/createAdoption",
	async ({ body: { pet_id, user_id } }) => {
		const adoptionsRepository = new AdoptionRepository();
		const adoption = await adoptionsRepository.createAdoption({
			pet_id,
			user_id,
		});
		return adoption;
	},
	{
		body: t.Object({
			pet_id: t.Number(),
			user_id: t.String(),
		}),
		detail: {
			summary: "Create adoption",
			description: "Create adoption",
		}
	}
)

AdpotionsController.put(
	"/updateAdoption",
	async ({ body }) => {
		const adoptionsRepository = new AdoptionRepository();
		const updatedAdoption = await adoptionsRepository.updateAdoption({
			id: body.id,
			adoption: body
		});
		return updatedAdoption;
	},
	{
		body: t.Object({
			id: t.Number(),
			pet_id: t.Number(),
			user_id: t.String(),
			createdAt: t.Optional(t.Date()),
			updatedAt: t.Optional(t.Date()),
		}),
		detail: {
			summary: "Update adoption",
			description: "Update adoption",
		}
	}
)


export default AdpotionsController;
