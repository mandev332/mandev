import fs from "fs";
import path from "path";
import sha256 from "sha256";
import { jwt } from "./jwt.js";
import { fetch, fetchAll } from "../database/connect.js";
import { userModel } from "../MODELS/userModel.js";

const { GET, GETALL, POST, PUT, DELETE } = userModel;

const UserConter = {
  GET: async (req, res, next) => {
    try {
      const { id } = req?.params;
      if (id && !isNaN(+id)) {
        let user = await fetch(GET, id);
        if (user)
          res.send({
            status: 200,
            data: user,
            message: "User = " + id,
          });
        else throw new Error("Not found user = " + id);
      } else if (id && isNaN(+id)) {
        throw new Error(
          "Are you searching user by id? You must send user's id type numer!"
        );
      } else {
        let users = await fetchAll(GETALL);
        if (users.length)
          res.send({
            status: 200,
            data: users,
            message: "Users",
          });
        else throw new Error("Users not found");
      }
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
      if (req?.user?.id) {
        let user = await fetch(userModel.GET, req.user.id);
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
          userModel.PUT,
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
          message: "User " + user.id + " updated!",
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
  DELETE: async (req, res, next) => {},
};

export default UserConter;
