import multer from "multer";
import path from "path";

const __dirname = path.resolve()

const upload = multer({dest: path.join(__dirname +"/backend/uploads/")});

// const pdfUpload = multer({
//   storage: multer.memoryStorage(),//keeps the file in memory instead of saving it to disk
//    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
//   fileFilter: (req, file, cb) => {
//     if(file.mimetype === "application/pdf"){
//       cb(null, true)
//     }else{
//       cb(new Error("Only PDF files are allowed"))
//     }
//   }
// })

// export {upload , pdfUpload};

export default upload