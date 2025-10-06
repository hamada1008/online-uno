const privateController = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: { id: req.user.id, username: req.user.username },
  });
};
//bypass db
// const privateController = (req, res, next) => {
//   res.status(200).json({
//     success: true,
//     msg: { id: Math.random(), username: "user" },
//   });
// };

module.exports = privateController;
