
const express=require('express');
const fs=require('fs');
const formidable=require('formidable')
const path=require('path');

//const multer=require('mu')

//Variables
const router=express.Router();

router.get('/:image',(req,res)=>{
    const img=req.params.image;
    if(img!=''){
        let src=process.cwd()+'/src/upload/'+img;

        fs.access(src,error=>{
            if(!error){
                res.sendFile(src);
            }
            else{
                res.send('Not Found!');        
            }
        });

    }else{
        res.send('Not Found!');
    }
})

router.post('/add',(req,res)=>{

    //console.log(req.body)
    //let pp=URL.createObjectURL(req.body.filetoupload)
    //req.flash('success_msg',req.body);
    //res.send(req.body)

    //res.redirect('/image');
    
    //if(req.body.filetoupload!=undefined || req.body.filetoupload!=null){

        const form=new formidable.IncomingForm();
        form.parse(req,(err,fields,files)=>{
            
            let oldPath=files.filetoupload[0].filepath;
            let newPath=path.join(process.cwd(),'src/upload')+'/'+files.filetoupload[0].originalFilename;

            let rawData=fs.readFileSync(oldPath);
                
                
            fs.writeFileSync(newPath,rawData,function(err){
                if(err) console.log(err);
                
                    return res.send('SucessFully upload')
                })

                req.flash('success_msg','SucessFully upload');
                res.redirect('/image')
        })

    // }else{
    //     req.flash('error_msg','ERROR');
    //     res.redirect('/image')
    // }
})

router.post('/add/upload',(req,res)=>{

    //console.log(req.body)
    //let pp=URL.createObjectURL(req.body.filetoupload)
    //req.flash('success_msg',req.body);
    //res.send(req.body)

        const form=new formidable.IncomingForm();
        form.parse(req,(err,fields,files)=>{
            
            let oldPath=files.filetoupload[0].filepath;
            let newPath=path.join(process.cwd(),'src/upload')+'/'+files.filetoupload[0].originalFilename;

            let rawData=fs.readFileSync(oldPath);
                
                
            fs.writeFileSync(newPath,rawData,function(err){
                if(err) console.log(err);
                
                    return res.send('SucessFully upload')
                })

                //req.flash('success_msg','SucessFully upload');
                res.redirect('http://localhost:3000/compartilhar/nova')
        })

})

// GET
router.get('/',(req,res)=>{

    res.render('postagem/addPostagem');
    //res.send(req.body);

})


module.exports=router;