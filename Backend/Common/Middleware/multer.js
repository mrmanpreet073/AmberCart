import multer from "multer"

const storage = multer.memoryStorage();
// Single 
export const singleUpload = multer({storage}).single("file")

// Multiple upload upto 5 images 
export const multiUpload = multer({storage}).array("files",5)

//for disk storage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// })   

