import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  host: {
    type: String,
    required: true,
    trim: true
  },
  isVirtual: {
    type: Boolean,
    required: true,
    default: false
  },
  eventLink: {
    type: String,
    trim: true,
    validate: {
      validator: function (value) {
        return this.isVirtual ? /^https?:\/\/.+$/.test(value) : true;
      },
      message: "Invalid event link"
    }
  },
  location: {
    type: String,
    trim: true,
    required: function () {
      return !this.isVirtual;
    }
  },
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

export default Event;
