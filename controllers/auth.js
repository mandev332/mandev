import fs from "fs";
import path from "path";
import sha256 from "sha256";
import nodemailer from "nodemailer";

import { fetch, fetchAll } from "../database/connect.js";
import { userModel } from "../MODELS/userModel.js";
import { jwt } from "./jwt.js";

const auth = {
  LOGIN: async (req, res, next) => {
    try {
      const { gmail, password } = req.body;
      const user = await fetch(userModel.LOGIN, gmail, sha256(password));
      if (!user)
        throw new Error("You are not registered! Siz ro'yxatdan o'tmagansiz!");
      res.send({
        status: 200,
        data: jwt.SIGN(user.id),
        message: "Welcome - Save a token! Xush kelibsiz - Tokenni saqlang!",
      });
    } catch (error) {
      res.send({
        status: 401,
        data: null,
        message: error.message,
      });
    }
  },

  CHECK: async (req, res, next) => {
    try {
      const { gmail, password } = req.body;
      const checkGmail1 = new RegExp(
        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
      );
      const checkGmail2 = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
      if (!checkGmail1.test(gmail) || !checkGmail2.test(gmail))
        throw new Error("Wrong email!");
      const user = await fetch("SELECT id FROM users where email = $1", gmail);
      if (user)
        throw new Error(
          "You are already authorized! Siz allaqachon avtorizatsiya qilgansiz!"
        );

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "nodirbekqobilov332@gmail.com",
          pass: "fyqdqumarcqabbgy",
        },
      });
      let cod = (Math.random() * 900000 + 100000).toFixed(0);
      const mailOptions = {
        from: "nodirbekqobilov332@gmail.com",
        to: gmail,
        subject: "GETTER UZ",
        html: `Sizga yuborilgan tasdiqlash kodi : ` + `<b>${cod}</b>`,
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) console.log(err.message);
        else
          res.send({
            status: 200,
            data: null,
            message:
              "We will send a code to your Gmail address! Gmail manzilingizga kod yubordik!",
          });
        let user = { gmail, password, cod, date: new Date() };
        const kesh = JSON.parse(
          fs.readFileSync(path.join(process.cwd(), "kesh.json"))
        );
        kesh.push(user);
        fs.writeFileSync(
          path.join(process.cwd(), "kesh.json"),
          JSON.stringify(kesh, null, 4)
        );
      });
    } catch (error) {
      res.send({
        status: 401,
        data: null,
        message: error.message,
      });
    }
  },

  PASS: async (req, res, next) => {
    try {
      const { checkPass } = req.body;
      let userKesh = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), "kesh.json"))
      );
      let userPass = userKesh.find((e) => e.password == checkPass);
      userKesh = userKesh.filter((e) => e.password != checkPass);
      fs.writeFileSync(
        path.join(process.cwd(), "kesh.json"),
        JSON.stringify(userKesh, null, 4)
      );
      if (!userPass) throw new Error("Kod to'gri kelmadi");

      if (parseInt((new Date() - new Date(userPass.date)) / 86400) > 6) {
        throw new Error("60 soniya tugadi qayta kod yuborilsinmi?");
      }

      res.send({
        status: 200,
        data: null,
        message: "/register",
      });
    } catch (error) {
      res.send({
        status: 400,
        data: null,
        message: error.message,
      });
    }
  },

  REGISTER: async (req, res, next) => {
    try {
      const file = req?.files?.file;
      const { username, contact, profession, gender } = req.body;
      const { password, gmail } = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), "kesh.json"))
      );
      let avatar = null;
      if (!password || !gmail)
        throw new Error(
          "You need to register Gmail! Gmail-ni ro'yxatdan o'tkazishingiz zarur!"
        );

      if (!username || !contact || !profession)
        throw new Error(
          "You must send username, contact and profession! Siz ismingiz, telefon raqamingiz va yo'nalishingizni  yuborishingiz zarur!"
        );

      if (file) {
        let filePath = path.join(process.cwd(), "avatarka", "users", contact);
        let type = file.mimetype.split("/")[1];
        avatar = "/users/" + contact + "." + type;
        await file.mv(filePath + "." + type);
      }

      let response = await fetch(
        userModel.POST,
        username,
        contact,
        gmail,
        sha256(password),
        avatar || gender == "male" ? "/users/boy" : "/users/girl.jpg",
        profession,
        gender
      );

      res.send({
        status: 200,
        data: response,
        message: "User added in users! Foydalanuvchi ro'yxatga qo'shildi!",
      });
    } catch (error) {
      res.send({
        status: 401,
        data: null,
        message: error.message,
      });
    }
  },
};

export { auth };
