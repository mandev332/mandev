import nodemailer from "nodemailer";
import path from "path";
import { fetch, fetchAll } from "../database/connect.js";
import { userModel } from "../MODELS/userModel.js";
import fs from "fs";
import sha256 from "sha256";
import { jwt } from "./jwt.js";
const auth = {
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
      // if (user.pass == sha256(password)) return next();
      // else throw new Error("Wrong your password!");

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "nodirbekqobilov332@gmail.com",
          pass: "fyqdqumarcqabbgy",
        },
      });
      let cod = (Math.random() * 1000000 + 100000).toFixed(0);
      console.log(cod);
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
        fs.writeFileSync(
          path.join(process.cwd(), "kesh.json"),
          JSON.stringify({ gmail, password, cod, date: new Date() }, null, 4)
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
      let userInfo = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), "kesh.json")) || "{}"
      );
      if (
        !Object.keys(userInfo).length ||
        parseInt((new Date() - new Date(userInfo.date)) / 86400) > 6
      ) {
        fs.writeFileSync(path.join(process.cwd(), "kesh.json"), "{}");
        throw new Error("60 soniya tugadi qayta kod yuborilsinmi?");
      }
      if (checkPass != userInfo.cod) throw new Error("Kod to'gri kelmadi");

      res.send({
        status: 200,
        data: null,
        message: "/register2",
      });
    } catch (error) {
      res.send({
        status: 400,
        data: null,
        message: error.message,
      });
    }
  },
  LOGIN: async (req, res, next) => {},
  REGISTER: async (req, res, next) => {
    try {
      const { file } = req.files;
      const { username, contact, profession } = req.body;
      const gmail = req.headers.gmail;
      const password = req.headers.password;
      let avatar = null;

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
        password,
        avatar,
        profession
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
