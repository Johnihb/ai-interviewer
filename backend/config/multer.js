import multer from "multer";
import path from "path";

const __dirname = path.resolve()

const upload = multer({dest: path.join(__dirname +"/backend/uploads/")});

export default upload;