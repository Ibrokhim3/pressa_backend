const Posts = require("../models/post-model");
const cloudinary = require("../config/cloudinary-config");
const fs = require("fs");
const path = require("path");
const { v4 } = require("uuid");

module.exports = {
  GET_MODERATING_POSTS: async (req, res) => {
    try {
      const search = req.query.search || "";

      let sort = req.query.sort || "asc";
      // req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

      // let sortBy = {};
      // if (sort[1]) {
      //   sortBy[sort[0]] = sort[1];
      // } else {
      //   sortBy[sort[0]] = "asc";
      // }

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
  SORT_MODERATING_POST: async (req, res) => {
    try {
      // let sort = req.query.sort || "Eng so’ngilari";
      // req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
      // let sortBy = {};
      // if (sort[1]) {
      //   sortBy[sort[0]] = sort[1];
      // } else {
      //   sortBy[sort[0]] = "asc";
      // }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  },
  GET_ACTIVE_POSTS: async (req, res) => {
    const limit = parseInt(req.query.limit) || 9;
    const search = req.query.search || "";

    try {
      const posts = await Posts.find({
        isModerated: true,
        postTitle: { $regex: search, $options: "i" },
      }).limit(limit);
      return res.status(200).json(posts);
    } catch (error) {
      return console.log(error.message);
    }
  },
  SEARCH_ACTIVE_POSTS: async (req, res) => {
    try {
      // const page = parseInt(req.query.page) - 1 || 0;
      const limit = parseInt(req.query.limit) || 9;
      let date = req.query.date || "2023-05-31";
      let category = req.query.category || "All";
      let type = req.query.type || "offline";
      let name = req.query.name || "All";

      const categoryOptions = [
        "IT",
        "Dizayn",
        "SMM",
        "English",
        "Robototexnika",
        "Motion-dizayn",
      ];

      const nameOptions = [
        "Alisher Isaev",
        "Sarvar Ikromov",
        "Sherzod Polatov",
      ];

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
      return console.log(error.message);
    }
  },
  GET_REJECTED_POSTS: async (req, res) => {
    try {
      const posts = await Posts.find({ isRejected: true });
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
      const { submit, reject, id } = req.body;
      if (submit) {
        await Posts.findByIdAndUpdate(id, {
          isModerated: true,
        });

        return res.status(200).json("Post is activated successfully");
      }
      if (reject) {
        await Posts.findByIdAndUpdate(id, {
          isRejected: true,
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
