
const jwt=require('jsonwebtoken');

module.exports={

    eAdmin:function(req,res,next){

        if(req.isAuthenticated() && req.user.eAdmin==1){
            return next();
        }

        req.flash("error_msg","Voce deve estar logado para entrar aqui!");
        res.redirect("/");

    },
    verifyToken:function(req,res,next){
        const token=req.header('Authorization');

        if(!token){
            return res.status(401).json({error:'Acesso denied'});
        }
        try{
            const decoded=jwt.verify(token,'mykeyIDFORM')
            req.userId=decoded.userId;
            //console.log(req.userId);
            next();
        }
        catch(error){
            res.status(401).json({error:'Error'});
        }

    }

}