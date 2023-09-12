module.exports = {
    mutiMongooseObject : function(mongooses){
        return mongooses.map(mongoose => mongoose.toObject())
    },
    MongooseObject : function(mongoose){
        return mongoose ? mongoose.toObject() : mongoose
    }
}