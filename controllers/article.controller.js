import { fetch, fetchAll } from "../database/connect.js";
import { userModel } from "../MODELS/userModel.js";
import { articleModel } from "../MODELS/articleModel.js";
const { GET, GETUSER, GETALL, PUT, DELETE } = articleModel;

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

  PUT: async (req, res, next) => {
    try {
      if (req.art.id) {
        let art = await fetch(GET, req.art.id);
        if (!art)
          throw new Error(
            "You need to register first!! Avval ro'yxatdan o'tishingiz zarur!"
          );

        let { artname, contact, gmail, password, avatar, profession, gender } =
          req.body;

        if (contact && !avatar) {
          fs.renameSync(
            path.join(process.cwd(), "avatarka", art.avatar),
            path.join(
              process.cwd(),
              "avatarka",
              "arts",
              contact + "." + art.avatar.split(".")[1]
            )
          );
          avatar = `/arts/${contact}.${art.avatar.split(".")[1]}`;
        }

        if (
          !artname &&
          !contact &&
          !gmail &&
          !password &&
          !avatar &&
          !profession &&
          !gender
        )
          throw new Error(
            "You must send someone data! Siz biron-bir ma'lumot yuborishingiz kerak!"
          );
        let responseRegExp = await jwt.RegExp(
          artname || art.artname,
          contact || art.contact,
          password || "password",
          profession || art.profession,
          gender || art.gender
        );
        if (1 != responseRegExp) throw new Error(responseRegExp);
        let update = await fetch(
          PUT,
          art.id,
          artname || art.artname,
          contact || art.contact,
          gmail || art.email,
          password ? sha256(password) : art.password,
          avatar || art.avatar,
          profession || art.profession,
          gender || art.gender
        );
        res.send({
          status: 200,
          data: update,
          message: "Article " + art.id + " updated!",
        });
      } else
        throw new Error("You don't have permission! Sizga ruxsat berilmagan!");
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
      let art = await fetch(GET, req.art.id);
      if (!art)
        throw new Error("You are not registered! Siz ro'yxatdan o'tmagansiz!");
      if (art.role == "admin") {
        let artId = req.params.id;
        if (artId) {
          let findart = await fetch(GET, artId);
          if (!findart) throw new Error("Not found art = " + artId);
          let delart = await fetch(DELETE, artId);
          res.send({
            status: 200,
            data: delart,
            message: "Article " + artId + " deleted!",
          });
        } else
          throw new Error(
            "Send id who to delete! Kimni o'chirish kerak id jo'nating!"
          );
      } else {
        fs.unlinkSync(path.join(process.cwd(), "avatarka", art.avatar));
        let deleteart = await fetch(DELETE, art.id);
        res.send({
          status: 200,
          data: deleteart,
          message: "Article " + art.id + " deleted!",
        });
      }
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
