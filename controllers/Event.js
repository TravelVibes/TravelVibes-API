import moment from 'moment';
import Attraction from '../models/Attraction.js';
import { httpStatus } from '../utils/httpStatus.js';
import { s3Upload } from '../utils/uploadFile.js';
import EventModal from '../models/Event.js';
import CONST from '../constraints/CONST.js';

// For admin only
export const getAllEvents = async (req, res) => {
  try {
    const events = await EventModal.find({})
      .sort({ createdAt: -1 })
      .populate([
        {
          path: 'attraction',
          select: 'name',
        },
      ]);

    res.status(httpStatus.OK).json(events);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const getAllApprovedEvents = async (req, res) => {
  try {
    const events = await EventModal.find({
      status: CONST.EVENT_STATUS.APPROVE,
    })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: 'attraction',
          select: 'name',
        },
      ]);

    res.status(httpStatus.OK).json(events);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const userID = req.userID;

    const events = await EventModal.find({
      poster: userID,
    })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: 'attraction',
          select: 'name',
        },
      ]);

    res.status(httpStatus.OK).json(events);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const getEventDetail = async (req, res) => {
  try {
    const { id: eventID } = req.params;
    const userID = req.userID;
    const event = await EventModal.findById(eventID)
      .populate([
        {
          path: 'attraction',
          select: 'name coordinates images address rating',
        },
        {
          path: 'poster',
          select: 'firstName lastName avatar',
        },
      ])
      .lean();

    if (event.poster._id.toString() === userID) {
      event.isOwner = true;
    }

    res.status(httpStatus.OK).json(event);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const userID = req.userID;
    const { name, description, attractionId, date } = req.body;
    // handle  images uploading to S3
    let s3FilesSaved = [];
    if (req.files && req.files.length !== 0) {
      s3FilesSaved = await s3Upload(req.files);
    }
    if (moment(date) < Date.now()) {
      return res
        .status(httpStatus.NOT_ACCEPTABLE)
        .json({ error: 'Cannot create an event in the past' });
    }

    const attraction = await Attraction.findById(attractionId);
    if (!attraction) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Attraction not found' });
    }

    const newEvent = new EventModal({
      name,
      description,
      images: s3FilesSaved,
      attraction: attractionId,
      poster: userID,
      date: moment(date),
    });

    const savedEvent = await newEvent.save();
    const populatedEvent = await savedEvent.populate([
      {
        path: 'attraction',
        select: 'name coordinates images address rating',
      },
      {
        path: 'poster',
        select: 'firstName lastName avatar',
      },
    ]);

    res.status(httpStatus.CREATED).json(populatedEvent);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id: eventID } = req.params;
    const userID = req.userID;

    const event = await EventModal.findById(eventID);
    if (event === null) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Can not find event' });
    }

    if (event.poster.toString() !== userID) {
      return res.status(httpStatus.FORBIDDEN).json({
        error: 'Can not update this event due to lack of ownership',
      });
    }

    // Create an object to store the updated data
    const updatedData = {};
    const allowedFields = ['name', 'description', 'attraction', 'date']; // Update if new fields added

    Object.keys(req.body).forEach((field) => {
      if (allowedFields.includes(field)) {
        // Check if the field is allowed
        updatedData[field] = req.body[field];
      }
    });

    let s3FilesSaved = [];
    if (req.files && req.files.length !== 0) {
      s3FilesSaved = await s3Upload(req.files);
      updatedData.images = s3FilesSaved;
    }

    const updatedEvent = await EventModal.findByIdAndUpdate(
      eventID,
      { $set: updatedData },
      { new: true }, // Return the updated document
    ).populate([
      {
        path: 'attraction',
        select: 'name coordinates images address rating',
      },
      {
        path: 'poster',
        select: 'firstName lastName avatar',
      },
    ]);

    if (!updatedEvent) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Event not found' });
    }

    res.status(httpStatus.OK).json(updatedEvent);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userID = req.userID;
    const event = await EventModal.findById(id);
    if (event.poster !== userID) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Cannot delete event without ownership' });
    }

    await EventModal.findByIdAndDelete(id);
    return res.status(httpStatus.OK).json({
      message: 'Event deleted',
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// handles the approval/rejection of events.
export const manageEventApproval = async (req, res) => {
  try {
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
