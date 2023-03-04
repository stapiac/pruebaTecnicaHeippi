const express = require("express");
const privateRoutes = express.Router();
const users = require("../models/users");
const clinichistories = require("../models/clinichistories");

privateRoutes.get("/testprivate", async (req, res) => {
  //test para probar JWT
  res.json({ mensaje: "prueba exitosa" });
  console.log("prueba de ruta privada satisfactoria");
});

privateRoutes.post("/signupmedic", async (req, res) => {
  //ruta para registrar un médico
  const data = await req.body;
  const _id = req.body._id;

  const hospitaldata = await users.findOne({ _id });

  const object = {
    hospitalID: hospitaldata.ID,
    tipo: "Medico",
    medicfirstlogin: false,
    ID: data.ID,
    Email: data.Email,
    PhNumber: data.PhNumber,
    password: data.password,
  };

  let user = new users(object);

  await user.save();

  res.json({ mensaje: "Medico creado" });
});

privateRoutes.post("/newclinichistory", async (req, res) => {
  //ruta para crear una historia clinica (observaciones médicas y estado de salud)
  try {
    const postdata = await req.body;

    if (!postdata.MedicSpeciality) {
      return res.json({
        mensaje: "Se debe especificar la especialidad médica",
      });
    }

    const _id = req.body._id;

    const medicdata = await users.findOne({ _id });
    const hospitaldata = await users.findOne({ ID: medicdata.hospitalID });
    const patientdata = await users.findOne({ ID: postdata.patientID });

    if (patientdata.tipo != "Paciente") {
      return res.json({
        mensaje:
          "El ID ingresado para paciente no corresponde a un paciente. Por favor revisar la información.",
      });
    }

    console.log(patientdata);

    const object = {
      HospitalID: medicdata.hospitalID,
      HospitalName: hospitaldata.Name,
      MedicID: medicdata.ID,
      MedicName: medicdata.Name,
      PatientID: postdata.patientID,
      PatientName: patientdata.Name,
      AppointmentObservations: req.body.obs,
      HealthStatus: req.body.HealthStatus,
      MedicSpeciality: req.body.MedicSpeciality,
    };

    console.log(object);

    let clinichistory = new clinichistories(object);

    await clinichistory.save();

    res.json({ mensaje: "Historia medica guardada" });
  } catch (e) {
    res.status(400).send(e);
  }
});

privateRoutes.post("/data", async (req, res) => {
  //ruta para obtener los registros médicos
  const _id = await req.body._id;

  const userdata = await users.findOne({ _id });

  console.log(userdata, _id);

  if (userdata.tipo == "Hospital") {
    const result = await clinichistories.find({
      HospitalID: userdata.ID,
    });
    return res.json(result);
  }

  if (userdata.tipo == "Paciente") {
    const result = await clinichistories.find({
      PatientID: userdata.ID,
    });
    return res.json(result);
  }

  if (userdata.tipo == "Medico") {
    const result = await clinichistories.find({
      MedicID: userdata.ID,
    });
    console.log(result);
    return res.json(result);
  }
});

privateRoutes.post("/changepassword", async (req, res) => {
  //cambiar el password
  newpassword = await req.body.newpassword;
  _id = req.body._id;

  user = await users.findOne({ _id });

  user.password = newpassword;

  if (user.tipo == "Medico") {
    user.medicfirstlogin = true;
  }

  console.log(newpassword, _id, user);

  await user.save();

  res.json({ mensaje: "contraseña cambiada" });
});

module.exports = privateRoutes;
