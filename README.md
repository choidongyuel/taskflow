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
- 업무 추가 / 삭제
- 업무 상태 변경 (대기 / 진행중 / 완료)
- 전체 진행도 대시보드 (완료율, 상태별 개수)
- 마감일 지정 및 지연 여부 표시
- 우선순위 지정 (높음 / 보통 / 낮음) 및 정렬 (최신순 / 우선순위순)

## API
| Method | Endpoint | 설명 |
| --- | --- | --- |
| GET | `/api/tasks?sort=created\|priority` | 업무 목록 조회 (기본 최신순, `priority`로 우선순위순 정렬) |
| POST | `/api/tasks` | 업무 추가 (`title`, `due_date`, `priority`) |
| PATCH | `/api/tasks/{task_id}` | 업무 상태 변경 |
| DELETE | `/api/tasks/{task_id}` | 업무 삭제 |
