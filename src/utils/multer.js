import path from "path";
import multer from "multer";
import __dirname from "./utils.js";
import { fs } from "file-system";

const uploader = (folderName) => {
    return multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const userId = req.params.uid;
            const destinationPath = path.join(__dirname, `public/uploads/${folderName}/${userId}`);

            if (!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath, { recursive: true });
              }
        
              cb(null, destinationPath);
        },
        filename: function (req, file, cb) {
          console.log("🚀 ~ file: upload-img.js:12 ~ file", file);
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
      onError: function (err, next) {
        console.log("🚀 ~ file: upload-img.js:17 ~ err ERROR AQUI", err);
        next();
      },
    })
  }
  
  export default uploader;