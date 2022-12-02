const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  sequelize.define(
    "dog",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
        validate: {
          isUUID: 4,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          customValidator(name) {
            if (!isNaN(name)) {
              throw new Error("Name must not be number");
            }
          },
        },
      },
      height: {
        type: DataTypes.STRING, // ej: 3 - 5 cm
        allowNull: false,
        validate: {
          customValidator(height) {
            let myHeight = height.split(" ");
            if (isNaN(myHeight[0]) || (myHeight[2] && isNaN(myHeight[2]))) {
              throw new Error(
                "If you want to define Height, you have to write a number"
              );
            }
          },
        },
      },
      weight: {
        type: DataTypes.STRING, // ej: 3 - 5 kg
        allowNull: false,
        validate: {
          customValidator(weight) {
            let myWeight = weight.split(" ");
            if (isNaN(myWeight[0]) || (myWeight[2] && isNaN(myWeight[2]))) {
              throw new Error(
                "If you want to define Weight, you have to write a number"
              );
            }
          },
        },
      },
      life_span: {
        type: DataTypes.STRING,
        validate: {
          customValidator(life_span) {
            const myLifeSpan = life_span.split(" ");
            if (isNaN(myLifeSpan[0])) {
              throw new Error(
                "If you want to define life span, you have to write a number"
              );
            }
          },
        },
      },
      imgUrl: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );
};
