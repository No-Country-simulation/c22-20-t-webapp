const express = require("express");
const {
  register,
  login,
  loginGoogle,
  getSpecialty,
  getPatientShifts,
  updateUser,
} = require("../controllers/user.controller");
const { checkRegister, checkLogin } = require("../middleware/middleware");
const {
  getDiagnosis,
  createDiagnosis,
} = require("../controllers/doctor.controller");
const {
  addHealthcareSystem,
} = require("../controllers/healthcareSystemController");
const { reserveTurn } = require("../controllers/turnController.js");
const AdminController = require("../controllers/adminController");
const {
  getMedicosPorEspecialidad,
} = require("../controllers/medicoController");
const passport = require("passport");
const { googleLogin } = require("../controllers/user.controller");

const router = express.Router();

router.use("/register/api", checkRegister);
router.use("/login/api", checkLogin);

router.post("/register/api", register);
router.post("/login/api", login);
router.post("/googleLogin", loginGoogle);
router.put("/turns/reserve/:id", reserveTurn);
router.put("/update/:id", updateUser);
router.get("/turnos", AdminController.verTurnos);
router.get("/medicos-por-especialidad", getMedicosPorEspecialidad);
router.get("/appointment/my_shifts/:id", getPatientShifts);
router.post("/add", addHealthcareSystem);
router.get("/diagnosis/:id", getDiagnosis);
router.get("/appointment/specialty", getSpecialty);
router.post("/create", createDiagnosis);
router.post("/add", addHealthcareSystem);
// Rutas para Google

module.exports = router;
