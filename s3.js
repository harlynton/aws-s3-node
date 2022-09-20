import { GetObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_PUBLIC_KEY, AWS_SECRET_KEY } from './config.js'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import fs from 'fs'

const client = new S3Client({
  region:AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_PUBLIC_KEY,
    secretAccessKey: AWS_SECRET_KEY
  }
})

export async function UploadFile(file) {
  const stream = fs.createReadStream(file.tempFilePath)

  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: file.name,
    Body: stream
  }

  const command = new PutObjectCommand(uploadParams)
  return await client.send(command)
}

export async function getFiles(){
  const command = new ListObjectsCommand({
    Bucket:AWS_BUCKET_NAME
  })
  return await client.send(command)
 
}

export async function getFile(fileName){
  const command = new GetObjectCommand({
    Bucket:AWS_BUCKET_NAME,
    Key: fileName
  })

  return await client.send(command)
}

export async function getFileUrl(fileName){
  const command = new GetObjectCommand({
    Bucket:AWS_BUCKET_NAME,
    Key: fileName
  })

  return await getSignedUrl(client, command, { expiresIn: 3600 })
}

export async function downloadFile(fileName){
  const command = new GetObjectCommand({
    Bucket:AWS_BUCKET_NAME,
    Key: fileName
  })

  const result = await client.send(command)
  result.Body.pipe(fs.createWriteStream(`./images/${fileName}`))
}