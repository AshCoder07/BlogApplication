const express=require('express');
const morgan=require('morgan');
const mongoose=require("mongoose")
const Blog=require("./models/blog")

const app=express();




app.set("view engine","ejs")

const dbURI="mongodb+srv://aswin07:aswin123@blogapplication.1ntohea.mongodb.net/blog-app?retryWrites=true&w=majority&appName=BlogApplication"
mongoose.connect(dbURI)
    .then((result)=>app.listen(3000))
    .catch((err)=>console.log(err))


app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))
app.use(morgan("dev"))



app.get("/",(req,res)=>{
    res.redirect("/blogs")
})

app.get("/about",(req,res)=>{
    res.render("about.ejs",{title:"About"})
})

app.get("/blogs/create",(req,res)=>{
    res.render("create.ejs",{title:"Create blog"})
})

app.get("/blogs",(req,res)=>{   
    Blog.find().sort({createdAt:-1})
    .then((result)=>{
        res.render("index.ejs",{title:"All Blogs",blogs:result})
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.post("/blogs",(req,res)=>{
    const blog=new Blog(req.body)
    blog.save()
    .then((result)=>{
        res.redirect("/blogs")
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.get("/blogs/:id",(req,res)=>{
    const id=req.params.id
    Blog.findById(id)
    .then((result)=>{
        res.render("details.ejs",{title:"Blog Details",blog:result})
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.delete("/blogs/:id",(req,res)=>{
    const id=req.params.id
    Blog.findByIdAndDelete(id)
    .then((result)=>{
        res.json({redirect:"/blogs"})
    })
    .catch((err)=>{
        console.log(err)
    })
})



app.use((req,res)=>{
    res.render("404.ejs",{title:"404 error"})
})