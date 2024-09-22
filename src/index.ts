import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import user from "./user";
import pet from "./pet";

const app = new Elysia();
app.use(
  swagger({
    path: "/docs",
    documentation: {
      info: { title: "AdoptMe Api Document", version: "1.0.0" },
      tags: [
        { name: "User", description: "User endpoint" },
        { name: "Pet", description: "Pet endpoint" },
        // { name: "Tournament", description: "Tournament endpoint" },
      ],
    },
  })
);

app.use(user);
app.use(pet);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
