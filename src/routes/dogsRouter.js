const { Dog } = require("../db");
const { Router } = require("express");
const {
  getDogs,
  createDog,
  searchDogByName,
  searchDogById,
  updateDog,
  deleteDog,
} = require("../controllers/dogsControllers");

const dogsRouter = Router();

dogsRouter.post("/", async (req, res) => {
  try {
    const newDog = await createDog(req.body);

    res.status(201).json(newDog);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

dogsRouter.get("/", async (req, res) => {
  try {
    const { name } = req.query;

    if (name) {
      const foundDog = await searchDogByName(name);
      res.status(200).json(foundDog);
    } else {
      const dogs = await getDogs();
      res.status(200).json(dogs);
    }
  } catch (err) {
    res.status(404).send(err.message);
  }
});

dogsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const foundDog = await searchDogById(id);
    res.status(200).json(foundDog);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

dogsRouter.put("/:attribute", async (req, res) => {
  try {
    const { attribute } = req.params;
    const { dogId } = req.query;
    const { value } = req.body;

    const dogName = await updateDog(attribute, value, dogId);

    res.status(200).send(`Se actualizaron los datos de ${dogName}`);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

dogsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const dogName = await deleteDog(id);

    res.status(200).send(`${dogName} fue borrado con éxito`);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = dogsRouter;
