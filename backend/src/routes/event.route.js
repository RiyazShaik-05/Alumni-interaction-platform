import express from "express"
import {createEvent, getAllEvents} from "../controllers/event.controller.js"

const router = express.Router()

router.post("/create-event",createEvent);
router.get("/get-all-events",getAllEvents)

export default router