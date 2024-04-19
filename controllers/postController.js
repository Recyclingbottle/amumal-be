const postModel = require("../models/postModel");
const { post } = require("../routes/userRoutes");

/**
 * 모든 게시글의 목록을 조회하여 반환합니다.
 * 각 게시글은 ID, 제목, 작성자 정보, 날짜, 조회수, 좋아요 수, 댓글 수를 포함합니다.
 */
exports.listAllPosts = (req, res) => {
  try {
    const posts = postModel.getPostsForListing(); // 게시글 목록을 모델에서 가져옴
    res.json(posts); // 조회된 게시글 목록을 JSON 형식으로 응답
  } catch (error) {
    console.error("게시글 목록 조회 실패:", error);
    res
      .status(500)
      .json({ message: "게시글 목록을 불러오는 중 오류가 발생했습니다." });
  }
};

/**
 * 요청된 ID에 해당하는 특정 게시글의 상세 정보를 조회합니다.
 * 성공적으로 조회된 경우 게시글 정보를, 찾을 수 없는 경우 404 에러를 반환합니다.
 */
exports.getPostDetails = (req, res) => {
  try {
    const postId = parseInt(req.params.postId); // URL 파라미터에서 postId 추출
    const post = postModel.getPostDetails(postId); // 특정 게시글 상세 정보 가져오기

    if (post) {
      res.json(post); // 조회된 게시글 정보 응답
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

/**
 * 새 게시글을 생성합니다. 요청 본문에서 게시글 데이터를 받아 처리합니다.
 * 성공적으로 생성된 경우 생성된 게시글 정보를, 실패한 경우 오류 메시지를 반환합니다.
 */
exports.createPost = async (req, res) => {
  try {
    console.log("Creating new post with data:", req.body); // 게시글 생성 요청 데이터 로깅
    const newPost = await postModel.createPost(req.body); // 새 게시글 생성

    if (!newPost) {
      console.error("게시글 생성 실패");
      return res.status(400).json({ message: "게시글을 생성하지 못했습니다." });
    }
    res.status(201).json(newPost); // 성공적으로 생성된 게시글 정보 응답
  } catch (error) {
    console.error("게시글 생성 중 오류 발생:", error);
    res.status(500).json({
      message: "게시글을 생성하는 중 알 수 없는 오류가 발생했습니다.",
    });
  }
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params; // URL에서 게시글 ID 추출
  const data = postModel.readPosts(); // 모든 게시글 데이터 읽기
  const posts = data.posts; // 게시글 배열 추출

  const postIndex = posts.findIndex((post) => post.id === parseInt(postId)); // 게시글 인덱스 찾기
  if (postIndex === -1) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." }); // 게시글이 존재하지 않는 경우
  }

  const post = posts[postIndex]; // 해당 게시글 데이터
  if (post.author.email !== req.user.userId) {
    // 게시글 작성자와 요청자의 이메일 비교
    return res
      .status(403)
      .json({ message: "이 게시글을 삭제할 권한이 없습니다." });
  }

  // 게시글 삭제
  posts.splice(postIndex, 1);
  postModel.writePosts({ posts }); // 변경된 데이터 저장
  res.status(200).json({ message: "게시글이 성공적으로 삭제되었습니다." });
};

exports.editPost = async (req, res) => {
  const { postId } = req.params;
  const { title, content, images } = req.body;

  // 게시글 정보 가져오기
  const postDetails = postModel.getPostDetails(postId);
  //오류 메모 : postID 가 getPostDetails 에 문자열로 들어가서 문제가 발생하였다.
  //getPostDetails 함수에서 직접 int 형변환을 하였다.

  // postDetails 검증
  if (!postDetails) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }

  // 작성자 확인 로직
  if (postDetails.author.email !== req.user.userId) {
    return res.status(403).json({ message: "수정 권한이 없습니다." });
  }

  // 게시글 업데이트
  const updatedPost = postModel.updatePost(postId, { title, content, images });
  if (updatedPost) {
    res.json(updatedPost);
  } else {
    res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }
};

// 댓글 추가 요청 처리
exports.addCommentToPost = async (req, res) => {
  const { postId } = req.params;
  const { email, nickname, profile_image } = req.user; // JWT 토큰에서 사용자 정보 추출
  const commentData = {
    author: {
      email,
      nickname,
      profile_image,
    },
    content: req.body.content,
  };

  console.log("Attempting to add comment to post ID:", postId);
  const newComment = postModel.addComment(parseInt(postId), commentData);
  if (!newComment) {
    console.log("Failed to add comment to post or post not found.");
    res
      .status(404)
      .json({ message: "게시글을 찾을 수 없거나 댓글 추가에 실패했습니다." });
  } else {
    console.log("Comment added successfully:", newComment);
    res.status(201).json(newComment);
  }
};

exports.getPostComments = (req, res) => {
  const { postId } = req.params;
  const comments = postModel.getComments(postId);
  if (!comments) {
    res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  } else {
    res.json(comments);
  }
};

// 댓글 수정
exports.editComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const userEmail = req.user.email; // 토큰에서 추출된 사용자 이메일
  const newContent = req.body.content;

  const updatedComment = postModel.editComment(
    postId,
    commentId,
    newContent,
    userEmail
  );
  if (!updatedComment) {
    return res.status(404).json({
      message: "게시글이나 댓글을 찾을 수 없거나 수정 권한이 없습니다.",
    });
  }

  res.json({ message: "댓글이 수정되었습니다.", comment: updatedComment });
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const userEmail = req.user.email;

  const success = postModel.deleteComment(postId, commentId, userEmail);
  if (!success) {
    return res.status(404).json({
      message: "게시글이나 댓글을 찾을 수 없거나 삭제 권한이 없습니다.",
    });
  }

  res.json({ message: "댓글이 삭제되었습니다." });
};
