import Post from '../models/Post.js';
import { httpStatus } from '../utils/httpStatus.js';

export const vote = async (req, res) => {
  try {
    const userID = req.userID;
    const { postID } = req.params;
    const post = await Post.findById(postID).populate({
      path: 'upvote',
      select: '_id',
    });
    if (post == null) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'Can not find post' });
    }

    // check if userID is in list of upvote
    const upvoteList = [...post.upvote];
    const foundUpvoteIndex = upvoteList.findIndex(
      (vote) => vote._id.toString() === userID,
    );
    if (foundUpvoteIndex !== -1) {
      upvoteList.splice(foundUpvoteIndex, 1);
    } else {
      upvoteList.push({ _id: userID });
    }

    // Update post vote
    const updatedPost = await Post.findByIdAndUpdate(
      postID,
      {
        $set: {
          upvote: upvoteList,
        },
      },
      { new: true },
    ).populate([
      {
        path: 'author',
        select: 'firstName lastName avatar',
      },
      { path: 'attractions', select: '-searchText ' },
      { path: 'upvote', select: 'firstName lastName avatar' },
    ]);

    res
      .status(httpStatus.CREATED)
      .json({ post: updatedPost, upvote: upvoteList });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
