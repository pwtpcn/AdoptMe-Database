import { Elysia, t } from "elysia";
import db from "./db";

const app = new Elysia({ prefix: "/pet" });

app.get(
  "/getAllPet",
  async () => {
    try {
      const petList = await db.pet.findMany();
      return petList;
    } catch (error) {
      console.error("Error fetching pets: ", error);
      return { error: "Failed to fetch pets" };
    }
  },
  {
    detail: {
      tags: ["Pet"],
    },
  }
);

app.post(
  "/getPetByID",
  async ({ body }) => {
    try {
      const pet = await db.pet.findUnique({
        where: { pet_id: body.pet_id },
      });

      if (!pet) {
        return { message: "Pet not found" };
      } else {
        console.log("Get pet by ID successfully: ", pet);
        return pet;
      }
    } catch (error) {
      console.error("Error fetching pet: ", error);
      return { error: "Failed to fetch pet" };
    }
  },
  {
    body: t.Object({
      pet_id: t.Number(),
    }),
    detail: {
      tags: ["Pet"],
    },
  }
);

app.post(
  "/post",
  async ({ body }) => {
    try {
      const insertedPet = db.pet.create({
        data: body,
      });

      console.log("Pet inserted successfully: ", insertedPet);
      return insertedPet;
    } catch (error) {
      console.error("Error inserting pet: ", error);
      return { error: "Failed to insert pet" };
    }
  },
  {
    body: t.Object({
      pet_name: t.String(),
      age_years: t.Integer({
        minimum: 0,
      }),
      age_months: t.Integer({
        minimum: 0,
        maximum: 11,
      }),
      species: t.String(),
      breed: t.String(),
      sex: t.Enum({male:"Male", female:"Female"}),
      photo_url: t.String(),
      weight: t.Number({
        minimum: 0,
      }),
      adopted: t.Boolean(),
      spayed: t.Boolean(),
      description: t.String(),
      color: t.String(),
    }),
    detail: {
      tags: ["Pet"],
    },
  }
);

app.put(
  "/updatePetByID",
  async ({ body }) => {
    try {
      const updatedPet = await db.pet.update({
        where: {
          pet_id: body.pet_id,
        },
        data: body,
      });

      console.log("Pet update successfully: ", updatedPet);
      return updatedPet;
    } catch (error) {
      console.error("Error updating pet: ", error);
      return { error: "Failed to update pet" };
    }
  },
  {
    body: t.Object({
      pet_id: t.Number(),
      pet_name: t.Optional(t.String()),
      age_years: t.Optional(
        t.Integer({
          minimum: 0,
        })
      ),
      age_months: t.Optional(
        t.Integer({
          minimum: 0,
          maximum: 11,
        })
      ),
      species: t.Optional(t.String()),
      breed: t.Optional(t.String()),
      sex: t.Optional(t.Enum({male:"Male", female:"Female"})),
      photo_url: t.Optional(t.String()),
      weight: t.Optional(
        t.Number({
          minimum: 0,
        })
      ),
      adopted: t.Optional(t.Boolean()),
      spayed: t.Optional(t.Boolean()),
      description: t.Optional(t.String()),
      color: t.Optional(t.String()),
    }),
    detail: {
      tags: ["Pet"],
    },
  }
);

app.delete(
  "/deletePetByID",
  async ({ body }) => {
    try {
      const deletedPet = await db.pet.delete({
        where: {
          pet_id: body.pet_id,
        },
      });

      console.log("Pet deleted successfully: ", deletedPet);
      return {
        message: "Pet deleted successfully",
        deleted_pet: deletedPet,
      };
    } catch (error) {
      console.error("Error deleting pet: ", error);
      return { error: "Failed to delete pet" };
    }
  },
  {
    body: t.Object({
      pet_id: t.Number(),
    }),
    detail: {
      tags: ["Pet"],
    },
  }
);

export default app;
