const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(bodyParser.json());

const upload_path = "./uploads/";

// define the storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, upload_path);
    },
    filename: (req, file, cb) => {
        const fileext = path.extname(file.originalname).toLowerCase();
        const filename =
            file.originalname
                .replace(fileext, "")
                .toLowerCase()
                .split(" ")
                .join("-") +
            "-" +
            Date.now();

        cb(null, filename + fileext);
    },
});

let upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000, // 1mb
    },
    fileFilter: (req, file, cb) => {
        console.log(file);
        if (file.fieldname === "Image") {
            if (
                file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg"
            ) {
                cb(null, true);
            } else {
                cb(Error("Only .jpg, .jpeg, .png format allow"));
                // cb(null, false);
            }
        } else if (file.fieldname === "Docs") {
            if (file.mimetype === "application/pdf") {
                cb(null, true);
            } else {
                cb(Error("Only .pdf format allow"));
                // cb(null, false);
            }
        }
    },
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Sinle File Upload
app.post("/uploadfile", upload.single("myFile"), (req, res) => {
    res.send("Hello Wrold");
});

// Multiple File Upload
app.post("/uploadmultiple", upload.array("myFiles", 3), (req, res) => {
    res.send("Hello Wrold");
});

// Multiple File Upload using Multiple Field
app.post(
    "/uploadphotoanddocs",
    upload.fields([
        { name: "Image", maxCount: 2 },
        { name: "Docs", maxCount: 3 },
    ]),
    (req, res) => {
        res.send("Hello Wrold");
    }
);

// Form data without File
app.post("/simpleformdata", upload.none(), (req, res) => {
    let name = req.body.name;
    res.send(name);
});

app.listen(3000);
