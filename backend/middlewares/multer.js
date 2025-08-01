
import multer from "multer";

// पहले storage को initialize करें
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// फिर storage का उपयोग करें
const upload = multer({ storage });

export default upload;
