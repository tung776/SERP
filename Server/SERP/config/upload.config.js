import multer from "multer";

export default function(dirname){
  return multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './public/uploads/' + dirname + "/");
    },
    filename: function (req, file, cb) {
          let extent = file["originalname"].slice(file["originalname"].length-4, file["originalname"].length);
       
          cb(null, file.fieldname + '-' + Date.now() + extent)
    }
  })
}