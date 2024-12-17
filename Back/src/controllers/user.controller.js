const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const Specialty = require("../models/Especialidad.js");
const Shifts = require("../models/Turn.js");
const mongoose = require("mongoose");

dotenv.config();

const register = async function (req, res) {
  const {
    name,
    lastName,
    email,
    password,
    gender,
    age,
    phone,
    role,
    idAfiliado,
    healthcareSystem,
  } = req.body;
  const salt = await bcrypt.genSalt(5);
  const hash = await bcrypt.hash(password, salt);
  User.create({
    name,
    lastName,
    email,
    password: hash,
    gender,
    age,
    phone,
    role,
    idAfiliado,
    healthcareSystem,
  })
    .then((result) => {
      res.status(201).json({ message: "success" });
    })
    .catch((error) => {
      if (error.code === 11000) {
        res.status(409).json({ error: "this user already exists!" });
      } else {
        console.error(error);
        res.status(503).json({ error: "content not aveliable!" });
      }
    });
};

const login = async function (req, res) {
  try {
    const result = await User.findOne({ email: req.body.email }).populate(
      "healthcareSystem"
    );
    if (!result) {
      return res.status(401).json({ error: "email or password incorrect!" });
    }
    if (bcrypt.compareSync(req.body.password, result.password)) {
      const userData = {
        id: result.id,
        name: result.name,
        lastName: result.lastName,
        email: result.email,
        phone: result.phone,
        gender: result.gender,
        age: result.age,
        idAfiliado: result.idAfiliado,
        healthcareSystem: result.healthcareSystem,
      };
      return res.json({ userData });
    } else {
      return res.status(401).json({ error: "email or password incorrect!" });
    }
  } catch (error) {
    console.error(error);
    res.status(503).json({ error: "content not available!" });
  }
};

const loginGoogle = async (req, res) => {
  try {
    // Validación del body
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Busca el usuario en la base de datos
    const user = await User.findOne({ email }).populate("healthcareSystem");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prepara los datos del usuario para la respuesta
    const userData = {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      age: user.age,
      idAfiliado: user.idAfiliado,
      healthcareSystem: user.healthcareSystem,
    };

    // Devuelve la respuesta al frontend
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: userData,
    });
  } catch (error) {
    // Log del error para depuración
    console.error("Error fetching user data:", error);

    // Devuelve una respuesta de error al cliente
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSpecialty = function (req, res) {
  Specialty.find({}, "especialidad")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(503).send("Content not aveliable!");
    });
};

const getPatientShifts = async function (req, res) {
  const params = req.params.id.replace(":", "");
  const id = new mongoose.Types.ObjectId(params);

  console.log("param", params);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "incorrect format" });
  } else {
    try {
      const shifts = await Shifts.aggregate([
        {
          $lookup: {
            from: "medicos",
            localField: "medico",
            foreignField: "_id",
            as: "doctor",
          },
        },
        { $match: { patient: id } },
        { $unwind: "$doctor" },
        { $sort: { _id: -1 } },
        { $limit: 3 },
        {
          $project: {
            fecha: 1,
            disponible: 1,
            url: 1,
            hora: 1,
            "doctor.especialidad": 1,
            "doctor.nombreCompleto": 1,
          },
        },
      ]);
      res.json(shifts);
    } catch (error) {
      console.log(error);
      res.status(503).json({ error: "content not available!" });
    }
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    for (const key in updates) {
      if (typeof updates[key] === "string") {
        updates[key] = updates[key].trim();
      }
    }

    console.log(req.body);
    console.log(req.params);
    if (updates.email) {
      return res.status(400).json({ error: "No se puede actualizar el email" });
    }
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: false,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar usuario:");
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

module.exports = {
  register,
  login,
  loginGoogle,
  getSpecialty,
  getPatientShifts,
  updateUser,
};
