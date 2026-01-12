
import TryCatch from "../middlewares/trycatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/lecture.js";
import {rm} from 'fs'
import {promisify} from 'util'
import fs from 'fs'
import { User } from "../models/usermodel.js";




export const createCourse=TryCatch(async(req,res)=>{
    const {title,description,category,createdby,price,duration}=req.body

    const image=req.file

    await Courses.create({
        title,
        description,
        category,
        createdby,
        image:image?.path,
        duration,
        price,
    })
    res.status(201).json({
        message:"course created successfully"
    })
})

export const addLectures=TryCatch(async(req,res)=>{
    const course= await Courses.findById(req.params.id)

    if(!course) return res.status(404).json({
        message:"no course found with this id"
    })
    const {title,description}=req.body

    const file=req.file

    const lecture= await Lecture.create({
        title,
        description,
        video:file?.path,
        course:course._id
    })
    res.status(201).json({
        message:"lecture added",
        lecture
    })

})
export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  rm(lecture.video, () => {
    console.log("video deleted");
  });
  await lecture.deleteOne();
  res.json({
    message: "lecture deleted",
  });
});


const unlinkasync=promisify(fs.unlink)
export const deleteCourse=TryCatch(async(req,res)=>{
    const course=await Courses.findById(req.params.id)
    const lectures=await Lecture.find({course:course._id})

    await Promise.all(
        lectures.map(async(lecture)=>{
            await unlinkasync(lecture.video)
            console.log("video deleted")

        })
    )
    rm(course.image,()=>{
        console.log("image deleted")
    })
    await Lecture.find({course:req.params.id}).deleteMany()

    await course.deleteOne()

    await User.updateMany({},{$pull:{subscription:req.params.id}})
    res.json({
        message:"course deleted"
    })
})
export const getallstats = TryCatch(async (req, res) => {
  const totalcourses = (await Courses.find()).length;
  const totallectures = (await Lecture.find()).length;
  const totalusers = (await User.find()).length;

  const stats = {
    totalcourses,
    totallectures,
    totalusers,
  };
  res.json({
    stats,
  });
});


export const getallusers=TryCatch(async(req,res)=>{
    const users=await User.find({_id:{$ne:req.user._id}}).select("-password")
    res.json({users})

})

export const updaterole=TryCatch(async(req,res)=>{
    const user=await User.findById(req.params.id)
    if(user.role==="user"){
        user.role="admin"
        await user.save()

        return res.status(200).json({
            message:"Role updated to admin"
        })
    }
    if (user.role === "admin") {
        user.role = "user";
        await user.save();

        return res.status(200).json({
        message: "Role updated ",
        });
    }

})