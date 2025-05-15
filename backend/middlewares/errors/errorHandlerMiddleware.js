const errorHandlerMiddleware = (err, req, res, next) => {
  const error = err.message;
  console.log(error);
  res.status(500).send({ message: "Något fel i servern", error });
};

export default errorHandlerMiddleware;