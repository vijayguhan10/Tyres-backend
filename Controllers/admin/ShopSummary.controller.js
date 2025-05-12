const Shop = require('../../Models/shop/Shop');
const Tyre = require('../../Models/admin/Addtyre'); 
exports.getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find({})
            .select('-__v')
            .populate({
                path: 'userId',
                select: 'name email phone' 
            }); 

        res.status(200).json({
            success: true,
            count: shops.length,
            data: shops
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error: ' + err.message
        });
    }
};

// 2. Endpoint to return revenue summary of all shops
exports.getRevenueSummary = async (req, res) => {
    try {
        // Aggregate revenue data from all shops
        const revenueData = await Shop.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$revenue" },
                    averageRevenue: { $avg: "$revenue" },
                    shops: { $push: { name: "$name", revenue: "$revenue" } }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalRevenue: 1,
                    averageRevenue: 1,
                    shops: 1
                }
            }
        ]);

        if (revenueData.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'No shops found'
            });
        }

        res.status(200).json({
            success: true,
            data: revenueData[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error: ' + err.message
        });
    }
};

exports.getTyreStockReport = async (req, res) => {
    try {
        // Get all shops with their ShopStocks and populate the tyre details
        const shops = await Shop.find({})
            .select('name ShopStocks')
            .populate({
                path: 'ShopStocks.tyreId',
                select: 'brand model type _id', // Adjust based on your addtyre model fields
                model: 'addtyre'
            });

        // Transform the data into a more organized structure
        const stockReport = shops.map(shop => {
            const shopStocks = shop.ShopStocks.map(stock => {
                const tyreInfo = stock.tyreId ? {
                    _id: stock.tyreId._id, 
                    brand: stock.tyreId.brand,
                    model: stock.tyreId.model,
                    type: stock.tyreId.type
                } : null;

                return {
                    tyre: tyreInfo,
                    sizes: stock.sizes.map(size => ({
                        size: size.size,
                        quantity: size.quantity,
                        price: size.price
                    }))
                };
            });

            return {
                shopId: shop._id,
                shopName: shop.name,
                stocks: shopStocks
            };
        });

        res.status(200).json({
            success: true,
            count: stockReport.length,
            data: stockReport
        });
    } catch (err) {
        console.error('Error in getTyreStockReport:', err);
        res.status(500).json({
            success: false,
            error: 'Error fetching tyre stock report',
            details: err.message
        });
    }
};