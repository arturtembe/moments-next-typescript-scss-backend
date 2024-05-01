
const express=require('express');
const mongoose = require('mongoose');

//Variables
const router=express.Router();
//Models
require('../../Models/comentario');
const Comentario=mongoose.model('comentarios');

//POST
router.post('/add',(req,res)=>{

    let novoComentario=[{
        comentario:req.body.comentario,
        postagem:req.body.postagem,
        usuario:req.body.usuario
    }];

    
    Comentario.insertMany(novoComentario).then((comentario)=>{
        
        novoComentario=[{
            texto:'Sucesso',
            comentario:comentario,
            tipo:1
        }];

        res.json(novoComentario);

    }).catch(error=>{
        //console.log('ERROR: '+error);
        novoComentario=[{texto:'Houve um erro interno',
            error:error,
            tipo:0
        }];
        res.json(novoComentario);
    })
    
});

//GET
router.get('/view/:postagem',(req,res)=>{

    let query={postagem:req.params.postagem}
    
    Comentario.find(query).sort({_id:'desc'}).then((comentario)=>{
        
        res.json(comentario);

    }).catch(error=>{
        //console.log('ERROR: '+error);
        novoComentario=[{texto:'Houve um erro interno',
            error:error,
            tipo:0
        }];
        res.json(novoComentario);
    })
    
});


module.exports=router;