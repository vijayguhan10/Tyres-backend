const axios = require("axios");
const Shop = require("../../Models/shop/Shop");

// Fetch coordinates using India Postal API
const getCoordinates = async (pincode) => {
  try {
    const apiKey = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";
    const response = await axios.get(
      `https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd`,
      {
        params: {
          "api-key": apiKey,
          format: "json",
          "filters[pincode]": pincode,
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
        return {
          latitude: parseFloat(record.latitude),
          longitude: parseFloat(record.longitude),
        };
      }
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
  const R = 6371; // Earth radius in km
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

    // Find shops and populate necessary fields
    const shops = await Shop.find().populate({
      path: 'TyresRequested',
      match: { status: 'Approved' }, // Only include approved tyre requests
      select: 'status specification price createdAt' // Select only needed fields
    });

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
          const completedTyres = shop.TyresRequested.map(request => ({
            requestId: request._id,
            status: request.status,
            price: request.price,
            createdAt: request.createdAt,
            tyres: request.specification.map(spec => ({
              tyreId: spec.tyreId,
              size: spec.size,
              quantity: spec.quantity
            }))
          }));

          return {
           UserId: shop.userId,
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
            completedTyres: completedTyres
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
