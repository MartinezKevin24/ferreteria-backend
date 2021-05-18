const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    cloudinary_id: {
        type: String,
        require: true
    },
    availability: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
});

const Products = mongoose.model('Product', productSchema);

module.exports = Products;