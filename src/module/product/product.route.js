const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multerConfig');
const productController = require('./product.controller');

router.post('/', upload.array('images', 5), productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', upload.array('images', 5), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
