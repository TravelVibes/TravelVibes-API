import Attraction from '../models/Attraction';
import Review from '../models/Review';
import { httpStatus } from '../utils/httpStatus';

export const fetchReviews = async (req, res) => {
  const { rating } = req.query;
  const { attractionID } = req.params;
  let reviews = [];
  try {
    if (!rating) {
      reviews = await Review.find({ attraction: attractionID })
        .limit(5)
        .populate('user');
    } else {
      reviews = await Review.find({
        attraction: attractionID,
        rating,
      }).populate('user');
    }
    res.status(httpStatus.OK).json(reviews);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const createReview = async (req, res) => {
  const attractionID = req.params.attractionID;
  // hard code user id for now: foden: 65840d669b9bf486c910d9e0
  const userID = '65840d669b9bf486c910d9e0';

  try {
    // const attraction = searchAttraction(attractionID);
    const attraction = await Attraction.findById(attractionID);

    if (!attraction) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Attraction not found' });
    }
    const { rating, content, images } = req.body;
    // TODO handle  images uploading to S3
    const newReview = new Review({
      attraction: attractionID,
      content,
      rating,
      user: userID,
    });
    const savedReview = await newReview.save();
    // TODO change rating score of that attraction

    res.status(httpStatus.CREATED).json(savedReview);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const editReview = async (req, res) => {
  try {
    const { attractionID, reviewID } = req.params;
    // Find attraction
    const attraction = await Attraction.findById(attractionID);
    const review = await Review.findById(reviewID);
    if (!attraction || !review) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Attraction or review not found' });
    }
    const updatedData = req.body;
    // TODO handle  images uploading to S3
    const updateReview = await Review.findByIdAndUpdate(
      reviewID,
      {
        $set: updatedData,
      },
      { new: true }, // Return the updated document
    );

    res.status(httpStatus.OK).json(updateReview);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const deleteReview = async (req, res) => {};
