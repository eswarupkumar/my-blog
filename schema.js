const express =require('express')
const mongoose = require('mongoose')
const router =express.Router()
const schema =new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    upvote:{
        type: Number,
        required:true,
        default:1
    },
    comments:{
        type: JSON,
        required: false,   
    }
})
module.exports=mongoose.model('aliens',schema)

