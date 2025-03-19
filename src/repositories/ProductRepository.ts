import { product } from ".prisma/client";
import db from "./Database";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

class ProductRepository {

	public async getAll(): Promise<product[]> {
		return await db.product.findMany();
	}

	public async getByName(name: string): Promise<product | null> {
		return await db.product.findFirst({
			where: {
				name: name
			}
		});
	}

	public async createProduct({
		name,
		price,
		stock,
		description,
		imageurl,
	}: {
		name: string;
		price: number;
		stock: number;
		description: string;
		imageurl: string;
	}): Promise<product> {
		try {
			const response = await db.product.create({
				data: {
					name: name,
					price: price,
					stock: stock,
					description: description,
					imageurl: imageurl,
				},
			});
			return response;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				throw JSON.stringify({error: error.message});
			}
			else
			{
				throw JSON.stringify({error: 'Unexpected error'});
			}
		}
	}

	public async updateProduct({
		id,
		product,
	}: {
		id: number;
		product: Partial<product>;
	}): Promise<product | null> {
		try {
			const response = await db.product.update({
				where: { id: id },
				data: product
			});
			return response;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				throw JSON.stringify({error: error.message});
			}
			else
			{
				throw JSON.stringify({error: 'Unexpected error'});
			}
		}
	}

	public async deleteProduct(id: number): Promise<product> {
		return await db.product.delete({
			where: { id: id },
		});
	}

}


export default ProductRepository;
