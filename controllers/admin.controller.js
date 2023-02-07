import { jwt } from "../middlewares/jwt.js";
import { fetch, fetchAll } from "../database/connect.js";
import { keshModel } from "../MODELS/keshModel.js";

const { GET, GETALL, POST, DELETE } = keshModel;

const SiteConter = {
  GET: async (req, res, next) => {
    try {
      if (req.user.role != "admin")
        throw new Error("You are not allowed! Sizga ruxsat berilmagan!");
      const { id } = req?.params;
      if (id) {
        let findkesh = await fetch(GET, id);
        if (!findkesh)
          throw new Error(`Not found xabar = ${id}!, ${id} - xabar topilmadi!`);
        res.send({
          status: 200,
          data: findkesh,
          message: "Site",
        });
      } else {
        let keshs = await fetchAll(GETALL);
        if (keshs.length)
          res.send({
            status: 200,
            data: keshs,
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

  POST: async (req, res, next) => {
    try {
      const { username, contact, sitelink } = req.body;

      let checkName = await jwt.RegExp(username, contact);
      if (1 != checkName) throw new Error(checkName);

      if (!username || !sitelink || !contact)
        throw new Error(
          "You must send data! Siz ma'lumot yuborishingiz zarur!"
        );
      let post = await fetch(POST, username, contact, sitelink);

      res.send({
        status: 200,
        data: post,
        message: "Messsage sended! Xabar jo'natildi!",
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
      let kesh = await fetch(GET, req.params.id);
      if (!kesh) throw new Error("This kesh not found! Bu sayt topilmadi!");
      const { username, sitelink, contact } = req.body;
      if (!username && !sitelink && !contact)
        throw new Error(
          "You need send sameone date for change! O'zgarish uchun bironta ma'lumot yuborishingiz zarur!"
        );
      let update = await fetch(
        PUT,
        kesh.id,
        username || kesh.username,
        contact || kesh.contact,
        sitelink || kesh.sitelink
      );
      res.send({
        status: 200,
        data: update,
        message: `Message  ${kesh.id} updated! ${kesh.id} - xabar o'zgartirildi!`,
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
          "You need send kesh's id for delete! O'chirish uchun saytning raqamini jo'nating"
        );
      let kesh = await fetch(GET, id);
      if (!kesh)
        throw new Error(`Not found kesh = ${id}! ${id} - sayt topilmadi`);

      let deletekesh = await fetch(DELETE, id);
      res.send({
        status: 200,
        data: deletekesh,
        message: `Message  ${id} deleted! ${id} - xabar o'chirildi! `,
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
