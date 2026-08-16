module.exports = function(req, res, next) {
  if (req.session && req.session.adminId) {
    req.admin = { id: req.session.adminId };
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized, please log in' });
  }
};
