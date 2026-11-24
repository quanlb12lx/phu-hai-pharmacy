import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, ArrowLeft } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider, PHARMACY } from "@/lib/store";
import { PatientView } from "@/components/app/Patient";
import { AdminView } from "@/components/app/Admin";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nhà Thuốc Phú Hải – DS. Bùi Thị Xuân, Trảng Dài" },
      { name: "description", content: "Tư vấn thuốc, đặt giữ hàng và chỉ đường tới Nhà Thuốc Phú Hải, 143 Nguyễn Phúc Chu, Trảng Dài, Đồng Nai." },
      { property: "og:title", content: "Nhà Thuốc Phú Hải – DS. Bùi Thị Xuân" },
      { property: "og:description", content: "Chăm sóc sức khỏe tận tâm cho gia đình tại Trảng Dài, Đồng Nai." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  const [role, setRole] = useState<"patient" | "admin">("patient");

  return (
    <StoreProvider>
      <div className="min-h-screen bg-background [--hdr:72px]">
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
          <div className="mx-auto flex h-[72px] max-w-4xl items-center justify-between gap-3 px-4">
            <button onClick={() => setRole("patient")} className="flex items-center gap-3 text-left">
              <img
                src="/logo.png.png"
                alt="Logo Nhà Thuốc Phú Hải"
                className="h-12 w-12 shrink-0 rounded-xl bg-white object-contain p-0.5 shadow-sm border border-border"
              />
              <div>
                <p className="text-xl font-extrabold leading-tight text-foreground">{PHARMACY.name}</p>
                <p className="text-sm font-semibold text-primary-deep">{PHARMACY.pharmacist}</p>
              </div>
            </button>

            {role === "patient" ? (
              <button
                onClick={() => setRole("admin")}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-3.5 text-sm font-bold text-primary-deep hover:bg-secondary"
              >
                <Lock className="h-4 w-4" />
                Góc Dược sĩ
              </button>
            ) : (
              <button
                onClick={() => setRole("patient")}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Trang Khách hàng
              </button>
            )}
          </div>
        </header>

        {role === "patient" ? <PatientView /> : <AdminView />}

        <Toaster position="top-center" richColors toastOptions={{ style: { fontSize: "17px" } }} />
      </div>
    </StoreProvider>
  );
}
