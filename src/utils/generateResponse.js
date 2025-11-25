const generateResponse = (status, statusCode, data) => {
  return {
    success: status,
    statusCode,
    data,
  };
};

module.exports = generateResponse;
