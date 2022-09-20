import express from 'express'
import fileUpload from 'express-fileupload'
import { downloadFile, getFile, getFiles, getFileUrl, UploadFile } from './s3.js'

const app = express()

//Middlewares
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './uploads'
}))

app.get('/files', async (req,res) => {
  const result = await getFiles()
  res.json(result.Contents)
})

app.get('/files/:fileName', async (req,res) => {
  const result = await getFileUrl(req.params.fileName)
  res.json({
    url: result
  })
})

app.get('/files/downloadfile/:fileName', async (req,res) => {
  await downloadFile(req.params.fileName)
  res.json({
    message: "File downloaded."
  })
})

app.post('/files', async (req,res) => {
  const result = await UploadFile(req.files.file)
  res.json({result})
})

//Express permite dejar la carpeta de images como pública (para su uso en el front end):
app.use(express.static('images'))

app.listen(3000)
console.log(`Server on port ${3000}`)