const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userid
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json(job)
}

const getAllJobs = async (req, res) => {
  const job = await Job.find({})
  if (!job) {
    return res.status(400).json('wrong')
  }
  res.status(StatusCodes.OK).json(job)
}

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    params: { id },
    user: { userid },
  } = req
  // const { body, params, user } = req
  // console.log(body, params, user)

  if (company == '' || position == '') {
    throw new BadRequestError('company and position feilds cannot be empty')
  }

  const job = await Job.findByIdAndUpdate(
    { _id: id, createdBy: userid },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  res.status(StatusCodes.OK).json({ job })
}

// get single job.........
const getJob = async (req, res) => {
  const jobId = req.params.id
  const job = await Job.findOne({ _id: jobId, createdBy: req.user.userid })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
  const jobId = req.params.id
  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: req.user.userid,
  })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
}
