const Appointment = require("../../Models/client/Appointment");
const createAppointment = async (req, res) => {
  try {
    // Token and authorization checks removed
    const { addressId, time, date, orderinfo, paymentStatus } = req.body.appointmentData;
    console.log("Request body for appointment:", req.body)
    if (!addressId || !time || !date || !orderinfo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const appointment = await Appointment.create({
      userId: req.user.userId, // Still using req.user.userId from the request
      addressId,
      time,
      date,
      orderinfo,
      paymentStatus: paymentStatus || "Unpaid",
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
// Update payment status controller
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    
    // Validate the payment status value
    if (!paymentStatus) {
      return res.status(400).json({ message: "Payment status is required" });
    }
    
    if (!['CashOnDelivery', 'Paid', 'Unpaid'].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status value" });
    }
    
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    );
    
    if (!updatedAppointment)
      return res.status(404).json({ message: "Appointment not found" });
      
    res.status(200).json({ 
      message: "Payment status updated successfully", 
      updatedAppointment 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  updatePaymentStatus,
  deleteAppointment,
};
