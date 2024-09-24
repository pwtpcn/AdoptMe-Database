import { Elysia, t } from "elysia";
import db from "./db";
import { sex } from "@prisma/client";

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
        
    }),
    detail: {
        tags: [
            "Adoption"
        ]
    }
});

export default app;