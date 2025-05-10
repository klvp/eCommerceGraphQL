import { orderService } from "./orders.service.js";
import { v4 as uuidv4 } from 'uuid';
import { UUID } from 'mongodb';
import { productService } from "./product.service.js";

export const placeOrder = async (parent, args) => {
    try {
        let { customerId, products } = args;
        const uuidString = uuidv4();
        // TODO: calculate totalAmount per Order and process products
        let totalAmount = 0;
        products = products.map(product => {
            totalAmount += Number(product.quantity) * parseFloat(product.
                priceAtPurchase)
            return {
                ...product,
                productId: new UUID(product.productId),
            }
        })
        // TODO: insert order details
        const newOrder = await orderService.create({
            _id: new UUID(uuidString),
            customerId: new UUID(customerId),
            orderDate: new Date(),
            products,
            totalAmount,
            status: "pending"
        })
        // TODO: update product stocks
        await Promise.all(
            products.map(product => productService.updateOne(
                {
                    _id: new UUID(product.productId),
                },
                {
                    $inc: { stock: -(product.quantity) }
                }
            ))
        )
        return newOrder.insertedId;
    } catch (error) {
        console.error(error.message)
        return error.message
    }
}

export const updateOrderStatus = async (parent, args) => {
    try {
        let { orderId, status } = args;
        // TODO: update order status
        const updateOrder = await orderService.updateOne(
            {
                _id: new UUID(orderId),
            },
            {
                $set: {
                    status
                }
            }
        )
        return updateOrder.modifiedCount
    } catch (error) {
        console.error(error.message)
        return error.message
    }
}