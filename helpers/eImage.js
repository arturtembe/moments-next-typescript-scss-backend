const express=require('express');
const mongoose = require('mongoose');

require('../Models/image');
const Image=mongoose.model('images');

function postagemImage(allImage,postagem){

    let data='';
    allImage.forEach(el => {
        if(`${el.postagem}`===`${postagem}`){
            data=el.imageName;
        }
        //console.log(el.imageName)
    });
    
    //console.log(data)

    return data;
}

async function allImagePost(){

    const image=await Image.find().then((image)=>{
        return image;
    }).catch(async(error)=>{
        console.log(error);
    })

    //console.log(await image)

    return await image;
}

module.exports={postagemImage,allImagePost}