module.exports.postCreate = (req, res, next) => {
  const errors = [];
  if (!req.body.fullname) {
    errors.push("Name is required.");
  }
  if (!req.body.username) {
    errors.push("Username is required.");
  }
  if (!req.body.password) {
    errors.push("Password is required.");
  }
  if (errors.length) {
    res.render("users/create", {
      errors: errors,
      values: req.body,
    });
    return;
  }
  next();
};
