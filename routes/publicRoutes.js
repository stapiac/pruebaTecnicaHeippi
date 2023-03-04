const express = require("express");
const publicRoutes = express.Router();
const users = require("../models/users");
//const cookieParser = require("cookie-parser");

//publicRoutes.use(cookieParser());

publicRoutes.get("/test", async (req, res) => {
  res.json({ mensaje: "prueba exitosa" });
  console.log("ruta accesada");
});

publicRoutes.post("/signup", async (req, res) => {
  //ruta para registrar un usuario
  try {
    const postdata = await req.body;
    // Validaciones
    if (
      !(postdata.ID && postdata.Email && postdata.password && postdata.tipo)
    ) {
      return res.json({
        mensaje:
          "Todos los campos del formulario son requeridos para poder registrarse, por favor intentar de nuevo",
      });
    }

    if (postdata.tipo != "Paciente" && postdata.tipo != "Hospital") {
      return res.json({
        mensaje:
          "Los tipos permitidos de registro son Hospital o Paciente, por favor revisar la información",
      });
    }

    if (await users.findOne({ Email: postdata.Email })) {
      //revisar que el correo no se repita en la DB
      return res.json({
        mensaje:
          "El correo ya existe en la base de datos, por favor usar uno diferente",
      });
    }

    if (await users.findOne({ ID: postdata.ID })) {
      //revisar que el correo no se repita en la DB
      return res.json({
        mensaje:
          "Ya hay un usuario registrado con el mismo ID. Por favor usar uno diferente",
      });
    }

    //Fin Validaciones

    let user = new users(postdata);

    await user.save();

    res.json({ mensaje: "Usuario creado" });
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

publicRoutes.post("/login", async (req, res) => {
  //ruta para el login
  try {
    const user = await users.findByCredentials(req.body.ID, req.body.password);

    const token = await user.generateJWTtoken();

    if (user.UserConfirmed == false) {
      return res.json({
        mensaje: "confirmación pendiente",
        tipo: user.tipo,
        id: user._id,
        token,
      });
    }

    res.json({ id: user._id, token, tipo: user.tipo });
  } catch (e) {
    res
      .status(500)
      .json({ mensaje: "Nombre de usuario o contraseñas invalidas", error: e });
  }
});

publicRoutes.post("/cr", async (req, res) => {
  const _id = req.body._id;
  const user = await users.findOne({ _id });

  if (!user) {
    return res.json({
      mensaje: "Debes iniciar sesión para poder confirmar una cuenta.",
    });
  }

  if (user.UserConfirmed) {
    return res.json({
      mensaje: "tu usuario ya ha sido confirmado anteriormente",
    });
  }

  if (
    user.Email == req.body.datocontacto ||
    user.PhNumber == req.body.datocontacto
  ) {
    user.UserConfirmed = true;
    await user.save();
    res.json({ mensaje: "Usuario confirmado!" });
  } else {
    res.json({ mensaje: "Los datos son incorrectos, intenta nuevamente" });
  }
});

module.exports = publicRoutes;
