import { Elysia, t } from "elysia";
import db from "./db";

const app = new Elysia({prefix:"/adoption"});

app.get("/get", async () => {
    const adoptionList = await db.adoption.findMany();
    return adoptionList;
  },{
      detail: {
         tags: ["Adoption"] 
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
        tags: ["Adoption"]
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
        tags: ["Adoption"]
    }
});

app.put(
    "/adopt",
    async ({ body }) => {
      const adoption: any = await db.$queryRaw`
      UPDATE adoption 
         SET adoption_id = (SELECT MAX(adoption_id) + 1 FROM adoption),
             adopt_user = ${body.adopt_user},
             adopted_at = ${new Date()}
         WHERE added_id = ${body.added_id} AND adopt_user IS NULL
         RETURNING added_id,adoption_id,added_user,adopt_user,pet_id,added_at,adopted_at;
      `;
      if (adoption.length === 0) {
        return {
          added_id: body.added_id,
          Status: "Already adopted or not exist",
        };
      }
      return adoption;
    },
    {
      error({error}: any){
          console.log(error);
          if(error.code === 'P2010'){
              return new Response(JSON.stringify({Error:'P2010', message:'Do not have adopt_user that you provided.'}), {headers:{'Content-Type': 'application/json'},status: 400});
          }
      },
      body: t.Object({
        added_id: t.Number(),
        adopt_user: t.Number(),
      }),
      detail: {
        tags: ["Adoption"],
      },
    }
  );

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
        tags: ["Adoption"]
    }
});

export default app;