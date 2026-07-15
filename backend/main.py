"""업무관리 앱 FastAPI 서버"""
import sqlite3
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

db_path = Path(__file__).parent / "taskflow.db"
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db_connection():
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'todo',
            due_date TEXT
        )
        """
    )
    existing_columns = {row["name"] for row in conn.execute("PRAGMA table_info(tasks)")}
    if "due_date" not in existing_columns:
        conn.execute("ALTER TABLE tasks ADD COLUMN due_date TEXT")
    conn.commit()
    conn.close()


init_db()


class TaskCreate(BaseModel):
    title: str
    due_date: Optional[str] = None


class TaskStatusUpdate(BaseModel):
    status: str


VALID_STATUSES = {"todo", "in_progress", "done"}


@app.get("/api/tasks")
def get_tasks():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM tasks ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(row) for row in rows]


@app.post("/api/tasks")
def create_task(task: TaskCreate):
    if not task.title.strip():
        raise HTTPException(status_code=400, detail="제목을 입력해주세요.")
    conn = get_db_connection()
    cursor = conn.execute(
        "INSERT INTO tasks (title, status, due_date) VALUES (?, 'todo', ?)",
        (task.title, task.due_date),
    )
    conn.commit()
    new_task = conn.execute(
        "SELECT * FROM tasks WHERE id = ?", (cursor.lastrowid,)
    ).fetchone()
    conn.close()
    return dict(new_task)


@app.patch("/api/tasks/{task_id}")
def update_task_status(task_id: int, update: TaskStatusUpdate):
    if update.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail="유효하지 않은 상태입니다.")
    conn = get_db_connection()
    existing = conn.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
    if existing is None:
        conn.close()
        raise HTTPException(status_code=404, detail="업무를 찾을 수 없습니다.")
    conn.execute("UPDATE tasks SET status = ? WHERE id = ?", (update.status, task_id))
    conn.commit()
    updated = conn.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
    conn.close()
    return dict(updated)


@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int):
    conn = get_db_connection()
    existing = conn.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
    if existing is None:
        conn.close()
        raise HTTPException(status_code=404, detail="업무를 찾을 수 없습니다.")
    conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return {"ok": True}


app.mount("/", StaticFiles(directory=Path(__file__).parent.parent / "frontend", html=True), name="frontend")
