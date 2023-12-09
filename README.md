# Simple REST Express + SQLite

## 사용법
Node.js LTS 버전이 설치되어 있어야 합니다.
```
$ npm i
$ node ./app
```
`mydb.sqlite` 자동 생성되면서 서버가 구동됩니다.  

## API 설명
`8080` 포트에서 동작합니다.  
GET `/api/articles` - 모든 게시글 가져오기  
GET `/api/articles/:id` - 아이디에 해당하는 게시글 가져오기  
POST `/api/articles` - 게시글 등록. `title` 과 `content` 를 보내세요.  
PUT `/api/articles/:id` - 게시글 수정. `title` 과 `content` 를 보내세요.  
DELETE `/api/articles/:id` - 게시글 삭제  

## 샘플 데이터 등록
SQLite3 를 설치한 후,
```
$ sqlite3 ./mydb.sqlite
sqlite > 
```
위 상태에서 `data_init.sql` 내용을 복사 붙여넣기 하세요.
```
sqlite > SELECT * FROM article;
1|제목1|내용1
2|제목2|내용2
3|제목3|내용3
```
이렇게 나올 시, 초기 데이터 세팅 성공입니다.  
SQLite 를 종료하겠습니다.  
```
sqlite > .quit
```

이후,
```
$ node ./app
```
실행해 서버를 구동하고 사용하세요.
