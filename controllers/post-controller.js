const Posts = require("../models/post-model");
const cloudinary = require("../config/cloudinary-config");
const fs = require("fs");
const path = require("path");
const { v4 } = require("uuid");

module.exports = {
  GET_MODERATING_POSTS: async (req, res) => {
    try {
      const posts = await Posts.find({ isModerated: false });
      return res.status(200).json(posts);
    } catch (error) {
      return console.log(error.message);
    }
  },
  GET_ACTIVE_POSTS: async (req, res) => {
    try {
      const posts = await Posts.find({ isModerated: true });
      return res.status(200).json(posts);
    } catch (error) {
      return console.log(error.message);
    }
  },
  GET_DELETED_POSTS: async (req, res) => {
    try {
      const posts = await Posts.find({ isDeleted: true });
      return res.status(200).json(posts);
    } catch (error) {
      return console.log(error.message);
    }
  },
  ADD_POST: async (req, res) => {
    try {
      const {
        postDate,
        postTime,
        postDir,
        postInnerDir,
        postType,
        postLink,
        speakerName,
        speakerJob,
        speakerTelNum,
        speakerTelNum2,
        postTitle,
        postDesc,
        postText,
      } = req.body;

      const { name, size, mv } = req.files.postImg;

      if (+size / 1048576 > 2) {
        return res
          .status(400)
          .json("The size of the image must not be over 2mb");
      }

      const filename = v4() + path.extname(name);

      mv(path.resolve("assets/" + filename), (err) => {
        if (err)
          return res
            .status(400)
            .json("Something went wrong, while uploading a file");
      });

      //Uploading file to the cloudinary server:

      let result = null;

      const options = {
        folder: "pressa",
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      };

      try {
        result = await cloudinary.uploader.upload(
          "assets/" + filename,
          options
        );
        if (!result) {
          return res.status(500).json("Error. Check the connection");
        }
        // console.log(result);
        // return result.public_id;
      } catch (error) {
        console.error(error);
      }

      const postImgUrl = result.secure_url;

      //deleting the file from folder

      fs.unlink(path.resolve("assets/" + filename), function (err) {
        if (err) throw err;
        console.log("File deleted!");
      });

      const newPost = await Posts({
        postDate,
        postTime,
        postDir,
        postInnerDir,
        postType,
        postLink,
        postImgUrl,
        speakerName,
        speakerJob,
        speakerTelNum,
        speakerTelNum2,
        postTitle,
        postDesc,
        postText,
      });

      await newPost.save();

      return res.status(201).json("Post sent to the moderation");
    } catch (error) {
      return console.log(error.message);
    }
  },
  MODERATE_POSTS: async (req, res) => {
    try {
      const { submit, cancel, id } = req.body;
      if (submit) {
        await Posts.findByIdAndUpdate(id, {
          isModerated: true,
        });

        return res.status(200).json("Post is activated successfully");
      }
      if (cancel) {
        await Posts.findByIdAndUpdate(id, {
          isDeleted: true,
        });

        return res.status(200).json("Post was rejected");
      }
    } catch (error) {
      return console.log(error.message);
    }
  },
  DELETE_USER_VIDEOS: async (req, res) => {
    try {
      const { id } = req.body;
      const { id: id2 } = videoCtr.GET_VIDEOS;
      await pool.query(`DELETE from videos where id=$1`, [id]);
      res.status(200).send({ msg: "Video deleted successfully", id2 });
    } catch (error) {
      return console.log(error.message);
    }
  },
};
