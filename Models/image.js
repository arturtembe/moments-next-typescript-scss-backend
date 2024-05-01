
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const Image=new Schema({
    imageName:{
        type:String,
        required:true
    },
    postagem:{
        type:Schema.Types.ObjectId,
        ref:"postagens",
        required:true
    },
    data:{
        type:Date,
        default:Date.now()
    }
});

mongoose.model('images',Image);