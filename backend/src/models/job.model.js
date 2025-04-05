import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  positionType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time',
    required: true
  },
  jobType: {
    type: String,
    enum: ['Job', 'Internship'],
    default: 'Job',
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true,
  },
  applyLink: {
    type: String,
    required: false,
    trim: true
  }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;
