"use client";

import { useActionState } from "react";
import { login, type ActionState } from "@/app/admin/actions";
import SubmitButton from "./SubmitButton";
import FormMessage from "./FormMessage";
import { card, input, label } from "./ui";

export default function LoginForm() {
  const [state, action] = useActionState<ActionState, FormData>(login, {});
  return (
    <form action={action} className={`${card} space-y-5`}>
      <div>
        <label htmlFor="l-email" className={label}>E-mail</label>
        <input id="l-email" name="email" type="email" required autoComplete="email" className={input} />
      </div>
      <div>
        <label htmlFor="l-pass" className={label}>Senha</label>
        <input id="l-pass" name="password" type="password" required autoComplete="current-password" className={input} />
      </div>
      <FormMessage state={state} />
      <SubmitButton className="w-full" pendingText="Entrando…">Entrar</SubmitButton>
    </form>
  );
}
