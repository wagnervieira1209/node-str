'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');

/* método NÃO async
exports.get = () => {
    return Product
        .find(
            {
                active: true, // Somente produtos ativos
            }, 
            'title slug price' // Somente estes campos devem ser exibidos
        );
}
*/

exports.get = async () => {
    const res = await Product.find({ active: true }, 'title slug price');
    return res;
}

exports.getBySlug = async (slug) => {
    const res = await Product
        .findOne(
            {
                slug: slug,
                active: true, // Somente produtos ativos
            }, 
            'title desciption slug price tags' // Somente estes campos devem ser exibidos
        );
    return res;
}

exports.getByTag = async (tag) => {
    const res = await Product
        .find(
            {
                tags: tag,
                active: true,
            }, 
            'title desciption slug price tags' 
        );
    return res;
}

exports.getById = async (id) => {
    const res = await Product
        .findById(id);
    return res;
}

exports.create = async (data) => {
    var product = new Product(data);  
    await product.save();
}

exports.update = async (id, data) => {
    await Product
        .findByIdAndUpdate(id, {
            $set: {
                title: data.title,
                description: data.description,
                slug: data.slug,
                price: data.price,
                tags: data.tags,
            }
        });
}

exports.delete = async (id) => {
    await Product
        .findOneAndRemove(id);
}