
const express=require('express');
const mongoose = require('mongoose');
const bcryp=require('bcryptjs');
const passport=require('passport');
const jwt=require('jsonwebtoken');

//Variables
const router=express.Router();
//Models
require('../../Models/usuario');
const Usuario=mongoose.model('usuarios');

//GET
router.get('/view',async(req,res)=>{

    Usuario.find().then(usuario=>{
            
        res.json(usuario)
                
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
router.get('/view/:id',(req,res)=>{
    
    const query={_id:req.params.id};

    Usuario.findOne(query).then(usuario=>{
        let msg;
        if(!usuario){
            msg=[{
                texto:'Not found User! ',
                token:'',
                usuario:usuario,
                tipo:0
            }]
        }
        else{
            msg=[{
                texto:'Token confirmado com sucesso! ',
                usuario:usuario,
                tipo:1
            }]
        }

        res.json(msg);

    }).catch(error=>{
        const msg=[{
            texto:'Houve erro interno! ',
            token:'',
            query:decoded.userId,
            error:error,
            tipo:0
        }]
        res.json(msg);
    });

});

router.get('/token/:token',(req,res)=>{
    
    const query={token:req.params.token};

    const decoded=jwt.verify(query.token,'mykeyIDFORM')
    
    Usuario.findOne({_id:decoded.userId}).then(usuario=>{
        let msg;
        if(!usuario){
            msg=[{
                texto:'Not found User! ',
                token:'',
                id:decoded.userId,
                usuario:usuario,
                tipo:0
            }]
        }
        else{
            msg=[{
                texto:'Token confirmado com sucesso! ',
                usuario:usuario,
                tipo:1
            }]
        }

        res.json(msg);

    }).catch(error=>{
        const msg=[{
            texto:'Houve erro interno! ',
            token:'',
            query:decoded.userId,
            error:error,
            tipo:0
        }]
        res.json(msg);
    });

});

// POST

router.post('/registro',async(req,res)=>{
    
    const novoUsuario=[{
        nome:req.body.nome,
        sobrenome:req.body.sobrenome,
        email:req.body.email,
        senha:req.body.senha
        // ,eAdmin:1
    }];

        const query={email:req.body.email};

        Usuario.findOne(query).then(usuario=>{
            
                if(usuario){
                    //console.log('ERROR: ',error);
                    const msg=[{
                        texto:'Ja existe uma conta com este email no nosso sistema!',
                        token:'',
                        tipo:0
                    }]
                    res.json(msg);
                }
                else{

                    bcryp.genSalt(10,(erro,salt)=>{
                        bcryp.hash(novoUsuario[0].senha,salt,(erro,hash)=>{
                            if(erro){
                                //console.log('ERROR: ',erro);
                                const msg=[{
                                    texto:'Houve um erro durante o salvamento do usuario',
                                    tipo:0
                                }]
                                res.json(msg);
                            }
                
                            novoUsuario[0].senha=hash;
                            
                            Usuario.insertMany(novoUsuario).then((usuario)=>{
                                const msg=[{
                                    texto:'Usuario criada com sucesso!',
                                    token:jwt.sign({userId:usuario[0]._id},'mykeyIDFORM'),//jwt.sign({userId:usuario[0]._id},'mykeyIDFORM',{expiresIn:'1h'})
                                    tipo:1
                                }]
                                res.json(msg);
                            }).catch(error=>{
                                console.log('ERROR: '+error);
                                    const msg=[{
                                        texto:'Houve um erro ao criar usuario, tente novamente!',
                                        token:'',
                                        tipo:0
                                    }];
                                res.json(msg);
                            })

                        });
                    });

                }
                
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

router.post('/email',(req,res)=>{
    
    const query={email:req.body.email};

        Usuario.findOne(query).then(usuario=>{
            
            if(!usuario){
                res.send('Not found user');
            }
            else{
                res.json(usuario);
            }

        }).catch(error=>{
            res.send(error)
        });
})

router.post('/login',(req,res)=>{
    
    const logarUsuario={
        email:req.body.email,
        senha:req.body.senha
    };

    const query={email:req.body.email};

        Usuario.findOne(query).then(async(usuario)=>{
            //res.json(usuario)
            
            if(usuario){
                let msg
                const senha=usuario.senha;
                const pwdLogar=await bcryp.compare(req.body.senha,senha);
                
                if(!pwdLogar){
                    msg=[{
                        texto:'Senha incorrecta!',
                        token:'',
                        tipo:0
                    }]
                }
                else{
                    msg=[{
                        texto:'Logado com sucesso!',
                        token:jwt.sign({userId:usuario._id},'mykeyIDFORM'),//jwt.sign({userId:usuario._id},'mykeyIDFORM',{expiresIn:'1h'})
                        tipo:1
                    }]
                }

                res.json(msg);
            }
            else{
                const msg=[{
                    texto:'Nao existe uma conta com este email no nosso sistema!',
                    token:'',
                    tipo:0
                }]
                res.json(msg);
            }
            
        })
        .catch(error=>{
            const msg=[{
                texto:'Houve erro interno! ',
                token:'',
                error:error,
                email:logarUsuario.email,
                senha:logarUsuario.senha,
                tipo:0
            }]
            res.json(msg);
        });

});

router.post('/login/token',(req,res)=>{
    
    const query={token:req.body.token};

    const decoded=jwt.verify(query.token,'mykeyIDFORM')
    
    Usuario.findOne({_id:decoded.userId}).then(usuario=>{
        let msg;
        if(!usuario){
            msg=[{
                texto:'Not found User! ',
                token:'',
                id:decoded.userId,
                usuario:usuario,
                tipo:0
            }]
        }
        else{
            msg=[{
                texto:'Token confirmado com sucesso! ',
                usuario:usuario,
                tipo:1
            }]
        }

        res.json(msg);

    }).catch(error=>{
        const msg=[{
            texto:'Houve erro interno! ',
            token:'',
            query:decoded.userId,
            error:error,
            tipo:0
        }]
        res.json(msg);
    });

});


module.exports=router;