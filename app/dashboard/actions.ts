"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";

export type CreateTaskState = { message: string };

export async function createTask(
  _previousState: CreateTaskState,
  formData: FormData,
): Promise<CreateTaskState> {
  const title = String(formData.get("title") ?? "").trim();
  if (!title || title.length > 100) {
    return { message: "할 일은 1~100자로 입력하세요." };
  }

  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("tasks").insert({ title, user_id: user.id });

  if (error) {
    return {
      message: error.message.includes("free plan limit")
        ? "Free 요금제는 할 일을 3개까지 만들 수 있습니다."
        : "저장하지 못했습니다.",
    };
  }

  revalidatePath("/dashboard");
  return { message: "" };
}

export async function toggleTask(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const completed = formData.get("completed") === "true";
  const { supabase, user } = await requireUser();
  await supabase.from("tasks").update({ completed: !completed }).eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function deleteTask(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const { supabase, user } = await requireUser();
  await supabase.from("tasks").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
}
