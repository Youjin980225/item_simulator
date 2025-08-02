# 🏺Item Simulator Project🏺- 1조 박유진
#### 1. 프로젝트 개요
  게임 내 캐릭터와 아이템을 생성, 수정, 조회 할 수 있는 시뮬레이터 API 서버입니다.
  
  RESTful API 형식으로 구성되었으며, Prisma를 통해 mySQL과 통신합니다.
  
#### 2. 기술스택
  - 💻언어 및 런타임 : Java Script, Node.js(Java Script런타임)
  - 📦패키지 매니저 : yarn
  
 <주요 의존성>   
  - 🛠️서버 및 미들웨어 : `express`  `cookie-parser`
  - 🔐보안 : `bcrypt` `jwt(jsonwebtoken)`
  - 📦ORM : `prisma`
  - 🧾Logging : `winston`
  - 🗄️데이터베이스 : `mySQL`


#### 3. 프로젝트 구조
      ├── 📁prisma
      │ └── 📄schema.prisma
      ├── 📁src
      │ └── 📁middlewares
      │   ├──📄auth.middleware.js
      │   ├──📄error-handling.middleware.js
      │   ├──📄log.middleware.js      
      │ └── 📁routes
      │   ├──📄character.router.js
      │   ├──📄item.router.js
      │   ├──📄users.router.js
      │ └── 📁utils\prisma
      │   ├──📄index.js
      │ └── 📁app.js 
      └── 📄README.md
#### 4. API 명세서
- 사용자 정보 조회 API
  
| 기능 | Method/Url | RequestBody|
| --- | --- | --- |
| 회원가입| `POST/auth/sign-up` |회원가입 기능(사용자 정보 생성)|
|사용자 정보 조회|`GET/user/:userId` | userId, Id, email, unseInfo(name, age, gender, profileImage) |
| 로그인 | `POST/auth/login` | 로그인 기능 |

     
  - 캐릭터 조회 API

| 기능 | Method/Url | RequestBody|
| --- | --- | --- |
| 캐릭터 생성| `POST/create-character`|캐릭터를 생성(이름 중복 확인)|
|캐릭터 삭제|`DELETE/character/:charcaterID` | 캐릭터를 삭제 |
| 캐릭터 정보 조회 | `GET/character/:characterId` | characterName, characterLevel, characterExp, health, power, money |


     
- 캐릭터 조회 API
     
| 기능 | Method/URL | RequestBody |
| --- | --- | --- |
| 아이템 생성 | `POST/item` | 아이템을 생성 |
| 아이템 수정 | `PATCH/item/:itemId` | 아이템 정보를 수정 |
| 아이템 삭제 | `DELETE/item/:itemId` | 아이템을 삭제 |
| 아이템 목록 조회 | `GET/item` | itemId, itemCode, itemName, itemPrice |
| 아이템 상세 조회 | `GET/item/:itemId | itemId, itemCode, itemName, itemHealth, itemPower, itemPrice` |
