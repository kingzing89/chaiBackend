import {v2 as Cloudinary} from "cloudinary"
import fs from "fs"


    // Configuration
    Cloudinary.config({ 
        cloud_name: process.env.cloud_name, 
        api_key: process.env.api_key, 
        api_secret: process.env.api_secret 
    });


     const uploadFileOnCloudinary = async (localFilePath) =>{
        try {
            if(!localFilePath) return null;

                const uploadResult = await Cloudinary.uploader
                  .upload(localFilePath, {
                    resource_type:"auto",
                  })
                  .catch((error) => {
                    console.log(error);
                  });

                // console.log('file upload result',uploadResult);

                fs.unlinkSync(localFilePath);

                return uploadResult;
                
        } catch (error) {
            fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed.
            console.error("WE HAVE GOT THIS ERROR ON UPLOADING IMAGE THROUGH CLOUDINARY",error);
        }
     }


     // Upload an image

     export {uploadFileOnCloudinary};
    