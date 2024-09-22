import { Elysia, t } from "elysia";
import db from "./db";

const app = new Elysia({prefix:"/pet"});

app.get("/get", async () => {
    const petList = await db.pet.findMany({
        include: {
            user: true 
        }
    });
    return petList;
  },{
      detail: {
         tags: [
          "Pet"
         ] 
      }
  
});

app.post("/post", async ({body}) => {
    const pet = db.pet.create({
        data: body
    });
    return pet;
},{
    body: t.Object({
        owner_id: t.Integer(),
        pet_name: t.String(),
        age_year: t.Optional(t.Integer()),
        age_month: t.Integer(),
        pet_type: t.String(),
        pet_species: t.String()
    }),
    detail: {
        tags: [
            "Pet"
        ]
    }
});

app.put("/put", async ({body}) => {
    // const username = body.username;
    // delete body.username;
    const pet = await db.pet.update({
        // include: {
        //     user: true
        // },
        where: {
            id: body.id,
            // user: {
            //     username: username
            // }
        },
        data: body
    });
    return pet
},{
    body: t.Object({
        id: t.Number(),
        owner_id: t.Optional(t.Integer()),
        pet_name: t.Optional(t.String()),
        age_year: t.Optional(t.Integer()),
        age_month: t.Optional(t.Integer()),
        pet_type: t.Optional(t.String()),
        pet_species: t.Optional(t.String()),
        // username: t.Optional(t.String())
    }),
    detail: {
        tags: [
            "Pet"
        ]
    }
});

app.delete("/delete", async ({body}) => {
    const pet = await db.pet.delete({
        where: {
            id: body.id
        }
    });
    return pet;
},{
    body: t.Object({
        id: t.Number(),
    }),
    detail: {
        tags: [
            "Pet"
        ]
    }
});

export default app;