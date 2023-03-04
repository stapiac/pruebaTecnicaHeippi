const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) return res.status(401).json({ error: "Acceso denegado" });

    const verified = jwt.verify(token, "heippi2023");

    req.user = verified; //user._id

    next();
  } catch (error) {
    res.status(400).json({ error: "token no es válido" });
  }
};

module.exports = authentication;
