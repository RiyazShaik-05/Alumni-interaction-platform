import Job from "../models/job.model.js";

const createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      company,
      location,
      positionType,
      jobType,
      deadline,
      description,
      contactEmail,
      applyLink,
    } = req.body;

    // console.log(req.body);

    const arr = [
      jobTitle,
      company,
      location,
      positionType,
      jobType,
      deadline,
      description,
      contactEmail,
      applyLink,
    ];

    if (arr.some((field) => !field)) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // console.log(req.body);

    const job = await Job.create({
      jobTitle,
      company,
      location,
      positionType,
      jobType,
      deadline,
      description,
      contactEmail,
      applyLink,
    });

    return res.status(201).json({
      success: true,
      message: "Job Posted successfully!",
      data: job,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const totalCount = await Job.countDocuments();
    // console.log(page, limit);

    const jobs = await Job.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();

    if (!jobs) {
      return res.status(200).json({
        success: true,
        message: "No jobs Found!",
        posts: [],
        totalCount,
      });
    }

    if (jobs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No more posts!",
        posts: [],
        totalCount,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Fetched successfully!",
      jobs,
      totalCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

export { createJob, getAllJobs };
