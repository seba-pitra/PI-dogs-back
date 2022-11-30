const { API_KEY } = process.env;
const fetch = require("node-fetch");
const { Temperament } = require("../db");
const { getDogs } = require("./dogsControllers");

//X Este controller debe separar todos los temperamentos de los perros
//que estan mal hechos en la API
//cuando los separo por coma algunos quedan asi:
//['Trainable,Stubborn', 'adaptable']

const getTemperaments = async () => {
  const dogs = await getDogs(); //All dogs

  let allTemperaments = [];
  while (dogs.length) {
    let dog = dogs.shift();
    allTemperaments.push(dog.temperaments);
  }

  //Hago un join para crear un string muy grande todas las posiciones(temps)
  // y luego hago un split a este para crear un array con todas las posiciones separadas por comma
  const myTemperaments = allTemperaments.join(",").split(",").sort(); //tener TODOS los temps en un array

  const filterTemperaments = []; //temperamentos NO REPETIDOS

  for (const temperament of myTemperaments) {
    if (!filterTemperaments.includes(temperament) && temperament) {
      filterTemperaments.push(temperament);
    }
  }

  const mappedTemps = filterTemperaments.map((temp) => {
    //se crea la collection para el bulkCreate
    return { name: temp };
  });

  let searchDbTemp = await Temperament.findAll();

  if (searchDbTemp.length) {
    return searchDbTemp;
  } else {
    let dbTemperaments = await Temperament.bulkCreate(mappedTemps);

    if (!dbTemperaments.length) {
      throw new Error("No temperaments were obtained");
    }

    return dbTemperaments;
  }
};

module.exports = { getTemperaments };
