require('dotenv/config')
const express = require('express');
const mongoose = require('mongoose')
const AuthRouter = require('./Routes')
const app = express()
const {exec} =require('child_process')
const ErrorHandler = require('./util/GlobalErrorController')

//connect to db

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', AuthRouter);

mongoose.connect(process.env.DB_URI).then(()=>{
    console.log('Connected to db');
}).catch((err)=>{
    console.log(`Failed to connect to db Error: ${err}`);
})

app.all('*', (req, res)=>{
    res.status(404).json({
        success:false,
        message:'Page not found'
    })
})

app.use(ErrorHandler)

const PORT = process.env.PORT || 3030

function startNgrok() {
    exec(`ngrok http ${PORT}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting ngrok: ${error}`);
        return;
      }
      console.log(`Ngrok started:\n${stdout}`);
    });
  }

app.listen(PORT, ()=>{
    console.log(`server started at port ${PORT}`);
    // startNgrok();
})
