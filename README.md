# 업무관리 앱

간단한 업무(Task) 추가/삭제/상태변경 기능을 제공하는 풀스택 웹앱입니다.

## 기술스택
- 서버: FastAPI + Python 3.11 + SQLite
- 프론트: Vanilla JS + Tailwind CDN
- 폴더 구조: `backend/`, `frontend/` 분리, FastAPI가 `frontend/`를 정적 파일로 서빙

## 실행 방법
```
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```
서버 실행 후 http://localhost:8000 에서 접속

## 기능
- 업무 추가
- 업무 삭제
- 업무 상태 변경 (대기 / 진행중 / 완료)

## API
| Method | Endpoint | 설명 |
| --- | --- | --- |
| GET | `/api/tasks` | 업무 목록 조회 |
| POST | `/api/tasks` | 업무 추가 |
| PATCH | `/api/tasks/{task_id}` | 업무 상태 변경 |
| DELETE | `/api/tasks/{task_id}` | 업무 삭제 |
