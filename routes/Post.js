import express from 'express';

import { isAuth } from '../middleware/isAuth.js';
import {
  createPost,
  deletePost,
  fetchAllPosts,
  getPostDetail,
  updatePost,
} from '../controllers/Post.js';

import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} from '../controllers/PostComment.js';
import { vote } from '../controllers/Upvote.js';

const postRoutes = express.Router();

postRoutes.get('/', isAuth, fetchAllPosts);
postRoutes.get('/:id', isAuth, getPostDetail);
postRoutes.post('/', isAuth, createPost);
postRoutes.put('/:id', isAuth, updatePost);
postRoutes.delete('/:id', isAuth, deletePost);

// Routes for comments
postRoutes.get('/:postID/comments', isAuth, getAllComments);
postRoutes.post('/:postID/comments', isAuth, createComment);
postRoutes.put('/:postID/comments/:id', isAuth, updateComment);
postRoutes.delete('/:postID/comments/:id', isAuth, deleteComment);

// Routes for upvote/ downvote
postRoutes.post('/:postID/vote', isAuth, vote);

export default postRoutes;
