### API 목록

1. **사용자 관련 API**
   - 로그인
   - 회원가입
   - 이메일 중복 확인
   - 닉네임 중복 확인
   - 사용자 정보 수정
   - 비밀번호 변경
   - 사용자 삭제
   - 사용자 정보 조회
   - 로그인 상태 확인
   - 로그아웃

2. **파일 업로드 관련 API**
   - 프로필 이미지 업로드
   - 게시글 이미지 업로드

3. **게시글 관련 API**
   - 게시글 목록 조회
   - 게시글 상세 조회
   - 게시글 생성
   - 게시글 삭제
   - 게시글 수정
   - 게시글 조회수 증가
   - 게시글 좋아요 수 증가

4. **댓글 관련 API**
   - 댓글 추가
   - 댓글 목록 조회
   - 댓글 수정
   - 댓글 삭제


### 사용자 관련 API 명세서

#### 1. 로그인
- **URL**: `/users/login`
- **Method**: POST
- **Description**: 사용자 로그인.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "로그인 성공",
      "user": {
        "id": 1,
        "email": "user@example.com",
        "nickname": "nickname",
        "profile_image": "profile.jpg"
      }
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "로그인 실패"
    }
    ```

#### 2. 회원가입
- **URL**: `/users/signup`
- **Method**: POST
- **Description**: 사용자 회원가입.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "nickname": "nickname",
    "profile_image": "profile.jpg"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "회원가입이 완료되었습니다.",
      "user": {
        "id": 1,
        "email": "user@example.com",
        "nickname": "nickname",
        "profile_image": "profile.jpg"
      }
    }
    ```
  - **409 Conflict**:
    ```json
    {
      "message": "이미 사용 중인 이메일입니다."
    }
    ```
    ```json
    {
      "message": "이미 사용 중인 닉네임입니다."
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "회원가입 중 오류가 발생했습니다.",
      "error": "Error message"
    }
    ```

#### 3. 이메일 중복 확인
- **URL**: `/users/check-email`
- **Method**: GET
- **Description**: 이메일 중복 확인.
- **Query Parameters**:
  - `email`: 확인할 이메일 주소.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "사용 가능한 이메일입니다."
    }
    ```
    ```json
    {
      "message": "이미 사용 중인 이메일입니다."
    }
    ```

#### 4. 닉네임 중복 확인
- **URL**: `/users/check-nickname`
- **Method**: GET
- **Description**: 닉네임 중복 확인.
- **Query Parameters**:
  - `nickname`: 확인할 닉네임.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "사용 가능한 닉네임입니다."
    }
    ```
    ```json
    {
      "message": "이미 사용 중인 닉네임입니다."
    }
    ```

#### 5. 사용자 정보 수정
- **URL**: `/users/:userId`
- **Method**: PATCH
- **Description**: 사용자 정보 수정.
- **Headers**:
  - `Cookie`: 세션 쿠키.
- **Request Body**:
  ```json
  {
    "email": "new_email@example.com",
    "nickname": "new_nickname",
    "profile_image": "new_profile.jpg"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "사용자 정보가 수정되었습니다."
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "인증 실패"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "사용자 정보 수정 중 오류가 발생했습니다."
    }
    ```

#### 6. 비밀번호 변경
- **URL**: `/users/:userId/password`
- **Method**: PATCH
- **Description**: 비밀번호 변경.
- **Headers**:
  - `Cookie`: 세션 쿠키.
- **Request Body**:
  ```json
  {
    "current_password": "current_password123",
    "new_password": "new_password123"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "비밀번호가 성공적으로 변경되었습니다."
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "인증 실패"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "message": "현재 비밀번호가 올바르지 않습니다."
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "비밀번호 변경 중 오류가 발생했습니다."
    }
    ```

#### 7. 사용자 삭제
- **URL**: `/users/:userId`
- **Method**: DELETE
- **Description**: 사용자 삭제.
- **Headers**:
  - `Cookie`: 세션 쿠키.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "사용자가 성공적으로 삭제되었습니다."
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "인증 실패"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "사용자 삭제 중 오류가 발생했습니다."
    }
    ```

#### 8. 사용자 정보 조회
- **URL**: `/users/:userId`
- **Method**: GET
- **Description**: 사용자 정보 조회.
- **Headers**:
  - `Cookie`: 세션 쿠키.
- **Response**:
  - **200 OK**:
    ```json
    {
      "id": 1,
      "email": "user@example.com",
      "nickname": "nickname",
      "profile_image": "profile.jpg"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "인증 실패"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "사용자 정보를 조회하는 중 오류가 발생했습니다."
    }
    ```

#### 9. 로그인 상태 확인
- **URL**: `/users/auth/check`
- **Method**: GET
- **Description**: 로그인 상태 확인.
- **Headers**:
  - `Cookie`: 세션 쿠키.
- **Response**:
  - **200 OK**:
    ```json
    {
      "isLoggedIn": true
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "isLoggedIn": false
    }
    ```

#### 10. 로그아웃
- **URL**: `/users/logout`
- **Method**: POST
- **Description**: 로그아웃.
- **Headers**:
  - `Cookie`: 세션 쿠키.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "로그아웃 성공"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "로그아웃 중 오류가 발생했습니다."
    }
    ```
### 파일 업로드 관련 API 명세서

#### 1. 프로필 이미지 업로드
- **URL**: `/upload/profile`
- **Method**: POST
- **Description**: 사용자 프로필 이미지를 업로드합니다.
- **Headers**:
  - `Cookie`: 세션 쿠키.
  - `Content-Type`: `multipart/form-data`
- **Request Body**:
  - `profile_image`: 업로드할 프로필 이미지 파일.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "프로필 이미지가 성공적으로 업로드되었습니다.",
      "imageUrl": "path/to/uploaded/profile_image.jpg"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "인증 실패"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "프로필 이미지 업로드 중 오류가 발생했습니다."
    }
    ```

#### 2. 게시글 이미지 업로드
- **URL**: `/upload/post`
- **Method**: POST
- **Description**: 게시글 이미지를 업로드합니다.
- **Headers**:
  - `Cookie`: 세션 쿠키.
  - `Content-Type`: `multipart/form-data`
- **Request Body**:
  - `post_image`: 업로드할 게시글 이미지 파일.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "게시글 이미지가 성공적으로 업로드되었습니다.",
      "imageUrl": "path/to/uploaded/post_image.jpg"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "인증 실패"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "게시글 이미지 업로드 중 오류가 발생했습니다."
    }
    ```

### 게시글 관련 API 명세서

#### 1. 게시글 목록 조회
- **URL**: `/posts`
- **Method**: GET
- **Description**: 모든 게시글의 목록을 조회합니다.
- **Headers**:
  - `Cookie`: 세션 쿠키.
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "id": 1,
        "title": "Post Title",
        "post_image": "path/to/image.jpg",
        "author_email": "author@example.com",
        "author_nickname": "nickname",
        "author_profile_image": "path/to/profile.jpg",
        "date": "2023-06-11T10:00:00Z",
        "views": 100,
        "likes": 20,
        "commentsCount": 5
      },
      ...
    ]
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "인증 실패"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "게시글 목록 조회 중 오류가 발생했습니다."
    }
    ```

#### 2. 게시글 상세 조회
- **URL**: `/posts/:postId`
- **Method**: GET
- **Description**: 특정 게시글의 상세 정보를 조회합니다.
- **Headers**:
  - `Cookie`: 세션 쿠키.
- **Response**:
  - **200 OK**:
    ```json
    {
      "id": 1,
      "title": "Post Title",
      "content": "Post content...",
      "post_image": "path/to/image.jpg",
      "author_email": "author@example.com",
      "author_nickname": "nickname",
      "author_profile_image": "path/to/profile.jpg",
      "date": "2023-06-11T10:00:00Z",
      "views": 100,
      "likes": 20,
      "commentsCount": 5
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "인증 실패"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "게시글을 찾을 수 없습니다."
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "게시글 조회 중 오류가 발생했습니다."
    }
    ```

#### 3. 게시글 생성
- **URL**: `/posts`
- **Method**: POST
- **Description**: 새로운 게시글을 생성합니다.
- **Headers**:
  - `Cookie`: 세션 쿠키.
- **Request Body**:
  ```json
  {
    "title": "Post Title",
    "content": "Post content...",
    "post_image": "path/to/image.jpg"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "게시글이 성공적으로 생성되었습니다.",
      "postId": 1
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "인증 실패"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "게시글 생성 중 오류가 발생했습니다."
    }
    ```

#### 4. 게시글 삭제
- **URL**: `/posts/:postId`
- **Method**: DELETE
- **Description**: 특정 게시글을 삭제합니다.
- **Headers**:
  - `Cookie`: 세션 쿠키.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "게시글이 성공적으로 삭제되었습니다."
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "인증 실패"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "게시글을 찾을 수 없습니다."
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "게시글 삭제 중 오류가 발생했습니다."
    }
    ```

#### 5. 게시글 수정
- **URL**: `/posts/:postId`
- **Method**: PATCH
- **Description**: 특정 게시글을 수정합니다.
- **Headers**:
  - `Cookie`: 세션 쿠키.
- **Request Body**:
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content...",
    "post_image": "path/to/updated_image.jpg"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "게시글이 성공적으로 수정되었습니다."
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "인증 실패"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "게시글을 찾을 수 없습니다."
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "게시글 수정 중 오류가 발생했습니다."
    }
    ```

#### 6. 게시글 조회수 증가
- **URL**: `/posts/:postId/views`
- **Method**: POST
- **Description**: 특정 게시글의 조회수를 증가시킵니다.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "조회수가 증가했습니다."
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "게시글을 찾을 수 없습니다."
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "조회수 증가 중 오류가 발생했습니다."
    }
    ```

#### 7. 게시글 좋아요 수 증가
- **URL**: `/posts/:postId/like`
- **Method**: POST
- **Description**: 특정 게시글의 좋아요 수를 증가시킵니다.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "좋아요 수가 증가했습니다."
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "게시글을 찾을 수 없습니다."
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "좋아요 수 증가 중 오류가 발생했습니다."
    }
    ```

### 댓글 관련 API 명세서

#### 1. 댓글 추가
- **URL**: `/posts/:postId/comments`
- **Method**: POST
- **Description**: 특정 게시글에 댓글을 추가합니다.
- **Headers**:
  - `Cookie`: 세션 쿠키.
- **Request Body**:
  ```json
  {
    "content": "This is a comment"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "댓글이 성공적으로 추가되었습니다.",
      "commentId": 1
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "인증 실패"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "댓글 추가 중 오류가 발생했습니다."
    }
    ```

#### 2. 댓글 목록 조회
- **URL**: `/posts/:postId/comments`
- **Method**: GET
- **Description**: 특정 게시글의 댓글 목록을 조회합니다.
- **Headers**:
  - `Cookie`: 세션 쿠키.
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "id": 1,
        "content": "This is a comment",
        "author_email": "user@example.com",
        "author_nickname": "nickname",
        "author_profile_image": "path/to/profile.jpg",
        "created_at": "2023-06-11T10:00:00Z"
      },
      ...
    ]
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "인증 실패"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "댓글 목록 조회 중 오류가 발생했습니다."
    }
    ```

#### 3. 댓글 수정
- **URL**: `/posts/:postId/comments/:commentId`
- **Method**: PATCH
- **Description**: 특정 댓글을 수정합니다.
- **Headers**:
  - `Cookie`: 세션 쿠키.
- **Request Body**:
  ```json
  {
    "content": "Updated comment content"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "댓글이 성공적으로 수정되었습니다."
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "인증 실패"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "댓글을 찾을 수 없거나 수정할 권한이 없습니다."
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "댓글 수정 중 오류가 발생했습니다."
    }
    ```

#### 4. 댓글 삭제
- **URL**: `/posts/:postId/comments/:commentId`
- **Method**: DELETE
- **Description**: 특정 댓글을 삭제합니다.
- **Headers**:
  - `Cookie`: 세션 쿠키.
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "댓글이 성공적으로 삭제되었습니다."
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "인증 실패"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "댓글을 찾을 수 없거나 삭제할 권한이 없습니다."
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "댓글 삭제 중 오류가 발생했습니다."
    }
    ```
