const fs = require("fs");
const path = require("path");
const postsFilePath = path.join(__dirname, "..", "data", "post.json");

// 게시물 데이터를 읽어오는 함수
function readPosts() {
  try {
    const data = fs.readFileSync(postsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("게시물 데이터 읽기 실패:", error);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

// 게시물 데이터를 저장하는 함수
function writePosts(data) {
  try {
    fs.writeFileSync(postsFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("게시물 데이터 쓰기 실패:", error);
  }
}

// 댓글을 게시글에 추가하는 함수
exports.addComment = (postId, commentData) => {
  const postsData = readPosts();
  const post = postsData.posts.find((post) => post.id === parseInt(postId));
  if (!post) {
    console.log("No post found with ID:", postId);
    return null; // 게시글이 존재하지 않을 경우
  }

  const newCommentId =
    post.comments.length > 0
      ? Math.max(...post.comments.map((c) => c.id)) + 1
      : 1;
  const newComment = {
    id: newCommentId,
    ...commentData,
    date: new Date().toISOString(),
  };
  post.comments.push(newComment);
  writePosts(postsData);
  console.log("New comment added:", newComment);
  return newComment;
};

//특정 게시글에 대한 댓글 가져오기
exports.getComments = (postId) => {
  const posts = readPosts();
  const post = posts.posts.find((post) => post.id === parseInt(postId));
  return post ? post.comments : null;
};

// 게시글 수정 함수
exports.updatePost = (postId, updateData) => {
  const postsData = readPosts();
  const postIndex = postsData.posts.findIndex(
    (post) => post.id === parseInt(postId)
  );

  if (postIndex === -1) {
    return null; // 게시글이 존재하지 않을 경우 null 반환
  }

  const post = postsData.posts[postIndex];
  // 제목, 내용, 사진 데이터를 업데이트
  postsData.posts[postIndex] = {
    ...post,
    title: updateData.title || post.title,
    content: updateData.content || post.content,
    images: updateData.images || post.images,
    date: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""), // 수정 날짜 업데이트
  };

  writePosts(postsData); // 변경된 데이터 저장
  return postsData.posts[postIndex];
};

exports.createPost = (postData) => {
  const data = readPosts();
  const newId =
    data.posts.length > 0
      ? Math.max(...data.posts.map((post) => post.id)) + 1
      : 1;
  const newPost = {
    id: newId,
    title: postData.title,
    content: postData.content,
    author: postData.author,
    date: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
    views: 0,
    likes: 0,
    comments: [],
    commentsCount: 0,
  };
  data.posts.push(newPost);
  writePosts(data);
  return newPost;
};

exports.getPostsForListing = () => {
  const data = readPosts();
  return data.posts.map((post) => ({
    id: post.id,
    title: post.title,
    author: post.author,
    date: post.date,
    views: post.views,
    likes: post.likes,
    commentsCount: post.comments.length,
  }));
};

exports.getPostDetails = (id) => {
  const data = readPosts();
  const postId = parseInt(id); // ID를 정수로 변환
  const post = data.posts.find((post) => post.id === postId);
  return post || null; // 찾은 게시물이 없다면 null 반환
};

exports.deletePost = (postId) => {
  const postsData = readPosts();
  const postIndex = postsData.posts.findIndex((post) => post.id === postId);
  if (postIndex === -1) {
    return false; // 게시물을 찾지 못한 경우
  }
  postsData.posts.splice(postIndex, 1);
  writePosts(postsData);
  return true; // 게시물 삭제 성공
};

// readPosts와 writePosts 함수를 외부에서도 사용할 수 있게 내보내기
exports.readPosts = readPosts;
exports.writePosts = writePosts;

// 댓글 수정 함수
exports.editComment = (postId, commentId, newContent, userEmail) => {
  const data = readPosts();
  const post = data.posts.find((post) => post.id === parseInt(postId));
  if (!post) return null;

  const comment = post.comments.find(
    (comment) => comment.id === parseInt(commentId)
  );
  if (!comment || comment.author.email !== userEmail) return null;

  comment.content = newContent;
  writePosts(data);
  return comment;
};

// 댓글 삭제 함수
exports.deleteComment = (postId, commentId, userEmail) => {
  const data = readPosts();
  const post = data.posts.find((post) => post.id === parseInt(postId));
  if (!post) return false;

  const commentIndex = post.comments.findIndex(
    (comment) =>
      comment.id === parseInt(commentId) && comment.author.email === userEmail
  );
  if (commentIndex === -1) return false;

  post.comments.splice(commentIndex, 1);
  writePosts(data);
  return true;
};
