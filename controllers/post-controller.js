const Posts = require("../models/post-model");
const Category = require("../models/category-model");
const cloudinary = require("../config/cloudinary-config");
const fs = require("fs");
const path = require("path");
const { v4 } = require("uuid");
const Name = require("../models/name-model");

module.exports = {
  GET_MODERATING_POSTS: async (req, res) => {
    try {
      const search = req.query.search || "";

      let sort = req.query.sort || "asc";

      const posts = await Posts.find({
        $and: [
          {
            isModerated: false,
            isRejected: false,
            postTitle: { $regex: search, $options: "i" },
          },
        ],
      }).sort({ postDate: sort });

      return res.status(200).json(posts);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  },
  GET_ACTIVE_POSTS: async (req, res) => {
    const limit = parseInt(req.query.limit) || 9;
    const search = req.query.search || "";
    let category = req.query.category || "All";
    let date = req.query.date || "";
    let sort = req.query.sort || "asc";

    const categoryOptions = await Category.distinct("category");

    category === "All"
      ? (category = [...categoryOptions])
      : (category = req.query.category.split(","));

    try {
      const posts = await Posts.find({
        isModerated: true,
        postTitle: { $regex: search, $options: "i" },
        postDate: { $regex: date },
        postDir: [...category],
      })
        .sort({ postDate: sort })
        .limit(limit);
      return res.status(200).json(posts);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  },
  GET_REJECTED_POSTS: async (req, res) => {
    try {
      let sort = req.query.sort || "asc";
      const posts = await Posts.find({ isRejected: true }).sort({
        postDate: sort,
      });
      return res.status(200).json(posts);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  },
  SEARCH_ACTIVE_POSTS: async (req, res) => {
    try {
      // const page = parseInt(req.query.page) - 1 || 0;
      const limit = parseInt(req.query.limit) || 9;
      let date = req.query.date || "";
      let category = req.query.category || "All";
      let type = req.query.type || "offline";
      let name = req.query.name || "All";

      const categoryOptions = await Category.find();
      const nameOptions = await Name.find();

      name === "All"
        ? (name = [...nameOptions])
        : (name = req.query.name.split(","));

      category === "All"
        ? (category = [...categoryOptions])
        : (category = req.query.category.split(","));

      const posts = await Posts.find({
        $and: [
          {
            isModerated: true,
            postDate: date,
            postType: type,
            postDir: [...category],
            speakerName: [...name],
          },
        ],
      }).limit(limit);

      return res.status(200).json(posts);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  },
  GET_ONE_ACTIVE_POST: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Posts.findOne({ _id: id, isModerated: true });
      return res.status(200).json(post);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  },
  GET_MAIN_CATEGORIES: async (req, res) => {
    try {
      const categories = await Category.find();

      return res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: true, message: "Internal server error" });
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
          return res.status(500).json("Internal server error");
        }
        // console.log(result);
        // return result.public_id;
      } catch (error) {
        // console.log(error.message);
        res.status(500).json({ error: true, message: "Internal server error" });
      }

      const postImgUrl = result?.secure_url;

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
      console.log(error.message);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  },
  MODERATE_POSTS: async (req, res) => {
    try {
      const { type, id } = req.body;
      const search = req.query.search || "";

      if (type === "true") {
        await Posts.findByIdAndUpdate(id, {
          isModerated: true,
          search: { $regex: search, option: "i" },
        });

        return res.status(201).json("Post is activated successfully");
      }

      await Posts.findByIdAndUpdate(id, {
        isRejected: true,
      });

      return res.status(201).json("Post was rejected");
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  },
};
