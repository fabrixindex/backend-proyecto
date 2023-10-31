import path from "path";
import multer from "multer";
import __dirname from "./utils.js";
import { fs } from "file-system";

const uploaderProductsFiles = (folderName) => {
    return multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const productId = req.params.pid;
            const destinationPath = path.join(__dirname, `public/uploads/${folderName}/${productId}`);

            if (!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath, { recursive: true });
              }
        
              cb(null, destinationPath);
        },
        filename: function (req, file, cb) {
          console.log("🚀 ~ file: upload-img.js:12 ~ file", file);
          const currentDate = new Date(Date.now()).toISOString().split('T')[0];
          cb(null, `${currentDate}-${file.originalname}`);
        },
      }),
      onError: function (err, next) {
        console.log("🚀 ~ file: upload-img.js:17 ~ err ERROR AQUI", err);
        next();
      },
    })
  }
  
  export default uploaderProductsFiles;