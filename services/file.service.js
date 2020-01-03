// const path = require('path')
const aws = require('aws-sdk')
// const express = require('express')
// const multer = require('multer')
// const upload = express.Router()
// const sharp = require('sharp')
// const uniqid = require('uniqid')
require('dotenv').config()

const spacesEndpoint = new aws.Endpoint('fra1.digitaloceanspaces.com')
const s3 = new aws.S3({
  endpoint: spacesEndpoint
})
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID
})

// const uploadFile = (buffer, name) => {
//   const params = {
//     Bucket: 'are-media',
//     Key: name,
//     Body: buffer,
//     ACL: 'public-read'
//   }
//   return new Promise((resolve, reject) => {
//     s3.upload(params, function(err, res) {
//       if (err) {
//         reject(err)
//       } else {
//         resolve(res)
//       }
//     })
//   })
// }

module.exports = {
  name: 'file',
  actions: {
    save: {
      handler(ctx) {
        console.log(ctx.params)
        return true
      }
    }
    // s3: {
    //   async handler(ctx) {
    //     const filename = uniqid() + path.extname(req.file.originalname)
    //     const thumbnail = await sharp(req.file.buffer)
    //       .resize(400, 225)
    //       .toBuffer()
    //     const resized = await sharp(req.file.buffer)
    //       .resize(1200)
    //       .toBuffer()

    //     const results = await Promise.all([
    //       uploadFile(req.file.buffer, filename),
    //       uploadFile(thumbnail, 'thumb-' + filename),
    //       uploadFile(resized, 'resized-' + filename)
    //     ])
    //     const files = {
    //       original: results[0].Location,
    //       thumbnail: results[1].Location,
    //       resized: results[2].Location
    //     }
    //     res.json(files)
    //   }
    // }
  },
  methods: {
    randomName() {
      return 'unnamed_' + Date.now() + '.png'
    },
    uploadFile(buffer, name) {
      const params = {
        Bucket: 'are-media',
        Key: name,
        Body: buffer,
        ACL: 'public-read'
      }
      return new Promise((resolve, reject) => {
        s3.upload(params, function(err, res) {
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        })
      })
    }
  }
}
