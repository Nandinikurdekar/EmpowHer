const commentService = require('../services/commentService');

const createComment = async (req, res, next) => {
  try {
    const comment = await commentService.createComment(req.user.id, req.params.postId, req.body);

    res.status(201).json({
      status: 'success',
      message: 'Comment created successfully',
      data: {
        comment
      }
    });
  } catch (error) {
    next(error);
  }
};

const listCommentsByPost = async (req, res, next) => {
  try {
    const comments = await commentService.listCommentsByPost(req.params.postId);

    res.status(200).json({
      status: 'success',
      data: {
        comments
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const comment = await commentService.updateComment(req.user.id, req.params.commentId, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Comment updated successfully',
      data: {
        comment
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await commentService.deleteComment(req.user.id, req.params.commentId);

    res.status(200).json({
      status: 'success',
      message: 'Comment deleted successfully',
      data: {
        comment
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  deleteComment,
  listCommentsByPost,
  updateComment
};
