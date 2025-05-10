export const typeDefs = `#graphql
    type Query{
        getCustomers: [Customer]
        getCustomeById(id: ID!): Customer
        getCustomerSpending(customerId: ID!): CustomerSpending
        getTopSellingProducts(limit: Int!): [TopProduct]
        getSalesAnalytics(startDate: String!, endDate: String!): SalesAnalytics
    }

    type Mutation {
        createUser(name: String!, age: Int!, isMarried: Boolean!): User
    }

    type User {
        id: ID
        name: String
        age: Int
        isMarried: Boolean
    }

    type Customer {
        _id: ID
        name: String
        email: String
        age: Int
        location: String
        gender: String
    }

    type CustomerSpending {
        customerId: ID
        totalSpent: Float
        averageOrderValue: Float
        lastOrderDate: String
    }

    type TopProduct {
        productId: ID
        name: String
        totalSold: Int
    }

    type SalesAnalytics {
        totalRevenue: Float
        completedOrders: Int
        categoryBreakdown: [CategoryBreakdown]
    }

    type CategoryBreakdown {
        category: String
        revenue: Float
    }
`

