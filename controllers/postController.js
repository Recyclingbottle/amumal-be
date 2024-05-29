const postModel = require("../models/postModel");

// 게시글 목록 조회
exports.listAllPosts = async (req, res) => {
  try {
    const posts = await postModel.getPostsForListing();
    res.json(posts);
  } catch (error) {
    console.error("게시글 목록 조회 실패:", error);
    res
      .status(500)
      .json({ message: "게시글 목록을 불러오는 중 오류가 발생했습니다." });
  }
};

// 게시글 상세 조회
exports.getPostDetails = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    await postModel.incrementViewCount(postId);
    const post = await postModel.getPostDetails(postId);

    if (post) {
      res.json(post);
    } else {
      res.status(404).send({ message: "게시글을 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("게시글 상세 조회 실패:", error);
    res
      .status(500)
      .json({ message: "게시글을 조회하는 중 오류가 발생했습니다." });
  }
};

// 게시글 생성
exports.createPost = async (req, res) => {
  try {
    const { title, content, post_image } = req.body;
    const newPost = await postModel.createPost({
      title,
      content,
      post_image,
      author_id: req.session.user.id,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("게시글 생성 중 오류 발생:", error);
    res.status(500).json({
      message: "게시글을 생성하는 중 알 수 없는 오류가 발생했습니다.",
    });
  }
};

// 게시글 삭제
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const success = await postModel.deletePost(postId);
    if (!success) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }
    res.status(200).json({ message: "게시글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    res.status(500).json({
      message: "게시글을 삭제하는 중 알 수 없는 오류가 발생했습니다.",
    });
  }
};

// 게시글 수정
exports.editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const success = await postModel.updatePost(postId, req.body);
    if (!success) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }
    res.status(200).json({ message: "게시글이 성공적으로 수정되었습니다." });
  } catch (error) {
    console.error("게시글 수정 중 오류 발생:", error);
    res.status(500).json({
      message: "게시글을 수정하는 중 알 수 없는 오류가 발생했습니다.",
    });
  }
};

// 댓글 추가
exports.addCommentToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { user } = req.session;
    const commentData = {
      user_id: user.id,
      content: req.body.content,
    };
    const newComment = await postModel.addComment(postId, commentData);
    res.status(201).json(newComment);
  } catch (error) {
    console.error("댓글 추가 중 오류 발생:", error);
    res
      .status(500)
      .json({ message: "댓글을 추가하는 중 오류가 발생했습니다." });
  }
};

// 댓글 목록 가져오기
exports.getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await postModel.getComments(postId);
    res.status(200).json(comments);
  } catch (error) {
    console.error("댓글 조회 중 오류 발생:", error);
    res
      .status(500)
      .json({ message: "댓글을 조회하는 중 오류가 발생했습니다." });
  }
};

// 댓글 수정
exports.editComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { user } = req.session;
    const success = await postModel.editComment(
      postId,
      commentId,
      req.body.content,
      user.email
    );
    if (!success) {
      return res
        .status(404)
        .json({ message: "댓글을 찾을 수 없거나 수정할 권한이 없습니다." });
    }
    res.status(200).json({ message: "댓글이 성공적으로 수정되었습니다." });
  } catch (error) {
    console.error("댓글 수정 중 오류 발생:", error);
    res
      .status(500)
      .json({ message: "댓글을 수정하는 중 오류가 발생했습니다." });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { user } = req.session;
    const success = await postModel.deleteComment(
      postId,
      commentId,
      user.email
    );
    if (!success) {
      return res
        .status(404)
        .json({ message: "댓글을 찾을 수 없거나 삭제할 권한이 없습니다." });
    }
    res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("댓글 삭제 중 오류 발생:", error);
    res
      .status(500)
      .json({ message: "댓글을 삭제하는 중 오류가 발생했습니다." });
  }
};

// 좋아요 수 증가
exports.incrementLikeCount = async (req, res) => {
  try {
    const { postId } = req.params;
    const success = await postModel.incrementLikeCount(postId);
    if (!success) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }
    res.status(200).json({ message: "좋아요 수가 증가했습니다." });
  } catch (error) {
    console.error("좋아요 수 증가 중 오류 발생:", error);
    res
      .status(500)
      .json({ message: "좋아요 수를 증가하는 중 오류가 발생했습니다." });
  }
};
