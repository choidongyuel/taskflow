# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트: 업무관리 풀스택 웹앱

## 기술스택
- 서버: FastAPI + Python 3.11 + SQLite (`backend/main.py`, DB 파일 `backend/taskflow.db`, 실행 시 자동 생성)
- 프론트: Vanilla JS + Tailwind CDN (빌드 과정 없음, `frontend/index.html`에서 CDN 스크립트로 로드)
- 폴더: `backend/`와 `frontend/` 분리. FastAPI가 `StaticFiles`로 `frontend/`를 루트(`/`)에 마운트하여 별도 프론트 서버 없이 단일 프로세스로 서빙

## 실행 방법
```
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```
서버 실행 후 http://localhost:8000 에서 프론트엔드와 API를 함께 사용

## 아키텍처
- 단일 `tasks` 테이블(`id`, `title`, `status`)로 상태를 관리하는 단순 CRUD 구조
- `status`는 `todo` / `in_progress` / `done` 세 값만 허용(`VALID_STATUSES`), 서버에서 검증 후 400 반환
- API 엔드포인트: `GET/POST /api/tasks`, `PATCH/DELETE /api/tasks/{task_id}`
- 프론트는 프레임워크 없이 `frontend/app.js`에서 fetch로 API 호출 후 DOM을 직접 그리는 방식(상태 관리 라이브러리 없음)
- 에러/성공 메시지는 한국어로 반환됨 (예: "제목을 입력해주세요.")

## 코딩 규칙
- 한국어 주석 사용
- 변수명: snake_case (Python), camelCase (JS)
- 모든 API는 `/api/` 경로 prefix 사용

## 금지사항
- jQuery 사용 금지
- CSS 직접 작성 금지 (Tailwind만 사용)
