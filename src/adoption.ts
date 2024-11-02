import { Elysia, t } from "elysia";
import db from "./db";

const app = new Elysia({ prefix: "/adoption" });

app.get(
  "/getAllAdoption",
  async () => {
    try {
      const adoptionList = await db.adoption.findMany();
      return adoptionList;
    } catch (error) {
      console.error("Error fetching adoptions: ", error);
      return { error: "Failed to fetch adoptions" };
    }
  },
  {
    detail: {
      tags: ["Adoption"],
    },
  }
);

app.post(
  "/getAdoptionByID",
  async ({ body }) => {
    try {
      const adoption = await db.adoption.findUnique({
        where: { added_id: body.added_id },
      });

      if (!adoption) {
        return { message: "Adoption not found" };
      } else {
        console.log("Get adoption by ID successfully: ", adoption);
        return adoption;
      }
    } catch (error) {
      console.error("Error fetching adoption: ", error);
      return { error: "Failed to fetch adoption" };
    }
  },
  {
    body: t.Object({
      added_id: t.Number(),
    }),
    detail: {
      tags: ["Adoption"],
    },
  }
);

app.post(
  "/post",
  async ({ body }) => {
    try {
      // Create a date and adjust it to UTC+7 by adding 7 hours (25200 seconds)
      const addedDate = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString();

      const insertedAdoption = await db.adoption.create({
        data: {
          added_user: body.added_user,
          pet_id: body.pet_id,
          added_date: addedDate
        },
      });

      console.log("User inserted successfully: ", insertedAdoption);
      return insertedAdoption;
    } catch (error) {
      console.error("Error inserting adoption: ", error);
      return { error: "Failed to insert adoption" };
    }
  },
  {
    body: t.Object({
      added_user: t.String(),
      pet_id: t.Number(),
    }),
    detail: {
      tags: ["Adoption"],
    },
  }
);


app.put(
  "/updateAdoptionByID",
  async ({ body }) => {
    try {
      const updatedAdoption = await db.adoption.update({
        where: {
          added_id: body.added_id,
        },
        data: body,
      });

      console.log("Adoption update successfully: ", updatedAdoption);
      return updatedAdoption;
    } catch (error) {
      console.error("Error updating adoption: ", error);
      return { error: "Failed to update adoption" };
    }
  },
  {
    body: t.Object({
      added_id: t.Number(),
      adoption_id: t.Optional(t.Number()),
      added_user: t.Optional(t.String()),
      adopt_user: t.Optional(t.String()),
      pet_id: t.Optional(t.Number()),
      added_date: t.Optional(t.Date()),
      adopted_date: t.Optional(t.Date()),
    }),
    detail: {
      tags: ["Adoption"],
    },
  }
);

app.put(
  "/adopt",
  async ({ body }) => {
    const adoption: any = await db.$queryRaw`
      UPDATE "adoption" 
         SET "adoption_id" = (SELECT COUNT("adoption_id") + 1 FROM "adoption"),
             "adopt_user" = (SELECT "user_id" FROM "user" WHERE "username" = ${body.username}),
             "adopted_date" = NOW() AT TIME ZONE 'Asia/Bangkok'
         WHERE "added_id" = ${body.added_id} AND "adopt_user" IS NULL
         RETURNING "added_id", "adoption_id", "added_user", "adopt_user", "pet_id", "added_date", "adopted_date";
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
    error({ error }: any) {
      console.log(error);
      if (error.code === "P2010") {
        return new Response(
          JSON.stringify({
            Error: "P2010",
            message: "Do not have adopt_user that you provided.",
          }),
          { headers: { "Content-Type": "application/json" }, status: 400 }
        );
      }
    },
    body: t.Object({
      added_id: t.Number(),
      username: t.String(),
    }),
    detail: {
      tags: ["Adoption"],
    },
  }
);

app.delete(
  "/delete",
  async ({ body }) => {
    try {
      const deletedAdoption = await db.adoption.delete({
        where: {
          added_id: body.added_id,
        },
      });

      console.log("Adoption deleted successfully: ", deletedAdoption);
      return {
        message: "Pet deleted successfully",
        deleted_adoption: deletedAdoption,
      };
    } catch (error) {
      console.error("Error deleting adoption: ", error);
      return { error: "Failed to delete adoption" };
    }
  },
  {
    body: t.Object({
      added_id: t.Number(),
    }),
    detail: {
      tags: ["Adoption"],
    },
  }
);

app.get(
  "/history",
  async () => {
    const history = await db.$queryRaw`
      SELECT 
      "adoption"."added_id",
      "adoption"."adoption_id",
      "added_user"."username" AS "added_username",
      "adoption"."added_date",
      "adopt_user"."username" AS "adopt_username",
      "adoption"."adopted_date",
      "pet"."pet_name"
      FROM "adoption"
      LEFT JOIN "user" AS "added_user" ON "added_user"."user_id" = "adoption"."added_user"
      LEFT JOIN "user" AS "adopt_user" ON "adopt_user"."user_id" = "adoption"."adopt_user"
      LEFT JOIN "pet" ON "pet"."pet_id" = "adoption"."pet_id";
    `;
    return history;
  },
  {
    detail: {
      tags: ["Adoption"],
    },
  }
)

export default app;
