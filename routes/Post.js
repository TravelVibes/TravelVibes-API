import express from 'express';

import { isAuth } from '../middleware/isAuth.js';
import {
  createPost,
  deletePost,
  fetchAllPosts,
  getPostDetail,
  updatePost,
} from '../controllers/Post.js';

const postRoutes = express.Router();

postRoutes.get('/', isAuth, fetchAllPosts);
postRoutes.get('/:id', isAuth, getPostDetail);
postRoutes.post('/', isAuth, createPost);
postRoutes.put('/:id', isAuth, updatePost);
postRoutes.delete('/:id', isAuth, deletePost);

export default postRoutes;
