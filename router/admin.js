var express = require('express')
var router = express.Router()
const adminController = require('../controllers/adminController')

// Get
// Lấy tất cả sản phẩm có trong db shirt, clothes, shoes
router.get('/admin/get-product', adminController.getProduct)
// Lấy tất cả người dùng
router.get('/admin/get-user', adminController.getUser)
// lấy tất cả các bill
router.get('/admin/get-bill', adminController.getBill)
// Post
// Tạo 1 người dùng mới
router.post('/admin/create-user', adminController.createUser) // path 
router.post('/admin/create-product', adminController.createProduct)
router.post('/admin/create-bill', adminController.createBill)

// Put 
// Sửa 1 sẩn phẩm
router.put('/admin/product/:type/:id', adminController.updateProduct)
router.put('/admin/:id/edit-user', adminController.editUserByID)
router.put('/admin/:id/update-bill', adminController.updateBill)

// delete
// XÓa 1 người dùng
router.delete('/admin/:id/delete-user', adminController.deleteUser)
router.delete('/admin/:type/:id/delete-product', adminController.deleteProduct)


// post get put delete 

// Login

router.post('/login', adminController.login)

















module.exports = router;