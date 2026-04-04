# 말씀나눔

같은 말씀을 함께 묵상하고 기도제목과 감사나눔을 남기는 반응형 Next.js 웹앱입니다.

## 기술 스택
- Next.js
- TypeScript
- Tailwind CSS
- Supabase

## 시작 방법
```bash
npm install
cp .env.example .env.local
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 환경변수
`.env.local`

```bash
NEXT_PUBLIC_APP_NAME=말씀나눔
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## Supabase 설정
1. Supabase 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 실행
3. SQL Editor에서 오늘의 말씀 seed SQL 실행
4. `.env.local`에 URL / Service Role Key 입력
5. `npm run dev` 실행

## 주요 화면
- 홈 화면
- 오늘의 말씀 카드 화면
- 즐겨찾기 화면
- 가족 피드 화면
- 지난 말씀 상세 화면

## 다음 확장 아이디어
- 대한성서공회 본문 읽기 링크 연결
- Pixabay API 서버 캐시 연동
- 푸시/알림 기능
- 묵상 기록 저장 API 연동
- 작성/조회 권한 제어

## Deployment Note
- Trigger production redeploy.
