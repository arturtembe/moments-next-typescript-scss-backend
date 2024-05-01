
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const Postagen=new Schema({
    conteudo:{
        type:String,
        default:''
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

mongoose.model('postagens',Postagen);