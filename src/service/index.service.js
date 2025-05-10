class MongoBaseService {
    collection = null;
    database = null;

    constructor() {
        this.collection = this.getCollection();
        this.database = this.getDatabase();
    }

    getCollection() {
        throw new Error('Please implement this method in child!');
    }

    getDatabase() {
        throw new Error('Please implement this method in child!');
    }

    async find(filter = {}, project = {}) {
        return this.collection.find(filter, project).toArray()
    }

    async findOne(filter, project = {}) {
        return this.collection.findOne(filter, project)
    }

    async create(payload) {
        return this.collection.insertOne(payload)
    }

    async createMany(payloadArray) {
        return this.collection.insertMany(payloadArray)
    }

    async update(filter, setterObject) {
        return this.collection.updateOne(filter, setterObject)
    }

    async updateMany(filter, setterObject) {
        return this.collection.updateMany(filter, setterObject)
    }

    async delete(filter) {
        return this.collection.deleteOne(filter)
    }

    async deleteMany(filter) {
        return this.collection.deleteMany(filter)
    }

    async aggregate(stageArray) {
        return this.collection.aggregate(stageArray).toArray()
    }
}

export { MongoBaseService }