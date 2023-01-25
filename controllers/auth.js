import nodemailer from "nodemailer";
import { jwt } from "./jwt.js";
import { fetch, fetchAll } from "../database/connect.js";
import sha256 from "sha256";

const auth = {
  CHECK: async (req, res, next) => {
    try {
      const { gmail, password } = req.body;
      const checkGmail1 = new RegExp(
        "^[a-z0-9](.?[a-z0-9]){5,}@g(oogle)?mail.com$"
      );
      const checkGmail2 = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
      if (!checkGmail1.test(gmail) || !checkGmail2.test(gmail))
        throw new Error("Wrong email!");
      const user = await fetch(
        "SELECT id,password FROM users where email = $1",
        gmail
      );
      if (user) {
        if (user.pass == sha256(password)) return next();
        else throw new Error("Wrong your password!");
      }
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "nodirbekqobilov332@gmail.com",
          pass: "fyqdqumarcqabbgy",
        },
      });
      const token = jwt.SIGN("getter.uz");
      const mailOptions = {
        from: "nodirbekqobilov332@gmail.com",
        to: gmail,
        subject: "GETTER UZ",
        html: `Siz bu linkni bosish orqali bu siz ekanligingizni tasdiqlashingiz zarur!
        <a href='http://localhost:5050/authtoken/${token}'>https://getter.uz</a>`,
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) console.log(err.message);
        else
          res.send({
            status: 200,
            data: null,
            message: "We send message to your gmail!",
          });
      });
      // res.sendFile(__dirname + "/authtoken")
    } catch (error) {
      res.send({
        status: 401,
        data: null,
        message: error.message,
      });
    }
  },
  TOKEN: async (req, res, next) => {},
  LOGIN: async (req, res, next) => {},
  REGISTER: async (req, res, next) => {},
};
export { auth };
