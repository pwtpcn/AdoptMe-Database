import { Elysia, t } from "elysia";
import db from "./db";

const app = new Elysia({prefix:"/user"});
app.get("/", () => "Hello Elysia");

app.get("/get", async () => {
  const userList = await db.user.findMany();
  return userList;
},{
    detail: {
       tags: [
        "User"
       ] 
    }
}
);

app.post("/post", async ({body}) => {
    const user = await db.user.create({
        data: body
    });
    return user;
},{
    body: t.Object({
        username: t.String(),
        password: t.String()
    }),
    detail: {
        tags: [
         "User"
        ] 
     }
});

app.put("/put", async ({body}) => {
    const user = await db.user.update({
        where: {
            id: body.id
        },
        data: body
    });
    return user;
},{
    body: t.Object({
        id: t.Number(),
        username: t.Optional(t.String()),
        password: t.Optional(t.String()),
    }),
    detail: {
        tags: [
         "User"
        ] 
     }
});

app.delete("/delete", async ({body}) => {
    const user = await db.user.delete({
        where: {
            id: body.id
        }
    });
    return user;
},{
    body: t.Object({
        id: t.Number(),
    }),
    detail: {
        tags: [
         "User"
        ] 
     }
});

export default app;