import { product_category } from ".prisma/client";
import db from "./Database";

class ProductCategoryRepository {

	public async getAll(): Promise<product_category[]> {
		return await db.product_category.findMany();
	}

	public async getById(id: number): Promise<product_category | null> {
		return await db.product_category.findUnique({
			where: { id: id },
		});
	}

	public async getByName(name: string): Promise<product_category | null> {
		return await db.product_category.findFirst({
			where: {
				name: name
			}
		});
	}

	public async createProductCategory({
		name,
		description,
	}: {
		name: string;
		description: string;
	}): Promise<product_category> {
		return await db.product_category.create({
			data: {
				name: name,
				description: description,
			},
		});
	}

	public async updateProductCategory({
		id,
		product_category,
	}: {
		id: number;
		product_category: Partial<product_category>;
	}): Promise<product_category | null> {
		return await db.product_category.update({
			where: { id: id },
			data: product_category,
		});
	}

	public async deleteProductCategory(id: number): Promise<product_category | null> {
		return await db.product_category.delete({
			where: { id: id },
		});
	}
}

export default new ProductCategoryRepository();
