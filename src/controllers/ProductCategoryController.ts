import Elysia, { t } from "elysia";
import ProductCategoryRepository from "../repositories/ProductCategoryRepository";

const ProductCategoryController = new Elysia({
	prefix: "/api/product-category",
	tags: ["Product Category"],
})

ProductCategoryController.get(
	"/getAll",
	async () => {
		const productCategoryRepository = new ProductCategoryRepository();
		const productCategory = await productCategoryRepository.getAll();
		return productCategory ?? { error: "Product Category not found" };
	},
	{
		detail: {
			summary: "Get all product categories",
			description: "Get all product categories",
		}
	}
)

ProductCategoryController.get(
	"/getById/:id",
	async ({ params: { id } }) => {
		const productCategoryRepository = new ProductCategoryRepository();
		const productCategory = await productCategoryRepository.getById(id);
		return productCategory ?? { error: "Product Category not found" };
	},
	{
		params: t.Object({
			id: t.Number(),
		}),
		detail: {
			summary: "Get product category by id",
			description: "Get product category by id",
		}
	}
)

ProductCategoryController.get(
	"/getByName/:name",
	async ({ params: { name } }) => {
		const productCategoryRepository = new ProductCategoryRepository();
		const productCategory = await productCategoryRepository.getDetailsByName(name);
		return productCategory ?? { error: "Product Category not found" };
	},
	{
		params: t.Object({
			name: t.String(),
		}),
		detail: {
			summary: "Get product category by name",
			description: "Get product category by name",
		}
	}
)

ProductCategoryController.post(
	"/createProductCategory",
	async ({ body }) => {
		const productCategoryRepository = new ProductCategoryRepository();
		const productCategory = await productCategoryRepository.createProductCategory(body);
		return productCategory ?? { error: "Product Category not created" };
	},
	{
		body: t.Object({
			name: t.String(),
			description: t.String(),
		}),
		detail: {
			summary: "Create product category",
			description: "Create product category",
		}
	}
)

ProductCategoryController.delete(
	"/deleteProductCategory",
	async ({body}) => {
		const productCategoryRepository = new ProductCategoryRepository();
		const productCategory = await productCategoryRepository.deleteProductCategory(body.id);
		return productCategory ?? { error: "Product Category not deleted" };
	},
	{
		body: t.Object({
			id: t.Number(),
		}),
		detail: {
			summary: "Delete product category",
			description: "Delete product category",
		}
	}
)

export default ProductCategoryController;
