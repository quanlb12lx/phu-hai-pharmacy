import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PHARMACY, usePharmacyStore } from "../lib/store";
import { Btn, BrandLogo } from "../components/app/ui";
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
      {/* Header chính */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-emerald-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Logo & Tên Nhà Thuốc */}
          <button
            type="button"
            onClick={() => setMode("patient")}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <BrandLogo className="h-12 w-12 sm:h-14 sm:w-14 group-hover:scale-105 transition-transform" />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                {PHARMACY.name}
              </h1>
              <p className="text-xs text-emerald-700 font-medium">
                {PHARMACY.pharmacist} • Trảng Dài
              </p>
            </div>
          </button>

          {/* Nút điều hướng góc phải */}
          <div className="flex items-center gap-2">
            {mode === "patient" ? (
              <>
                <a
                  href={zaloUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  Zalo: {PHARMACY.phone}
                </a>
                <Btn
                  variant="outline"
                  onClick={() => setMode("admin")}
                  className="text-xs sm:text-sm"
                >
                  Góc Dược sĩ
                </Btn>
              </>
            ) : (
              <Btn
                variant="outline"
                onClick={() => setMode("patient")}
                className="text-xs sm:text-sm"
              >
                ← Trang Khách hàng
              </Btn>
            )}
          </div>
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {mode === "patient" ? (
          <PatientView store={store} />
        ) : (
          <AdminView store={store} onExit={() => setMode("patient")} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-10 w-10" />
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
