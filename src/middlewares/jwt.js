import JWT from "jsonwebtoken";
const jwt = {
  SIGN: (token) => {
    try {
      return JWT.sign(token, process.env.SECRET);
    } catch (err) {
      return err;
    }
  },
  VERIFY: (token) => {
    try {
      return JWT.verify(token, process.env.SECRET);
    } catch (err) {
      return err;
    }
  },
  RegExp: async (username, contact, password, profession, gender) => {
    let nameRegex = new RegExp("^[a-zA-Z\\s]{3,32}$");
    let phoneRegex = new RegExp("^(9[012345789]|88|33)[0-9]{7}$");
    let passRegex = new RegExp("^[a-zA-Z0-9]{4,10}$");
    let proRegex = new RegExp("^[a-zA-Z0-9\\s\\+\\#\\&\\*\\(\\)]{1,32}$");
    if (!nameRegex.test(username || "nodir"))
      return "Wrong name! Not number Max 32 Min 3";
    if (!phoneRegex.test(contact || "992562321"))
      return "Wrong contact! example 941234567";
    if (!passRegex.test(password || "salom123"))
      return "Wrong password! Max 10 Min 4";
    if (!proRegex.test(profession || "mentor"))
      return "Wrong profession! You mustn't use Symbol";
    if (!["male", "female"].includes(gender || "male"))
      return "Wrong gender! You must send male or female";
    return 1;
  },
};
export { jwt };
