import nodemailer from "nodemailer";

const auth = {
  CHECK: async (req, res, next) => {
    try {
      const { email } = req.body;
      var nodemailer = require("nodemailer");
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "nodirbekqobilov332@gmail.com",
          pass: "djrtfqiqabvzmaoz",
        },
      });
      const mailOptions = {
        from: "nodirbekqobilov332@gmail.com", // sender address
        to: email,
        subject: "Salom", // Subject line
        html: "<p>Your html here</p>", // plain text body
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) console.log(err);
        else console.log(info);
      });
    } catch (error) {}
  },
  TOKEN: async (req, res, next) => {},
  LOGIN: async (req, res, next) => {},
  REGISTER: async (req, res, next) => {},
};
