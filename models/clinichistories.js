const mongoose = require("../db/database");
const Schema = mongoose.Schema;
const validator = require("validator");

const clinichistoriesSchema = new Schema({
  HospitalID: String,
  HospitalName: String,
  MedicID: String,
  MedicName: String,
  PatientID: String,
  PatientName: String,
  AppointmentObservations: String,
  HealthStatus: String,
  MedicSpeciality: {
    type: String,
    required: [true, "Se debe especificar la especialidad médica"],
  },
});

const clinichistories = mongoose.model(
  "clinichistories",
  clinichistoriesSchema
);

module.exports = clinichistories;
