import { afterAll, describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import ProductController from "../src/controllers/ProductController";
import ProductCategoryController from "../src/controllers/ProductCategoryController";



const app = new Elysia().use(ProductController).use(ProductCategoryController);
const server = app.listen(3000); // Use a test port if needed
let id: number;
let productCategoryId: number;

describe("Product API", () => {
	it("get all products", async () => {
	  const response = await fetch("http://localhost:3000/api/product/getAll");
	  const data = await response.json();

	  expect(response.status).toBe(200);
	  expect(Array.isArray(data)).toBe(true);
	});


	it("return an error for get a non-existent product", async () => {
	  const response = await fetch("http://localhost:3000/api/product/getById/0");

	  const data = await response.json();
	  expect(response.status).toBe(404);
	  expect(data.error).toBe("Product not found");
	});

	it("create a new product category", async () => {
		const response = await fetch("http://localhost:3000/api/product-category/createProductCategory", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: "Test Category",
				description: "Test Category Description",
			}),
		});

		const data = await response.json();
		expect(response.status).toBe(200);
		expect(data).toHaveProperty("id");

		// Save the category ID for the next test
		productCategoryId = data.id;
	});


	it("create a new product", async () => {
		const response = await fetch("http://localhost:3000/api/product/createProduct", {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({
			name: "Test Product",
			price: 100,
			stock: 10,
			description: "Test description",
			product_category_id: 1,
			imageurl: "test-product.jpg",
		  }),
		});

		const data = await response.json();
		id = data.id;
		console.log(data.name);
		expect(response.status).toBe(200);
		expect(data.name).toBe("Test Product");
	});

	it("get one product by id", async () => {
		const response = await fetch(`http://localhost:3000/api/product/getById/${id}`);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toHaveProperty("name", "Test Product");
	});

	it("update a product", async () => {
		const response = await fetch("http://localhost:3000/api/product/updateProduct", {
		  method: "PATCH",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({
			id: id,
			name: "Updated Product",
			price: 200,
			stock: 20,
			description: "Updated description",
			product_category_id: 1,
			imageurl: "updated-product.jpg",
		  }),
		});

		const data = await response.json();
		expect(response.status).toBe(200);
		expect(data.name).toBe("Updated Product");
	});

	it("return an error for update a non-existent product", async () => {
		const response = await fetch("http://localhost:3000/api/product/updateProduct", {
		  method: "PATCH",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({
			id: id+1,
			name: "Updated Product",
			price: 200,
			stock: 20,
			description: "Updated description",
			product_category_id: 1,
			imageurl: "updated-product.jpg",
		  }),
		});

		const data = await response.json();
		expect(response.status).toBe(404);
		expect(data.error).toBe("Product not found");
	});

	it("order a product", async () => {
		const response = await fetch("http://localhost:3000/api/product/orderProduct", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: id,
				total: 5,
			}),
		});
		const data = await response.json();
		expect(response.status).toBe(200);
		expect(data.stock).toBe(15);
	});

	it("order a product until stock is zero", async () => {
		const response = await fetch("http://localhost:3000/api/product/orderProduct", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: id,
				total: 15,
			}),
		});
		const data = await response.json();
		expect(response.status).toBe(200);
		expect(data.stock).toBe(0);
		expect(data.status).toBe("OUT_OF_STOCK");
	});

	it("order a product stock less than zero", async () => {
		const response = await fetch("http://localhost:3000/api/product/orderProduct", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: id,
				total: 15,
			}),
		});
		const data = await response.json();
		expect(response.status).toBe(400);
		expect(data.error).toBe("Not enough stock");
	});


	it("delete a product", async () => {
		const response = await fetch("http://localhost:3000/api/product/deleteProduct", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: id,
			}),
		});

		const data = await response.json();
		expect(response.status).toBe(200);
		expect(data).toHaveProperty("name", "Updated Product");
	});

	it("delete product that dont have", async () => {
		const response = await fetch("http://localhost:3000/api/product/deleteProduct", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: id,
			}),
		});

		const data = await response.json();
		expect(response.status).toBe(404);
		expect(data.error).toBe("Product not found");
	});

	afterAll(() => {
		server.stop(); // Stop the test server
	  });

});
