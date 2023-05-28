const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dephdgqpo",
  api_key: "226979763886815",
  api_secret: "UtSxAxFzkpjUHxKQAiXS3fANfyo",
  secure: true,
});

// console.log(cloudinary.config());

module.exports = cloudinary;
