import { Elysia, t } from "elysia";
import db from "./db";

const app = new Elysia({prefix:"/pet"});

app.get("/get", async () => {
    const adoptionList = await db.adoption.findMany();
    return adoptionList;
  },{
      detail: {
         tags: [
          "Adoption"
         ] 
      }
  
});

app.post("/post", async ({body}) => {
    const adoption = await db.adoption.create({
        data: body
    });
    return adoption
},{
    body: t.Object({
        added_user: t.Number(),
        pet_id: t.Number(),
        added_at: t.Date(),
    }),
    detail: {
        tags: [
            "Adoption"
        ]
    }
});

app.put("/put", async ({body}) => {
    const adoption = await db.adoption.update({
        where: {
            added_id: body.added_id
        },
        data: body
    });
    return adoption
},{
    body: t.Object({
        added_id: t.Number(),
        adoption_id: t.Optional(t.Number()),
        added_user: t.Optional(t.Number()),
        adopt_user: t.Optional(t.Number()),
        pet_id: t.Optional(t.Number()),
        added_at: t.Optional(t.Date()),
        adopted_at: t.Optional(t.Date())
    }),
    detail: {
        tags: [
            "Adoption"
        ]
    }
});

app.delete("/delete", async ({body}) => {
    const adoption = await db.adoption.delete({
        where: {
            added_id: body.added_id
        }
    });
    return adoption
},{
    body: t.Object({
        added_id: t.Number()
    }),
    detail: {
        tags: [
            "Adoption"
        ]
    }
});

export default app;