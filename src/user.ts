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
        email: t.String(),
        password: t.String(),
        first_name: t.String(),
        last_name: t.String(),
        phone_number: t.String(),
        photo_url : t.Optional(t.String()),
        salary: t.Number({
            minimum: 0
        })
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
            user_id: body.user_id
        },
        data: body
    });
    return user;
},{
    body: t.Object({
        user_id: t.Number(),
        username: t.Optional(t.String()),
        email: t.Optional(t.String()),
        password: t.Optional(t.String()),
        first_name: t.Optional(t.String()),
        last_name: t.Optional(t.String()),
        phone_number: t.Optional(t.String()),
        photo_url : t.Optional(t.String()),
        salary: t.Optional(t.Number({
            minimum: 0
        }))
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
            user_id: body.user_id
        }
    });
    return user;
},{
    body: t.Object({
        user_id: t.Number(),
    }),
    detail: {
        tags: [
         "User"
        ] 
     }
});

export default app;