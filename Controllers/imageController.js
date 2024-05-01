
const express=require('express');
const mongoose = require('mongoose');

const formidable=require('formidable');
const fs=require('fs');
const path=require('path');

//Models
require('../Models/image');
const Image=mongoose.model('images');

async function addImg(fileType,idPostagem){

    let dt=new Date();
    let name=dt.getDay()+''+dt.getMonth()+''+dt.getFullYear()+''+dt.getHours()+''+dt.getMinutes()+''+dt.getSeconds()+''+dt.getMilliseconds();

    let novaImage=[{
        imageName:name+fileType,
        postagem:idPostagem
    }];

    //Image
    return await Image.insertMany(novaImage).then((imagem)=>{
        return imagem;
    }).catch(error=>{
        console.log(error);
    });

}
async function updateImg(fileType,idPostagem){

    let novaImage={
        imageName:fileType,
    };

    const query={postagem:idPostagem}

    //Image
    return await Image.findOneAndUpdate(query,novaImage,{upsert:true}).then((imagem)=>{
        return imagem;
    }).catch(error=>{
        console.log(error);
    });

}

function uploadImg(req,res,pathName,endpoint){

    const form=new formidable.IncomingForm();

    form.parse(req,(err,fields,files)=>{
        
        console.log(fields)

        let oldPath=files.filetoupload[0].filepath;
        let newPath=path.join(process.cwd(),'src/upload')+'/'+pathName+fields.fileType;

        let rawData=fs.readFileSync(oldPath);

        /*
        fs.writeFileSync(newPath,rawData,function(err){
            if(err) console.log(err);

            console.log('Success')
        })
          */      
        res.redirect(endpoint)
    })
    
}

module.exports={addImg,updateImg,uploadImg};