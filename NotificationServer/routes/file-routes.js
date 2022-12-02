const express = require('express');
const multer = require("multer");
const bodyParser = require('body-parser')
const router = express.Router();

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true}));

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, 'uploads/')
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

let upload = multer({ storage: storage }).single("videoFile")

router.post('/' ,async (req, res) => {
    upload(req, res, err => {
        console.log(req.file, req.body);
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true})
    });

});

module.exports = router;

