const { Router } = require('express')
const userController = require('../controllers/user.controller')
const router = Router()

router.post('/login', userController.loginUser)

router.post('/user', userController.createUser)
router.get('/user', userController.getUsers)
router.get('/user/:id', userController.getUser)
router.post('/user/:id', userController.updateUser)
router.get('/deluser/:id', userController.deleteUser)

router.get('/roles', userController.getRoles)

module.exports = router 