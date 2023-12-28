import Attraction from '../models/Attraction.js';
import Review from '../models/Review.js';
import { httpStatus } from '../utils/httpStatus.js';
import { s3Upload } from '../utils/uploadFile.js';
import { calculateRating } from '../utils/calculateRating.js';

export const fetchReviews = async (req, res) => {
  const { rating } = req.query;
  const { attractionID } = req.params;
  let reviews = [];
  try {
    const attraction = await Attraction.findById(attractionID);
    if (!attraction) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Attraction not found' });
    }

    if (!rating) {
      reviews = await Review.find({ attraction: attractionID })
        .limit(5)
        .populate({ path: 'user', select: 'firstName lastName avatar' });
    } else {
      reviews = await Review.find({
        attraction: attractionID,
        rating,
      }).populate({ path: 'user', select: 'firstName lastName avatar' });
    }
    res.status(httpStatus.OK).json(reviews);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const attractionID = req.params.attractionID;
    const userID = req.userID;
    const attraction = await Attraction.findById(attractionID);

    // handle  images uploading to S3
    let s3FilesSaved = [];
    if (req.files && req.files.length !== 0) {
      s3FilesSaved = await s3Upload(req.files);
    }

    if (!attraction) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Attraction not found' });
    }

    const { rating: userRating, content } = req.body;
    const newReview = new Review({
      attraction: attractionID,
      content,
      rating: userRating,
      user: userID,
      images: s3FilesSaved,
    });
    const savedReview = await newReview.save();

    // Populate the 'user' field in the saved review
    await savedReview.populate('user', 'firstName lastName avatar');

    // TODO change rating score of that attraction
    let updatedAttraction = { ...attraction };
    if (savedReview) {
      updatedAttraction = await updateAttractionRating(
        attraction,
        userRating,
        Number(attraction.noRatings),
        Number(attraction.noRatings) + 1,
      );
    }

    res.status(httpStatus.CREATED).json({
      review: savedReview,
      attraction: {
        rating: updatedAttraction.rating,
        noRatings: updatedAttraction.noRatings,
      },
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const editReview = async (req, res) => {
  try {
    const { attractionID, reviewID } = req.params;
    // Check if attraction and review exist
    const attraction = await Attraction.findById(attractionID);
    const review = await Review.findById(reviewID);
    if (!attraction || !review) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Attraction or review not found' });
    }
    // Create an object to store the updated data
    const updatedData = {};
    const allowedFields = ['content', 'rating']; // Update if new fields added

    Object.keys(req.body).forEach((field) => {
      if (allowedFields.includes(field)) {
        // Check if the field is allowed
        updatedData[field] = req.body[field];
      }
    });

    // TODO handle  images uploading to S3
    let s3FilesSaved = [];
    if (req.files && req.files.length !== 0) {
      s3FilesSaved = await s3Upload(req.files);
      updatedData.images = s3FilesSaved;
    }
    const updateReview = await Review.findByIdAndUpdate(
      reviewID,
      {
        $set: updatedData,
      },
      { new: true }, // Return the updated document
    ).populate('user', 'firstName lastName avatar');

    let updatedAttraction = { ...attraction };
    // Update rating for that destination
    if (req.body.rating && updateReview) {
      updatedAttraction = await updateAttractionRating(
        attraction,
        req.body.rating,
        Number(attraction.noRatings),
        Number(attraction.noRatings),
        review.rating,
      );
    }

    res.status(httpStatus.OK).json({
      review: updateReview,
      attraction: {
        rating: updatedAttraction.rating,
        noRatings: updatedAttraction.noRatings,
      },
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { attractionID, reviewID } = req.params;
    // Check if attraction and review exist
    const attraction = await Attraction.findById(attractionID);
    const review = await Review.findById(reviewID);
    if (!attraction || !review) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Attraction or review not found' });
    }

    const updatedAttraction = await updateAttractionRating(
      attraction,
      0,
      Number(attraction.noRatings),
      Number(attraction.noRatings) - 1,
      review.rating,
    );

    await Review.findByIdAndDelete(review._id);

    res.status(httpStatus.OK).json({ attraction: updatedAttraction, review });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const updateAttractionRating = async (
  attraction,
  userRating,
  oldNoRatings,
  newNoRatings,
  oldRating = 0,
) => {
  let updatedAttraction = { ...attraction };
  const newRating = calculateRating(
    attraction.rating ?? 0,
    oldNoRatings,
    newNoRatings,
    userRating,
    oldRating,
  );
  updatedAttraction = await Attraction.findByIdAndUpdate(
    attraction._id,
    {
      $set: {
        rating: newRating,
        noRatings: newNoRatings,
      },
    },
    {
      new: true,
    },
  );
  return updatedAttraction;
};
