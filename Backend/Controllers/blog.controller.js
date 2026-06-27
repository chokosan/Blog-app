import Blog from '../models/blog.model.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads');

export const allblogs =async(req,res)=>{
    try {
        const blogs = await Blog.find({}).sort({createdAt: -1})
          return res.status(200).json({blogs,success:true,message:"all blogs"})
    } catch (error) {
  console.error("ALL BLOGS ERROR:", error);
  return res.status(500).json({
    message: "internal server error",
    error: error.message
  });
}}

export const createBlog = async (req, res) => {
    try {
        const { title, category, description } = req.body;


        if (!req.file) {
            return res.status(400).json({ message: "Image is required", success: false });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        const blog = await Blog.create({
            title,
            category,
            description,
            image: {
                public_id: req.file.filename,
                url: imageUrl,
            },
            author: {
                id: req.user.id,
                name: req.user.name,
                image: req.user.image.url
            }
        });


        return res.status(201).json({
            message: 'Blog created successfully',
            success: true,
            blog
        });

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

export const deleteBlog = async(req,res)=>{
    try {
        const blog = await Blog.findById(req.params.id)
        if(!blog){
            return res.status(404).json({message :'blog not found',success:false})
        }
        if(blog.author.id.toString() !== req.user.id.toString()){
            return res.status(403).json({message :'not authorized to delete this blog '})
        }

        if (blog.image?.public_id) {
            const filePath = path.join(uploadDir, blog.image.public_id);
            fs.unlink(filePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error('Failed to delete image file:', err.message);
                }
            });
        }

        await blog.deleteOne()
        return res.status(200).json({message :'blog deleted successfully', success: true})
    } catch (error) {
        return res.status(500).json({message: error.message, success: false})
    }
}

export const singleblog = async(req,res)=>{
    try {
    const singleblog = await Blog.findById(req.params.id)

    res.status(200).json({message : 'blog found' ,success : true  ,singleblog})
} catch (error) {
    return res.status(500).json({message :'internal server error',success:false})
}
}

export const userblogs = async(req,res)=>{
    try {

        const blogs = await Blog.find({'author.id': req.user.id}).sort({createdAt : -1})
        res.status(200).json(blogs)
    } catch (error) {
         return res.status(500).json({message :'internal server error', success:false})
    }
}