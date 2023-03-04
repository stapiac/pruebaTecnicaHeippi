const mongoose = require("../db/database");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const usersSchema = new Schema({
  ID: String,
  Name: String,
  Address: String,
  Email: {
    type: String,
    unique: [true, "El correo ya existe, por favor registrar uno diferente"],
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Correo en formato inválido");
      }
    },
  },
  PhNumber: Number,
  password: String,
  tipo: String, // Hospital, Paciente, Medico
  hosMedServices: String,
  patientDOB: Date,
  UserConfirmed: { type: Boolean, default: false },
  medicfirstlogin: { type: Boolean },
  hospitalID: String,
  DoctorID: String,
});

usersSchema.methods.generateJWTtoken = async function () {
  //este metodo ayuda a crear un token JWT
  const user = this;
  const token = jwt.sign({ _id: user._id }, "heippi2023");
  return token;
};

usersSchema.statics.findByCredentials = async function (ID, password) {
  //este statics ayuda a iniciar sesión si la contraseña es correcta
  const user = await this.findOne({ ID: ID });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const passwordcorrecto = await bcrypt.compare(password, user.password);

  if (!passwordcorrecto) {
    throw new Error("Contraseña incorrecta");
  }

  return user;
};

//pre antes de usar cualquier users.save, solo si el password ha cambiado
usersSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const users = mongoose.model("Users", usersSchema);

module.exports = users;
