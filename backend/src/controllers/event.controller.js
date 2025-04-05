import Event from "../models/event.model.js";

const createEvent = async (req, res) => {
  try {
    const {
      date,
      description,
      eventLink,
      eventName,
      host,
      isVirtual,
      location,
    } = req.body;

    // console.log(req.body);

    if (
      [date, description, eventName, host].some((field) => !field)
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // console.log("Completed first check")

    if (isVirtual) {
      if (eventLink === "") {
        return res.status(400).json({
          success: false,
          message: "All fields are required!",
        });
      }
    } else {
      if (location === "") {
        return res.status(400).json({
          success: false,
          message: "All fields are required!",
        });
      }
    }

    // console.log("Completed Secind check");

    const newEvent = new Event({
      date,
      description,
      eventLink,
      eventName,
      host,
      isVirtual,
      location,
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully!",
      event: newEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const totalCount = await Event.countDocuments();
    // console.log(page, limit);

    const Events = await Event.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();

    if (!Events) {
      return res.status(200).json({
        success: true,
        message: "No Events Found!",
        posts: [],
        totalCount,
      });
    }

    if (Events.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No more Events!",
        posts: [],
        totalCount,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Fetched successfully!",
      Events,
      totalCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

export { createEvent, getAllEvents };
