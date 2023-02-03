import fs from "fs";
import path from "path";
import sha256 from "sha256";
import nodemailer from "nodemailer";
import { fetch } from "../database/connect.js";
import { userModel } from "../MODELS/userModel.js";
import { jwt } from "./jwt.js";

const auth = {
  TOKEN: async (req, res, next) => {
    try {
      const token = req.headers?.token;
      if (jwt.VERIFY(token) instanceof Error)
        throw new Error("You are not registered! Siz ro'yxatdan o'tmagansiz!");
      const user = jwt.VERIFY(token);
      req.user = user;
      return next();
    } catch (error) {
      res.send({
        status: 401,
        data: null,
        message: error.message,
      });
    }
  },

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
        let userKesh = { gmail, password, cod, date: new Date() };
        const kesh = JSON.parse(
          fs.readFileSync(path.join(process.cwd(), "kesh.json"))
        );
        kesh.push(userKesh);
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
      let userPass = userKesh.find((e) => e.cod == checkPass);

      if (!userPass) throw new Error("Kod to'gri kelmadi");

      if (parseInt((new Date() - new Date(userPass.date)) / 86400) > 12) {
        throw new Error("2 daqiqa tugadi qayta kod yuborilsinmi?");
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

  UPLOAD: async (req, res, next) => {
    try {
      if (!req?.files?.file && req.method == "PUT") return next();
      let user;
      let avatar;
      const file = req?.files?.file;
      if (!file) return next();
      let { contact } = req.body;
      if (req.method == "PUT") {
        user = await fetch(userModel.GET, req.user.id);
      } else {
        let phoneRegex = new RegExp("^(9[012345789]|88|33)[0-9]{7}$");
        if (!phoneRegex.test(contact)) {
          throw new Error("Invalid contact! Telefon raqam noaniq");
        }
      }

      let filePath = path.join(
        process.cwd(),
        "avatarka",
        "users",
        contact || user.contact
      );
      if (
        user?.avatar &&
        !["/users/boy.jpg", "/users/girl.jpg"].includes(user.avatar)
      ) {
        fs.unlinkSync(path.join(process.cwd(), "avatarka", user.avatar));
      }
      let type = file.mimetype.split("/")[1];
      avatar = "/users/" + (contact || user.contact) + "." + type;
      await file.mv(filePath + "." + type);
      req.body.avatar = avatar;

      return next();
    } catch (error) {
      res.send({
        status: 504,
        data: "upload",
        message: error.message,
      });
    }
  },
  REGISTER: async (req, res, next) => {
    try {
      const { username, contact, gmail, password, avatar, profession, gender } =
        req.body;
      if (!gmail)
        throw new Error(
          "You need to register Gmail! Gmail-ni ro'yxatdan o'tkazishingiz zarur!"
        );

      if (!username || !contact || !profession)
        throw new Error(
          "You must send username, contact and profession! Siz ismingiz, telefon raqamingiz va yo'nalishingizni  yuborishingiz zarur!"
        );

      jwt.RegExp(username, contact, password, profession, gender);

      let response = await fetch(
        userModel.POST,
        username,
        contact,
        gmail,
        sha256(password),
        avatar || (gender == "male" ? "/users/boy.jpg" : "/users/girl.jpg"),
        profession,
        gender
      );

      res.send({
        status: 200,
        data: jwt.SIGN({ id: response }),
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
