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
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useStore, PHARMACY, vnd, type Product } from "@/lib/store";
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
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-secondary/60 px-4 py-3">
        <div>
          <p className="text-base font-bold text-primary-deep">👋 Xin chào, {PHARMACY.pharmacist}</p>
          <p className="text-xs font-semibold text-slate-600">Trạng thái: {dbStatus}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              refreshAll();
              toast.info("Đang tải lại dữ liệu mới nhất...");
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-xs hover:bg-emerald-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Làm mới
          </button>
          <button
            type="button"
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
                  href={["https", "://", "zalo.me/", r.phone.replace(/\D/g, "")].join("")}
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
                <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1.5 text-lg font-bold text-primary underline">
                  <Phone className="h-4 w-4" />
                  {c.phone}
                </a>
                <p className="mt-1 text-base font-bold text-primary-deep">{c.reason}</p>
                {c.note && <p className="mt-1 text-base text-slate-700">{c.note}</p>}
                <p className="mt-1 text-sm text-muted-foreground">Gửi lúc: {c.time}</p>
              </div>
              <a
                href={["https", "://", "zalo.me/", c.phone.replace(/\D/g, "")].join("")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-[#0068FF] px-4 text-sm font-bold text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Zalo khách
              </a>
            </div>

            {c.photo && (
              <div className="mt-3">
                <p className="mb-1 text-xs font-semibold text-slate-500">Ảnh khách đính kèm:</p>
                <img src={c.photo} alt="Đơn thuốc khách gửi" className="max-h-64 rounded-xl border border-slate-200 object-contain" />
              </div>
            )}

            {!c.done ? (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input
                  className={inputCls}
                  placeholder="Ghi chú nội dung đã tư vấn (tùy chọn)..."
                  value={notes[c.id] || ""}
                  onChange={(e) => setNotes({ ...notes, [c.id]: e.target.value })}
                />
                <Btn
                  className="shrink-0"
                  onClick={() => {
                    completeCallback(c.id, notes[c.id]);
                    toast.success("Đã đánh dấu hoàn tất tư vấn!");
                  }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Đã gọi tư vấn xong
                </Btn>
              </div>
            ) : (
              c.replyNote && <p className="mt-2 rounded-lg bg-emerald-50 p-2 text-sm text-emerald-800">Ghi chú DS: {c.replyNote}</p>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
function ContentManager() {
  const { products, articles, addProduct, removeProduct, addArticle, removeArticle } = useStore();
  const [p, setP] = useState({
    name: "",
    category: "Tăng đề kháng" as Product["category"],
    price: "",
    note: "",
    image: "https://unsplash.com",
  });
  const [a, setA] = useState({
    title: "",
    minutes: "3",
    body: "",
    advice: "",
    image: "https://unsplash.com",
  });

  return (
    <div className="space-y-8">
      <Card>
        <H2>Thêm sản phẩm mới lên Kệ hàng</H2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Tên sản phẩm">
            <input className={inputCls} value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} placeholder="VD: Vitamin C 500mg" />
          </Field>
          <Field label="Danh mục">
            <select
              className={inputCls}
              value={p.category}
              onChange={(e) => setP({ ...p, category: e.target.value as Product["category"] })}
            >
              <option>Tăng đề kháng</option>
              <option>Tiêu hóa</option>
              <option>Giảm đau - Hạ sốt</option>
              <option>Chăm sóc gia đình</option>
            </select>
          </Field>
          <Field label="Giá bán (VNĐ)">
            <input className={inputCls} type="number" value={p.price} onChange={(e) => setP({ ...p, price: e.target.value })} placeholder="85000" />
          </Field>
          <Field label="Ghi chú cách dùng">
            <input className={inputCls} value={p.note} onChange={(e) => setP({ ...p, note: e.target.value })} placeholder="Hộp 30 viên..." />
          </Field>
        </div>
        <Btn
          className="mt-4"
          disabled={!p.name || !p.price}
          onClick={() => {
            addProduct({ name: p.name, category: p.category, price: Number(p.price), note: p.note, image: p.image });
            toast.success("Đã thêm sản phẩm lên kệ hàng!");
            setP({ ...p, name: "", price: "", note: "" });
          }}
        >
          Đăng sản phẩm
        </Btn>

        <div className="mt-6 space-y-2">
          {products.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-border p-3">
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-primary font-semibold">{vnd(item.price)} · {item.category}</p>
              </div>
              <button
                onClick={() => {
                  removeProduct(item.id);
                  toast.info("Đã xóa sản phẩm");
                }}
                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                title="Xóa"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <H2>Đăng bài viết Góc Sức Khỏe</H2>
        <div className="space-y-3">
          <Field label="Tiêu đề bài viết">
            <input className={inputCls} value={a.title} onChange={(e) => setA({ ...a, title: e.target.value })} placeholder="VD: Lưu ý khi dùng kháng sinh..." />
          </Field>
          <Field label="Nội dung chi tiết">
            <textarea className={inputCls + " min-h-24 py-2"} value={a.body} onChange={(e) => setA({ ...a, body: e.target.value })} />
          </Field>
          <Field label="Lời khuyên của DS. Bùi Thị Xuân">
            <input className={inputCls} value={a.advice} onChange={(e) => setA({ ...a, advice: e.target.value })} />
          </Field>
          <Btn
            disabled={!a.title || !a.body}
            onClick={() => {
              addArticle({ title: a.title, minutes: Number(a.minutes) || 3, body: a.body, advice: a.advice, image: a.image });
              toast.success("Đã đăng bài viết mới!");
              setA({ ...a, title: "", body: "", advice: "" });
            }}
          >
            Đăng bài viết
          </Btn>
        </div>

        <div className="mt-6 space-y-2">
          {articles.map((art) => (
            <div key={art.id} className="flex items-center justify-between rounded-xl border border-border p-3">
              <p className="font-bold">{art.title}</p>
              <button
                onClick={() => {
                  removeArticle(art.id);
                  toast.info("Đã xóa bài viết");
                }}
                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                title="Xóa"
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
