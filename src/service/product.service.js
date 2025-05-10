import { db } from "../db/index.js";
import { MongoBaseService } from "./index.service.js";

class ProductService extends MongoBaseService{
    getCollection() {
        return db.collection('products')
    }

    getDatabase() {
        return db
    }
}
export const productService = new ProductService()