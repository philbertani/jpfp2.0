const express = require('express')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan');
const app = express()

// static middleware
app.use(express.static(path.join(__dirname, '..','public')))

// body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', require('./api'))

//app.use(cors())  //cors not needed

app.use(morgan('dev'))

//only return main if match slash exactly
//app.use(/^\/$/, (req, res, next) => {
app.use('/', (req, res, next) => {
  console.log(req.params)
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

//if we get here then that is an error
app.use(  (req,res,next)=>{
  //throw new Error('path on main route not found')
  next(new Error('/ main route not found'));   //send to default err handler for now
})


module.exports = app;

