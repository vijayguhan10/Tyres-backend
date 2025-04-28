const Appointment = require("../../Models/client/Appointment");
const createAppointment = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    if (req.user.role !== "client")
      return res.status(403).json({ message: "Unauthorized role" });
    const { addressId, time, date, orderinfo } = req.body;
    if (!addressId || !time || !date || !orderinfo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const appointment = await Appointment.create({
      userId: req.user.userId,
      addressId,
      time,
      date,
      orderinfo,
    });

    res.status(201).json({ message: "Appointment created", appointment });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate(
      "userId addressId orderinfo"
    );
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id)
      .populate("userId addressId orderinfo")
      .populate({
        path: "userId",
        select: "email name",
      });
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json({ appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedAppointment)
      return res.status(404).json({ message: "Appointment not found" });
    res
      .status(200)
      .json({ message: "Appointment updated", updatedAppointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
