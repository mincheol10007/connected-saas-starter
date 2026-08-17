"use client";

import { useActionState } from "react";

import { createTask, type CreateTaskState } from "./actions";

const initialState: CreateTaskState = { message: "" };

export function TaskForm() {
  const [state, action, pending] = useActionState(createTask, initialState);

  return (
    <form action={action} className="stack">
      <div className="row">
        <input name="title" type="text" maxLength={100} placeholder="새 할 일" required />
        <button className="button" type="submit" disabled={pending}>
          {pending ? "저장 중" : "추가"}
        </button>
      </div>
      {state.message && <p className="error">{state.message}</p>}
    </form>
  );
}
