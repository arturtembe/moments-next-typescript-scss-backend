
const express=require('express');
const mongoose = require('mongoose');

//Variables
const router=express.Router();
//Models
require('../../Models/gosto');
const Like=mongoose.model('gostos');

//GET
router.get('/view/:postagem/:usuario',async(req,res)=>{

    const query={postagem:req.params.postagem,
    usuario:req.params.usuario}

    Like.findOne(query).then(like=>{
        
        let msg={tipo:0}
        if(like){
            msg={tipo:1,like:like}
        }
        res.json(msg)
                
    }).catch(error=>{
        //console.log('ERROR: '+error);
        const msg=[{
                texto:'Houve um erro interno',
                token:'',
                tipo:0
            }];
            res.json(msg);
        });
    
    //res.render('usuario/registro');

});

router.get('/usuario/:usuario',async(req,res)=>{

    const query={usuario:req.params.usuario}

    Like.find(query).then(like=>{
        
        res.json(like)
                
    }).catch(error=>{
        console.log('ERROR: '+error);
        const msg=[{
                texto:'Houve um erro interno',
                error:error,
                tipo:0
            }];
            res.json(msg);
        });
    
    //res.render('usuario/registro');

});

router.get('/view/:postagem',async(req,res)=>{

    const query={postagem:req.params.postagem}
    Like.findOne(query).then(like=>{
        
        let msg={tipo:0}
        if(like){
            msg={tipo:1,like:like}
        }
        res.json(msg)
                
    }).catch(error=>{
        //console.log('ERROR: '+error);
        const msg=[{
                texto:'Houve um erro interno',
                token:'',
                tipo:0
            }];
            res.json(msg);
        });
    
    //res.render('usuario/registro');

});

//Post
router.post('/add',(req,res)=>{

    let novaLike=[{
        postagem:req.body.postagem,
        usuario:req.body.usuario
    }];

    //console.log(req.body.conteudo)
    
    
    Like.insertMany(novaLike).then((like)=>{
        
        novaLike=[{
            texto:'Sucesso',
            like:like,
            tipo:1
        }];

        res.json(novaLike);

    }).catch(error=>{
        //console.log('ERROR: '+error);
        novaPostagen=[{texto:'Houve um erro interno',
            error:error,
            tipo:0
        }];
        res.json(novaPostagen);
    })
    
});

router.get('/delete/:postagem/:usuario',async(req,res)=>{

    const query={postagem:req.params.postagem,
    usuario:req.params.usuario}

    Like.findOneAndDelete(query).then(like=>{
        
        let msg={tipo:0}
        if(like){
            msg={texto:'Removido',tipo:1}
        }
        res.json(msg)
                
    }).catch(error=>{
        //console.log('ERROR: '+error);
        const msg=[{
                texto:'Houve um erro interno',
                token:'',
                tipo:0
            }];
            res.json(msg);
        });
    
    //res.render('usuario/registro');

});

module.exports=router;