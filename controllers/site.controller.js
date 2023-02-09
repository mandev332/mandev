import fs from "fs";
import path from "path";
import { jwt } from "../middlewares/jwt.js";
import { fetch, fetchAll } from "../database/connect.js";
import { siteModel } from "../MODELS/siteModel.js";
import downloadImage from "../middlewares/upload.js";

const { GET, GETALL, POST, PUT, DELETE } = siteModel;

const SiteConter = {
  GET: async (req, res, next) => {
    try {
      const { id } = req?.params;
      if (id) {
        let findsite = await fetch(GET, id);
        if (!findsite)
          throw new Error(`Not found site = ${id}!, ${id} - sayt topilmadi!`);
        res.send({
          status: 200,
          data: findsite,
          message: "Site",
        });
      } else {
        let sites = await fetchAll(GETALL);
        if (sites.length)
          res.send({
            status: 200,
            data: sites,
            message: "Sites",
          });
        else throw new Error("Sites not found");
      }
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
      let site;
      if (req.body.imagelink && req.method == "PUT") {
        const { id } = req.params;
        site = await fetch(GET, id);
        if (!site) throw new Error("This site not found! Bu sayt topilmadi!");
        if (site?.image) {
          fs.unlinkSync(path.join(process.cwd(), "avatarka", site.image));
        }
      }

      let { imagelink } = req.body;
      if (imagelink) {
        let type = imagelink.slice(imagelink.lastIndexOf("."));
        let cod = (Math.random() * 900000 + 100000).toFixed(0);
        let image = `sites/${cod + type}`;

        downloadImage(imagelink, image);
        req.body.image = "/avatarka/" + (image || "sites/getter.png");
      }
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
      if (req.user?.role != "admin")
        throw new Error("You are not allowed! Sizga ruxsat berilmagan!");
      const { name, link, author, image, contact, hashtag } = req.body;

      let checkName = await jwt.RegExp(name, contact);
      if (1 != checkName) throw new Error(checkName);

      let checkAuthor = await jwt.RegExp(author);
      if (1 != checkAuthor) throw new Error(checkAuthor);

      if (!name || !link || !author || !image || !contact || !hashtag)
        throw new Error(
          "You must send data! Siz ma'lumot yuborishingiz zarur!"
        );
      let post = await fetch(POST, name, link, author, image, contact, hashtag);

      res.send({
        status: 200,
        data: post,
        message: "Site added! Sayt qo'shildi!",
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
      if (req.user.role != "admin")
        throw new Error("You are not allowed! Sizga ruxsat berilmagan!");
      let site = await fetch(GET, req.params.id);
      if (!site) throw new Error("This site not found! Bu sayt topilmadi!");
      const { name, link, author, image, contact, hashtag } = req.body;
      if (!name && !link && !author && !image && !contact && !hashtag)
        throw new Error(
          "You need send sameone date for change! O'zgarish uchun bironta ma'lumot yuborishingiz zarur!"
        );
      let update = await fetch(
        PUT,
        site.id,
        name || site.name,
        link || site.link,
        author || site.author,
        image || site.image,
        contact || site.contact,
        hashtag || site.hashtag
      );
      res.send({
        status: 200,
        data: update,
        message: `Site  ${site.id} updated! ${site.id} - sayt o'zgartirildi!`,
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
      if (req.user.role != "admin")
        throw new Error("You are not allowed! Sizga ruxsat berilmagan!");
      const { id } = req?.params;
      if (!id)
        throw new Error(
          "You need send site's id for delete! O'chirish uchun saytning raqamini jo'nating"
        );
      let site = await fetch(GET, id);
      if (!site)
        throw new Error(`Not found site = ${id}! ${id} - sayt topilmadi`);
      if (site.image)
        fs.unlinkSync(path.join(process.cwd(), "avatarka", site.image));
      let deletesite = await fetch(DELETE, id);
      res.send({
        status: 200,
        data: deletesite,
        message: `Site  ${id} deleted! ${id} - sayt o'chirildi! `,
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

export default SiteConter;
