const DB = require('../db')
const fs = require('fs')
const uuid = require('uuid')
require('dotenv').config()

class FileController {
  async uploadFile(req, res){
    console.log('take & save the file', req.files);
//    if(!req.files) return res.status(400).json({message: 'Reload please'});
    
    const folderName = process.env.filePath;
    const subFolderName = 'photos';
    try {
      if(!fs.existsSync(folderName)) {
        console.log('Try to make dir:', folderName);
        fs.mkdirSync(folderName);
      }
    } catch (err) { console.error(err) }
    
    try {
      if(!fs.existsSync(folderName + '/' + subFolderName)) {
        console.log('Try to make subdir:', folderName + '/' + subFolderName);
        fs.mkdirSync(folderName + '/' + subFolderName);
      }
    } catch (err) { console.error(err) }

    // res.send('ok');
    
    try{
      let file = []
      if(req.files.file.length && req.files.file.length > 0) file = req.files.file;
      else file.push(req.files.file);
      // console.log('file[]', file);
      let fileName = [],
          pathFile = [],
          newFiles = [];
  
      // save the file
      for(let key in file){
        fileName[key] = uuid.v4() + '_' + file[key].name;
        // console.log('File:', file[key]);
        // console.log('fileName:', fileName[key]);
        pathFile[key] = folderName + '/' + fileName[key];
        // console.log('\nPath:', folderName, pathFile[key]);
        if (fs.existsSync(pathFile)) {
          return res.status(400).json({message: 'File already exist'});
        }
        file[key].mv(pathFile[key]);
        // console.log('file was saved');
  
        // add file to DB
        const sql = 'INSERT INTO files (filename, type, size, path, ts) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const ts = new Date();
        const type = file[key].name.split('.').pop();
        // console.log('for DB:\n', fileName, type, file.size, folderName, ts)    ;
        const newFile = await DB.query(sql, [fileName[key], type, file[key].size, folderName, ts]);
        // console.log('newFile:', newFile.rows[0]);
        newFiles.push(newFile.rows[0]);
    }
    // console.log('newFiles:', newFiles)
    res.send(newFiles)
    } catch (err) { 
      console.error('Error:', err);
      return res.status(500).json({message:"Upload error"});
    }
  }

  async getFiles(req, res){
    // console.log('get all files')
    try {
      const sql = `SELECT * FROM files ORDER BY filename`
      const files = await DB.query(sql)
      // console.log(files.rows)
      res.send(files.rows)
    } catch(e) {
      console.log(`Error: ${e}`)
      return res.status(500).json({message: "The connection with database was lost."})
    }
  }

  async getFile(req, res){
    const id = req.params.id
    try {
      const sql = `SELECT * FROM files WHERE id = $1;`
      const files = await DB.query(sql, [id])
      // console.log(files.rows[0])
      res.send(files.rows[0])
    } catch(e) {
      console.log(`Error: ${e}`)
      return res.status(500).json({message: "The connection with database was lost."})
    }
  }

  async deleteFile(req, res){
    const id = req.params.id
    // console.log(`delete File by ID #${id}`)

    // delete from DB
    const sql = `DELETE FROM files WHERE id = $1 RETURNING filename;`
    const fileDeleted = await DB.query(sql, [id])
    // console.log('fileDeleted', fileDeleted)
    const fileName = fileDeleted.rows[0].filename
    // console.log(`file #${id}: ${fileName} with SQL: ${sql}`)
    
    //delete from FS
    const folderName = process.env.filePath + '\\docs'
    const pathFile = folderName + '\\' + fileName
    // console.log('pathFile:', pathFile)
    fs.unlink(pathFile, (err) => {
      if (err) {
        console.error(err)
        return
      }
      // console.log(`file #${id} removed`)
    })

    res.send(fileDeleted)    
  }
}

module.exports = new FileController()
