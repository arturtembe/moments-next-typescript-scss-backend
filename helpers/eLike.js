const express=require('express');
const mongoose = require('mongoose');

require('../Models/gosto');
const Like=mongoose.model('gostos');

function usuarioCurrentLike(allLike,postagem,usuario){

    let data=false;
    allLike.forEach(el => {
        if(`${el.postagem}`===`${postagem}` 
        && `${el.usuario}`===`${usuario}`){
            data=true;
        }
    });

    return data;
}

function postagemLike(allLike,postagem){

    let data=false;
    allLike.forEach(el => {
        if(`${el.postagem}`===`${postagem}`){
            data=true;
        }
    });

    return data;
}

async function allLike(){

    const like=await Like.find().then(async(like)=>{
        return like;
    }).catch(async(error)=>{
        console.log(error);
    })

    return await like;
}

module.exports={usuarioCurrentLike,postagemLike,allLike}