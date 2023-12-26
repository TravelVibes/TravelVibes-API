import Attraction from '../models/Attraction.js';
import { httpStatus } from '../utils/httpStatus.js';

export const getAllAttractions = async (req, res) => {
  try {
    const attractions = await Attraction.find();
    res.status(201).json(attractions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const searchAttractions = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    if (!searchTerm) {
      // search all
      const attractions = await Attraction.find();
      return res.status(201).json(attractions);
    }
    const attractions = await Attraction.find({
      name: {
        $regex: new RegExp(searchTerm.toString().toLowerCase(), 'i'),
      },
    });
    res.status(201).json(attractions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const fetchSingleAttraction = async (req, res) => {
  const attractionID = req.params.id;
  try {
    const attraction = await Attraction.findById(attractionID);
    if (!attraction) {
      return res.status(404).json({ error: 'Attraction not found' });
    }
    res.status(httpStatus.CREATED).json(attraction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchAttraction = async (attractionID) => {
  try {
    const attraction = await Attraction.find(attractionID);
    return attraction;
  } catch (error) {
    return null;
  }
};
