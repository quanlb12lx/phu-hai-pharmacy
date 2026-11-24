import { useState } from "react";
import { toast } from "sonner";
import {
  Phone,
  MapPin,
  ShoppingBag,
  MessageCircle,
  Upload,
  Home,
  Stethoscope,
  Store as StoreIcon,
  Clock,
  BookOpen,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useStore, vnd, PHARMACY, type Article, type Product } from "@/lib/store";
import { Btn, Card, H2, Pill, inputCls, Field } from "./ui";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "home", label: "Trang chủ", icon: Home },
  { id: "shop", label: "Kệ hàng", icon: StoreIcon },
  { id: "ask", label: "Hỏi Dược sĩ", icon: Stethoscope },
] as const;
type Tab = (typeof tabs)[number]["id"];

export function PatientView() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div>
      <nav className="sticky top-[var(--hdr)] z-20 hidden border-b border-border bg-card md:block">
        <div className="mx-auto flex max-w-4xl gap-2 p-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl text-lg font-bold transition",
                tab === t.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
              )}
            >
              <t.icon className="h-5 w-5" />
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-4xl space-y-6 p-4 pb-28 md:pb-12">
        {tab === "home" && <HomeTab onNavigate={setTab} />}
        {tab === "shop" && <ShopTab />}
        {tab === "ask" && <AskTab />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-border bg-card shadow-lg md:hidden">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex min-h-[68px] flex-col items-center justify-center gap-1 text-base font-bold transition",
              tab === t.id ? "bg-secondary text-primary-deep" : "text-muted-foreground"
            )}
          >
            <t.icon className="h-6 w-6" />
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function ReserveDialog({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { reserve } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Đặt giữ hàng tại quầy</DialogTitle>
        </DialogHeader>
        {product && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
              <img src={product.image} alt={product.name} className="h-16 w-16 rounded-lg object-cover" />
              <div>
                <p className="text-lg font-extrabold">{product.name}</p>
                <p className="text-xl font-bold text-primary">{vnd(product.price)}</p>
              </div>
            </div>
            <Field label="Tên của cô chú / anh chị">
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Cô Mai" />
            </Field>
            <Field label="Số điện thoại liên hệ">
              <input className={inputCls} inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xx xxx xxx" />
            </Field>
            <Btn
              className="w-full"
              disabled={!name || phone.length < 9}
              onClick={() => {
                reserve(product.name, name, phone);
                toast.success("Đã gửi yêu cầu giữ hàng! DS. Xuân sẽ soạn sẵn cho mình ạ.");
                setName("");
                setPhone("");
                onClose();
              }}
            >
              <CheckCircle2 className="h-5 w-5" />
              Xác nhận giữ hàng tại tiệm
            </Btn>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
function HomeTab({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const { products, articles } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedArt, setSelectedArt] = useState<Article | null>(null);

  return (
    <>
      <div className="rounded-3xl bg-hero p-6 text-primary-foreground shadow-card md:p-8">
        <p className="text-lg font-medium opacity-95">Xin chào cô chú, anh chị 👋</p>
        <h1 className="mt-1 text-2xl font-extrabold leading-snug md:text-3xl">
          Nhà Thuốc Phú Hải — DS. Bùi Thị Xuân luôn sẵn lòng tư vấn tận tâm
        </h1>
        <p className="mt-3 flex items-start gap-2 text-base opacity-95 md:text-lg">
          <MapPin className="mt-1 h-5 w-5 shrink-0" />
          <span>{PHARMACY.address}</span>
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <a
            href={`tel:${PHARMACY.phone}`}
            className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-card px-4 text-lg font-extrabold text-primary-deep shadow-sm transition active:scale-[0.99]"
          >
            <Phone className="h-6 w-6" />
            Gọi DS. Xuân
          </a>

          <a
            href={PHARMACY.zalo}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#0068FF] px-4 text-lg font-extrabold text-white shadow-sm transition active:scale-[0.99]"
          >
            <MessageCircle className="h-6 w-6" />
            Nhắn Zalo ngay
          </a>

          <a
            href={PHARMACY.maps}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-primary-foreground/80 bg-white/10 px-4 text-lg font-bold text-primary-foreground transition active:scale-[0.99]"
          >
            <MapPin className="h-6 w-6" />
            Chỉ đường Maps
          </a>
        </div>
      </div>

      <Card className="flex flex-col items-start justify-between gap-4 border-2 border-primary/20 bg-secondary/40 sm:flex-row sm:items-center">
        <div>
          <p className="text-xl font-extrabold text-foreground">Cần hỏi thuốc hoặc gửi ảnh đơn thuốc?</p>
          <p className="mt-1 text-base text-muted-foreground">Chụp ảnh vỏ thuốc cũ hoặc đơn bác sĩ để DS. Xuân xem giúp ạ.</p>
        </div>
        <Btn className="w-full shrink-0 sm:w-auto" onClick={() => onNavigate("ask")}>
          <Stethoscope className="h-5 w-5" />
          Gửi câu hỏi ngay
        </Btn>
      </Card>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <H2 icon={<StoreIcon className="h-6 w-6 text-primary" />}>Sản phẩm chăm sóc sức khỏe</H2>
          <button onClick={() => onNavigate("shop")} className="text-base font-bold text-primary underline">
            Xem tất cả ({products.length})
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {products.slice(0, 4).map((p) => (
            <Card key={p.id} className="flex flex-col overflow-hidden p-0">
              <img src={p.image} alt={p.name} className="h-44 w-full object-cover" loading="lazy" />
              <div className="flex flex-1 flex-col p-4">
                <span className="self-start rounded-full bg-secondary px-3 py-0.5 text-sm font-bold text-secondary-foreground">{p.category}</span>
                <p className="mt-2 flex-1 text-lg font-extrabold leading-snug">{p.name}</p>
                {p.note && <p className="mt-1 text-sm text-muted-foreground">{p.note}</p>}
                <p className="my-2.5 text-2xl font-extrabold text-primary">{vnd(p.price)}</p>
                <div className="grid grid-cols-2 gap-2">
                  <Btn onClick={() => setSelectedProduct(p)}>
                    <ShoppingBag className="h-5 w-5" />
                    Giữ hàng
                  </Btn>
                  <a
                    href={PHARMACY.zalo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl border-2 border-primary bg-card px-3 text-base font-bold text-primary-deep"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Hỏi Zalo
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <H2 icon={<BookOpen className="h-6 w-6 text-primary" />}>Góc Sức Khỏe Trảng Dài</H2>
        <div className="grid gap-4 sm:grid-cols-2">
          {articles.map((a) => (
            <button key={a.id} onClick={() => setSelectedArt(a)} className="overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card transition hover:border-primary">
              <img src={a.image} alt="" className="h-40 w-full object-cover" loading="lazy" />
              <div className="p-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-0.5 text-sm font-bold text-accent-foreground">
                  <Clock className="h-4 w-4" />
                  {a.minutes} phút đọc
                </span>
                <p className="mt-2 text-lg font-extrabold leading-snug">{a.title}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <ReserveDialog product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      <Dialog open={!!selectedArt} onOpenChange={(o) => !o && setSelectedArt(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          {selectedArt && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl leading-snug">{selectedArt.title}</DialogTitle>
              </DialogHeader>
              <img src={selectedArt.image} alt="" className="h-48 w-full rounded-xl object-cover" />
              <p className="text-lg leading-relaxed">{selectedArt.body}</p>
              <div className="rounded-xl bg-secondary p-4">
                <p className="font-extrabold text-primary-deep">Lời khuyên từ DS. Bùi Thị Xuân</p>
                <p className="mt-1 text-base">{selectedArt.advice}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
function ShopTab() {
  const { products } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <section>
        <H2 icon={<StoreIcon className="h-7 w-7 text-primary" />}>Kệ hàng Nhà Thuốc Phú Hải</H2>
        <p className="mb-4 text-base text-muted-foreground">
          Cô chú, anh chị có thể bấm <b>Giữ hàng tại quầy</b> để nhà thuốc soạn sẵn, ghé 143 Nguyễn Phúc Chu lấy ngay không phải chờ ạ.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((p) => (
            <Card key={p.id} className="flex flex-col overflow-hidden p-0">
              <img src={p.image} alt={p.name} className="h-48 w-full object-cover" loading="lazy" />
              <div className="flex flex-1 flex-col p-4">
                <span className="self-start rounded-full bg-secondary px-3 py-0.5 text-sm font-bold text-secondary-foreground">{p.category}</span>
                <p className="mt-2 flex-1 text-xl font-extrabold leading-snug">{p.name}</p>
                {p.note && <p className="mt-1 text-base text-muted-foreground">{p.note}</p>}
                <p className="my-3 text-2xl font-extrabold text-primary">{vnd(p.price)}</p>
                <div className="grid grid-cols-2 gap-2">
                  <Btn onClick={() => setSelectedProduct(p)}>
                    <ShoppingBag className="h-5 w-5" />
                    Giữ hàng
                  </Btn>
                  <a
                    href={PHARMACY.zalo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl border-2 border-primary bg-card px-3 text-base font-bold text-primary-deep"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Nhắn Zalo
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <ReserveDialog product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
}

function AskTab() {
  const { addCallback } = useStore();
  const [f, setF] = useState({ name: "", phone: "", who: "Bản thân" });
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<string>();

  return (
    <div className="space-y-6">
      <Card className="border-2 border-[#0068FF]/30 bg-[#0068FF]/5">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xl font-extrabold text-foreground">Muốn gửi ảnh đơn thuốc qua Zalo cho nhanh?</p>
            <p className="mt-1 text-base text-muted-foreground">Bấm để mở Zalo trò chuyện trực tiếp với DS. Bùi Thị Xuân ({PHARMACY.phone}).</p>
          </div>
          <a
            href={PHARMACY.zalo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0068FF] px-5 text-lg font-bold text-white sm:w-auto"
          >
            <ExternalLink className="h-5 w-5" />
            Mở Zalo DS. Xuân
          </a>
        </div>
      </Card>

      <Card>
        <H2 icon={<MessageCircle className="h-7 w-7 text-primary" />}>Hoặc để lại thông tin để DS. Xuân gọi lại</H2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tên của mình">
              <input className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="VD: Anh Hùng" />
            </Field>
            <Field label="Số điện thoại / Zalo">
              <input className={inputCls} inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="09xx xxx xxx" />
            </Field>
          </div>

          <div>
            <p className="mb-2 text-lg font-bold">Đối tượng cần tư vấn</p>
            <div className="flex flex-wrap gap-2">
              {["Bản thân", "Trẻ em", "Người cao tuổi", "Phụ nữ mang thai"].map((w) => (
                <Pill key={w} active={f.who === w} onClick={() => setF({ ...f, who: w })}>
                  {w}
                </Pill>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-lg font-bold">Triệu chứng đang gặp</p>
            <div className="flex flex-wrap gap-2">
              {["Cảm sốt", "Ho / Đau họng", "Đau dạ dày", "Dị ứng", "Huyết áp / Tiểu đường"].map((t) => (
                <Pill key={t} active={tags.includes(t)} onClick={() => setTags(tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t])}>
                  {t}
                </Pill>
              ))}
            </div>
          </div>

          <Field label="Ghi chú thêm (không bắt buộc)">
            <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} placeholder="VD: Đang uống thuốc huyết áp..." />
          </Field>

          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary bg-secondary/50 p-4 text-center">
            {photo ? (
              <img src={photo} alt="Ảnh đơn thuốc" className="max-h-48 rounded-xl" />
            ) : (
              <>
                <Upload className="h-9 w-9 text-primary" />
                <span className="text-lg font-bold">Chụp ảnh đơn thuốc hoặc vỏ thuốc cũ</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => setPhoto(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>

          <Btn
            className="w-full"
            disabled={!f.name || f.phone.length < 9}
            onClick={() => {
              addCallback({
                name: f.name,
                phone: f.phone,
                reason: photo ? "Gửi ảnh hỏi đơn thuốc" : `Tư vấn cho ${f.who.toLowerCase()}`,
                note: [f.who, ...tags, note].filter(Boolean).join(" · "),
                photo,
              });
              toast.success("Đã gửi tới DS. Xuân! Nhà thuốc sẽ gọi lại cho mình sớm nhất ạ.");
              setF({ name: "", phone: "", who: "Bản thân" });
              setTags([]);
              setNote("");
              setPhoto(undefined);
            }}
          >
            Gửi yêu cầu tư vấn
          </Btn>
        </div>
      </Card>
    </div>
  );
}
