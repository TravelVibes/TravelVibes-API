import Journey from '../models/Journey';
import { httpStatus } from '../utils/httpStatus';

export const fetchAllJourneys = async (req, res) => {
  try {
    const journeys = await Journey.find().limit(3);
    res.status(201).json(journeys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchSingleJourney = async (req, res) => {
  const id = req.params.id;
  try {
    const journey = await Journey.findById(id);
    res.status(201).json(journey);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createJourney = async (req, res) => {
  try {
    // hard code user id for now: harrynguyen: 65840cd36fb15fffda3a62ed
    const userID = '65840cd36fb15fffda3a62ed';
    const { title, attractions } = req.body;

    const newJourney = new Journey({
      title,
      userID,
      attractions,
    });

    const savedJourney = await newJourney.save();
    // Create a new journey
    const populatedJourney = await Journey.populate(savedJourney, {
      path: 'attractions',
    });

    res.status(201).json(populatedJourney);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateJourney = async (req, res) => {
  const journeyId = req.params.id;
  const updateData = req.body;
  try {
    const updatedJourney = await Journey.findByIdAndUpdate(
      journeyId,
      { $set: updateData },
      { new: true }, // Return the updated document
    );

    if (!updatedJourney) {
      return res.status(404).json({ error: 'Journey not found' });
    }

    res.status(httpStatus.OK).json(updatedJourney);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteJourney = async (req, res) => {
  const journeyId = req.params.id;
  try {
    const deletedJourney = await Journey.findOneAndDelete(journeyId);
    if (!deletedJourney) {
      return res.status(404).json({ error: 'Journey not found' });
    }
    res.status(httpStatus.OK).json(deletedJourney);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
