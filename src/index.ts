import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import user from "./user";
import pet from "./pet";
import adoption from "./adoption";

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
      ],
    },
  })
);

app.use(user);
app.use(pet);
app.use(adoption);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
