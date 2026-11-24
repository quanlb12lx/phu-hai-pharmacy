import { createContext, useContext, useState, type ReactNode } from "react";

export type Callback = {
  id: string; name: string; phone: string; reason: string; note?: string;
  photo?: string; time: string; done: boolean; pharmacistNote?: string; urgent?: boolean;
};
export type Reservation = { id: string; customer: string; product: string; time: string; ready: boolean };
export type Product = { id: string; name: string; price: number; category: string; image: string };
export type Article = { id: string; title: string; image: string; minutes: number; body: string; advice: string; productId?: string };

const img = (id: string) => `https://images.unsplash.com/${id}?w=600&q=70&auto=format&fit=crop`;

const initialProducts: Product[] = [
  { id: "p1", name: "Máy đo huyết áp bắp tay Omron", price: 850000, category: "Thiết bị y tế", image: img("photo-1615486511484-92e172cc4fe0") },
  { id: "p2", name: "Men vi sinh Enterogermina (Hộp 20 ống)", price: 165000, category: "Tiêu hóa", image: img("photo-1584308666744-24d5c474f2ae") },
  { id: "p3", name: "Nước muối sinh lý Natri Clorid 0.9% (Lốc 10 chai)", price: 45000, category: "Vệ sinh", image: img("photo-1631549916768-4119b2e5f926") },
  { id: "p4", name: "Xịt chống muỗi & phòng sốt xuất huyết Remos", price: 68000, category: "Phòng bệnh", image: img("photo-1576602976047-174e57a47881") },
  { id: "p5", name: "Viên sủi Vitamin C + Kẽm tăng đề kháng", price: 55000, category: "Vitamin", image: img("photo-1607619056574-7b8d3ee536b2") },
  { id: "p6", name: "Sữa dinh dưỡng cho người tiểu đường (Lon 400g)", price: 320000, category: "Dinh dưỡng", image: img("photo-1550583724-b2692b85b150") },
];

const initialArticles: Article[] = [
  { id: "a1", title: "Cảnh báo sốt xuất huyết tại Đồng Nai: 4 dấu hiệu nhận biết sớm cho gia đình", image: img("photo-1584036561566-baf8f5f1b144"), minutes: 4,
    body: "Mùa mưa ở Trảng Dài, muỗi vằn sinh sản rất nhanh. Bốn dấu hiệu cần chú ý: (1) Sốt cao đột ngột 39–40°C kéo dài 2–7 ngày; (2) Đau nhức đầu, đau sau hốc mắt; (3) Nổi chấm đỏ dưới da, chảy máu chân răng; (4) Đau bụng, nôn ói, mệt lả. Khi có dấu hiệu (3) hoặc (4), cần đưa người bệnh đến bệnh viện ngay.",
    advice: "Tuyệt đối không tự ý dùng Aspirin hay Ibuprofen khi nghi sốt xuất huyết. Chỉ hạ sốt bằng Paracetamol đúng liều và uống nhiều nước, oresol nha cô chú.", productId: "p4" },
  { id: "a2", title: "Cách bảo quản thuốc huyết áp, tiểu đường đúng cách khi thời tiết nắng nóng", image: img("photo-1471864190281-a93a3070b6de"), minutes: 3,
    body: "Nhiệt độ trong nhà mùa nắng có thể vượt 35°C. Thuốc nên để nơi khô ráo, dưới 30°C, tránh ánh nắng trực tiếp và không để trong xe máy. Bút tiêm insulin chưa mở nắp cần để ngăn mát tủ lạnh (2–8°C), không để ngăn đá.",
    advice: "Cô chú đừng bóc vỉ thuốc ra hộp chia sẵn quá 7 ngày, vì thuốc dễ hút ẩm và giảm tác dụng ạ.", productId: "p1" },
  { id: "a3", title: "Phân biệt cảm cúm thông thường và viêm họng cấp để tránh lạm dụng kháng sinh", image: img("photo-1584515933487-779824d29309"), minutes: 5,
    body: "Cảm cúm do virus thường kèm sổ mũi, hắt hơi, đau mình và tự khỏi sau 5–7 ngày, không cần kháng sinh. Viêm họng do vi khuẩn thường đau rát họng dữ dội, sốt cao, amidan có mủ trắng, không ho — trường hợp này cần được khám và kê đơn.",
    advice: "Kháng sinh không trị được cảm cúm. Dùng sai sẽ gây nhờn thuốc và rối loạn tiêu hóa. Cô chú cứ ghé hỏi Xuân trước khi mua kháng sinh nha.", productId: "p5" },
];

type Store = {
  points: number; addPoints: (n: number) => void;
  callbacks: Callback[]; addCallback: (c: Omit<Callback, "id" | "time" | "done">) => void;
  completeCallback: (id: string, note: string) => void;
  reservations: Reservation[]; reserve: (product: string, customer?: string) => void; markReady: (id: string) => void;
  products: Product[]; addProduct: (p: Omit<Product, "id">) => void;
  articles: Article[]; addArticle: (a: Omit<Article, "id">) => void;
};

const Ctx = createContext<Store | null>(null);
const now = () => new Date().toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" });
const uid = () => Math.random().toString(36).slice(2, 9);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(250);
  const [callbacks, setCallbacks] = useState<Callback[]>([
    { id: "c1", name: "Cô Nguyễn Thị Mai", phone: "0908123456", reason: "Yêu cầu gọi lại sau 48h dùng thuốc", note: "Vẫn còn ho về đêm", time: "08:15 24/11", done: false, urgent: true },
    { id: "c2", name: "Anh Lê Văn Tâm", phone: "0912345678", reason: "Gửi ảnh hỏi đơn thuốc mới", note: "Người cao tuổi · Huyết áp/Tiểu đường", photo: img("photo-1587854692152-cbe660dbde88"), time: "07:40 24/11", done: false, urgent: true },
    { id: "c3", name: "Chị Phạm Thu Hà", phone: "0987654321", reason: "Tư vấn cho trẻ em", note: "Cảm sốt", time: "16:20 23/11", done: true, pharmacistNote: "Đã hướng dẫn liều hạ sốt theo cân nặng" },
  ]);
  const [reservations, setReservations] = useState<Reservation[]>([
    { id: "r1", customer: "Cô Lan", product: "Men vi sinh Enterogermina (Hộp 20 ống)", time: "08:30 24/11", ready: false },
  ]);
  const [products, setProducts] = useState(initialProducts);
  const [articles, setArticles] = useState(initialArticles);

  const value: Store = {
    points, addPoints: (n) => setPoints((p) => p + n),
    callbacks,
    addCallback: (c) => setCallbacks((l) => [{ ...c, id: uid(), time: now(), done: false, urgent: true }, ...l]),
    completeCallback: (id, note) => setCallbacks((l) => l.map((c) => (c.id === id ? { ...c, done: true, pharmacistNote: note } : c))),
    reservations,
    reserve: (product, customer = "Khách dùng ứng dụng") => setReservations((l) => [{ id: uid(), customer, product, time: now(), ready: false }, ...l]),
    markReady: (id) => setReservations((l) => l.map((r) => (r.id === id ? { ...r, ready: true } : r))),
    products, addProduct: (p) => setProducts((l) => [...l, { ...p, id: uid() }]),
    articles, addArticle: (a) => setArticles((l) => [{ ...a, id: uid() }, ...l]),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}

export const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";
export const PHARMACY = {
  name: "Nhà Thuốc Phú Hải", pharmacist: "Dược sĩ Bùi Thị Xuân",
  address: "143 Nguyễn Phúc Chu, Phường Trảng Dài, Đồng Nai",
  phone: "0909000143", maps: "https://google.com",
};
