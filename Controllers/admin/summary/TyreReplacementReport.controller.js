const TyreInfo = require("../../../Models/client/OrderTyre");
const mongoose = require("mongoose");

// Get revenue for last 30 days with weekly breakdown
exports.getLast30DaysRevenue = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    console.log("Date range:", { thirtyDaysAgo, today });

    const result = await TyreInfo.aggregate([
      {
        $match: {
          status: "Approved",
          createdAt: { $gte: thirtyDaysAgo },
          deleted: false,
        },
      },
      {
        $group: {
          _id: {
            week: { $week: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.week": 1 },
      },
    ]);

    console.log("Aggregation result:", result);

    // Calculate total revenue
    const totalRevenue = result.reduce((sum, week) => sum + week.revenue, 0);

    // Format weekly breakdown
    const weeklyBreakdown = result.map((week) => {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - (30 - (week._id.week - 1) * 7));
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      return {
        week: week._id.week,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        revenue: week.revenue,
      };
    });

    res.status(200).json({
      success: true,
      total_revenue: totalRevenue,
      weekly_breakdown: weeklyBreakdown,
    });
  } catch (error) {
    console.error("Error in getLast30DaysRevenue:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching last 30 days revenue",
      error: error.message,
    });
  }
};

// Get revenue for last 6 months with monthly breakdown
exports.getLast6MonthsRevenue = async (req, res) => {
  try {
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    const result = await TyreInfo.aggregate([
      {
        $match: {
          status: "Approved",
          createdAt: { $gte: sixMonthsAgo },
          deleted: false,
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Calculate total revenue
    const totalRevenue = result.reduce((sum, month) => sum + month.revenue, 0);

    // Format monthly breakdown
    const monthlyBreakdown = result.map((month) => {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return {
        month: `${monthNames[month._id.month - 1]} ${month._id.year}`,
        revenue: month.revenue,
      };
    });

    res.status(200).json({
      success: true,
      total_revenue: totalRevenue,
      monthly_breakdown: monthlyBreakdown,
    });
  } catch (error) {
    console.error("Error in getLast6MonthsRevenue:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching last 6 months revenue",
      error: error.message,
    });
  }
};

// Get revenue for last 12 months with monthly breakdown
exports.getLast12MonthsRevenue = async (req, res) => {
  try {
    const today = new Date();
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setMonth(today.getMonth() - 12);

    const result = await TyreInfo.aggregate([
      {
        $match: {
          status: "Approved",
          createdAt: { $gte: twelveMonthsAgo },
          deleted: false,
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Calculate total revenue
    const totalRevenue = result.reduce((sum, month) => sum + month.revenue, 0);

    // Format monthly breakdown
    const monthlyBreakdown = result.map((month) => {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return {
        month: `${monthNames[month._id.month - 1]} ${month._id.year}`,
        revenue: month.revenue,
      };
    });

    res.status(200).json({
      success: true,
      total_revenue: totalRevenue,
      monthly_breakdown: monthlyBreakdown,
    });
  } catch (error) {
    console.error("Error in getLast12MonthsRevenue:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching last 12 months revenue",
      error: error.message,
    });
  }
};

// Get overall revenue with yearly breakdown
exports.getOverallRevenue = async (req, res) => {
  try {
    const result = await TyreInfo.aggregate([
      {
        $match: {
          status: "Approved",
          deleted: false,
        },
      },
      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { "_id.year": 1 },
      },
    ]);

    // Calculate total revenue
    const totalRevenue = result.reduce((sum, year) => sum + year.revenue, 0);

    // Format yearly breakdown
    const yearlyBreakdown = result.map((year) => ({
      year: year._id.year,
      revenue: year.revenue,
    }));

    res.status(200).json({
      success: true,
      total_revenue: totalRevenue,
      yearly_breakdown: yearlyBreakdown,
    });
  } catch (error) {
    console.error("Error in getOverallRevenue:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching overall revenue",
      error: error.message,
    });
  }
};
