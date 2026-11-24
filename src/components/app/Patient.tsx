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
  ShieldCheck,
  ChevronRight,
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

function openZaloWithText(message: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(message).catch(() => {});
  }
  const url = `${PHARMACY.zalo}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function PatientView() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div className="min-h-screen bg-slate-50/80">
      <nav className="sticky top-[var(--hdr)] z-20 hidden border-b border-slate-100 bg-white/95 backdrop-blur md:block">
        <div className="mx-auto flex max-w-3xl gap-1.5 px-4 py-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex h-10 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition",
                tab === t.id ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-3xl space-y-5 px-4 pt-4 pb-24 md:pb-12">
        {tab === "home" && <HomeTab onNavigate={setTab} />}
        {tab === "shop" && <ShopTab />}
        {tab === "ask" && <AskTab />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-slate-200/80 bg-white/95 pb-safe backdrop-blur md:hidden">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold transition",
              tab === t.id ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <div className={cn("rounded-full px-3 py-1 transition", tab === t.id && "bg-emerald-50")}>
              <t.icon className="h-5 w-5" />
            </div>
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
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-800">Đặt giữ hàng tại quầy</DialogTitle>
        </DialogHeader>
        {product && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
              <img src={product.image} alt={product.name} className="h-14 w-14 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">{product.name}</p>
                <p className="text-base font-extrabold text-emerald-600">{vnd(product.price)}</p>
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
                const msg = `Chào DS. Xuân (Nhà Thuốc Phú Hải), mình đặt giữ hàng:\n- Sản phẩm: ${product.name} (${vnd(product.price)})\n- Khách hàng: ${name}\n- SĐT: ${phone}`;
                openZaloWithText(msg);
                toast.success("Đang chuyển sang Zalo DS. Xuân để xác nhận giữ hàng ạ!");
                setName("");
                setPhone("");
                onClose();
              }}
            >
              <CheckCircle2 className="h-4 w-4" />
              Gửi giữ hàng qua Zalo DS. Xuân
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 p-5 text-white shadow-md md:p-7">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
          <ShieldCheck className="h-3.5 w-3.5" />
          Nhà thuốc chuẩn GPP · Tư vấn tận tâm
        </div>
        <h1 className="mt-3 text-xl font-bold leading-snug md:text-2xl">
          Xin chào! {PHARMACY.pharmacist} sẵn sàng hỗ trợ sức khỏe gia đình bạn
        </h1>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-emerald-50 md:text-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" />
          <span>{PHARMACY.address}</span>
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <a
            href={`tel:${PHARMACY.phone}`}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-white px-2 text-xs font-bold text-emerald-700 shadow-sm transition active:scale-[0.98] sm:text-sm"
          >
            <Phone className="h-4 w-4 shrink-0" />
            <span>Gọi ngay</span>
          </a>

          <a
            href={PHARMACY.zalo}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#0068FF] px-2 text-xs font-bold text-white shadow-sm transition active:scale-[0.98] sm:text-sm"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            <span>Nhắn Zalo</span>
          </a>

          <a
            href={PHARMACY.maps}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-white/30 bg-white/10 px-2 text-xs font-semibold text-white backdrop-blur-sm transition active:scale-[0.98] sm:text-sm"
          >
            <MapPin className="h-4 w-4 shrink-0" />
            <span>Chỉ đường</span>
          </a>
        </div>
      </div>

      <button
        onClick={() => onNavigate("ask")}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4 text-left transition hover:bg-emerald-50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Cần hỏi thuốc hoặc gửi ảnh đơn thuốc?</p>
            <p className="text-xs text-slate-500">Chụp ảnh vỏ thuốc cũ để DS. Xuân tư vấn miễn phí</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-emerald-600" />
      </button>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <H2 icon={<StoreIcon className="h-5 w-5 text-emerald-600" />}>Sản phẩm chăm sóc sức khỏe</H2>
          <button onClick={() => onNavigate("shop")} className="text-xs font-bold text-emerald-600 hover:underline">
            Xem tất cả ({products.length})
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {products.slice(0, 4).map((p) => (
            <Card key={p.id} className="flex flex-col overflow-hidden p-0">
              <div className="relative h-32 w-full bg-slate-100 sm:h-40">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 shadow-xs backdrop-blur-xs">
                  {p.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="line-clamp-2 flex-1 text-sm font-bold leading-snug text-slate-800">{p.name}</p>
                <p className="my-2 text-base font-extrabold text-emerald-600">{vnd(p.price)}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <Btn className="h-9 px-2 text-xs" onClick={() => setSelectedProduct(p)}>
                    Giữ hàng
                  </Btn>
                  <button
                    type="button"
                    onClick={() => openZaloWithText(`Chào DS. Xuân, mình muốn hỏi thêm về sản phẩm: ${p.name} (${vnd(p.price)})`)}
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Zalo
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <H2 icon={<BookOpen className="h-5 w-5 text-emerald-600" />}>Góc Sức Khỏe Trảng Dài</H2>
        <div className="grid gap-3 sm:grid-cols-2">
          {articles.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedArt(a)}
              className="flex items-center gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-xs transition hover:border-emerald-200"
            >
              <img src={a.image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" loading="lazy" />
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <Clock className="h-3 w-3" />
                  {a.minutes} phút đọc
                </span>
                <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-slate-800">{a.title}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <ReserveDialog product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      <Dialog open={!!selectedArt} onOpenChange={(o) => !o && setSelectedArt(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto rounded-2xl">
          {selectedArt && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold leading-snug text-slate-800">{selectedArt.title}</DialogTitle>
              </DialogHeader>
              <img src={selectedArt.image} alt="" className="h-44 w-full rounded-xl object-cover" />
              <p className="text-sm leading-relaxed text-slate-600">{selectedArt.body}</p>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3.5">
                <p className="text-xs font-bold text-emerald-800">Lời khuyên từ DS. Bùi Thị Xuân</p>
                <p className="mt-1 text-sm text-slate-700">{selectedArt.advice}</p>
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
        <H2 icon={<StoreIcon className="h-5 w-5 text-emerald-600" />}>Kệ hàng Nhà Thuốc Phú Hải</H2>
        <p className="mb-3 text-xs text-slate-500">
          Bấm <b>Giữ hàng</b> để nhà thuốc soạn sẵn, ghé 143 Nguyễn Phúc Chu lấy ngay không phải chờ ạ.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {products.map((p) => (
            <Card key={p.id} className="flex flex-col overflow-hidden p-0">
              <div className="relative h-32 w-full bg-slate-100 sm:h-40">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 shadow-xs backdrop-blur-xs">
                  {p.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="line-clamp-2 text-sm font-bold leading-snug text-slate-800">{p.name}</p>
                {p.note && <p className="mt-1 line-clamp-2 flex-1 text-xs text-slate-500">{p.note}</p>}
                <p className="my-2 text-base font-extrabold text-emerald-600">{vnd(p.price)}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <Btn className="h-9 px-2 text-xs" onClick={() => setSelectedProduct(p)}>
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Giữ hàng
                  </Btn>
                  <button
                    type="button"
                    onClick={() => openZaloWithText(`Chào DS. Xuân, mình muốn hỏi thêm về sản phẩm: ${p.name} (${vnd(p.price)})`)}
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Zalo
                  </button>
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
    <div className="space-y-4">
      <Card className="border-blue-100 bg-blue-50/50">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold text-slate-800">Muốn gửi ảnh đơn thuốc qua Zalo cho nhanh?</p>
            <p className="mt-0.5 text-xs text-slate-500">Mở Zalo trò chuyện trực tiếp với DS. Bùi Thị Xuân ({PHARMACY.phone}).</p>
          </div>
          <a
            href={PHARMACY.zalo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#0068FF] px-4 text-xs font-bold text-white shadow-xs sm:w-auto"
          >
            <ExternalLink className="h-4 w-4" />
            Mở Zalo DS. Xuân
          </a>
        </div>
      </Card>

      <Card>
        <H2 icon={<MessageCircle className="h-5 w-5 text-emerald-600" />}>Để lại thông tin tư vấn qua Zalo</H2>
        <div className="space-y-3.5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Tên của mình">
              <input className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="VD: Anh Hùng" />
            </Field>
            <Field label="Số điện thoại / Zalo">
              <input className={inputCls} inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="09xx xxx xxx" />
            </Field>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-semibold text-slate-700">Đối tượng cần tư vấn</p>
            <div className="flex flex-wrap gap-1.5">
              {["Bản thân", "Trẻ em", "Người cao tuổi", "Phụ nữ mang thai"].map((w) => (
                <Pill key={w} active={f.who === w} onClick={() => setF({ ...f, who: w })}>
                  {w}
                </Pill>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-semibold text-slate-700">Triệu chứng đang gặp</p>
            <div className="flex flex-wrap gap-1.5">
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

          <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 p-4 text-center transition hover:bg-emerald-50/60">
            {photo ? (
              <img src={photo} alt="Ảnh đơn thuốc" className="max-h-40 rounded-xl" />
            ) : (
              <>
                <Upload className="h-6 w-6 text-emerald-600" />
                <span className="text-sm font-semibold text-slate-700">Chụp ảnh đơn thuốc hoặc vỏ thuốc cũ</span>
                <span className="text-xs text-slate-400">Bấm để chọn ảnh từ điện thoại</span>
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
              const summary = [f.who, ...tags, note].filter(Boolean).join(" · ");
              addCallback({
                name: f.name,
                phone: f.phone,
                reason: photo ? "Gửi ảnh hỏi đơn thuốc" : `Tư vấn cho ${f.who.toLowerCase()}`,
                note: summary,
                photo,
              });
              const msg = [
                `Chào DS. Xuân (Nhà Thuốc Phú Hải), mình cần tư vấn thuốc:`,
                `- Khách hàng: ${f.name} (${f.phone})`,
                `- Đối tượng: ${f.who}`,
                tags.length ? `- Triệu chứng: ${tags.join(", ")}` : "",
                note ? `- Ghi chú: ${note}` : "",
                photo ? `- (Mình có chụp ảnh đơn/vỏ thuốc, sẽ gửi kèm ngay bên dưới ạ)` : "",
              ]
                .filter(Boolean)
                .join("\n");
              openZaloWithText(msg);
              toast.success("Đã sao chép nội dung & mở Zalo DS. Xuân! Bạn chỉ cần bấm Gửi là xong ạ.");
              setF({ name: "", phone: "", who: "Bản thân" });
              setTags([]);
              setNote("");
              setPhoto(undefined);
            }}
          >
            Gửi yêu cầu tư vấn qua Zalo
          </Btn>
        </div>
      </Card>
    </div>
  );
}
