import type { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Btn({
  v = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { v?: "primary" | "outline" | "soft" | "danger" }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-45",
        v === "primary" && "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700",
        v === "outline" && "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        v === "soft" && "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
        v === "danger" && "bg-rose-50 text-rose-600 hover:bg-rose-100",
        className
      )}
    />
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.06)]", className)}>
      {children}
    </div>
  );
}

export function H2({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-lg font-bold tracking-tight text-slate-800">
      {icon}
      <span>{children}</span>
    </h2>
  );
}

export function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-9 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
        active
          ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/50"
      )}
    >
      {children}
    </button>
  );
}

export const inputCls =
  "h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}
