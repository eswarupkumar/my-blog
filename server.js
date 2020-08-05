const express =require('express')
const app=express();
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
// const router =express.Router()
const article=require ('./schema') 
const path=require('path')

app.use(express.static(path.join(__dirname,'/build')));

const url='mongodb://localhost/swarup'

mongoose.connect(url,{useNewUrlParser:true})
const con =mongoose.connection
// const db=con.db('my-blog')

con.on('open',function(){
    console.log("DB Connected....")
})

// app.use(bodyParser.json());
app.use(express.json());
// const ArticleInfo=
// {
//     'learn-react' : {
//         upvotes: 0,
//         comments: [],
//     },
//     'learn-node':{
//         upvotes: 0,
//         comments: [],
//     },
//     'my-thoughts-on-resumes':{
//         upvotes: 0,
//         comments: [],
//     },
// };

app.get('/',(req,res)=>res.send("Hello"))
app.get('/hello/:name',(req,res)=>res.send(`Hello ${req.params.name}`))

app.post('/api/articles/:name/add-comment',async(req,res)=>{
    const {username,text}=req.body;
    const articleName=req.params.name;

    // ArticleInfo[articleName].comments.push({username,text});
    // res.status(200).send(ArticleInfo[articleName])
    const articleInfo=await article.findOne({name:articleName});
    await article.updateOne({name:articleName,
        '$set':{
            comments:articleInfo.comments.concat({username,text}),
        },
    });
    const updateArticleInfo=await article.findOne({name:articleName});
    res.status(200).json(updateArticleInfo);
    
    // con.close()
})

app.post('/post',async(req,res)=>{
    const tuple=new article({
        name:req.body.name,
        upvote:req.body.upvote,
        comments:req.body.comments
    })

    try{
        const t1=await tuple.save()
        res.json(t1)
    }catch{
        res.send("error")
    }
})
app.get('/api/articles/:name',async(req,res)=>{
    try{
        const articleName=req.params.name
        const aliens = await article.findOne({name:articleName})
        res.json(aliens)
    }catch(err){
        throw err;
    }
})
app.post('/api/articles/:name/upvote',async(req,res)=>{
    const articleName=req.params.name;
    // ArticleInfo[articleName].upvotes+=1;
    // res.status(200).send(`${articleName} has ${ArticleInfo[articleName].upvotes} upvotes`)
    const articleInfo=await article.findOne({name:articleName});
    await article.updateOne({name:articleName,
        '$set':{
            upvote:articleInfo.upvote+1
        }
    });
    const updateArticleInfo=await article.findOne({name:articleName});
    res.status(200).json(updateArticleInfo);
    
    // con.close()
})
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname+'/build/index.html'))
})  

app.listen(8000,function () {
    console.log("Running...")
})