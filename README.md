# 닷컴 (Dotcom)

## 설명
닷컴은 Node.js와 Express를 기반으로 기본적인 웹 애플리케이션 기능을 구현한 백엔드 프로젝트입니다.

## 기능
1. **회원가입 및 로그인**
    - 이메일과 비밀번호를 이용한 회원가입
    - JWT를 이용한 로그인 인증
    - 리프레시 토큰을 통한 엑세스 토큰 갱신
    - 카카오 계정을 이용한 간편 로그인 및 회원가입

2. **게시글 관리**
    - 게시글 작성, 조회, 수정, 삭제
    - 최대 10개의 이미지 업로드 (AWS S3 저장)
    - 게시글 목록 정렬, 페이징, 필터링 기능 제공

3. **채팅 기능**
    - 실시간 채팅 기능 (Socket.IO 사용)

## 설치 방법
1. 리포지토리를 클론합니다:
   ```bash
   https://github.com/gambaesi/dotcom.git
   ```
2. 프로젝트 디렉토리로 이동:
   ```bash
   cd dotcom
   ```
3. 의존성 설치:
   ```bash
   npm install
   ```
4. 개발 서버 실행:
   ```bash
   npm start
   ```
5. 서버가 실행되면 Swagger 문서를 통해 API를 확인하고, Try it out 버튼을 눌러 직접 테스트할 수 있습니다.
   ```markdown
   [Swagger 문서] https://app.swaggerhub.com/apis-docs/gambaesi/dotcom/v1.0.0#/

## 기술 스택
- **Backend Framework**: Node.js, Express
- **Database**: MySQL, Sequelize
- **Authentication**: JWT
- **Cloud Storage**: AWS S3
- **Documentation**: Swagger
- **Version Control**: Git, GitHub
