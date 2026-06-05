const postService = require('../services/postService');

const createPost = async (req, res, next) => {
  try {
    const post = await postService.createPost(req.user.id, req.body);

    res.status(201).json({
      status: 'success',
      message: 'Post created successfully',
      data: {
        post
      }
    });
  } catch (error) {
    next(error);
  }
};

const listPosts = async (req, res, next) => {
  try {
    const posts = await postService.listActivePosts();

    res.status(200).json({
      status: 'success',
      data: {
        posts
      }
    });
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await postService.getActivePostById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        post
      }
    });
  } catch (error) {
    next(error);
  }
};

const listMyPosts = async (req, res, next) => {
  try {
    const posts = await postService.listMyPosts(req.user.id);

    res.status(200).json({
      status: 'success',
      data: {
        posts
      }
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await postService.updatePost(req.user.id, req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Post updated successfully',
      data: {
        post
      }
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await postService.deletePost(req.user.id, req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Post deleted successfully',
      data: {
        post
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  deletePost,
  getPostById,
  listMyPosts,
  listPosts,
  updatePost
};
