import { order, order_status, pet } from "@prisma/client";
import db from "./Database";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

class OrderRepository {
	public async getAll(): Promise<order[]> {
		return await db.order.findMany();
	}

	public async getById(id: number): Promise<order | null> {
		return await db.order.findUnique({
			where: { id: id }
		});
	}

	public async getByUserId(user_id: string): Promise<order[]> {
		return await db.order.findMany({
			where: { user_id: user_id }
		});
	}

	public async getByProductId(product_id: number): Promise<order[]> {
		return await db.order.findMany({
			where: {
				product_id: product_id,
				NOT: {
					comment: null,
					rating: null,
				},
			}
		});
	}
	public async createOrder({
		user_id,
		product_id,
		quantity,
		total_price
	}: {
		user_id: string;
		product_id: number;
		quantity: number;
		total_price: number;
	}): Promise<order> {
		try {
			const response = await db.order.create({
				data: {
					user_id: user_id,
					product_id: product_id,
					quantity: quantity,
					total_price: total_price,
					order_date: new Date()
				}
			});
			return response;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				throw JSON.stringify({error: error.message});
			}
			throw JSON.stringify({error: "Internal Server Error"});
		}
	}

    public async updateOrder({
        id,
        order,
    }: {
        id: number;
        order : Partial<order>;
    }): Promise<order | null> {
        try {
            const response = await db.order.update({
                where: { id: id },
                data: { 
                    ...order
                }
            });
            return response;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                throw JSON.stringify({error: error.message});
            }
            throw JSON.stringify({error: "Internal Server Error"});
        }
    }
}


export default OrderRepository;
