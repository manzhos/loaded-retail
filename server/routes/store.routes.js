const { Router } = require('express')
const storeController = require('../controllers/store.controller')
const router = Router()

router.post('/store', storeController.createStore)
router.get('/store', storeController.getStores)
router.get('/store/:id', storeController.getStore)
router.post('/store/:id', storeController.updateStore)
router.delete('/store/:id', storeController.deleteStore)

module.exports = router 