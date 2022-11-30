const { API_KEY } = process.env;
const fetch = require("node-fetch");
const { Dog, Temperament } = require("../db");

const urlApi = `https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}}`;

const createDog = async ({
  name,
  height,
  weight,
  imgUrl,
  life_span,
  temperaments,
}) => {
  if (!name || !height || !weight) {
    throw new Error("Mandatory fields are missing");
  }

  const foundDog = await Dog.findOne({ where: { name } });

  if (foundDog) {
    throw new Error("There is already a breed of dog with this name");
  }

  const newDog = await Dog.create({
    name,
    height,
    weight,
    imgUrl,
    life_span,
  });

  await newDog.addTemperaments(temperaments);

  return newDog;
};

const getDogs = async () => {
  const apiDogs = await fetch(urlApi).then((res) => res.json());
  const infoDogs = apiDogs.map((dog) => {
    return {
      id: dog.id,
      name: dog.name,
      life_span: dog.life_span,
      imgUrl: dog.image.url,
      temperaments: [dog.temperament].join(", "),
      height: dog.height.metric + " cm",
      weight: dog.weight.metric + " kg",
    };
  });

  const dbDogs = await Dog.findAll({ include: Temperament });

  if (!infoDogs && !dbDogs) {
    throw new Error("No dog found");
  }

  return [...infoDogs, ...dbDogs];
};

const searchDogByName = async (name) => {
  const foundDog = await getDogs();
  const foundDogFilter = foundDog.filter((dog) =>
    dog.name.toLowerCase().includes(name)
  );

  if (!foundDog.length) {
    const dbDogs = await Dog.findAll({ where: { name } });

    if (!dbDogs.length) {
      throw new Error("No dog breed with this name was found");
    }

    return dbDogs;
  }

  return foundDogFilter;
};

const searchDogById = async (id) => {
  try {
    const foundDogApi = await (
      await getDogs()
    ).find((dog) => !isNaN(id) && dog.id === parseInt(id));

    if (!foundDogApi) {
      const foundDogsDb = await Dog.findAll({ include: Temperament });
      const filterDogById = await foundDogsDb.find((dog) => dog.id == id);
      //findByPk no me funciona. Me mandaba el error:
      // "la sintaxis de entrada no es válida para tipo uuid: «39696325-7668-499d-8682-add042d922a7324»"
      //Queria poner un IF aqui pero el finder de sequelize tiraba error y no llegaba a esta linea

      return filterDogById;
    }

    return foundDogApi;
  } catch {
    throw new Error(`Id: ${id} does not correspond to an existing dog`);
  }
};

const updateDog = async (attribute, value, dogId) => {
  if (!isNaN(dogId)) {
    throw new Error("The id is not of type UUID");
  }

  const foundDog = await Dog.findByPk(dogId);

  if (!foundDog) {
    throw new Error("No dog found");
  }

  const updatedDog = await foundDog.update({ [attribute]: value });

  return updatedDog.name;
};

const deleteDog = async (id) => {
  const foundDog = await Dog.findByPk(id);

  if (!foundDog) {
    throw new Error("No dog found");
  }

  const name = foundDog.name;

  await Dog.destroy({ where: { name } });

  return name;
};

module.exports = {
  getDogs,
  createDog,
  searchDogByName,
  searchDogById,
  updateDog,
  deleteDog,
};
