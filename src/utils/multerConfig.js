
//********* Multer Configuration *************
//this function will set up
const mongoose = require("mongoose");
const multer = require("multer");
const storage = multer.diskStorage({
    //configure the path of the destination of the upload images
    destination: function (req, file, cb) {
        cb(null, "./src/uploads/");
    },
    filename: function (req, file, cb) {
        //configure the name of the images
        var extension = "";
        if (file.mimetype === 'image/jpeg') {
            extension = file.mimetype.slice(file.mimetype.length - 4, file.mimetype.length);
        } else {
            extension = file.mimetype.slice(file.mimetype.length - 3, file.mimetype.length);
        }
        let name = mongoose.Types.ObjectId();
        console.log(name + "." + extension);
        cb(null, name + "." + extension);
    }
})
const fileFilter = (req, file, cb) => {
    // Accept only the images with the extention jpeg or png
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('the file extension is not valide'), false);
    }

};

//
exports.upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 10
    }, fileFilter: fileFilter
});