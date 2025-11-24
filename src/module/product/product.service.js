const Product = require('./product.model');

exports.createProduct = async (data) => {
  return await Product.create(data);
};

exports.getAllProducts = async () => {
  return await Product.find();
};

exports.getProductById = async (id) => {
  return await Product.findById(id);
};

exports.updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};
