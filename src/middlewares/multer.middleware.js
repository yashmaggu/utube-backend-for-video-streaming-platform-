//we are prefering disk storage over memory storage as sometimes memory storage 
// can get filled as our files can be of bigger sizes

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../../public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
 export const upload = multer({ storage: storage })