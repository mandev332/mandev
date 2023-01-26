import sha256 from "sha256";
import url from "url";
import qs from "querystring";
import { fetch, fetchAll } from "../database/connect.js";
import { userModel } from "../MODELS/userModel.js";
import { jwt } from "./jwt.js";
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
  POST: async (req, res, next) => {},
  PUT: async (req, res, next) => {},
  DELETE: async (req, res, next) => {},
};

export default UserConter;
