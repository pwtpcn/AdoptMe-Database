import Elysia, { t } from "elysia";
import OrderRepository from "../repositories/OrderRepository";
import { order_status } from "@prisma/client";

const OrderController = new Elysia({
	prefix: "/api/order",
	tags: ["Order"],
})

OrderController.get(
	"/getAll",
	async () => {
		const orderRepository = new OrderRepository();
		const orders = await orderRepository.getAll();
		return orders ?? { error: "Orders not found" };
	},
	{
		detail: {
			summary: "Get all orders",
			description: "Get all orders",
		}
	}
)

OrderController.get(
	"/getById/:id", 
	async ({ params: { id } }) => {
		const orderRepository = new OrderRepository();
		const order = await orderRepository.getById(id);
		return order ?? { error: "Order not found" };
	},
	{
		params: t.Object({
			id: t.Number(),
		}),
		detail: {
			summary: "Get order by id",
			description: "Get order by id",
		}
	}
)

OrderController.post(
	"/createOrder",
	async ({ body : { user_id, product_id, quantity, total_price } }) => {
		const orderRepository = new OrderRepository();
		const order = await orderRepository.createOrder({
            user_id,
            product_id,
            quantity,
            total_price  
        });
		return order;
	},
	{
		body: t.Object({
			user_id: t.String(),
			product_id: t.Number(),
			quantity: t.Number(),
			total_price: t.Number(),
		}),
		detail: {
			summary: "Create order",
			description: "Create order",
		}
	}
)

OrderController.patch(
	"/updateOrder",
	async ({ body : { id, order } }) => {
		const orderRepository = new OrderRepository();
		const updatedOrder = await orderRepository.updateOrder({
            id,
            order
		});
		return updatedOrder;
	},
	{
		body: t.Object({
			id: t.Number(),
			order: t.Object({
				user_id: t.Optional(t.String()),
				product_id: t.Optional(t.Number()),
				quantity: t.Optional(t.Number()),
				total_price: t.Optional(t.Number()),
				order_status: t.Optional(t.Enum(order_status)),
				order_date: t.Optional(t.Date())
			})
		}),
		detail: {
			summary: "Update order",
			description: "Update order",
		}
	}
)

export default OrderController;

