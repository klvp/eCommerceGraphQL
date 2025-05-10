import { UUID } from "mongodb";
import { orderService } from "../service/orders.service.js";
export const getCustomerSpending = async (_, args) => {
    const { customerId } = args

    const customerSpending = await orderService
        .aggregate([
            {
                $match: {
                    customerId: new UUID(customerId),
                    status: {
                        $nin: ["pending", "canceled"]
                    }
                }
            },
            {
                $group: {
                    _id: "$customerId",
                    totalSpent: { $sum: "$totalAmount" },
                    lastPurchaseDate: { $max: "$orderDate" },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $addFields: {
                    averageOrderValue: {
                        $cond: [
                            { $eq: ["$orderCount", 0] },
                            0,
                            { $divide: ["$totalSpent", "$orderCount"] }
                        ]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    customerId: "$_id",
                    totalSpent: 1,
                    averageOrderValue: 1,
                    lastOrderDate: "$lastPurchaseDate",
                }
            }
        ]);
    return customerSpending[0];
}

export const getTopSellingProducts = async (_, args) => {
    const { limit } = args

    const topSellingProducts = await orderService
        .aggregate([
            {
                $match: {
                    status: {
                        $nin: ["pending", "canceled"]
                    }
                }
            },

            { $unwind: "$products" },

            {
                $group: {
                    _id: "$products.productId",
                    totalSold: { $sum: "$products.quantity" }
                }
            },

            { $sort: { totalSold: -1 } },

            { $limit: limit },

            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },

            {
                $project: {
                    productId: "$_id",
                    totalSold: 1,
                    name: { $arrayElemAt: ["$productDetails.name", 0] }
                }
            }
        ]);
    return topSellingProducts;
}

export const getSalesAnalytics = async (_, args) => {
    const { startDate, endDate } = args;
    const getAnalytics = await orderService
        .aggregate([
            {
                $match: {
                    orderDate: {
                        $gt: new Date(startDate),
                        $lt: new Date(endDate),
                    },
                    status: {
                        $nin: ["pending", "canceled"]
                    }
                },
            },
            {
                $facet: {
                    orderStats: [
                        { $count: "completedOrders" }
                    ],
                    totalRevenue: [
                        {
                            $group: {
                                _id: null,
                                totalRevenue: { $sum: "$totalAmount" }
                            }
                        }
                    ],
                    productRevenue: [
                        { $unwind: "$products" },
                        {
                            $addFields: {
                                productRevenue: {
                                    $multiply: ["$products.quantity", "$products.priceAtPurchase"]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "products",
                                localField: "products.productId",
                                foreignField: "_id",
                                as: "productInfo"
                            }
                        },
                        { $unwind: "$productInfo" },
                        {
                            $group: {
                                _id: "$productInfo.category",
                                revenue: { $sum: "$productRevenue" }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                category: "$_id",
                                revenue: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    totalRevenue: { $arrayElemAt: ["$totalRevenue.totalRevenue", 0] },
                    completedOrders: { $arrayElemAt: ["$orderStats.completedOrders", 0] },
                    categoryBreakdown: "$productRevenue"
                }
            }
        ])
    return getAnalytics[0]
}