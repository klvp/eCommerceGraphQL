import { db } from "./index.js";
import fs from 'fs';
import csv from 'csv-parser';
import { UUID } from "mongodb";

async function run() {
    const ordersCollection = db.collection('orders');

    const results = [];

    fs.createReadStream(process.cwd() + "/dump/orders.csv")
        .pipe(csv())
        .on('data', (row) => {
            try {
                // Convert stringified 'products' to real array
                const productsStr = row.products.replace(/'/g, '"');
                const products = JSON.parse(productsStr);

                const order = {
                    _id: new UUID(row._id),
                    customerId: new UUID(row.customerId),
                    products: products.map(p => ({
                        productId: new UUID(p.productId),
                        quantity: Number(p.quantity),
                        priceAtPurchase: parseFloat(p.priceAtPurchase)
                    })),
                    totalAmount: parseFloat(row.totalAmount),
                    orderDate: new Date(row.orderDate),
                    status: row.status
                };

                // Simple validation
                if (!order.customerId || !Array.isArray(order.products)) {
                    throw new Error('Invalid data');
                }

                results.push(order);
            } catch (err) {
                console.error(`Skipping row due to error: ${err.message}`);
            }
        })
        .on('end', async () => {
            try {
                if (results.length) {
                    const insertResult = await ordersCollection.insertMany(results);
                    console.log(`Inserted ${insertResult.insertedCount} orders`);
                } else {
                    console.log('No valid orders to insert');
                }
            } catch (err) {
                console.error('Error inserting into MongoDB:', err);
            } finally {
                process.exit(0)
            };
        })
}

run().catch(console.dir);