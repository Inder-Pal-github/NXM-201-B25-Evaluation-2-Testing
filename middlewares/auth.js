const jwt = require("jsonwebtoken");
const { Blacklist } = require("../models/blacklist.model");

const auth = async (req, res, next) => {
  const { JAA_access_token } = req?.cookies;

  if (!JAA_access_token) return res.status(400).send({ msg: "Please login!" });

  const isTokenBlacklisted = await Blacklist.findOne({
    token: JAA_access_token,
  });

  if (isTokenBlacklisted)
    return res.status(400).send({ msg: "Please login..." });

  jwt.verify(
    JAA_access_token,
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    (err, payload) => {
      if (err) {
        return res.status(401).send({ msg: err.message });
      } else {
        req.userId = payload.userId;
        req.role = payload.role;
        next();
      }
    }
  );
};

module.exports = { auth };
