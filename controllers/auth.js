const mongoose = require('mongoose')
const model = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  const user = await model.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('please provide email and password')
  }

  const user = await model.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invailid Cretentials')
  }
  // compare password
  const isPassCorrect = await user.comparePassword(password)
  if (!isPassCorrect) {
    throw new UnauthenticatedError('Invailid Cretentials')
  }

  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = {
  register,
  login,
}
