import { useState } from "react";
import { toast } from "sonner";
import {
  Phone,
  PackageCheck,
  PhoneCall,
  ClipboardList,
  Lock,
  LogOut,
  Trash2,
  MessageCircle,
  PlusCircle,
} from "lucide-react";
import { useStore, PHARMACY, vnd } from "@/lib/store";
import { Btn, Card, H2, Pill, inputCls, Field } from "./ui";
import { cn } from "@/lib/utils";

const subs = [
  { id: "res", label: "Đơn giữ hàng", icon: ClipboardList },
  { id: "cb", label: "Khách hỏi tư vấn", icon: PhoneCall },
  { id: "cms", label: "Quản lý Kệ hàng & Tin", icon: PlusCircle },
] as const;

export function AdminView() {
  const [authed, setAuthed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("phuhai_admin_auth") === "true";
    } catch {
      return false;
    }
  });
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [tab, setTab] = useState<(typeof subs)[number]["id"]>("res");
  const { callbacks, reservations, dbStatus, refreshAll } = useStore();
  const pendingCb = callbacks.filter((c) => !c.done).length;
  const pendingRes = reservations.filter((r) => !r.ready).length;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.trim().toLowerCase() === PHARMACY.adminUser && pass === PHARMACY.adminPass) {
      setAuthed(true);
      try {
        sessionStorage.setItem("phuhai_admin_auth", "true");
      } catch {
        // ignore
      }
      toast.success("Chào mừng Dược sĩ Bùi Thị Xuân!");
    } else {
      toast.error("Sai tên đăng nhập hoặc mật khẩu!");
    }
  };

  if (!authed) {
    return (
      <main className="mx-auto max-w-md p-4 pt-10">
        <Card className="border-2 border-primary/20">
          <div className="mb-5 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary-deep">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-extrabold">Đăng nhập Góc Dược sĩ</h1>
            <p className="mt-1 text-base text-muted-foreground">Dành riêng cho {PHARMACY.pharmacist}</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Tên đăng nhập">
              <input
                className={inputCls}
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                autoComplete="username"
              />
            </Field>
            <Field label="Mật khẩu">
              <input
                type="password"
                className={inputCls}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
              />
            </Field>
            <Btn type="submit" className="w-full">
              Đăng nhập quản lý
            </Btn>
          </form>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-4 pb-12">
         <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-secondary/60 px-4 py-3">      <div>        <p className="text-base font-bold text-primary-deep">👋 Xin chào, {PHARMACY.pharmacist}</p>        <p className="text-xs font-semibold text-slate-600">Trạng thái: {dbStatus}</p>      </div>      <div className="flex items-center gap-3">        <button          type="button"          onClick={() => {            refreshAll();            toast.info("Đang tải lại dữ liệu mới nhất...");          }}          className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-xs hover:bg-emerald-50"        >          Làm mới        </button>        <button          onClick={() => {            setAuthed(false);            try {              sessionStorage.removeItem("phuhai_admin_auth");            } catch {              // ignore            }          }}          className="inline-flex items-center gap-1.5 text-sm font-bold text-destructive underline"        >          <LogOut className="h-4 w-4" />          Đăng xuất        </button>      </div>    </div>
        <p className="text-base font-bold text-primary-deep">👋 Xin chào, {PHARMACY.pharmacist}</p>
        <button
          onClick={() => {
            setAuthed(false);
            try {
              sessionStorage.removeItem("phuhai_admin_auth");
            } catch {
              // ignore
            }
          }}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-destructive underline"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {subs.map((s) => (
          <button
            key={s.id}
            onClick={() => setTab(s.id)}
            className={cn(
              "relative flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 px-2 text-base font-bold md:text-lg",
              tab === s.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
            )}
          >
            <s.icon className="h-5 w-5 shrink-0" />
            <span className="truncate">{s.label}</span>
            {s.id === "res" && pendingRes > 0 && (
              <span className="absolute -right-1 -top-2 rounded-full bg-destructive px-2 text-sm text-destructive-foreground">{pendingRes}</span>
            )}
            {s.id === "cb" && pendingCb > 0 && (
              <span className="absolute -right-1 -top-2 rounded-full bg-destructive px-2 text-sm text-destructive-foreground">{pendingCb}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "res" && <Reservations />}
      {tab === "cb" && <Callbacks />}
      {tab === "cms" && <ContentManager />}
    </main>
  );
}
function Reservations() {
  const { reservations, markReady } = useStore();
  return (
    <section>
      <H2 icon={<PackageCheck className="h-7 w-7 text-primary" />}>Đơn khách đặt giữ hàng tại quầy</H2>
      <div className="space-y-3">
        {reservations.length === 0 && <p className="text-lg text-muted-foreground">Chưa có đơn đặt giữ hàng nào.</p>}
        {reservations.map((r) => (
          <Card key={r.id} className={cn("flex flex-wrap items-center justify-between gap-4", !r.ready && "border-l-8 border-l-primary")}>
            <div>
              <p className="text-xl font-extrabold">{r.customer}</p>
              {r.phone && (
                <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1.5 text-lg font-bold text-primary underline">
                  <Phone className="h-4 w-4" />
                  {r.phone}
                </a>
              )}
              <p className="mt-1 text-lg font-semibold">{r.product}</p>
              <p className="text-sm text-muted-foreground">Đặt lúc: {r.time}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {r.phone && (
                <a
                  href={["https://", "zalo.me/", r.phone.replace(/\D/g, "")].join("")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center gap-1.5 rounded-xl bg-[#0068FF] px-4 text-base font-bold text-white"
                >
                  <MessageCircle className="h-5 w-5" />
                  Nhắn Zalo khách
                </a>
              )}
              <Btn
                v={r.ready ? "soft" : "primary"}
                disabled={r.ready}
                onClick={() => {
                  markReady(r.id);
                  toast.success("Đã đánh dấu soạn sẵn hàng!");
                }}
              >
                {r.ready ? "Đã soạn xong ✓" : "Đã soạn sẵn hàng"}
              </Btn>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Callbacks() {
  const { callbacks, completeCallback } = useStore();
  const [f, setF] = useState<"all" | "wait" | "done">("wait");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const list = callbacks.filter((c) => (f === "all" ? true : f === "wait" ? !c.done : c.done));

  return (
    <section>
      <div className="mb-4 flex flex-wrap gap-2">
        <Pill active={f === "wait"} onClick={() => setF("wait")}>
          Chờ phản hồi ({callbacks.filter((c) => !c.done).length})
        </Pill>
        <Pill active={f === "done"} onClick={() => setF("done")}>
          Đã tư vấn ({callbacks.filter((c) => c.done).length})
        </Pill>
        <Pill active={f === "all"} onClick={() => setF("all")}>
          Tất cả ({callbacks.length})
        </Pill>
      </div>
      <div className="space-y-4">
        {list.length === 0 && <p className="text-lg text-muted-foreground">Không có yêu cầu nào trong mục này.</p>}
        {list.map((c) => (
          <Card key={c.id} className={c.done ? "opacity-80" : "border-l-8 border-l-destructive"}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-2xl font-extrabold">{c.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1.5 text-lg font-bold text-primary underline">
                    <Phone className="h-5 w-5" />
                    {c.phone}
                  </a>
                  <a
                    href={["https://", "zalo.me/", c.phone.replace(/\D/g, "")].join("")}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-[#0068FF] px-3 py-1 text-sm font-bold text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Zalo khách
                  </a>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{c.time}</span>
            </div>
            <span className={cn("mt-2 inline-block rounded-full px-3 py-1 text-sm font-bold", c.done ? "bg-secondary text-primary-deep" : "bg-danger-soft text-destructive")}>
              {c.reason}
            </span>
            {c.note && <p className="mt-2 text-lg">📝 {c.note}</p>}
            {c.photo && <img src={c.photo} alt="Ảnh đơn thuốc" className="mt-3 max-h-56 rounded-xl border border-border object-contain" />}
            {c.done ? (
              <p className="mt-3 rounded-xl bg-secondary p-3 text-base font-medium">✓ {c.pharmacistNote || "Đã gọi tư vấn"}</p>
            ) : (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  className={inputCls}
                  placeholder="Ghi chú nội dung đã tư vấn..."
                  value={notes[c.id] ?? ""}
                  onChange={(e) => setNotes({ ...notes, [c.id]: e.target.value })}
                />
                <Btn
                  className="shrink-0"
                  onClick={() => {
                    completeCallback(c.id, notes[c.id] ?? "");
                    toast.success(`Đã hoàn tất tư vấn cho ${c.name}`);
                  }}
                >
                  Đánh dấu đã tư vấn
                </Btn>
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
function ContentManager() {
  const { products, addProduct, deleteProduct, addArticle } = useStore();
  const [mode, setMode] = useState<"product" | "article">("product");
  const [p, setP] = useState({ name: "", price: "", category: "", note: "", image: "" });
  const [a, setA] = useState({ title: "", body: "", advice: "", image: "" });
  const fallback = ["https://", "://unsplash.com"].join("");

  return (
    <div className="space-y-6">
      <Card>
        <H2>Thêm Sản phẩm / Tin sức khỏe mới</H2>
        <div className="mb-4 flex gap-2">
          <Pill active={mode === "product"} onClick={() => setMode("product")}>
            Thêm sản phẩm lên kệ
          </Pill>
          <Pill active={mode === "article"} onClick={() => setMode("article")}>
            Đăng tin sức khỏe
          </Pill>
        </div>

        {mode === "product" ? (
          <div className="space-y-3">
            <Field label="Tên sản phẩm">
              <input className={inputCls} value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} placeholder="VD: Siro ho Bảo Thanh" />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Giá bán (đ)">
                <input className={inputCls} inputMode="numeric" value={p.price} onChange={(e) => setP({ ...p, price: e.target.value })} placeholder="55000" />
              </Field>
              <Field label="Danh mục">
                <input className={inputCls} value={p.category} onChange={(e) => setP({ ...p, category: e.target.value })} placeholder="VD: Hô hấp, Vitamin..." />
              </Field>
            </div>
            <Field label="Công dụng ngắn gọn">
              <input className={inputCls} value={p.note} onChange={(e) => setP({ ...p, note: e.target.value })} placeholder="VD: Giảm ho, bổ phế cho người lớn và trẻ em" />
            </Field>
            <Field label="Link hình ảnh (không bắt buộc)">
              <input className={inputCls} value={p.image} onChange={(e) => setP({ ...p, image: e.target.value })} placeholder="https://..." />
            </Field>
            <Btn
              className="w-full"
              disabled={!p.name || !p.price}
              onClick={() => {
                addProduct({
                  name: p.name,
                  price: +p.price.replace(/\D/g, ""),
                  category: p.category || "Chăm sóc sức khỏe",
                  note: p.note,
                  image: p.image || fallback,
                });
                toast.success("Đã thêm sản phẩm lên kệ hàng!");
                setP({ name: "", price: "", category: "", note: "", image: "" });
              }}
            >
              Đăng lên Kệ hàng
            </Btn>
          </div>
        ) : (
          <div className="space-y-3">
            <Field label="Tiêu đề bài viết">
              <input className={inputCls} value={a.title} onChange={(e) => setA({ ...a, title: e.target.value })} />
            </Field>
            <Field label="Nội dung">
              <textarea className={cn(inputCls, "min-h-28 py-2")} value={a.body} onChange={(e) => setA({ ...a, body: e.target.value })} />
            </Field>
            <Field label="Lời khuyên của DS. Xuân">
              <textarea className={cn(inputCls, "min-h-20 py-2")} value={a.advice} onChange={(e) => setA({ ...a, advice: e.target.value })} />
            </Field>
            <Btn
              className="w-full"
              disabled={!a.title || !a.body}
              onClick={() => {
                addArticle({
                  title: a.title,
                  body: a.body,
                  advice: a.advice,
                  image: a.image || fallback,
                  minutes: Math.max(1, Math.round(a.body.split(" ").length / 180)),
                });
                toast.success("Đã đăng bài lên Góc Sức Khỏe!");
                setA({ title: "", body: "", advice: "", image: "" });
              }}
            >
              Đăng bài viết
            </Btn>
          </div>
        )}
      </Card>

      <Card>
        <H2>Danh sách sản phẩm đang hiển thị ({products.length})</H2>
        <div className="space-y-2">
          {products.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-muted p-3">
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm font-bold text-primary">{vnd(item.price)}</p>
              </div>
              <button
                onClick={() => {
                  deleteProduct(item.id);
                  toast.success("Đã xóa sản phẩm khỏi kệ");
                }}
                className="rounded-lg p-2 text-destructive hover:bg-danger-soft"
                title="Xóa sản phẩm"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
