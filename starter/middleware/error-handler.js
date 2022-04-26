const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err.code == 11000) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Email already exists in database!' })
  }
  if (err.statusCode == 401) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `id is not correct!` })
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
}

module.exports = errorHandlerMiddleware
