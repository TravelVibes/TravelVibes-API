import Post from '../models/Post.js';
import PostComment from '../models/PostComment.js';
import { httpStatus } from '../utils/httpStatus.js';

export const getAllComments = async (req, res) => {
  try {
    const postID = req.params.postID;
    const postFind = await Post.findById(postID);
    if (postFind == null) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'Can not find post' });
    }

    const comments = await PostComment.find({ post: postID }).populate(
      'user',
      'firstName lastName avatar',
    );

    res.status(httpStatus.OK).json(comments);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const userID = req.userID;
    const postID = req.params.postID;
    const { content } = req.body;

    const postFind = await Post.findById(postID);
    if (postFind == null) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'Can not find post' });
    }

    if (content.trim() === '') {
      return res
        .status(httpStatus.METHOD_NOT_ALLOWED)
        .json({ message: 'Cannot create comment without content' });
    }

    const newPostComment = new PostComment({
      post: postID,
      user: userID,
      content,
    });
    const savedComment = await newPostComment.save();

    const populatedComment = await savedComment.populate(
      'user',
      'firstName lastName avatar',
    );

    // Update comment number
    const updatedPost = await Post.findByIdAndUpdate(
      postID,
      {
        $set: {
          countComments: postFind.countComments + 1,
        },
      },
      {
        new: true,
        fields: 'countComments',
      },
    );

    res
      .status(httpStatus.CREATED)
      .json({ comment: populatedComment, post: updatedPost });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const userID = req.userID;
    const { postID, id: commentID } = req.params;
    const { content } = req.body;

    const comment = await PostComment.findOne({
      _id: commentID,
      post: postID,
      user: userID,
    });

    if (!comment) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'Can not find this comment' });
    }
    if (content.trim() !== comment.content) {
      const updatedComment = await PostComment.findByIdAndUpdate(
        commentID,
        {
          $set: {
            content,
            isEdited: true,
          },
        },
        {
          new: true,
        },
      );
      return res.status(httpStatus.OK).json(updatedComment);
    }
    res.status(httpStatus.OK).json(comment);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postID, id: commentID } = req.params;
    const post = await Post.findById(postID);
    const comment = await PostComment.findByIdAndDelete(commentID);
    if (post == null || comment == null) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'Can not find post or comment' });
    }
    // Update comment number
    const updatedPost = await Post.findByIdAndUpdate(
      postID,
      {
        $set: {
          countComments: post.countComments - 1,
        },
      },
      {
        new: true,
        fields: 'countComments',
      },
    );

    return res.status(httpStatus.OK).json({
      message: 'Delete comment done',
      post: updatedPost,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
