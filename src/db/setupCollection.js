import { db } from "./index.js";
import fs from 'fs';
import csv from 'csv-parser';
import { UUID } from "mongodb";
import path from 'path';

function processFile(filePath, collectionName) {
    return new Promise((resolve, reject) => {
        const results = [];
        const collection = db.collection(collectionName);
        if (collectionName === "orders") {
            collection.createIndex({ status: 1 })
                .then(() => console.log('Index created for orders collection'))
                .catch(error => {
                    console.error('Error creating index:', error);
                    return reject(error);
                });
        }
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                try {
                    let order = {}
                    if (collectionName == "orders") {
                        const productsStr = row.products.replace(/'/g, '"');
                        const products = JSON.parse(productsStr);

                        order = {
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

                        if (!order.customerId || !Array.isArray(order.products)) {
                            throw new Error('Invalid data');
                        }
                    } else if (collectionName == "products") {
                        order = {
                            _id: new UUID(row._id),
                            name: row.name,
                            category: row.category,
                            price: parseFloat(row.price),
                            stock: Number(row.stock),
                        }
                    } else {
                        order = {
                            _id: new UUID(row._id),
                            name: row.name,
                            email: row.email,
                            age: Number(row.age),
                            location: row.location,
                            gender: row.gender,
                        }
                    }

                    results.push(order);
                } catch (err) {
                    console.error(`Skipping row due to error: ${err.message}`);
                }
            })
            .on('end', async () => {
                try {
                    if (results.length) {
                        const insertResult = await collection.insertMany(results);
                        console.log(`Inserted ${insertResult.insertedCount}`);
                    } else {
                        console.log('No valid orders to insert');
                    }
                    resolve();
                } catch (err) {
                    console.error('Error inserting into MongoDB:', err);
                    reject();
                }
            })
            .on('error', reject);
    })
}

async function run() {

    const folderPath = path.join(process.cwd(), "dump")

    const files = fs.readdirSync(path.join(process.cwd(), "dump")).filter(file => {
        return fs.statSync(path.join(folderPath, file)).isFile();
    });

    for (const file of files) {
        await processFile(path.join(folderPath, file), file.replace(".csv", ""))
    }

}

run().then(() => {
    console.log("All files processed.");
    process.exit(0);
}).catch(err => {
    console.error("Error in run:", err);
    process.exit(1);
});