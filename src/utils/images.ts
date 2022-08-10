import { Express } from 'express'
import { existsSync, unlinkSync } from 'fs'
import { v4 as uuid } from 'uuid'
const imageTypes = ['image/png', 'image/jpeg']
const ValidateImage = (_req, file: Express.Multer.File, callback) => {
  if (imageTypes.includes(file.mimetype)) {
    callback(null, true)
  } else {
    callback(null, false)
  }
}

const createName = (_req, file: Express.Multer.File, callback) => {
  if (!file) return callback(new Error('No file provided'), false)
  const name = `${uuid()}-${file.originalname}`
  callback(null, name)
}

const removeFile = (path:string) => {
  if (existsSync(path)) {
    unlinkSync(path)
  }
}
export {
  ValidateImage,
  createName,
  removeFile
}
