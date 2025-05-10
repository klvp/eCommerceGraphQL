import { db } from "../db/index.js";
import { MongoBaseService } from "./index.service.js";

class CustomerService extends MongoBaseService{
    getCollection() {
        return db.collection('customers')
    }

    getDatabase() {
        return db
    }
}
export const customerService = new CustomerService()