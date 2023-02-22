require('dotenv').config()
const AWS = require('aws-sdk')

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_REKOGNITION,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_REKOGNITION,
  region: process.env.AWS_REGION_REKOGNITION
})

module.exports = AWS