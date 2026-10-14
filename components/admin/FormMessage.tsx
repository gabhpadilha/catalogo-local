import type { ActionState } from "@/app/admin/actions";

export default function FormMessage({ state }: { state: ActionState }) {
  if (state.error) return <p role="alert" className="rounded-2xl bg-red-50 text-red-700 font-bold text-sm p-4">{state.error}</p>;
  if (state.ok) return <p role="status" className="rounded-2xl bg-green-50 text-green-800 font-bold text-sm p-4">{state.ok}</p>;
  return null;
}
