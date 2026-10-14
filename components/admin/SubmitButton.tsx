"use client";

import { useFormStatus } from "react-dom";
import { primaryButton } from "./ui";

export default function SubmitButton({ children, pendingText = "Salvando…", className = "" }: { children: React.ReactNode; pendingText?: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${primaryButton} ${className}`}>
      {pending ? pendingText : children}
    </button>
  );
}
