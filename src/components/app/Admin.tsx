import { useState } from "react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { Phone, Camera, Printer, Send, PackageCheck, PhoneCall, FilePlus, CalendarClock, ClipboardList } from "lucide-react";
import { useStore, PHARMACY } from "@/lib/store";
import { Btn, Card, H2, Pill, inputCls, Field } from "./ui";
import { cn } from "@/lib/utils";

const subs = [
  { id: "cb", label: "Khách cần gọi lại", icon: PhoneCall },
  { id: "rx", label: "Tạo đơn & QR", icon: FilePlus },
  { id: "refill", label: "Sắp hết thuốc", icon: CalendarClock },
  { id: "res", label: "Giữ hàng & Đăng tin", icon: ClipboardList },
] as const;

export function AdminView() {
  const [tab, setTab] = useState<(typeof subs)[number]["id"]>("cb");
  const { callbacks, reservations } = useStore();
  const pending = callbacks.filter((c) => !c.done).length;
  const resPending = reservations.filter((r) => !r.ready).length;
  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4 pb-10">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {subs.map((s) => (
          <button key={s.id} onClick={() => setTab(s.id)} className={cn("relative flex min-h-16 items-center justify-center gap-2 rounded-xl border-2 px-2 text-base font-bold md:text-lg", tab === s.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}>
            <s.icon className="h-6 w-6 shrink-0" />{s.label}
            {s.id === "cb" && pending > 0 && <span className="absolute -right-1 -top-2 rounded-full bg-destructive px-2 text-sm text-destructive-foreground">{pending}</span>}
            {s.id === "res" && resPending > 0 && <span className="absolute -right-1 -top-2 rounded-full bg-destructive px-2 text-sm text-destructive-foreground">{resPending}</span>}
          </button>
        ))}
      </div>
      {tab === "cb" && <Callbacks />}
      {tab === "rx" && <Prescription />}
      {tab === "refill" && <Refill />}
      {tab === "res" && <Reservations />}
    </main>
  );
}

function Callbacks() {
  const { callbacks, completeCallback } = useStore();
  const [f, setF] = useState<"all" | "wait" | "done">("wait");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const list = callbacks.filter((c) => (f === "all" ? true : f === "wait" ? !c.done : c.done));
  const fmt = (p: string) => p.replace(/(\d{4})(\d{3})(\d+)/, "$1.$2.$3");
  return (
    <section>
      <div className="mb-4 flex flex-wrap gap-2">
        <Pill active={f === "all"} onClick={() => setF("all")}>Tất cả ({callbacks.length})</Pill>
        <Pill active={f === "wait"} onClick={() => setF("wait")}>Chờ gọi lại ({callbacks.filter((c) => !c.done).length})</Pill>
        <Pill active={f === "done"} onClick={() => setF("done")}>Đã tư vấn xong ({callbacks.filter((c) => c.done).length})</Pill>
      </div>
      <div className="space-y-4">
        {list.length === 0 && <p className="text-lg text-muted-foreground">Không có khách nào trong mục này.</p>}
        {list.map((c) => (
          <Card key={c.id} className={c.done ? "opacity-80" : "border-l-8 border-l-destructive"}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-2xl font-extrabold">{c.name}</p>
                <a href={`tel:${c.phone}`} className="inline-flex min-h-12 items-center gap-2 text-xl font-bold text-primary underline"><Phone className="h-5 w-5" />{fmt(c.phone)}</a>
              </div>
              <span className="text-base text-muted-foreground">{c.time}</span>
            </div>
            <span className={cn("mt-2 inline-block rounded-full px-3 py-1 text-base font-bold", c.done ? "bg-secondary text-primary-deep" : "bg-danger-soft text-destructive")}>{c.reason}</span>
            {c.note && <p className="mt-2 text-lg">📝 {c.note}</p>}
            {c.photo && <img src={c.photo} alt="Ảnh đơn thuốc" className="mt-3 h-28 w-28 rounded-xl object-cover" />}
            {c.done ? <p className="mt-3 rounded-xl bg-secondary p-3 text-lg">✓ {c.pharmacistNote || "Đã tư vấn"}</p> : (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input className={inputCls} placeholder="Ghi chú của dược sĩ..." value={notes[c.id] ?? ""} onChange={(e) => setNotes({ ...notes, [c.id]: e.target.value })} />
                <Btn className="shrink-0" onClick={() => { completeCallback(c.id, notes[c.id] ?? ""); toast.success(`Đã tư vấn xong cho ${c.name}`); }}>Đánh dấu đã gọi tư vấn</Btn>
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}

function Prescription() {
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [kind, setKind] = useState("Cấp tính 3-5 ngày");
  const [meds, setMeds] = useState("");
  const [qr, setQr] = useState(false);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <H2 icon={<FilePlus className="h-7 w-7 text-primary" />}>Tạo đơn nhanh</H2>
        <div className="space-y-4">
          <Field label="Tên khách hàng"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Số điện thoại/Zalo"><input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
          <div className="flex flex-wrap gap-2">{["Cấp tính 3-5 ngày", "Mãn tính 30 ngày"].map((k) => <Pill key={k} active={kind === k} onClick={() => setKind(k)}>{k}</Pill>)}</div>
          <Btn v="soft" className="w-full" onClick={() => { setMeds("Amoxicillin 500mg — 1 viên × 2 lần/ngày, sau ăn\nParacetamol 500mg — 1 viên khi sốt, cách 4-6h\nAlpha Choay — 2 viên × 3 lần/ngày, ngậm dưới lưỡi"); toast.success("Đã nhận diện 3 loại thuốc từ ảnh đơn"); }}>
            <Camera className="h-5 w-5" />Chụp ảnh đơn thuốc để tự động điền
          </Btn>
          <Field label="Thuốc & liều dùng"><textarea className={cn(inputCls, "min-h-32 py-2")} value={meds} onChange={(e) => setMeds(e.target.value)} /></Field>
          <Btn className="w-full" disabled={!name || !meds} onClick={() => { setQr(true); toast.success(`Đã gửi đơn qua Zalo cho ${name}`); }}><Send className="h-5 w-5" />Tạo mã QR & Gửi Zalo</Btn>
        </div>
      </Card>
      {qr && (
        <Card className="text-center">
          <H2 icon={<Printer className="h-7 w-7 text-primary" />}>Tem QR in sẵn</H2>
          <div className="mx-auto max-w-xs rounded-2xl border-4 border-dashed border-primary bg-card p-5">
            <QRCodeSVG value={JSON.stringify({ name, phone, kind, meds })} size={180} className="mx-auto" />
            <p className="mt-3 text-xl font-extrabold">{name}</p><p className="text-base">{kind}</p>
            <p className="mt-2 text-sm font-bold text-primary-deep">{PHARMACY.name} - DS. Bùi Thị Xuân - 143 Nguyễn Phúc Chu</p>
          </div>
          <Btn v="outline" className="mt-4" onClick={() => window.print()}><Printer className="h-5 w-5" />In tem</Btn>
        </Card>
      )}
    </div>
  );
}

function Refill() {
  const [list, setList] = useState([
    { id: 1, name: "Chú Trần Văn Hùng", med: "Thuốc huyết áp Amlodipin", days: 2, sent: false },
    { id: 2, name: "Cô Võ Thị Hoa", med: "Thuốc tiểu đường Metformin", days: 3, sent: false },
    { id: 3, name: "Bác Nguyễn Văn Sáu", med: "Thuốc mỡ máu Atorvastatin", days: 4, sent: false },
  ]);
  return (
    <section>
      <H2 icon={<CalendarClock className="h-7 w-7 text-primary" />}>Khách sắp hết thuốc định kỳ</H2>
      <div className="space-y-4">
        {list.map((p) => (
          <Card key={p.id}>
            <p className="text-2xl font-extrabold">{p.name}</p>
            <p className="text-xl">{p.med} — <b className="text-destructive">còn {p.days} ngày</b></p>
            <p className="mt-2 rounded-xl bg-muted p-3 text-lg italic">"Dạ chào {(p.name.split(" ")[0] ?? "").toLowerCase()}, Xuân ở Nhà Thuốc Phú Hải đây ạ. {p.med} của mình còn khoảng {p.days} ngày nữa là hết. Xuân chuẩn bị sẵn, khi nào tiện mình ghé lấy nha. Chúc mình nhiều sức khỏe!"</p>
            <Btn className="mt-3" disabled={p.sent} onClick={() => { setList(list.map((x) => (x.id === p.id ? { ...x, sent: true } : x))); toast.success(`Đã gửi Zalo nhắc ${p.name}`); }}>
              <Send className="h-5 w-5" />{p.sent ? "Đã nhắc ✓" : "Gửi tin nhắn nhắc Zalo"}
            </Btn>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Reservations() {
  const { reservations, markReady, addProduct, addArticle } = useStore();
  const [mode, setMode] = useState<"product" | "article">("product");
  const [p, setP] = useState({ name: "", price: "", category: "", image: "" });
  const [a, setA] = useState({ title: "", body: "", advice: "", image: "" });
  const fallback = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=70&auto=format&fit=crop";
  return (
    <div className="space-y-6">
      <section>
        <H2 icon={<PackageCheck className="h-7 w-7 text-primary" />}>Đơn giữ hàng</H2>
        <div className="space-y-3">
          {reservations.map((r) => (
            <Card key={r.id} className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="text-xl font-extrabold">{r.customer} đặt giữ</p><p className="text-lg">{r.product}</p><p className="text-base text-muted-foreground">{r.time}</p></div>
              <Btn v={r.ready ? "soft" : "primary"} disabled={r.ready} onClick={() => { markReady(r.id); toast.success("Đã soạn sẵn hàng"); }}>{r.ready ? "Đã soạn ✓" : "Đã soạn sẵn hàng"}</Btn>
            </Card>
          ))}
        </div>
      </section>
      <Card>
        <H2>Đăng nội dung mới</H2>
        <div className="mb-4 flex gap-2"><Pill active={mode === "product"} onClick={() => setMode("product")}>Sản phẩm</Pill><Pill active={mode === "article"} onClick={() => setMode("article")}>Tin sức khỏe</Pill></div>
        {mode === "product" ? (
          <div className="space-y-3">
            <Field label="Tên sản phẩm"><input className={inputCls} value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Giá (đ)"><input className={inputCls} inputMode="numeric" value={p.price} onChange={(e) => setP({ ...p, price: e.target.value })} /></Field>
              <Field label="Danh mục"><input className={inputCls} value={p.category} onChange={(e) => setP({ ...p, category: e.target.value })} /></Field>
            </div>
            <Field label="Link ảnh (không bắt buộc)"><input className={inputCls} value={p.image} onChange={(e) => setP({ ...p, image: e.target.value })} /></Field>
            <Btn className="w-full" disabled={!p.name || !p.price} onClick={() => { addProduct({ name: p.name, price: +p.price.replace(/\D/g, ""), category: p.category || "Khác", image: p.image || fallback }); toast.success("Đã lên kệ hàng Phú Hải!"); setP({ name: "", price: "", category: "", image: "" }); }}>Thêm vào Kệ hàng</Btn>
          </div>
        ) : (
          <div className="space-y-3">
            <Field label="Tiêu đề"><input className={inputCls} value={a.title} onChange={(e) => setA({ ...a, title: e.target.value })} /></Field>
            <Field label="Nội dung"><textarea className={cn(inputCls, "min-h-28 py-2")} value={a.body} onChange={(e) => setA({ ...a, body: e.target.value })} /></Field>
            <Field label="Lời khuyên của DS. Xuân"><textarea className={cn(inputCls, "min-h-20 py-2")} value={a.advice} onChange={(e) => setA({ ...a, advice: e.target.value })} /></Field>
            <Field label="Link ảnh bìa (không bắt buộc)"><input className={inputCls} value={a.image} onChange={(e) => setA({ ...a, image: e.target.value })} /></Field>
            <Btn className="w-full" disabled={!a.title || !a.body} onClick={() => { addArticle({ title: a.title, body: a.body, advice: a.advice, image: a.image || fallback, minutes: Math.max(1, Math.round(a.body.split(" ").length / 200)) }); toast.success("Đã đăng lên Góc Sức Khỏe!"); setA({ title: "", body: "", advice: "", image: "" }); }}>Đăng tin</Btn>
          </div>
        )}
      </Card>
    </div>
  );
}
