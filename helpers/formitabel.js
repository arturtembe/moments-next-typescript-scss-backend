const { error } = require('console');
const formidable=require('formidable')
const fs=require('fs');
const client=require('https');

function dd(){
    /*
            fs.readFile(newPP01,(error,data)=>{
                if(error){res.json({
                        texto:error,
                        data:data,
                        //outArquivo:outArquivo,
                        tipo:0
                    }); 
                    return;
                }
                console.log(data);

                fs.writeFile(outArquivo,data,(err1)=>{
                    if(err1){
                        res.json({
                            texto:err1,
                            tipo:0
                        }); 
                        return;
                    }

                    let smsPost={
                        texto:'Movido com sucesso',
                        tipo:1
                    };

                    res.json(smsPost);
                })

            });
            */
}

const uploadArquivo=function(url,filepath){    

    return new Promise((resolve,reject)=>{

        client.get(url,(res)=>{

            if(res.statusCode===200){
                res.pipe(fs.createWriteStream(filepath))
                .on('error',reject)
                .once('close',()=>resolve(filepath));
            }
            else{
                //Consume Response data to free up memory
                res.resume();
                reject(new error(`Request Failed with a status code: ${res.statusCode}`));
            }

        })

    })

}

module.exports=uploadArquivo;