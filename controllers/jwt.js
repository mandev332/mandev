import JWT from "jsonwebtoken";
console.log(1, JWT);
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
    if (!nameRegex.test(username)) return "Wrong username!";
    if (!phoneRegex.test(contact)) return "Wrong contact!";
    if (!passRegex.test(password)) return "Wrong pass!";
    if (!proRegex.test(profession)) return "Wrong profession!";
    if (!["male", "female"].includes(gender)) return "Wrong gender!";
    return 1;
  },
};

export { jwt };
