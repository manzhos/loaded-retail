const { Router } = require('express')
const productController = require('../controllers/product.controller')
const router = Router()

router.post('/product',     productController.createProduct)
router.get('/product',      productController.getProducts)
router.get('/product/:id',  productController.getProduct)
router.post('/product/:id', productController.updateProduct)
router.get('/product/:id',  productController.deleteProduct)

module.exports = router 