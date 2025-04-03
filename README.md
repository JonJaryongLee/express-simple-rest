# Simple REST Express + SQLite

## 사용법
Node.js LTS 버전이 설치되어 있어야 합니다.
```
$ npm i
$ node ./index.mjs
```
`mydb.sqlite` 자동 생성되면서 서버가 구동됩니다.  

## API 설명
`8080` 포트에서 동작합니다.  
GET `/api/v1/articles` - 모든 게시글 가져오기  
GET `/api/v1/articles/:id` - 아이디에 해당하는 게시글 가져오기  
POST `/api/v1/articles` - 게시글 등록. `title` 과 `content` 를 보내세요.  
PATCH `/api/v1/articles/:id` - 게시글 수정. `title` 과 `content` 를 보내세요.  
DELETE `/api/v1/articles/:id` - 게시글 삭제  


