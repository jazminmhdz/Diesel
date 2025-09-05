const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname,'../../uploads')),
  filename: (req,file,cb)=> cb(null, Date.now()+'-'+file.originalname.replace(/\s+/g,''))
});
const fileFilter = (req,file,cb)=>{
  if(!['image/jpeg','image/png','image/jpg'].includes(file.mimetype)) return cb(new Error('Formato inválido'), false);
  cb(null, true);
};
module.exports = multer({ storage, fileFilter, limits:{ fileSize: 3*1024*1024 } }); // 3MB
