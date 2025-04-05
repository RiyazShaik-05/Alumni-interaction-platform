import express from "express"
import {createJob, getAllJobs} from "../controllers/job.controller.js"

const router = express.Router()

router.post("/create-job",createJob);
router.get("/get-all-jobs",getAllJobs)

export default router;