import {
    getCustomerSpending,
    getSalesAnalytics,
    getTopSellingProducts
} from "../service/analytics.api.service.js";
import { placeOrder, updateOrderStatus } from "../service/orders.api.service.js";

export const resolvers = {
    Query: {
        getCustomerSpending,
        getTopSellingProducts,
        getSalesAnalytics,
    },
    Mutation: {
        createUser: (_, args) => {
            const newUser = { id: users.length + 1, ...args }
            users.push(newUser)
            return newUser
        },
        placeOrder,
        updateOrderStatus,
    }
}