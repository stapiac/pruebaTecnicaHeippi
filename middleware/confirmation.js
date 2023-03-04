const users = require("../models/users");

//Este middleware revisa si el usuario ha confirmado su cuenta, y si es doctor, que haya cambiado la contraseña.
//En caso de que no, no le permite ingresar a la plataforma

const authentication = async (req, res, next) => {
  try {
    const _id = req.body._id;
    const user = await users.findOne({ _id });

    if (user.UserConfirmed) {
      if (
        user.tipo == "Medico" &&
        user.medicfirstlogin == false &&
        !req.originalUrl.includes("password") //el unico override es que la petición venga desde api/changepassword, de tal forma que el médico pueda acceder esta ruta
      ) {
        return res.json({
          mensaje:
            "Usuarios Medico deben cambiar su contraseña antes de poder usar la plataforma.",
        });
      }
      next();
    } else {
      return res.json({
        mensaje:
          "Usted no ha confirmado su cuenta, por favor confirmarla para poder usar nuestros servicios",
      });
    }
  } catch (error) {
    res.status(400).json({ error: "error de middleware confirmation" });
  }
};

module.exports = authentication;
