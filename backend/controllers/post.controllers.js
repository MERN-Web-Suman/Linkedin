
import Post from "../models/post.model.js"
import uploadOnCloudinary from "../config/cloudinary.js"
import { io } from "../index.js";
import Notification from "../models/notification.models.js";

export const createPost = async (req,res)=>{
    try {
        let {description} = req.body
        let newPost;   // globaly newPost variable

        if(req.file){
            let image = await uploadOnCloudinary(req.file.path)
                newPost = await Post.create({
                author:req.userId,
                description,
                image
            })
        } else{
            newPost = await Post.create({
                author:req.userId,
                description
            })
        }

        return res.status(201).json(newPost)

    } catch (error) {
         return res.status(201).json(`create post error ${error}`)
    }
}

// all post axcess

export const getPost = async(req,res)=>{
    try {
        const post = await Post.find()
        .populate("author","firstName lastName profileImage headline userName ")
        .populate("comment.user","firstName lastName profileImage headline  ")
        .sort({createdAt:-1})
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({message:"getPost error"})
    }
};

// likes 

export const like = async (req,res) => {
    try {
         let postId = req.params.id
         let userId = req.userId
         let post = await Post.findById(postId)

         if(!post){
            return res.status(400).json({message:"post not found"})
         }
         if(post.like.includes(userId)){
          post.like = post.like.filter((id)=>id!=userId)
         } else{
            post.like.push(userId)
            let notification = await Notification.create({
                receiver:post.author,
                type:"like",
                relatedUser:userId,
                relatedPost:postId
            })
         }

         await post.save()

         io.emit("likeUpdated",{postId,likes:post.like})
          
         

         return res.status(200).json(post)

    } catch (error) {
        console.log(error)
    }
};


   // comments

   export const comment = async (req,res)=>{
    try {
        let postId = req.params.id
        let userId = req.userId
        let {content} = req.body

        let post = await Post.findByIdAndUpdate(postId,{
            $push:{comment:{content,user:userId}}
        },{new:true})
        .populate("comment.user","firstName lastName profileImage headline")

         let notification = await Notification.create({
                receiver:post.author,
                type:"comment",
                relatedUser:userId,
                relatedPost:postId
            })

        io.emit("commentAdded",{postId,comm:post.comment})

        return res.status(200).json(post)
        
    } catch (error) {
        console.log(error);
    }
   };