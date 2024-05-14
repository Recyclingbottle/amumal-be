const authenticateSession = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  authenticateSession,
};
