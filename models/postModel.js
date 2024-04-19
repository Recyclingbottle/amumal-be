const fs = require("fs");
const path = require("path");
const postsFilePath = path.join(__dirname, "..", "data", "posts.json");

/**
 * 게시물 데이터를 파일에서 읽어옵니다.
 * @returns {Array} 게시물 배열
 */
const readPosts = () => {
  try {
    return JSON.parse(fs.readFileSync(postsFilePath, "utf8"));
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return [];
  }
};

/**
 * 게시물 데이터를 파일에 씁니다.
 * @param {Array} data 게시물을 포함하고 있는 전체 데이터 객체
 */
const writePosts = (data) => {
  try {
    fs.writeFileSync(postsFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing JSON file:", error);
  }
};

/**
 * 모든 게시물을 반환합니다.
 * @returns {Array} 모든 게시물 배열
 */
exports.findAll = () => {
  return readPosts().posts;
};

/**
 * 특정 ID를 가진 게시물을 찾습니다.
 * @param {number} id 게시물 ID
 * @returns {Object|null} 게시물 객체 또는 null
 */
exports.findById = (id) => {
  const posts = readPosts().posts;
  return posts.find((post) => post.id === id);
};

/**
 * 새로운 게시물을 생성하고 파일에 저장합니다.
 * @param {Object} postData 새 게시물 데이터
 * @returns {Object} 생성된 게시물
 */
exports.create = (postData) => {
  const data = readPosts();
  const newPost = { id: data.posts.length + 1, ...postData };
  data.posts.push(newPost);
  writePosts(data);
  return newPost;
};

/**
 * 특정 ID의 게시물을 업데이트합니다.
 * @param {number} id 업데이트할 게시물의 ID
 * @param {Object} postData 업데이트할 게시물 데이터
 * @returns {Object|null} 업데이트된 게시물 또는 null
 */
exports.update = (id, postData) => {
  const data = readPosts();
  const index = data.posts.findIndex((post) => post.id === id);
  if (index !== -1) {
    data.posts[index] = { ...data.posts[index], ...postData };
    writePosts(data);
    return data.posts[index];
  } else {
    return null;
  }
};

/**
 * 특정 ID의 게시물을 삭제합니다.
 * @param {number} id 삭제할 게시물의 ID
 * @returns {Object|null} 삭제된 게시물 객체 또는 null
 */
exports.delete = (id) => {
  const data = readPosts();
  const index = data.posts.findIndex((post) => post.id === id);
  if (index !== -1) {
    const deletedPost = data.posts.splice(index, 1);
    writePosts(data);
    return deletedPost[0];
  } else {
    return null;
  }
};
