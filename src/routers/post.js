const express=require('express');
const mongoose = require('mongoose');

const formidable=require('formidable');
const fs=require('fs');
const path=require('path');

//Variables
const router=express.Router();
//Models
require('../../Models/postagen');
const Postagen=mongoose.model('postagens');

require('../../Models/image');
const Image=mongoose.model('images');

require('../../Models/gosto');
const Like=mongoose.model('gostos');

require('../../Models/usuario');
const Usuario=mongoose.model('usuarios');

const endpoint=`http://localhost:3000`;

const endpointImage=`http://localhost:8081/image/`;

let eLike=require('../../helpers/eLike');
let eImage=require('../../helpers/eImage');

// GET

router.get('/',async(req,res)=>{

    let novaPostagen=[];

    const post=await Postagen.find().sort({_id:'desc'}).then((postagen)=>{
        return postagen;
    }).catch(error=>{
        console.log(error);
    })
            
    if(post){
        
        post.forEach(el=>{
            novaPostagen.push({
                '_id':el._id,
                'conteudo':el.conteudo,
                'usuario':el.usuario,
                //'usuarioLike':usuarioCurrentLike(el._id,''),
                'like':(eLike.postagemLike(el._id)==true?true:false)
            })
        })

    }

    res.json(novaPostagen);
    
});

router.get('/like/:usuario',async(req,res)=>{

    let novaPostagen=[];
    let usuario=req.params.usuario;

    const post=await Postagen.find().sort({_id:'desc'}).then((postagen)=>{
        return postagen;
    }).catch(error=>{
        console.log(error);
    })

    const alllike=await eLike.allLike();
    const allImage=await eImage.allImagePost();
            
    if(post){
        
        post.forEach(el=>{

            //console.log(el._id+'-'+usuario)

            let usuarioLike=eLike.usuarioCurrentLike(alllike,el._id,usuario);
            let like=eLike.postagemLike(alllike,el._id);
            
            let imageName=eImage.postagemImage(allImage,el._id);
            let srcImage=imageName!=''?`${endpointImage}${imageName}`:'';

            novaPostagen.push({
                '_id':el._id,
                'conteudo':el.conteudo,
                'usuario':el.usuario,
                'usuarioLike':usuarioLike,
                'like':like,
                'image':srcImage
            })

            //console.log(`usuarioLike ${usuarioLike} e like ${like}`);
        })

    }

    res.json(novaPostagen);
    
});

router.get('/share/:usuario',async(req,res)=>{

    let novaPostagen=[];
    let usuario=req.params.usuario;

    const post=await Postagen.find({usuario:usuario}).sort({_id:'desc'}).then((postagen)=>{
        return postagen;
    }).catch(error=>{
        console.log(error);
    })

    const alllike=await eLike.allLike();
    const allImage=await eImage.allImagePost();
            
    if(post){
        
        post.forEach(el=>{
            let usuarioLike=eLike.usuarioCurrentLike(alllike,el._id,usuario);
            let like=eLike.postagemLike(alllike,el._id);
            
            let imageName=eImage.postagemImage(allImage,el._id);
            let srcImage=imageName!=''?`${endpointImage}${imageName}`:'';

            novaPostagen.push({
                '_id':el._id,
                'conteudo':el.conteudo,
                'usuario':el.usuario,
                'usuarioLike':usuarioLike,
                'like':like,
                'image':srcImage
            })

            //console.log(srcImage)
        })

    }

    res.json(novaPostagen);
    
});


/*
router.get('/',async(req,res)=>{

    await Postagen.find().sort({_id:'desc'}).then(async(postagen)=>{
        
        if(await postagen){

            const like=await Like.find().then(async(res_like)=>{
                return await res_like;
                }).catch(async(error)=>{
                    let novaPostagen=[{error_like:await error}];
                    res.json(novaPostagen);
            })

            let novaPostagen=[];

            if(like){
                //Existem algum like adicionado
                
                await postagen.forEach(async(el)=>{

                    let _id=el._id;
                    let conteudo=el.conteudo;

                    //novaPostagen=like
                    let v="";v.e
                    await like.forEach(async(el_like)=>{

                            if((el._id+'')==(el_like.postagem+'')){
                                
                                novaPostagen.push({
                                    '_id': _id,
                                    'conteudo':conteudo,
                                    'usuario':el.usuario,
                                    'usuarioLike':((''+el_like.usuario)==(''+el.usuario))?true:false,
                                    'like':true
                                })
                                
                            }
                            else{
                                
                                novaPostagen.push({
                                    '_id': _id,
                                    'conteudo':conteudo,
                                    'usuario':el.usuario,
                                    'usuarioLike':false,
                                    'like':false
                                })
                                
                            }
                        
                    })
                })
            }
            else{
                // Nao existem nehum like adiconado
                novaPostagen.push({
                    '_id':postagen[0]._id,
                    'conteudo':postagen[0].conteudo,
                    'usuario':postagen[0].usuario,
                    'usuarioLike':false,
                    'like':false
                })
            }
            
            //let novaPostagen=[like];
            res.json(novaPostagen);
            
        }
        else{
            let novaPostagen=[{text:'Nao a postagem regitrada'}];
            res.json(novaPostagen);
        }
    }).catch(async(error)=>{
        let novaPostagen=[{'ERROR':await error}];
        res.json(novaPostagen);
    })

});
*/

router.get('/:id',async(req,res)=>{

    let novaPostagen=[];
    const query={_id:req.params.id}

    const post=await Postagen.findOne(query).then((postagen)=>{
        return postagen;
    }).catch(error=>{
        console.log(error);
    })

    const allImage=await eImage.allImagePost();
            
    if(post){
        
        let imageName=eImage.postagemImage(allImage,post._id);
        let srcImage=imageName!=''?`${endpointImage}${imageName}`:'';

            novaPostagen={
                '_id':post._id,
                'conteudo':post.conteudo,
                'usuario':post.usuario,
                'image':srcImage
            }
    }

    res.json(novaPostagen);

});

//POST

router.post('/add',async(req,res,next)=>{

    const form=new formidable.IncomingForm();
    form.parse(req,async(err,fields,files)=>{
        
        if(fields.conteudo[0]=='' && fields.fileType[0]==''){
            res.redirect(`${endpoint}/compartilhar/nova/?ref=cfempty`)
        }
        else{
        
            const post=await require('../../Controllers/postagemController').addPost(fields.conteudo[0],fields.usuario[0]);
            
            if(post){

                if(fields.fileType[0]!=''){
                    const img=await require('../../Controllers/imageController').addImg(fields.fileType[0],post[0]._id);
                    
                    if(img){
        
                        let oldPath=files.filetoupload[0].filepath;
                        let newPath=path.join(process.cwd(),'src/upload')+'/'+img[0].imageName;
        
                        let rawData=fs.readFileSync(oldPath);
        
                        fs.writeFileSync(newPath,rawData,function(err){
                            if(err) console.log(err);
                
                            console.log('Success')
                        })
        
                        res.redirect(`${endpoint}/compartilhar`)
                    }
                }
                else{
                    res.redirect(`${endpoint}/compartilhar`)
                }
            }else{//ERROR
                res.redirect(`${endpoint}/compartilhar/nova/?ref=error`)
            }
        }
        
    })
    
});

router.post('/add/image',(req,res)=>{

    let novaImage=[{
        imageName:req.body.imageName,
        postagem:req.body.postagem
    }];

    //Image
    Image.insertMany(novaImage)
    .then((imagem)=>{

        if(imagem){

            let smsPost={
                texto:'Image registada com sucesso',
                imagem:imagem,
                tipo:1
            };

            res.json(smsPost);
            

        }else{
            // Tenho quem remover image aqui mais tarde
            let smsPost={
                texto:'Houve um erro ao inserir image, porfavor tente novamente',
                tipo:0
            };

            res.json(smsPost);
        }

    }).catch(error=>{
        //console.log('ERROR: '+error);
        let smsPost={
            texto:'Houve um erro interno',
            errorImage:error,
            tipo:-1
        };
        res.json(smsPost)
    })
    
});

router.post('/edit',async(req,res,next)=>{

    const form=new formidable.IncomingForm();
    form.parse(req,async(err,fields,files)=>{
        
        if(fields.conteudo[0]=='' && fields.fileType[0]==''){
            res.redirect(`${endpoint}/compartilhar/edit/editar?id=${fields.id[0]}&ref=cfempty`)
        }
        else{
        
            const post=await require('../../Controllers/postagemController').updatePost(fields.id[0],fields.conteudo[0]);
            
            if(post){
                
                if(fields.fileType[0]!='' && fields.fileType[0]!='0'){

                    let dt=new Date();
                    const nameDT=(dt.getDay()+''+dt.getMonth()+''+dt.getFullYear()+''+dt.getHours()+''+dt.getMinutes()+''+dt.getSeconds()+''+dt.getMilliseconds())+fields.fileType[0];

                    const img=await require('../../Controllers/imageController').updateImg(nameDT,fields.id[0]);
                    
                    if(img){
                        
                        let oldPath=files.filetoupload[0].filepath;
                        let newPath=path.join(process.cwd(),'src/upload')+'/'+nameDT;
                        
                        let rawData=fs.readFileSync(oldPath);
        
                        fs.writeFileSync(newPath,rawData,function(err){
                            if(err) console.log(err);
                
                            console.log('Success')
                        })
                        
                        res.redirect(`${endpoint}/compartilhar`)
                    }
                }
                else{
                    res.redirect(`${endpoint}/compartilhar`)
                }

            }else{//ERROR
                res.redirect(`${endpoint}/compartilhar/nova/?ref=error`)
            }
        }
        
    })
    
});

/*
router.post('/edit',(req,res)=>{

    let novaPostagen={
        conteudo:req.body.conteudo,
        //usuario:1
    };

    const query={_id:req.body.id};
    
    Postagen.findOneAndUpdate(query,novaPostagen,{upsert:true}).then((postagem)=>{
        res.json(postagem);
        //console.log(postagem)
    }).catch(error=>{
        //console.log('ERROR: '+error);
        novaPostagen=[];
        res.json(novaPostagen);
    })
    
});
*/

router.get('/remove/:id',(req,res)=>{

    const query={_id:req.params.id};
    
    Postagen.findOneAndDelete(query,{upsert:true}).then(()=>{
        res.json([{id:query._id}]);
        //console.log(postagem)
    }).catch(error=>{
        console.log('ERROR: '+error);
        novaPostagen=[];
        res.json(novaPostagen);
    })
    
});


module.exports=router;

