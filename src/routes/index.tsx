import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Cross } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider, PHARMACY } from "@/lib/store";
import { PatientView } from "@/components/app/Patient";
import { AdminView } from "@/components/app/Admin";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nhà Thuốc Phú Hải – DS. Bùi Thị Xuân, Trảng Dài" },
      { name: "description", content: "Nhắc uống thuốc, hỏi dược sĩ, kệ hàng sức khỏe và tích điểm tại Nhà Thuốc Phú Hải, 143 Nguyễn Phúc Chu, Trảng Dài, Đồng Nai." },
      { property: "og:title", content: "Nhà Thuốc Phú Hải – DS. Bùi Thị Xuân" },
      { property: "og:description", content: "Ứng dụng chăm sóc sức khỏe thân thiện cho cô chú, anh chị tại Trảng Dài, Đồng Nai." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [role, setRole] = useState<"patient" | "admin">("patient");
  return (
    <StoreProvider>
      <div className="min-h-screen bg-background [--hdr:0px] md:[--hdr:88px]">
        <header className="sticky top-0 z-30 border-b-2 border-border bg-card">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 p-3 md:min-h-[88px]">
            <div className="flex flex-1 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Cross className="h-7 w-7" /></div>
              <div><p className="text-2xl font-extrabold leading-tight">{PHARMACY.name}</p><p className="text-base font-semibold text-primary-deep">{PHARMACY.pharmacist}</p></div>
            </div>
            <a href={PHARMACY.maps} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-4 text-lg font-bold text-primary-foreground"><MapPin className="h-5 w-5" />Chỉ đường Google Maps</a>
            <div className="flex rounded-full border-2 border-primary bg-secondary p-1">
              {(["patient", "admin"] as const).map((r) => (
                <button key={r} onClick={() => setRole(r)} className={cn("min-h-12 rounded-full px-4 text-lg font-bold", role === r ? "bg-primary text-primary-foreground" : "text-primary-deep")}>
                  {r === "patient" ? "Khách hàng" : "Góc DS. Xuân"}
                </button>
              ))}
            </div>
          </div>
        </header>
        {role === "patient" ? <PatientView /> : <AdminView />}
        <Toaster position="top-center" richColors toastOptions={{ style: { fontSize: "18px" } }} />
      </div>
    </StoreProvider>
  );
}
