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
    const event = await EventModal.findById(eventID).populate([
      {
        path: 'attraction',
        select: 'name coordinates images address rating',
      },
      {
        path: 'poster',
        select: 'firstName lastName avatar',
      },
    ]);

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
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const verifyEvent = async (req, res) => {
  try {
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
