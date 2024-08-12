import multer from "multer"
import path from "path";

const MIME_TYPES = {
    "image/jpg":"jpg",
    "image/jpeg":"jpg",
    "image/png":"png",
    'application/pdf':"pdf"
}
const storage = multer.diskStorage({
    destination: (req, file ,callback): void => {
        callback(null, path.join(__dirname, "..", "files"))
    },
    filename: (req, file, callback) =>{
        const name = file.originalname.split(' ').join('_')
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.' + extension)
    }
})

const upload = multer({storage}).single("file")

export default upload