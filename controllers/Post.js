import Post from '../models/Post.js';
import { httpStatus } from '../utils/httpStatus.js';

export const fetchAllPosts = async (req, res) => {
  try {
    // TODO implement following logic later

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate([
        {
          path: 'author',
          select: 'firstName lastName avatar',
        },
        { path: 'attractions', select: 'name coordinates address' },
        { path: 'upvote', select: 'firstName lastName avatar' },
      ]);

    res.status(httpStatus.OK).json(posts);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const getPostDetail = async (req, res) => {
  try {
    const { id: postID } = req.params;
    const post = await Post.findById(postID).populate([
      {
        path: 'author',
        select: 'firstName lastName avatar',
      },
      { path: 'attractions', select: '-searchText ' },
      { path: 'upvote', select: 'firstName lastName avatar' },
    ]);

    if (post == null) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'Can not find post' });
    }

    res.status(httpStatus.OK).json(post);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const userID = req.userID;
    const { caption, attractions } = req.body;
    const newPost = new Post({
      caption,
      attractions,
      upvote: [userID],
      isUpvote: true,
      author: userID,
      countComments: 0,
    });

    const savedPost = await newPost.save();

    // Create a new journey
    const populatedPost = await Post.populate(savedPost, [
      {
        path: 'author',
        select: 'firstName lastName avatar',
      },
      {
        path: 'attractions',
      },
      { path: 'upvote', select: 'firstName lastName avatar' },
    ]);

    res.status(httpStatus.CREATED).json(populatedPost);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postID = req.params.id;
    const userID = req.userID;

    // Check right
    const postFind = await Post.findById(postID);
    if (postFind == null) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'Can not find post' });
    }
    if (postFind.author.toString() !== userID) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json({ message: 'Can not edit this post' });
    }

    const updateData = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      postID,
      { $set: updateData },
      { new: true }, // Return the updated document
    ).populate([
      {
        path: 'author',
        select: 'firstName lastName avatar',
      },
      { path: 'attractions', select: '-searchText ' },
      { path: 'upvote', select: 'firstName lastName avatar' },
    ]);

    res.status(httpStatus.OK).json(updatedPost);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (post == null) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'Can not find post' });
    }
    return res.status(httpStatus.OK).json({
      message: 'Delete post done',
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
