const Medico = require("../models/Medico");
const Turn = require("../models/Turn");

const getMedicosPorEspecialidad = async (req, res) => {
  try {
    const { especialidad } = req.query; // Recibir la especialidad como parámetro de consulta.

    if (!especialidad) {
      return res.status(400).json({ message: "La especialidad es requerida." });
    }

    // Buscar médicos con la especialidad solicitada.
    const medicos = await Medico.find({ especialidad });

    if (medicos.length === 0) {
      return res.status(404).json({ message: "No se encontraron médicos para esta especialidad." });
    }

    // Obtener la fecha actual y los próximos 4 días.
    const hoy = new Date();
    const fechas = Array.from({ length: 5 }, (_, i) => {
      const nuevaFecha = new Date(hoy);
      nuevaFecha.setDate(hoy.getDate() + i);
      return nuevaFecha.toISOString().split("T")[0]; // Formatear a "YYYY-MM-DD".
    });

    // Construir la respuesta con los turnos disponibles para cada médico.
    const resultado = await Promise.all(
      medicos.map(async (medico) => {
        const turnosDisponibles = await Turn.find({
          medico: medico._id,
          disponible: true,
          fecha: { $in: fechas },
        }).select("fecha hora disponible -_id");

        return {
          medico: medico.nombreCompleto,
          especialidad: medico.especialidad,
          turnosDisponibles,
        };
      })
    );

    res.json(resultado);
  } catch (error) {
    console.error("Error al obtener médicos por especialidad:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

module.exports = { getMedicosPorEspecialidad };
