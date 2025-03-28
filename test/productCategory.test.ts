import { afterAll, describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import ProductController from "../src/controllers/ProductController";
import ProductCategoryController from "../src/controllers/ProductCategoryController";

const app = new Elysia().use(ProductController).use(ProductCategoryController);
const server = app.listen(3000);

let categoryId: number;
let name: string;

describe("🛒 Product & Category API", () => {
	it("create a new product category", async () => {
		const response = await fetch("http://localhost:3000/api/product-category/createProductCategory", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: "Dogs",
				description: "Dogs food",
			}),
		});

		const data = await response.json();
		expect(response.status).toBe(200);
		expect(data).toHaveProperty("id");
		name = data.name;
		categoryId = data.id;
	});

	it("should return all product categories", async () => {
		const response = await fetch("http://localhost:3000/api/product-category/getAll");
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(Array.isArray(data)).toBe(true);
		expect(data.length).toBeGreaterThan(0);
	});

	it("should return a category by ID", async () => {
		const response = await fetch(`http://localhost:3000/api/product-category/getById/${categoryId}`);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data.name).toBe("Dogs");
	});

	it("should return 404 for get non-existent category", async () => {
		const response = await fetch("http://localhost:3000/api/product-category/getById/0");
		const data = await response.json();

		expect(response.status).toBe(404);
		expect(data.error).toBe("Product Category not found");
	});

	it("delete a category", async () => {
		const response = await fetch(`http://localhost:3000/api/product-category/deleteProductCategory`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: categoryId,
			}),
		});
		const data = await response.json();
		expect(response.status).toBe(200);
		expect(data.name).toBe("Dogs");

	});

	it("should return 404 for delete non-existent category", async () => {
		const response = await fetch(`http://localhost:3000/api/product-category/deleteProductCategory`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: categoryId,
			}),
		});
		const data = await response.json();
		expect(response.status).toBe(404);
		expect(data.error).toBe("Product Category not found");
	});

	afterAll(() => {
		server.stop(); // Stop the test server
	  });
});
