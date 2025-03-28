import { Elysia, redirect } from "elysia";
import { swagger } from "@elysiajs/swagger";
import middleware from "./middleware";
import UserController from "./controllers/UserController";
import PetController from "./controllers/PetController";
import AdpotionsController from "./controllers/AdoptionController";
import ProductController from "./controllers/ProductController";
import ProductCategoryController from "./controllers/ProductCategoryController";
import CartController from "./controllers/CartController";
import OrderController from "./controllers/OrderController";

const app = new Elysia();
app.use(
  swagger({
    path: "/docs",
    documentation: {
      info: { title: "AdoptMe Api Document", version: "1.0.0" },
      tags: [
        { name: "User", description: "User endpoint" },
        { name: "Pet", description: "Pet endpoint" },
        { name: "Adoption", description: "Adoption endpoint" },
        { name: "Product", description: "Product endpoint" },
        { name: "Product Category", description: "Product Category endpoint" },
      ],
    },
  })
);


app.use(middleware);
app.use(UserController)
app.use(PetController);
app.use(AdpotionsController);
app.use(ProductController);
app.use(ProductCategoryController);
app.use(CartController);
app.use(OrderController);


app.get(
  "/",
  () => {
    return redirect("/docs");
  },
  { detail: { tags: ["Home"], summary: "Home", description: "Redirect to API docs" } }
);


app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
