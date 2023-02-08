import fs from "fs";
import path from "path";
import sha256 from "sha256";
import { jwt } from "../middlewares/jwt.js";
import { fetch, fetchAll } from "../database/connect.js";
import { userModel } from "../MODELS/userModel.js";
const { GET, GETALL, PUT, DELETE, ADMINPUT } = userModel;

const UserConter = {
  GET: async (req, res, next) => {
    try {
      const { id } = req?.user;

      let user = await fetch(GET, id);
      if (user.role == "admin") {
        let userId = req?.params.id;
        if (userId) {
          let finduser = await fetch(GET, userId);
          if (!finduser)
            throw new Error(
              `Not found user = ${artId}!, ${artId} - foydalanuvchi topilmadi!`
            );
          res.send({
            status: 200,
            data: finduser,
            message: "User",
          });
        } else {
          let users = await fetchAll(GETALL);
          if (users.length)
            res.send({
              status: 200,
              data: users,
              message: "Users",
            });
          else throw new Error("Users not found! Foydalanuvchilar topilmadi!");
        }
      } else if (user.role == "user")
        res.send({
          status: 200,
          data: user,
          message: `User = ${id}! ${id} - foydalanuvchi`,
        });

      if (!user)
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
      if (req.user.id) {
        let user = await fetch(GET, req.user.id);
        if (!user)
          throw new Error(
            "You need to register first!! Avval ro'yxatdan o'tishingiz zarur!"
          );

        let { username, contact, gmail, password, avatar, profession, gender } =
          req.body;

        if (contact && !avatar) {
          fs.renameSync(
            path.join(process.cwd(), "avatarka", user.avatar),
            path.join(
              process.cwd(),
              "avatarka",
              "users",
              contact + "." + user.avatar.split(".")[1]
            )
          );
          avatar = `/users/${contact}.${user.avatar.split(".")[1]}`;
        }

        if (
          !username &&
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
          username || user.username,
          contact || user.contact,
          password || "password",
          profession || user.profession,
          gender || user.gender
        );
        if (1 != responseRegExp) throw new Error(responseRegExp);
        let update = await fetch(
          PUT,
          user.id,
          username || user.username,
          contact || user.contact,
          gmail || user.email,
          password ? sha256(password) : user.password,
          avatar || user.avatar,
          profession || user.profession,
          gender || user.gender
        );
        res.send({
          status: 200,
          data: update,
          message: `User ${user.id}  updated! ${user.id} - foydalanuvchi o'zgartrildi!`,
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
  ADDADMIN: async (req, res, next) => {
    try {
      const admin = req?.user.role;
      if (admin != "admin")
        throw new Error("You are not allowed! Sizga ruxsat berilmagan!");
      const { id } = req.params;
      if (id) {
        let user = await fetch(GET, id);
        if (!user)
          throw new Error(
            `Not found user = ${id}!, ${id} - foydalanuvchi topilmadi!`
          );
        let { role } = req.body;
        let update = await fetch(ADMINPUT, id, role);
        res.send({
          status: 200,
          data: update,
          message: `User ${id}  updated! ${id} - foydalanuvchi o'zgartrildi!`,
        });
      } else
        throw new Error(
          "Send id who to change! Kimni o'zgartirish kerak id jo'nating!"
        );
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
      let user = await fetch(GET, req.user.id);
      if (!user)
        throw new Error("You are not registered! Siz ro'yxatdan o'tmagansiz!");
      if (user.role == "admin") {
        let userId = req.params.id;
        if (userId) {
          let finduser = await fetch(GET, userId);
          if (!finduser)
            throw new Error(
              `Not found user = ${userId}!, ${userId} - foydalanuvchi topilmadi!`
            );
          if (finduser.role == "admin")
            throw new Error(
              "This user Admin! Adminni o'chirib bo'lmaydi avval adminlikdan olib tashlang!"
            );
          let deluser = await fetch(DELETE, userId);
          res.send({
            status: 200,
            data: deluser,
            message: `User deleted = ${id}!, ${id} - foydalanuvchi o'chirildi!`,
          });
        } else
          throw new Error(
            "Send id who to delete! Kimni o'chirish kerak id jo'nating!"
          );
      } else {
        fs.unlinkSync(path.join(process.cwd(), "avatarka", user.avatar));
        let deleteuser = await fetch(DELETE, user.id);
        res.send({
          status: 200,
          data: deleteuser,
          message: `User deleted = ${user.id}!, ${user.id} - foydalanuvchi o'chirildi!`,
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

export default UserConter;
