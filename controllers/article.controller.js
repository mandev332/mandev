import fs from "fs";
import path from "path";
import { fetch, fetchAll } from "../database/connect.js";
import { userModel } from "../MODELS/userModel.js";
import { articleModel } from "../MODELS/articleModel.js";
const { GET, GETUSER, GETALL, POST, PUT, DELETE } = articleModel;

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
      let user = await fetch(userModel.GET, id);
      if (user) {
        let artId = req?.params.id;
        if (artId) {
          let findart = await fetch(GET, artId);
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
          let arts = await fetchAll(GETUSER, user.id);
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
      let cod = (Math.random() * 900000 + 100000).toFixed(0);
      let art;
      req.body.image = null;
      const file = req?.files?.file;
      if (!file) return next();
      if (req.method == "PUT" && req?.params.id) {
        art = await fetch(GET, req.params.id);
      }
      let filePath = path.join(process.cwd(), "avatarka", "sites", cod);
      if (art?.image) {
        fs.unlinkSync(path.join(process.cwd(), "avatarka", art.image));
      }
      let type = file.mimetype.split("/")[1];
      req.body.image = "/sites/" + cod + "." + type;
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
      const { title, description, image } = req.body;
      if (!title || !description)
        throw new Error(
          "You must send title and description! Siz mavzu va maqola yuborishingiz zarur!"
        );
      let post = await fetch(POST, id, title, description, image);

      res.send({
        status: 200,
        data: post,
        message: "Article added! Maqola qo'shildi!",
      });
    } catch (error) {
      res.send({
        status: 404,
        data: null,
        message: err.message,
      });
    }
  },
  PUT: async (req, res, next) => {
    try {
      let art = await fetch(GET, req.params.id);
      if (!art) throw new Error("This article not found! Bu maqola topilmadi!");

      const { title, description, image } = req.body;
      if (!title && !description && !image)
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
        image || art.image
      );
      res.send({
        status: 200,
        data: update,
        message: "Article " + art.id + " updated!",
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
      const { id } = req?.params;
      if (!id)
        throw new Error(
          "You need send article's id for delete! O'chirish uchun maqolaning raqamini jo'nating"
        );
      let art = await fetch(GET, id);
      if (!art)
        throw new Error(`Not found article = ${id}! ${id} - maqola topilmadi`);
      fs.unlinkSync(path.join(process.cwd(), "avatarka", art.image));
      let deleteart = await fetch(DELETE, id);
      res.send({
        status: 200,
        data: deleteart,
        message: "Article " + id + " deleted!",
      });
    } catch (err) {
      res.send({
        status: 404,
        data: null,
        message: err.message,
      });
    }
  },
};

export default ArticleConter;
