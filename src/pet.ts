import { Elysia, t } from "elysia";
import db from "./db";
import {sex} from "@prisma/client";

const app = new Elysia({prefix:"/pet"});

app.get("/get", async () => {
    const petList = await db.pet.findMany();
    return petList;
  },{
      detail: {
         tags: ["Pet"] 
      }
});

app.post("/post", async ({body}) => {
    const pet = db.pet.create({
        data: body
    });
    return pet;
},{
    body: t.Object({
        pet_name: t.String(),
        age_years: t.Integer({
            minimum: 0
        }),
        age_months: t.Integer({
            minimum: 0,
            maximum: 11
        }),
        species: t.String(),
        breed: t.String(),
        sex: t.Enum(sex),
        photo_url: t.String(),
        weight: t.Number({
            minimum: 0
        }),
        adopted: t.Boolean(),
        spayed: t.Boolean(),
        description: t.String()
    }),
    detail: {
        tags: ["Pet"]
    }
});

app.put("/put", async ({body}) => {
    const pet = await db.pet.update({
        where: {
            pet_id: body.pet_id,
        },
        data: body
    });
    return pet
},{
    body: t.Object({
        pet_id: t.Number(),
        pet_name: t.Optional(t.String()),
        age_years: t.Optional(t.Integer({
            minimum: 0
        })),
        age_months: t.Optional(t.Integer({
            minimum: 0,
            maximum: 11
        })),
        species: t.Optional(t.String()),
        breed: t.Optional(t.String()),
        sex: t.Optional(t.Enum(sex)),
        photo_url: t.Optional(t.String()),
        weight: t.Optional(t.Number({
            minimum: 0
        })),
        adopted: t.Optional(t.Boolean()),
        spayed: t.Optional(t.Boolean()),
        description: t.Optional(t.String())
    }),
    detail: {
        tags: ["Pet"]
    }
});

app.delete("/delete", async ({body}) => {
    const pet = await db.pet.delete({
        where: {
            pet_id: body.pet_id
        }
    });
    return pet;
},{
    body: t.Object({
        pet_id: t.Number(),
    }),
    detail: {
        tags: ["Pet"]
    }
});

export default app;