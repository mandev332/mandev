import fs from "fs";
import path from "path";
import { fetch, fetchAll } from "../database/connect.js";
import { articleModel } from "../MODELS/articleModel.js";

const {
  GET,
  GETUSER,
  GETUser,
  GETALL,
  POST,
  ADMINPOST,
  PUT,
  ADMINPUT,
  DELETE,
} = articleModel;

const ArticleConter = {
  GET: async (req, res, next) => {
    try {
      const { id } = req?.params;
      if (id) {
        let findart = await fetch(GET, id);
        if (!findart)
          throw new Error(
            `Not found article = ${id}!, ${id} - maqola topilmadi!`
          );
        res.send({
          status: 200,
          data: findart,
          message: "Article",
        });
      } else {
        let arts = await fetchAll(GETALL);
        if (arts.length)
          res.send({
            status: 200,
            data: arts,
            message: "Articles",
          });
        else throw new Error("Articles not found");
      }
    } catch (err) {
      res.send({
        status: 404,
        data: null,
        message: err.message,
      });
    }
  },
  GETUSER: async (req, res, next) => {
    try {
      const { id } = req?.user;
      if (id) {
        let artId = req?.params.id;
        if (artId) {
          let findart = await fetch(GETUser, id, artId);
          if (!findart)
            throw new Error(
              `Not found art = ${artId}! ${artId} - maqola topilmadi!`
            );
          if (findart.user_id != id)
            throw new Error(
              `This article in not yours! Bu maqola sizniki emas!`
            );
          res.send({
            status: 200,
            data: findart,
            message: "Article",
          });
        } else {
          let arts = await fetchAll(GETUSER, id);
          if (arts.length)
            res.send({
              status: 200,
              data: arts,
              message: "Articles",
            });
          else throw new Error("Articles not found! Sizda maqola yo'q!");
        }
      } else
        throw new Error(
          "You are not allowed to access information from this section! Bu bo'limdan ma'lumot olish uchun sizga ruxsat yo'q! "
        );
    } catch (err) {
      res.send({
        status: 404,
        data: null,
        message: err.message,
      });
    }
  },
  UPLOAD: async (req, res, next) => {
    try {
      if (!req?.files?.file && req.method == "PUT") return next();
      const file = req?.files?.file;
      if (!file) return next();

      let cod = (Math.random() * 900000 + 100000).toFixed(0);
      let art;

      if (req.method == "PUT") {
        const { id } = req?.user;
        art = await fetch(GET, req.params.id);
        if (!art)
          throw new Error("This article not found! Bu maqola topilmadi!");
        if (art.user_id != id)
          throw new Error(`This article in not yours! Bu maqola sizniki emas!`);
        if (art?.image) {
          fs.unlinkSync(path.join(process.cwd(), "avatarka", art.image));
        }
      }

      let filePath = path.join(process.cwd(), "avatarka", "article", cod);
      let type = file.mimetype.split("/")[1];
      req.body.image = "/artilcle/" + cod + "." + type;
      await file.mv(filePath + "." + type);
      return next();
    } catch (error) {
      res.send({
        status: 504,
        data: "upload",
        message: error.message,
      });
    }
  },
  POST: async (req, res, next) => {
    try {
      const { id } = req?.user;
      const { title, description, image, hashtag } = req.body;
      if (!title || !description || !hashtag)
        throw new Error(
          "You must send title and description! Siz surat, mavzu, maqola va hashtag yuborishingiz zarur!"
        );
      let post;
      if (req.user.role == "admin") {
        post = await fetch(
          ADMINPOST,
          id,
          title,
          description,
          image,
          hashtag,
          true
        );
      } else {
        post = await fetch(POST, id, title, description, image, hashtag);
      }

      res.send({
        status: 200,
        data: post,
        message: "Article added! Maqola qo'shildi!",
      });
    } catch (error) {
      res.send({
        status: 404,
        data: null,
        message: error.message,
      });
    }
  },
  PUT: async (req, res, next) => {
    try {
      const { id } = req?.user;
      let art = await fetch(GET, req.params.id);
      if (!art) throw new Error("This article not found! Bu maqola topilmadi!");
      if (art.user_id != id)
        throw new Error(`This article in not yours! Bu maqola sizniki emas!`);
      const { title, description, image, hashtag } = req.body;
      if (!title && !description && !image && !hashtag)
        throw new Error(
          "You need send sameone date for change! O'zgarish uchun bironta ma'lumot yuborishingiz zarur!"
        );

      if (title?.length > 255)
        throw new Error("Title very longer! Sarlavha uzun berilgan!");

      let update = await fetch(
        PUT,
        art.id,
        title || art.title,
        description || art.description,
        image || art.image,
        hashtag || art.hashtag
      );
      res.send({
        status: 200,
        data: update,
        message: `Article ${art.id} updated! ${art.id} Maqola o'zgartirildi!`,
      });
    } catch (err) {
      res.send({
        status: 404,
        data: null,
        message: err.message,
      });
    }
  },

  ADMINPUT: async (req, res, next) => {
    try {
      const { role } = req?.user;
      if (role != "admin")
        throw new Error("You are not allowed! Sizga ruxsat berilmagan!");
      let art = await fetch(GET, req.params.id);
      if (!art) throw new Error("This article not found! Bu maqola topilmadi!");
      const { title, description, image, hashtag, permission } = req.body;
      if (!title && !description && !image && !hashtag && !permission)
        throw new Error(
          "You need send sameone date for change! O'zgarish uchun bironta ma'lumot yuborishingiz zarur!"
        );

      if (title?.length > 255)
        throw new Error("Title very longer! Sarlavha uzun berilgan!");

      let update = await fetch(
        ADMINPUT,
        art.id,
        title || art.title,
        description || art.description,
        image || art.image,
        hashtag || art.hashtag,
        permission || art.permission
      );
      res.send({
        status: 200,
        data: update,
        message: `Article ${art.id} updated! ${art.id} Maqola o'zgartirildi!`,
      });
    } catch (err) {
      res.send({
        status: 404,
        data: null,
        message: err.message,
      });
    }
  },

  DELETE: async (req, res, next) => {
    try {
      const userId = req?.user.id;
      const { id } = req?.params;
      console.log(id);
      if (!id)
        throw new Error(
          "You need send article's id for delete! O'chirish uchun maqolaning raqamini jo'nating"
        );
      let art = await fetch(GET, id);
      if (!art)
        throw new Error(`Not found article = ${id}! ${id} - maqola topilmadi`);
      if (art.user_id != userId && req.user.role != "admin")
        throw new Error(`This article in not yours! Bu maqola sizniki emas!`);
      if (art.image != "/sites/demo.jpg")
        fs.unlinkSync(path.join(process.cwd(), "avatarka", art.image));
      let deleteart = await fetch(DELETE, id);
      res.send({
        status: 200,
        data: deleteart,
        message: `Article ${id} updated! ${id} Maqola o'zgartirildi!`,
      });
    } catch (err) {
      res.send({
        status: 404,
        data: null,
        message: err.message,
      });
    }
  },
  SEND: async (req, res) => {},
};

export default ArticleConter;
