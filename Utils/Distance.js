const axios = require("axios");

async function getCoordinates(pincode) {
  try {
    console.log("api call form the opencage api");
    const apiKey = "a4c137f955eb488cb8d7df25d7a9b770";
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${pincode}&key=${apiKey}`
    );
    console.log("response data : ", response.data);
    if (response.data.results && response.data.results[0]) {
      const { lat, lng } = response.data.results[0].geometry;
      return { latitude: lat, longitude: lng };
    } else {
      console.error(`No valid coordinates found for pincode ${pincode}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates for pincode:", pincode, error);
    return null;
  }
}
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function calculateDistance(pincode1, pincode2) {
  const place1 = await getCoordinates(pincode1);
  const place2 = await getCoordinates(pincode2);

  if (place1 && place2) {
    const lat1 = place1.latitude;
    const lon1 = place1.longitude;
    const lat2 = place2.latitude;
    const lon2 = place2.longitude;

    const distance = haversine(lat1, lon1, lat2, lon2);
    console.log(
      `The distance between pincode ${pincode1} and ${pincode2} is ${distance.toFixed(
        2
      )} km.`
    );
  } else {
    console.log("Could not calculate distance due to invalid pincodes.");
  }
}

const pincode1 = "636103";
const pincode2 = "636003";

calculateDistance(pincode1, pincode2);
