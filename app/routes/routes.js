const express = require('express')
const route = express.Router()
const face = require('../controllers/face.controller')

const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage()
})  

route.post('/detect', upload.single("image"), (face.detectFace))

module.exports = route