import { useState } from "react";
import { toast } from "sonner";
import { Phone, MapPin, Check, Pill as PillIcon, ShoppingBag, MessageCircle, Upload, AlertTriangle, ShieldCheck, Home, Stethoscope, Store as StoreIcon, Archive, HeartPulse, QrCode, Gift, Clock, BookOpen, Sun, Sunset, Moon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useStore, vnd, PHARMACY, type Article } from "@/lib/store";
import { Btn, Card, H2, Pill, inputCls, Field } from "./ui";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "home", label: "Trang chủ", icon: Home },
  { id: "ask", label: "Hỏi DS", icon: Stethoscope },
  { id: "shop", label: "Kệ hàng", icon: StoreIcon },
  { id: "cabinet", label: "Tủ thuốc", icon: Archive },
  { id: "health", label: "Sổ SK", icon: HeartPulse },
] as const;
type Tab = (typeof tabs)[number]["id"];

export function PatientView() {
  const [tab, setTab] = useState<Tab>("home");
  return (
    <div>
      <nav className="sticky top-[var(--hdr)] z-20 hidden border-b border-border bg-card md:block">
        <div className="mx-auto flex max-w-5xl gap-2 p-2">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn("flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl text-lg font-bold", tab === t.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary")}>
              <t.icon className="h-6 w-6" />{t.label}
            </button>
          ))}
        </div>
      </nav>
      <main className="mx-auto max-w-5xl space-y-6 p-4 pb-32 md:pb-10">
        {tab === "home" && <HomeTab />}
        {tab === "ask" && <AskTab />}
        {tab === "shop" && <ShopTab />}
        {tab === "cabinet" && <CabinetTab />}
        {tab === "health" && <HealthTab />}
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t-2 border-border bg-card md:hidden">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn("flex min-h-[68px] flex-col items-center justify-center gap-1 text-sm font-bold", tab === t.id ? "bg-secondary text-primary-deep" : "text-muted-foreground")}>
            <t.icon className="h-7 w-7" />{t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

const meds = [
  { slot: "Sáng (07:30)", icon: Sun, items: [{ id: "m1", name: "Amoxicillin 500mg", note: "1 viên sau ăn no" }, { id: "m2", name: "Amlodipin 5mg", note: "1 viên, uống với nước lọc" }] },
  { slot: "Trưa (12:00)", icon: Sunset, items: [{ id: "m3", name: "Paracetamol 500mg", note: "1 viên khi sốt trên 38.5°C" }] },
  { slot: "Tối (19:30)", icon: Moon, items: [{ id: "m4", name: "Amoxicillin 500mg", note: "1 viên sau ăn no" }] },
];

function CallbackDialog({ open, onOpenChange, reason }: { open: boolean; onOpenChange: (b: boolean) => void; reason: string }) {
  const { addCallback } = useStore();
  const [name, setName] = useState(""); const [phone, setPhone] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle className="text-2xl">DS. Xuân sẽ gọi lại cho mình ạ</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <Field label="Họ tên"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Cô Mai" /></Field>
          <Field label="Số điện thoại"><input className={inputCls} inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xx xxx xxx" /></Field>
          <Btn className="w-full" disabled={!name || phone.length < 9} onClick={() => { addCallback({ name, phone, reason }); toast.success("Đã gửi! DS. Xuân sẽ gọi lại sớm nhất ạ."); onOpenChange(false); setName(""); setPhone(""); }}>
            <Phone className="h-5 w-5" />Xác nhận gọi lại
          </Btn>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HomeTab() {
  const { addPoints, reserve, products } = useStore();
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [cb, setCb] = useState(false);
  const [feel, setFeel] = useState<string | null>(null);
  const ent = products.find((p) => p.id === "p2")!;
  return (
    <>
      <div className="rounded-2xl bg-hero p-6 text-primary-foreground shadow-card">
        <p className="text-lg opacity-90">Chào cô chú, anh chị 👋</p>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight">DS. Bùi Thị Xuân luôn sẵn lòng lắng nghe mình ạ</h1>
        <p className="mt-2 flex items-start gap-2 text-lg"><MapPin className="mt-1 h-5 w-5 shrink-0" />143 Nguyễn Phúc Chu, P. Trảng Dài</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={`tel:${PHARMACY.phone}`} className="inline-flex min-h-14 items-center gap-2 rounded-xl bg-card px-6 text-xl font-extrabold text-primary-deep"><Phone className="h-6 w-6" />Gọi ngay DS. Xuân</a>
          <a href={PHARMACY.maps} target="_blank" rel="noreferrer" className="inline-flex min-h-14 items-center gap-2 rounded-xl border-2 border-primary-foreground px-6 text-xl font-bold"><MapPin className="h-6 w-6" />Chỉ đường</a>
        </div>
      </div>

      <section>
        <H2 icon={<PillIcon className="h-7 w-7 text-primary" />}>Nhắc lịch uống thuốc hôm nay</H2>
        <div className="space-y-4">
          {meds.map((g) => (
            <Card key={g.slot}>
              <h3 className="mb-3 flex items-center gap-2 text-xl font-extrabold text-primary-deep"><g.icon className="h-6 w-6" />{g.slot}</h3>
              <div className="space-y-3">
                {g.items.map((m) => {
                  const done = taken.has(m.id);
                  return (
                    <div key={m.id} className={cn("flex flex-wrap items-center justify-between gap-3 rounded-xl p-4", done ? "bg-secondary" : "bg-muted")}>
                      <div><p className="text-xl font-extrabold">{m.name}</p><p className="text-lg text-muted-foreground">{m.note}</p></div>
                      <Btn v={done ? "soft" : "primary"} disabled={done} onClick={() => { setTaken(new Set(taken).add(m.id)); addPoints(10); toast.success("Giỏi quá! +10 Điểm Sống Khỏe 🌿"); }}>
                        <Check className="h-6 w-6" />{done ? "Đã uống ✓" : "Đã uống"}
                      </Btn>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Card className="border-2 border-primary">
        <p className="mb-3 text-lg font-bold text-primary-deep">💡 Gợi ý bổ sung từ DS. Xuân</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <img src={ent.image} alt={ent.name} className="h-36 w-full rounded-xl object-cover sm:w-36" />
          <div className="flex-1">
            <p className="text-xl font-extrabold">{ent.name}</p>
            <p className="text-2xl font-extrabold text-primary">{vnd(ent.price)}</p>
            <p className="mt-2 rounded-xl bg-secondary p-3 text-lg italic">"Uống kháng sinh dễ gây rối loạn tiêu hóa, dùng thêm men vi sinh cách 2 tiếng để bảo vệ đường ruột ạ"</p>
            <Btn className="mt-3" onClick={() => { reserve(ent.name); toast.success("Đã giữ hàng tại quầy cho mình ạ!"); }}><ShoppingBag className="h-5 w-5" />Giữ hàng tại quầy</Btn>
          </div>
        </div>
      </Card>

      <Card className="bg-accent">
        <p className="text-lg font-bold text-accent-foreground">Chăm sóc sau 48h</p>
        <p className="mt-1 text-2xl font-extrabold">Chào cô/chú/anh/chị, sức khỏe sau 2 ngày dùng thuốc thế nào rồi ạ?</p>
        {feel ? <p className="mt-4 rounded-xl bg-card p-4 text-lg font-bold">{feel}</p> : (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Btn onClick={() => setFeel("Mừng quá! Mình nhớ uống đủ liệu trình nha 💚")}>😊 Đã đỡ nhiều</Btn>
            <Btn v="warning" onClick={() => setFeel("Mình cứ tiếp tục theo dõi, nếu sốt cao hoặc mệt hơn hãy gọi ngay DS. Xuân ạ.")}>😐 Vẫn còn triệu chứng</Btn>
            <Btn v="outline" onClick={() => setCb(true)}><Phone className="h-5 w-5" />Cần DS. Xuân gọi lại</Btn>
          </div>
        )}
      </Card>
      <CallbackDialog open={cb} onOpenChange={setCb} reason="Yêu cầu gọi lại sau 48h dùng thuốc" />
    </>
  );
}

const drugs = [
  { name: "Panadol Extra", active: ["Paracetamol", "Caffeine"] },
  { name: "Efferalgan 500mg", active: ["Paracetamol"] },
  { name: "Hapacol 650", active: ["Paracetamol"] },
  { name: "Vitamin C", active: ["Acid ascorbic"] },
];

function AskTab() {
  const { addCallback } = useStore();
  const [f, setF] = useState({ name: "", phone: "", who: "Bản thân" });
  const [tags, setTags] = useState<string[]>([]);
  const [photo, setPhoto] = useState<string>();
  const [a, setA] = useState(""); const [b, setB] = useState("");
  const da = drugs.find((d) => d.name === a), db = drugs.find((d) => d.name === b);
  const dup = da && db && a !== b ? da.active.filter((x) => db.active.includes(x)) : [];
  return (
    <>
      <Card>
        <H2 icon={<MessageCircle className="h-7 w-7 text-primary" />}>Tư vấn 1-1 với DS. Bùi Thị Xuân</H2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Họ tên"><input className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
            <Field label="Số điện thoại / Zalo"><input className={inputCls} inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
          </div>
          <div><p className="mb-2 text-lg font-bold">Ai cần tư vấn?</p>
            <div className="flex flex-wrap gap-2">{["Bản thân", "Trẻ em", "Người cao tuổi", "Phụ nữ mang thai"].map((w) => <Pill key={w} active={f.who === w} onClick={() => setF({ ...f, who: w })}>{w}</Pill>)}</div></div>
          <div><p className="mb-2 text-lg font-bold">Triệu chứng</p>
            <div className="flex flex-wrap gap-2">{["Cảm sốt", "Ho/Đau họng", "Đau dạ dày", "Dị ứng", "Huyết áp/Tiểu đường"].map((t) => <Pill key={t} active={tags.includes(t)} onClick={() => setTags(tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t])}>{t}</Pill>)}</div></div>
          <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary bg-secondary p-4 text-center">
            {photo ? <img src={photo} alt="Ảnh đơn thuốc" className="max-h-48 rounded-xl" /> : <><Upload className="h-10 w-10 text-primary" /><span className="text-lg font-bold">Chụp ảnh đơn thuốc hoặc vỏ thuốc cũ</span></>}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) setPhoto(URL.createObjectURL(file)); }} />
          </label>
          <Btn className="w-full" disabled={!f.name || f.phone.length < 9} onClick={() => {
            addCallback({ name: f.name, phone: f.phone, reason: photo ? "Gửi ảnh hỏi đơn thuốc mới" : `Tư vấn cho ${f.who.toLowerCase()}`, note: [f.who, ...tags].join(" · "), photo });
            toast.success("Đã gửi tới DS. Xuân! Mình để ý điện thoại nha ạ."); setF({ name: "", phone: "", who: "Bản thân" }); setTags([]); setPhoto(undefined);
          }}>Gửi cho DS. Xuân</Btn>
        </div>
      </Card>
      <Card>
        <H2 icon={<ShieldCheck className="h-7 w-7 text-primary" />}>Kiểm tra trùng hoạt chất</H2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[[a, setA, "Thuốc thứ nhất"], [b, setB, "Thuốc thứ hai"]].map(([v, set, l]) => (
            <Field key={l as string} label={l as string}>
              <select className={inputCls} value={v as string} onChange={(e) => (set as (s: string) => void)(e.target.value)}>
                <option value="">— Chọn thuốc —</option>{drugs.map((d) => <option key={d.name}>{d.name}</option>)}
              </select>
            </Field>
          ))}
        </div>
        {dup.length > 0 && (
          <div className="mt-4 flex gap-3 rounded-2xl border-2 border-destructive bg-danger-soft p-5 text-destructive">
            <AlertTriangle className="h-10 w-10 shrink-0" />
            <p className="text-xl font-extrabold">Cảnh báo trùng hoạt chất {dup.join(", ")} - Nguy cơ quá liều, vui lòng hỏi DS. Xuân</p>
          </div>
        )}
        {da && db && a !== b && dup.length === 0 && <p className="mt-4 rounded-2xl bg-secondary p-5 text-xl font-bold text-primary-deep">✓ Không phát hiện trùng hoạt chất.</p>}
      </Card>
    </>
  );
}

function ShopTab() {
  const { products, articles, reserve, points } = useStore();
  const [art, setArt] = useState<Article | null>(null);
  return (
    <>
      <section>
        <H2 icon={<StoreIcon className="h-7 w-7 text-primary" />}>Kệ hàng chăm sóc sức khỏe Phú Hải</H2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Card key={p.id} className="flex flex-col p-0 overflow-hidden">
              <img src={p.image} alt={p.name} className="h-44 w-full object-cover" loading="lazy" />
              <div className="flex flex-1 flex-col p-4">
                <span className="self-start rounded-full bg-secondary px-3 py-1 text-sm font-bold text-secondary-foreground">{p.category}</span>
                <p className="mt-2 flex-1 text-xl font-extrabold leading-snug">{p.name}</p>
                <p className="my-2 text-2xl font-extrabold text-primary">{vnd(p.price)}</p>
                <div className="grid gap-2">
                  <Btn onClick={() => { reserve(p.name); toast.success("Đã giữ hàng tại quầy cho mình ạ!"); }}><ShoppingBag className="h-5 w-5" />Giữ hàng tại quầy</Btn>
                  <Btn v="outline" onClick={() => toast(`Mình đang có ${points} điểm. Báo DS. Xuân khi nhận hàng để được trừ tiền nha!`)}><Gift className="h-5 w-5" />Dùng điểm giảm giá</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <section>
        <H2 icon={<BookOpen className="h-7 w-7 text-primary" />}>Góc Sức Khỏe Trảng Dài - Đồng Nai</H2>
        <div className="grid gap-4 md:grid-cols-3">
          {articles.map((a) => (
            <button key={a.id} onClick={() => setArt(a)} className="overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card">
              <img src={a.image} alt="" className="h-40 w-full object-cover" loading="lazy" />
              <div className="p-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground"><Clock className="h-4 w-4" />{a.minutes} phút đọc</span>
                <p className="mt-2 text-xl font-extrabold leading-snug">{a.title}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
      <Dialog open={!!art} onOpenChange={(o) => !o && setArt(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          {art && (<>
            <DialogHeader><DialogTitle className="text-2xl leading-snug">{art.title}</DialogTitle></DialogHeader>
            <img src={art.image} alt="" className="h-48 w-full rounded-xl object-cover" />
            <p className="text-lg">{art.body}</p>
            <div className="rounded-xl border-l-4 border-primary bg-secondary p-4"><p className="font-extrabold text-primary-deep">Lời khuyên từ DS. Bùi Thị Xuân</p><p className="text-lg">{art.advice}</p></div>
            {(() => { const p = products.find((x) => x.id === art.productId); return p && (
              <div className="flex items-center gap-3 rounded-xl border border-border p-3">
                <img src={p.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                <div className="flex-1"><p className="font-bold">{p.name}</p><p className="font-extrabold text-primary">{vnd(p.price)}</p></div>
                <Btn onClick={() => { reserve(p.name); toast.success("Đã giữ hàng!"); }}>Giữ</Btn>
              </div>); })()}
          </>)}
        </DialogContent>
      </Dialog>
    </>
  );
}

const cabinet = [
  { name: "Paracetamol 500mg", hsd: "12/2027", status: "ok" },
  { name: "Siro ho Prospan", hsd: "15/12/2026", status: "soon" },
  { name: "Thuốc nhỏ mắt V.Rohto", hsd: "08/2026", status: "expired" },
  { name: "Oresol (gói)", hsd: "03/2028", status: "ok" },
] as const;
const hsdStyle = { ok: ["bg-secondary text-primary-deep", "Còn hạn dài"], soon: ["bg-warning text-warning-foreground", "Sắp hết hạn (30 ngày)"], expired: ["bg-destructive text-destructive-foreground", "Đã hết hạn"] } as const;

function CabinetTab() {
  const { reserve } = useStore();
  const [rx, setRx] = useState(false); const [auto, setAuto] = useState(false); const [prepared, setPrepared] = useState(false);
  return (
    <>
      <Card className="bg-hero text-primary-foreground">
        <H2 icon={<QrCode className="h-7 w-7" />}><span className="text-primary-foreground">Quét mã QR trên túi thuốc</span></H2>
        <p className="mb-4 text-lg">Quét tem QR do Nhà Thuốc Phú Hải dán trên túi thuốc để xem đơn và bật nhắc lịch.</p>
        <button onClick={() => setRx(true)} className="inline-flex min-h-14 items-center gap-2 rounded-xl bg-card px-6 text-xl font-extrabold text-primary-deep"><QrCode className="h-6 w-6" />Quét mã QR</button>
      </Card>
      <Dialog open={rx} onOpenChange={setRx}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-2xl">Đơn thuốc điện tử</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">Ngày 22/11/2026 · Cấp tính 5 ngày</p>
          <ul className="space-y-2 text-lg">
            <li className="rounded-xl bg-muted p-3"><b>Amoxicillin 500mg</b> — 1 viên × 2 lần/ngày, sau ăn</li>
            <li className="rounded-xl bg-muted p-3"><b>Paracetamol 500mg</b> — 1 viên khi sốt, cách 4–6 giờ</li>
            <li className="rounded-xl bg-muted p-3"><b>Enterogermina</b> — 1 ống/ngày, cách kháng sinh 2 giờ</li>
          </ul>
          <p className="text-right font-bold italic text-primary-deep">Ký: DS. Bùi Thị Xuân ✍️</p>
          <label className="flex min-h-14 items-center justify-between rounded-xl bg-secondary p-4 text-xl font-bold">Bật nhắc lịch tự động
            <Switch checked={auto} onCheckedChange={(c) => { setAuto(c); if (c) toast.success("Đã bật nhắc lịch uống thuốc!"); }} className="scale-150" />
          </label>
        </DialogContent>
      </Dialog>

      <Card className="border-2 border-warning">
        <p className="text-2xl font-extrabold">⏰ Thuốc huyết áp Amlodipin còn 4 ngày nữa sẽ hết</p>
        <Btn className="mt-4" disabled={prepared} onClick={() => { reserve("Amlodipin 5mg (30 viên) - thuốc định kỳ"); setPrepared(true); toast.success("Nhà thuốc sẽ chuẩn bị sẵn cho mình ạ!"); }}>
          {prepared ? "Đã nhờ chuẩn bị ✓" : "Nhờ nhà thuốc chuẩn bị sẵn"}
        </Btn>
      </Card>

      <section>
        <H2 icon={<Archive className="h-7 w-7 text-primary" />}>Tủ thuốc gia đình</H2>
        <div className="space-y-3">
          {cabinet.map((m) => (
            <Card key={m.name} className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="text-xl font-extrabold">{m.name}</p>
                <span className={cn("mt-1 inline-block rounded-full px-3 py-1 text-base font-bold", hsdStyle[m.status][0])}>HSD {m.hsd} · {hsdStyle[m.status][1]}</span></div>
              <Btn v="outline" onClick={() => { reserve(m.name); toast.success(`Đã đặt mua bổ sung ${m.name}`); }}>Đặt mua bổ sung</Btn>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

const gifts = [
  { name: "Khẩu trang y tế 4D", cost: 100 }, { name: "Nước muối sinh lý", cost: 80 },
  { name: "Tuýp C sủi", cost: 150 }, { name: "Đo huyết áp & đường huyết miễn phí tại quầy", cost: 0 },
];

function HealthTab() {
  const { points, addPoints } = useStore();
  const [log, setLog] = useState([
    { d: "18/11", sys: 145, dia: 92, sugar: 7.8 }, { d: "19/11", sys: 140, dia: 90, sugar: 7.2 }, { d: "20/11", sys: 138, dia: 88, sugar: 7.0 },
    { d: "21/11", sys: 135, dia: 86, sugar: 6.8 }, { d: "22/11", sys: 132, dia: 85, sugar: 6.9 }, { d: "23/11", sys: 130, dia: 84, sugar: 6.5 },
  ]);
  const [sys, setSys] = useState(""); const [dia, setDia] = useState(""); const [sugar, setSugar] = useState("");
  return (
    <>
      <Card>
        <H2 icon={<HeartPulse className="h-7 w-7 text-primary" />}>Sổ sức khỏe</H2>
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={log}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="d" tick={{ fontSize: 16 }} /><YAxis yAxisId="l" tick={{ fontSize: 16 }} /><YAxis yAxisId="r" orientation="right" tick={{ fontSize: 16 }} />
              <Tooltip /><Legend wrapperStyle={{ fontSize: 16 }} />
              <Line yAxisId="l" dataKey="sys" name="Tâm thu" stroke="var(--destructive)" strokeWidth={3} />
              <Line yAxisId="l" dataKey="dia" name="Tâm trương" stroke="var(--primary)" strokeWidth={3} />
              <Line yAxisId="r" dataKey="sugar" name="Đường huyết" stroke="var(--warning-foreground)" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <Field label="Tâm thu"><input className={inputCls} inputMode="numeric" value={sys} onChange={(e) => setSys(e.target.value)} placeholder="130" /></Field>
          <Field label="Tâm trương"><input className={inputCls} inputMode="numeric" value={dia} onChange={(e) => setDia(e.target.value)} placeholder="85" /></Field>
          <Field label="Đường huyết (mmol/L)"><input className={inputCls} inputMode="decimal" value={sugar} onChange={(e) => setSugar(e.target.value)} placeholder="6.5" /></Field>
          <Btn className="self-end" disabled={!sys || !dia} onClick={() => {
            setLog([...log, { d: new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }), sys: +sys, dia: +dia, sugar: +sugar.replace(",", ".") || 0 }]);
            addPoints(5); toast.success("Đã lưu chỉ số! +5 điểm"); setSys(""); setDia(""); setSugar("");
          }}>Lưu</Btn>
        </div>
      </Card>
      <Card>
        <H2 icon={<Gift className="h-7 w-7 text-primary" />}>Điểm Sống Khỏe</H2>
        <p className="text-5xl font-extrabold text-primary">{points} <span className="text-2xl">điểm</span></p>
        <div className="mt-4 space-y-3">
          {gifts.map((g) => (
            <div key={g.name} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted p-4">
              <div><p className="text-xl font-bold">{g.name}</p><p className="text-lg text-primary-deep">{g.cost} điểm</p></div>
              <Btn disabled={points < g.cost} onClick={() => { addPoints(-g.cost); toast.success(`Đã đổi "${g.name}". Mình ghé quầy nhận quà nha!`); }}>Đổi quà</Btn>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
