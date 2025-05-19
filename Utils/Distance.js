const axios = require("axios");

// Remove hardcoded clientCoordinates

const calculateDistance = async (hopsPincode, clientCoordinates) => {
  try {
    const apiKey = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";
    const response = await axios.get(
      `https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd`,
      {
        params: {
          "api-key": apiKey,
          format: "json",
          "filters[pincode]": hopsPincode,
          limit: 1,
        },
        headers: {
          accept: "application/json",
        },
      }
    );

    if (response.data.records && response.data.records.length > 0) {
      const record = response.data.records[0];
      if (record.latitude && record.longitude) {
        const hopsCoordinates = {
          latitude: parseFloat(record.latitude),
          longitude: parseFloat(record.longitude),
          _id: record._id, // Include the _id from the response
        };

        // Calculate distance using haversine formula
        const distance = haversine(
          clientCoordinates.latitude,
          clientCoordinates.longitude,
          hopsCoordinates.latitude,
          hopsCoordinates.longitude
        );
        console.log(
          `Distance from client to ${hopsPincode}: ${distance} km`
        );
        return {
          distance,
          _id: hopsCoordinates._id,
        };
      }
    }
    console.log(`No coordinates found for pincode: ${hopsPincode}`);
    return null;
  } catch (error) {
    console.error(
      `Error calculating distance for pincode ${hopsPincode}:`,
      error.message
    );
    return null;
  }
};

// Haversine formula to calculate distance between two coordinates
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // returns distance in km
};
module.exports = {
  calculateDistance,
};
