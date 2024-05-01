
const express=require('express');
const mongoose = require('mongoose');

//Models
require('../Models/postagen');
const Postagen=mongoose.model('postagens');

async function addPost(conteudo,usuario){
    let novaPostagen=[{
        conteudo:conteudo,
        usuario:usuario
    }];

    return await Postagen.insertMany(novaPostagen).then(postagem=>{
        return postagem;
    }).catch(error=>{
        console.log(error);
    });

}

async function updatePost(id,conteudo){
    let novaPostagen={
        conteudo:conteudo
    };

    const query={_id:id};

    return await Postagen.findOneAndUpdate(query,novaPostagen,{upsert:true}).then(postagem=>{
        return postagem;
    }).catch(error=>{
        console.log(error);
    });

}

module.exports={addPost,updatePost};