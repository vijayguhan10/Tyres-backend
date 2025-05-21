const axios = require("axios");
const Shop = require("../../Models/shop/Shop");

// Fetch coordinates using OpenWeatherMap API
const getCoordinates = async (pincode) => {
  try {
    const openWeatherApiKey = "4b9b8688eca407ea3546cf525c8f03cb";
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/zip`,
      {
        params: {
          zip: `${pincode},IN`,
          appid: openWeatherApiKey,
        },
      }
    );

    if (response.data.lat && response.data.lon) {
      return {
        latitude: response.data.lat,
        longitude: response.data.lon,
      };
    }
    console.log(`No coordinates found for pincode: ${pincode}`);
    return null;
  } catch (error) {
    console.error(
      `Error fetching coordinates for pincode ${pincode}:`,
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

// Controller to return all shops with distance from given pincode
const getShopsWithDistance = async (req, res) => {
  try {
    const clientPincode = req.body.addressId;
    if (!clientPincode) {
      return res.status(400).json({ error: "Pincode is required" });
    }

    const clientGeo = await getCoordinates(clientPincode);
    if (!clientGeo) {
      return res
        .status(400)
        .json({ error: "Invalid client pincode or coordinates not available" });
    }

    // Fetch all shops without populating TyresRequested
    const shops = await Shop.find();

    const uniquePincodes = [...new Set(shops.map((shop) => shop.pincode))];
    const pincodeGeos = {};

    for (const pincode of uniquePincodes) {
      const geo = await getCoordinates(pincode);
      if (geo) {
        pincodeGeos[pincode] = geo;
      }
    }

    const shopData = shops
      .map((shop) => {
        const shopGeo = pincodeGeos[shop.pincode];
        if (!shopGeo) return null;

        const distance = haversine(
          clientGeo.latitude,
          clientGeo.longitude,
          shopGeo.latitude,
          shopGeo.longitude
        );

        if (distance <= 50) {
          const availableTyres = shop.ShopStocks.map((stock) => ({
            tyreId: stock.tyreId,
            sizes: stock.sizes.map((size) => ({
              size: size.size,
              quantity: size.quantity,
              price: size.price,
            })),
          }));

          return {
            userId: shop.userId,
            shopId: shop._id,
            shopName: shop.name,
            phoneNumber: shop.phoneNumber,
            businessAddress: shop.businessAddress,
            pincode: shop.pincode,
            region: shop.region,
            openingTime: shop.openingTime,
            closingTime: shop.closingTime,
            daysOfOperation: shop.daysOfOperation,
            distance: distance.toFixed(2),
            availableTyres: availableTyres,
          };
        }

        return null;
      })
      .filter(Boolean);

    shopData.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    return res.status(200).json({
      clientPincode,
      clientLocation: clientGeo,
      shops: shopData,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getShopsWithDistance,
};
