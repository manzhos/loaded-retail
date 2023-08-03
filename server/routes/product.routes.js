const { Router } = require('express')
const productController = require('../controllers/product.controller')
const router = Router()

router.post('/product',         productController.createProduct)
router.get('/product',          productController.getProducts)
router.get('/product/:id',      productController.getProduct)
router.patch('/product/:id',    productController.updateProduct)
router.patch('/qtyproduct/:id', productController.updateQtyProduct)
router.get('/delproduct/:id',   productController.deleteProduct)

router.get('/productflow',      productController.getProductsFlow)

module.exports = router 