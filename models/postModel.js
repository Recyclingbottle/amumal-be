const pool = require("../db");

// 게시글 생성
exports.createPost = async (postData) => {
  const [result] = await pool.query(
    "INSERT INTO Posts (title, content, image, user_id, created_at, view_count, like_count, comment_count) VALUES (?, ?, ?, ?, NOW(), 0, 0, 0)",
    [postData.title, postData.content, postData.post_image, postData.author_id]
  );
  return result.insertId;
};

// 게시글 목록 조회
exports.getPostsForListing = async () => {
  const [rows] = await pool.query(
    `SELECT 
      p.id, 
      p.title, 
      p.image AS post_image, 
      u.email AS author_email, 
      u.nickname AS author_nickname, 
      u.profile_picture AS author_profile_image, 
      p.created_at AS date, 
      p.view_count AS views, 
      p.like_count AS likes, 
      (SELECT COUNT(*) FROM Comments c WHERE c.post_id = p.id) AS commentsCount 
    FROM Posts p 
    JOIN Users u ON p.user_id = u.id`
  );
  return rows;
};

// 게시글 상세 조회
exports.getPostDetails = async (postId) => {
  const [rows] = await pool.query(
    `SELECT 
      p.*, 
      u.email AS author_email, 
      u.nickname AS author_nickname, 
      u.profile_picture AS author_profile_image 
    FROM Posts p 
    JOIN Users u ON p.user_id = u.id 
    WHERE p.id = ?`,
    [postId]
  );
  return rows[0];
};

// 게시글 삭제
exports.deletePost = async (postId) => {
  const [result] = await pool.query("DELETE FROM Posts WHERE id = ?", [postId]);
  return result.affectedRows > 0;
};

// 게시글 수정
exports.updatePost = async (postId, updateData) => {
  const fields = [];
  const values = [];

  if (updateData.title) {
    fields.push("title = ?");
    values.push(updateData.title);
  }

  if (updateData.content) {
    fields.push("content = ?");
    values.push(updateData.content);
  }

  if (updateData.post_image) {
    fields.push("image = ?");
    values.push(updateData.post_image);
  }

  values.push(postId);

  const query = `UPDATE Posts SET ${fields.join(", ")} WHERE id = ?`;
  const [result] = await pool.query(query, values);

  return result.affectedRows > 0;
};

// 조회수 증가
exports.incrementViewCount = async (postId) => {
  const [result] = await pool.query(
    "UPDATE Posts SET view_count = view_count + 1 WHERE id = ?",
    [postId]
  );
  return result.affectedRows > 0;
};

// 좋아요 수 증가
exports.incrementLikeCount = async (postId) => {
  const [result] = await pool.query(
    "UPDATE Posts SET like_count = like_count + 1 WHERE id = ?",
    [postId]
  );
  return result.affectedRows > 0;
};

// 댓글 추가
exports.addComment = async (postId, commentData) => {
  const [result] = await pool.query(
    "INSERT INTO Comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())",
    [postId, commentData.user_id, commentData.content]
  );
  return result.insertId;
};

// 댓글 목록 가져오기
exports.getComments = async (postId) => {
  const [rows] = await pool.query(
    `SELECT 
      c.*, 
      u.email AS author_email, 
      u.nickname AS author_nickname, 
      u.profile_picture AS author_profile_image 
    FROM Comments c 
    JOIN Users u ON c.user_id = u.id 
    WHERE c.post_id = ?`,
    [postId]
  );
  return rows;
};

// 댓글 수정
exports.editComment = async (postId, commentId, newContent, userEmail) => {
  const [user] = await pool.query("SELECT id FROM Users WHERE email = ?", [
    userEmail,
  ]);
  if (!user.length) return null;

  const [result] = await pool.query(
    "UPDATE Comments SET content = ? WHERE id = ? AND post_id = ? AND user_id = ?",
    [newContent, commentId, postId, user[0].id]
  );

  return result.affectedRows > 0;
};

// 댓글 삭제
exports.deleteComment = async (postId, commentId, userEmail) => {
  const [user] = await pool.query("SELECT id FROM Users WHERE email = ?", [
    userEmail,
  ]);
  if (!user.length) return false;

  const [result] = await pool.query(
    "DELETE FROM Comments WHERE id = ? AND post_id = ? AND user_id = ?",
    [commentId, postId, user[0].id]
  );

  return result.affectedRows > 0;
};
