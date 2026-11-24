import type { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type V = "primary" | "outline" | "soft" | "danger" | "warning";
const variants: Record<V, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-deep",
  outline: "border-2 border-primary text-primary-deep bg-card hover:bg-secondary",
  soft: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
  danger: "bg-destructive text-destructive-foreground hover:opacity-90",
  warning: "bg-warning text-warning-foreground hover:opacity-90",
};
export function Btn({ v = "primary", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { v?: V }) {
  return <button {...p} className={cn("inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-2 text-lg font-bold transition-colors disabled:opacity-50", variants[v], className)} />;
}
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-card", className)}>{children}</div>;
}
export function H2({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return <h2 className="mb-4 flex items-center gap-2 text-2xl font-extrabold text-foreground">{icon}{children}</h2>;
}
export function Pill({ active, children, onClick }: { active?: boolean; children: ReactNode; onClick?: () => void }) {
  return <button onClick={onClick} className={cn("min-h-12 rounded-full border-2 px-4 text-base font-bold transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary")}>{children}</button>;
}
export const inputCls = "min-h-12 w-full rounded-xl border-2 border-input bg-card px-4 text-lg text-foreground focus:border-primary focus:outline-none";
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1 block text-lg font-bold">{label}</span>{children}</label>;
}
