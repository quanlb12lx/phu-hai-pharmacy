import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PHARMACY, usePharmacyStore } from "../lib/store";
import { Btn } from "../components/app/ui";
import { PatientView } from "../components/app/Patient";
import { AdminView } from "../components/app/Admin";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [mode, setMode] = useState<"patient" | "admin">("patient");
  const store = usePharmacyStore();

  const zaloUrl = ["https", "://", "zalo.me/", PHARMACY.phone].join("");
  const mapsUrl = [
    "https",
    "://",
    "://google.com",
    PHARMACY.lat,
    ",",
    PHARMACY.lng,
  ].join("");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-emerald-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setMode("patient")}
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <img
              src="/logo.png"
              alt="Logo Nhà Thuốc Phú Hải"
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-contain bg-white p-0.5 shadow-sm border border-emerald-100 shrink-0"
            />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {PHARMACY.name}
              </h1>
              <p className="text-xs text-emerald-700 font-medium">
                {PHARMACY.pharmacist} • Trảng Dài
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {mode === "patient" ? (
              <>
                <a
                  href={zaloUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                >
                  Zalo: {PHARMACY.phone}
                </a>
                <Btn variant="outline" onClick={() => setMode("admin")} className="text-xs sm:text-sm">
                  Góc Dược sĩ
                </Btn>
              </>
            ) : (
              <Btn variant="outline" onClick={() => setMode("patient")} className="text-xs sm:text-sm">
                ← Trang Khách hàng
              </Btn>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {mode === "patient" ? (
          <PatientView store={store} />
        ) : (
          <AdminView store={store} onExit={() => setMode("patient")} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo Nhà Thuốc Phú Hải"
              className="h-10 w-10 rounded-xl object-contain bg-white p-0.5 border border-slate-100 shrink-0"
            />
            <div>
              <p className="font-semibold text-slate-800">{PHARMACY.name}</p>
              <p>{PHARMACY.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="hover:text-emerald-600 underline">
              Chỉ đường Google Maps
            </a>
            <a href={zaloUrl} target="_blank" rel="noreferrer" className="hover:text-emerald-600 underline">
              Zalo {PHARMACY.phone}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
