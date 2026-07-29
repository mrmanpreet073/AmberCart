import DatauriParser from "datauri/parser.js";
import path from "path";

// Create parser instance
const parser = new DatauriParser();

// Convert Multer file into Data URI
const getDataUri = (file) => {
console.log(file);

    // Get extension (.png, .jpg, etc.)
    const extName = path.extname(file.originalname);

    // Convert buffer to Base64 Data URI
    return parser.format(extName, file.buffer);
};

export default getDataUri;


// parser.format()

// Now the package converts

// .png
// +
// buffer
// Internally, it's doing something similar to this:

// const base64 = file.buffer.toString("base64");

// const dataUri = `data:image/png;base64,${base64}`;