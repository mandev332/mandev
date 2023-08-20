import JWT from "jsonwebtoken";
const jwt = {
  SIGN: (token) => {
    try {
      return JWT.sign({ id: token }, process.env.SECRET);
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
    if (!nameRegex.test(username || "salom")) return "Wrong name!";
    if (!phoneRegex.test(contact || "985632589")) return "Wrong contact!";
    if (!passRegex.test(password || "salom123")) return "Wrong password!";
    if (!proRegex.test(profession || "nodeJs")) return "Wrong profession!";
    if (!["male", "female"].includes(gender || "male")) return "Wrong gender!";
    return 1;
  },
};
export { jwt };
