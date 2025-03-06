import mongoose, { mongo } from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

let Schema = mongoose.Schema;


const videoSchema = new Schema({


    videoFile:{
        type:String, // cloudinary string,
        required:true
    },

    thumbnail:{
        type:String, // cloudinary string,
        required:true
    },

    title:{
        type:String, // cloudinary string,
        required:true
    },

    
    description :{
        type:String, // cloudinary string,
        required:true
    },

    duration :{
        type:Number, // cloudinary string,
        required:true
    },

    views:{
        type:Number,
        default: 0,
    },

    isPublished:{
        type:Boolean,
        default:true
    },

    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'

    }
    

    

       



    

},{timestamps:true})


videoSchema.plugin(mongooseAggregatePaginate);


let videoModel = mongoose.model('Video',videoSchema);

module.exports =  videoModel;