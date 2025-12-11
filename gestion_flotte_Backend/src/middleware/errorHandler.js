 export const ErrorHandler = (err, req, res, next) => {
    
  console.log("Middleware Error Hadnling");
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Internal Server Error';

  res.status(errStatus).json({
      success: false,
      status: errStatus,
      message: errMsg,
  });
};

export default ErrorHandler;