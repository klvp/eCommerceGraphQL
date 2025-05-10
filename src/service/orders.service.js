import { db } from "../db/index.js";
import { MongoBaseService } from "./index.service.js";

class OrderService extends MongoBaseService{
    getCollection() {
        return db.collection('orders')
    }

    getDatabase() {
        return db
    }
}
export const orderService = new OrderService()