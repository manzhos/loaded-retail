const { Router } = require('express')
const goodtypeController = require('../controllers/goodtype.controller')
const router = Router()

router.post('/goodtype',       goodtypeController.createGoodType)
router.get('/goodtype',        goodtypeController.getGoodTypes)
router.get('/goodtype/:id',    goodtypeController.getGoodType)
router.post('/goodtype/:id',   goodtypeController.updateGoodType)
router.get('/delgoodtype/:id', goodtypeController.deleteGoodType)

module.exports = router 