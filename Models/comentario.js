
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const Image=new Schema({
    comentario:{
        type:String,
        required:true
    },
    postagem:{
        type:Schema.Types.ObjectId,
        ref:"postagens",
        required:true
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:"usuarios",
        required:true
    },
    data:{
        type:Date,
        default:Date.now()
    }
});

mongoose.model('comentarios',Image);