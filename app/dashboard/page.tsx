import { deleteTask, toggleTask } from "./actions";
import { TaskForm } from "./task-form";

import { requireUser } from "@/lib/auth";

type Task = { id: string; title: string; completed: boolean };

export default async function DashboardPage() {
  const { supabase, user } = await requireUser();
  const [{ data: tasks }, { data: entitlement }] = await Promise.all([
    supabase.from("tasks").select("id,title,completed").order("created_at"),
    supabase.from("entitlements").select("plan").eq("user_id", user.id).maybeSingle(),
  ]);
  const plan = entitlement?.plan === "pro" ? "Pro" : "Free";

  return (
    <>
      <header className="row">
        <div>
          <h1>내 할 일</h1>
          <p className="muted">{user.email}</p>
        </div>
        <span className="badge">{plan}</span>
      </header>
      <section className="card stack">
        <TaskForm />
        {(tasks as Task[] | null)?.map((task) => (
          <div className="task" key={task.id}>
            <form action={toggleTask}>
              <input type="hidden" name="id" value={task.id} />
              <input type="hidden" name="completed" value={String(task.completed)} />
              <button className="button secondary" type="submit">{task.completed ? "되돌리기" : "완료"}</button>
            </form>
            <span className={task.completed ? "done" : ""}>{task.title}</span>
            <form action={deleteTask}>
              <input type="hidden" name="id" value={task.id} />
              <button className="button danger" type="submit">삭제</button>
            </form>
          </div>
        ))}
        {!tasks?.length && <p className="muted">첫 할 일을 추가하세요.</p>}
      </section>
    </>
  );
}
