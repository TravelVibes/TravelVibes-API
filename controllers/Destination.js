import Destination from '../models/Destination';
// FOr test only
export const getAllDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.find();
    res.status(201).json(destinations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const searchDestinations = async (req, res, next) => {
  try {
    const { searchText } = req.body;
    const destinations = await Destination.find({
      name: {
        $regex: new RegExp(searchText.toString().toLowerCase(), 'i'),
      },
    });
    console.log('hieu destinations ', destinations);
    res.status(201).json(destinations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addDestination = async (req, res, next) => {
  try {
    // const destinations = await Destination.find();
    // console.log('hieu destinations ', destinations);
    // res.status(201).json(destinations);
  } catch (error) {
    // res.status(404).json({ message: error.message });
  }
};
