import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export const PHARMACY = {
  name: "Nhà Thuốc Phú Hải",
  pharmacist: "Dược sĩ Bùi Thị Xuân",
  address: "143 Nguyễn Phúc Chu, Phường Trảng Dài, Đồng Nai",
  phone: "0933050507",
  zalo: ["https", "://", "zalo.me/0933050507"].join(""),
  maps: ["https", "://", "://google.com"].join(""),
  hours: "06:30 – 21:30 · Tất cả các ngày trong tuần",
  adminUser: "dsxuan",
  adminPass: "123456",
};

export type Product = {
  id: string;
  name: string;
  category: "Tăng đề kháng" | "Tiêu hóa" | "Giảm đau - Hạ sốt" | "Chăm sóc gia đình";
  price: number;
  note: string;
  image: string;
};

export type Article = {
  id: string;
  title: string;
  minutes: number;
  body: string;
  advice: string;
  image: string;
};

export type CallbackRequest = {
  id: string;
  name: string;
  phone: string;
  reason: string;
  note: string;
  photo?: string;
  time: string;
  done: boolean;
  replyNote?: string;
};

export type Reservation = {
  id: string;
  product: string;
  customer: string;
  phone: string;
  time: string;
  ready: boolean;
};

const SEED_PRODUCTS: Product[] = [
  { id: "p1", name: "Vitamin C 500mg + Kẽm Tăng Đề Kháng", category: "Tăng đề kháng", price: 85000, note: "Hộp 30 viên · Uống sau ăn sáng, hỗ trợ sức đề kháng cả nhà", image: "https://unsplash.com" },
  { id: "p2", name: "Men Vi Sinh Bào Tử Lợi Khuẩn", category: "Tiêu hóa", price: 120000, note: "Hộp 20 ống · Dùng được cho trẻ nhỏ và người lớn rối loạn tiêu hóa", image: "https://unsplash.com" },
  { id: "p3", name: "Paracetamol 500mg Giảm Đau Hạ Sốt", category: "Giảm đau - Hạ sốt", price: 25000, note: "Vỉ 10 viên · Cách nhau tối thiểu 4–6 giờ khi sốt trên 38.5°C", image: "https://unsplash.com" },
  { id: "p4", name: "Nước Muối Sinh Lý Rửa Mũi Họng 0.9%", category: "Chăm sóc gia đình", price: 15000, note: "Chai 500ml · Vệ sinh mũi họng hằng ngày mùa nắng bụi Trảng Dài", image: "https://unsplash.com" },
  { id: "p5", name: "Siro Thảo Dược Giảm Ho Dịu Họng", category: "Chăm sóc gia đình", price: 68000, note: "Chai 100ml · Chiết xuất lá thường xuân, dịu họng không gây buồn ngủ", image: "https://unsplash.com" },
  { id: "p6", name: "Oresol Bù Nước Điện Giải Vị Cam", category: "Tiêu hóa", price: 32000, note: "Hộp 10 gói · Pha đúng 1 gói với 200ml nước đun sôi để nguội", image: "https://unsplash.com" },
];

const SEED_ARTICLES: Article[] = [
  {
    id: "a1",
    title: "Cách dùng thuốc hạ sốt an toàn cho trẻ nhỏ tại nhà",
    minutes: 3,
    body: "Khi trẻ sốt từ 38.5°C trở lên, phụ huynh nên lau mát vùng trán, nách, bẹn bằng nước ấm và cho trẻ mặc đồ thoáng. Thuốc hạ sốt Paracetamol tính theo cân nặng: 10–15mg cho mỗi kg cân nặng, mỗi lần cách nhau ít nhất 4–6 giờ.",
    advice: "Tuyệt đối không tự ý phối hợp hai loại thuốc hạ sốt cùng lúc. Nếu trẻ sốt cao liên tục trên 48 giờ hoặc li bì, hãy đưa bé đi khám ngay.",
    image: "https://unsplash.com",
  },
  {
    id: "a2",
    title: "Người cao tuổi uống thuốc huyết áp cần lưu ý gì mỗi sáng?",
    minutes: 4,
    body: "Thuốc huyết áp cần được uống đều đặn vào một khung giờ cố định mỗi ngày, thường là buổi sáng sau khi thức dậy. Không tự ý ngưng thuốc khi thấy chỉ số huyết áp đã ổn định vì dễ gây tăng huyết áp hồi ứng nguy hiểm.",
    advice: "Cô chú nên ghi lại chỉ số đo huyết áp mỗi sáng vào sổ nhỏ và mang theo khi ghé Nhà Thuốc Phú Hải để Dược sĩ Xuân theo dõi giúp.",
    image: "https://unsplash.com",
  },
  {
    id: "a3",
    title: "Phân biệt cảm cúm thông thường và viêm họng cần khám bác sĩ",
    minutes: 3,
    body: "Cảm cúm do virus thường gây sổ mũi, hắt hơi, đau mỏi người nhẹ và tự lui sau 5–7 ngày nếu nghỉ ngơi, bù nước đầy đủ. Kháng sinh không có tác dụng diệt virus cảm cúm thông thường.",
    advice: "Chỉ dùng kháng sinh khi có chỉ định của bác sĩ. Nhà thuốc luôn sẵn sàng tư vấn giảm triệu chứng an toàn, tránh lạm dụng thuốc.",
    image: "https://unsplash.com",
  },
];

const SB_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const SB_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

async function sbFetch(path: string, init?: RequestInit) {
  if (!SB_URL || !SB_KEY) return { ok: false, error: "Thiếu biến môi trường trên Vercel", data: null };
  try {
    const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
        ...(init?.headers || {}),
      },
    });
    const text = await res.text();
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}: ${text.slice(0, 80)}`, data: null };
    }
    return { ok: true, error: "", data: text ? JSON.parse(text) : [] };
  } catch (e) {
    return { ok: false, error: String(e), data: null };
  }
}

function nowTime() {
  return new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) + " · " + new Date().toLocaleDateString("vi-VN");
}
type StoreCtx = {
  products: Product[];
  articles: Article[];
  callbacks: CallbackRequest[];
  reservations: Reservation[];
  dbStatus: string;
  addProduct: (p: Omit<Product, "id">) => void;
  removeProduct: (id: string) => void;
  addArticle: (a: Omit<Article, "id">) => void;
  removeArticle: (id: string) => void;
  addCallback: (c: Omit<CallbackRequest, "id" | "time" | "done">) => void;
  completeCallback: (id: string, replyNote?: string) => void;
  reserve: (product: string, customer: string, phone: string) => void;
  markReady: (id: string) => void;
  refreshAll: () => void;
};

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [articles, setArticles] = useState<Article[]>(SEED_ARTICLES);
  const [callbacks, setCallbacks] = useState<CallbackRequest[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [dbStatus, setDbStatus] = useState<string>("Đang kết nối Supabase...");

  const refreshAll = useCallback(async () => {
    if (!SB_URL || !SB_KEY) {
      setDbStatus("Chưa có biến VITE_SUPABASE trên Vercel (cần Redeploy)");
      return;
    }

    const [pRes, aRes, cRes, rRes] = await Promise.all([
      sbFetch("products?select=*"),
      sbFetch("articles?select=*"),
      sbFetch("callbacks?select=*&order=created_at.desc"),
      sbFetch("reservations?select=*&order=created_at.desc"),
    ]);

    if (!cRes.ok || !rRes.ok) {
      setDbStatus(`Lỗi kết nối: ${cRes.error || rRes.error}`);
      return;
    }

    setDbStatus(`Đã đồng bộ (${cRes.data.length} tư vấn · ${rRes.data.length} giữ hàng)`);

    if (pRes.ok && Array.isArray(pRes.data)) {
      if (pRes.data.length > 0) setProducts(pRes.data);
      else await sbFetch("products", { method: "POST", body: JSON.stringify(SEED_PRODUCTS) });
    }

    if (aRes.ok && Array.isArray(aRes.data)) {
      if (aRes.data.length > 0) setArticles(aRes.data);
      else await sbFetch("articles", { method: "POST", body: JSON.stringify(SEED_ARTICLES) });
    }

    if (Array.isArray(cRes.data)) {
      setCallbacks(
        cRes.data.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          name: String(r.name || ""),
          phone: String(r.phone || ""),
          reason: String(r.reason || ""),
          note: String(r.note || ""),
          photo: r.photo ? String(r.photo) : undefined,
          time: r.created_at ? new Date(String(r.created_at)).toLocaleString("vi-VN") : nowTime(),
          done: Boolean(r.done),
        }))
      );
    }

    if (Array.isArray(rRes.data)) {
      setReservations(
        rRes.data.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          product: String(r.product_name || ""),
          customer: String(r.customer_name || ""),
          phone: String(r.phone || ""),
          time: r.created_at ? new Date(String(r.created_at)).toLocaleString("vi-VN") : nowTime(),
          ready: Boolean(r.done),
        }))
      );
    }
  }, []);

  useEffect(() => {
    refreshAll();
    const timer = setInterval(refreshAll, 5000);
    return () => clearInterval(timer);
  }, [refreshAll]);

  const addProduct = (p: Omit<Product, "id">) => {
    const item = { ...p, id: "p" + Date.now() };
    setProducts((prev) => [item, ...prev]);
    sbFetch("products", { method: "POST", body: JSON.stringify(item) }).then(() => refreshAll());
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((x) => x.id !== id));
    sbFetch(`products?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" }).then(() => refreshAll());
  };

  const addArticle = (a: Omit<Article, "id">) => {
    const item = { ...a, id: "a" + Date.now() };
    setArticles((prev) => [item, ...prev]);
    sbFetch("articles", { method: "POST", body: JSON.stringify(item) }).then(() => refreshAll());
  };

  const removeArticle = (id: string) => {
    setArticles((prev) => prev.filter((x) => x.id !== id));
    sbFetch(`articles?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" }).then(() => refreshAll());
  };

  const addCallback = (c: Omit<CallbackRequest, "id" | "time" | "done">) => {
    const id = "c" + Date.now();
    const item: CallbackRequest = { ...c, id, time: nowTime(), done: false };
    setCallbacks((prev) => [item, ...prev]);
    sbFetch("callbacks", {
      method: "POST",
      body: JSON.stringify({
        id,
        name: c.name,
        phone: c.phone,
        reason: c.reason,
        note: c.note,
        photo: c.photo || null,
        done: false,
      }),
    }).then((res) => {
      if (!res.ok) setDbStatus(`Lỗi gửi tư vấn: ${res.error}`);
      else refreshAll();
    });
  };

  const completeCallback = (id: string, replyNote?: string) => {
    setCallbacks((prev) => prev.map((x) => (x.id === id ? { ...x, done: true, replyNote } : x)));
    sbFetch(`callbacks?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ done: true }),
    }).then(() => refreshAll());
  };

  const reserve = (product: string, customer: string, phone: string) => {
    const id = "r" + Date.now();
    const item: Reservation = { id, product, customer, phone, time: nowTime(), ready: false };
    setReservations((prev) => [item, ...prev]);
    sbFetch("reservations", {
      method: "POST",
      body: JSON.stringify({
        id,
        product_name: product,
        customer_name: customer,
        phone,
        done: false,
      }),
    }).then((res) => {
      if (!res.ok) setDbStatus(`Lỗi gửi giữ hàng: ${res.error}`);
      else refreshAll();
    });
  };

  const markReady = (id: string) => {
    setReservations((prev) => prev.map((x) => (x.id === id ? { ...x, ready: true } : x)));
    sbFetch(`reservations?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ done: true }),
    }).then(() => refreshAll());
  };

  return (
    <Ctx.Provider
      value={{
        products,
        articles,
        callbacks,
        reservations,
        dbStatus,
        addProduct,
        removeProduct,
        addArticle,
        removeArticle,
        addCallback,
        completeCallback,
        reserve,
        markReady,
        refreshAll,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}

export const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";
