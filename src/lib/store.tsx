import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Callback = {
  id: string;
  name: string;
  phone: string;
  reason: string;
  note?: string;
  photo?: string;
  time: string;
  done: boolean;
  pharmacistNote?: string;
};

export type Reservation = {
  id: string;
  customer: string;
  phone: string;
  product: string;
  time: string;
  ready: boolean;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  note?: string;
};

export type Article = {
  id: string;
  title: string;
  image: string;
  minutes: number;
  body: string;
  advice: string;
  productId?: string;
};

const img = (id: string) => ["https://", "://unsplash.com", id, "?w=600&q=75&auto=format&fit=crop"].join("");

const initialProducts: Product[] = [
  { id: "p1", name: "Máy đo huyết áp bắp tay Omron", price: 850000, category: "Thiết bị y tế", image: img("photo-1615486511484-92e172cc4fe0"), note: "Bảo hành chính hãng, đo chuẩn xác tại nhà" },
  { id: "p2", name: "Men vi sinh Enterogermina (Hộp 20 ống)", price: 165000, category: "Tiêu hóa", image: img("photo-1584308666744-24d5c474f2ae"), note: "Bổ sung lợi khuẩn, hỗ trợ tiêu hóa khi dùng kháng sinh" },
  { id: "p3", name: "Nước muối sinh lý Natri Clorid 0.9% (Lốc 10 chai)", price: 45000, category: "Vệ sinh", image: img("photo-1631549916768-4119b2e5f926"), note: "Rửa mũi, súc họng hằng ngày cho cả gia đình" },
  { id: "p4", name: "Xịt chống muỗi & phòng sốt xuất huyết Remos", price: 68000, category: "Phòng bệnh", image: img("photo-1576602976047-174e57a47881"), note: "Bảo vệ da khỏi muỗi vằn suốt 10 giờ" },
  { id: "p5", name: "Viên sủi Vitamin C + Kẽm tăng đề kháng", price: 55000, category: "Vitamin", image: img("photo-1607619056574-7b8d3ee536b2"), note: "Hỗ trợ phục hồi sức khỏe, giảm mệt mỏi" },
  { id: "p6", name: "Sữa dinh dưỡng cho người tiểu đường (Lon 400g)", price: 320000, category: "Dinh dưỡng", image: img("photo-1550583724-b2692b85b150"), note: "Ổn định đường huyết, bổ sung dưỡng chất thiết yếu" },
];

const initialArticles: Article[] = [
  {
    id: "a1",
    title: "Cảnh báo sốt xuất huyết tại Đồng Nai: 4 dấu hiệu nhận biết sớm",
    image: img("photo-1584036561566-baf8f5f1b144"),
    minutes: 3,
    body: "Mùa mưa ở Trảng Dài, muỗi vằn sinh sản rất nhanh. Bốn dấu hiệu cần chú ý: (1) Sốt cao đột ngột 39–40°C kéo dài 2–7 ngày; (2) Đau nhức đầu, đau sau hốc mắt; (3) Nổi chấm đỏ dưới da, chảy máu chân răng; (4) Đau bụng, nôn ói, mệt lả. Khi có dấu hiệu (3) hoặc (4), cần đưa người bệnh đến bệnh viện ngay.",
    advice: "Tuyệt đối không tự ý dùng Aspirin hay Ibuprofen khi nghi sốt xuất huyết. Chỉ hạ sốt bằng Paracetamol đúng liều và uống nhiều nước, oresol nha cô chú.",
    productId: "p4",
  },
  {
    id: "a2",
    title: "Cách bảo quản thuốc huyết áp, tiểu đường đúng cách mùa nắng nóng",
    image: img("photo-1471864190281-a93a3070b6de"),
    minutes: 3,
    body: "Nhiệt độ trong nhà mùa nắng có thể vượt 35°C. Thuốc nên để nơi khô ráo, dưới 30°C, tránh ánh nắng trực tiếp và không để trong cốp xe máy. Bút tiêm insulin chưa mở nắp cần để ngăn mát tủ lạnh (2–8°C), không để ngăn đá.",
    advice: "Cô chú đừng bóc vỉ thuốc ra hộp chia sẵn quá 7 ngày, vì thuốc dễ hút ẩm và giảm tác dụng ạ.",
    productId: "p1",
  },
];

type Store = {
  callbacks: Callback[];
  addCallback: (c: Omit<Callback, "id" | "time" | "done">) => void;
  completeCallback: (id: string, note: string) => void;
  reservations: Reservation[];
  reserve: (product: string, customer: string, phone: string) => void;
  markReady: (id: string) => void;
  products: Product[];
  addProduct: (p: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
  articles: Article[];
  addArticle: (a: Omit<Article, "id">) => void;
};

const Ctx = createContext<Store | null>(null);
const now = () => new Date().toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" });
const uid = () => Math.random().toString(36).slice(2, 9);

function useLocalState<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore storage quota errors
    }
  }, [key, state]);
  return [state, setState];
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [callbacks, setCallbacks] = useLocalState<Callback[]>("phuhai_callbacks_v2", [
    { id: "c1", name: "Cô Nguyễn Thị Mai", phone: "0908123456", reason: "Hỏi tư vấn đơn thuốc huyết áp", note: "Muốn hỏi uống trước hay sau ăn", time: "08:15 24/11", done: false },
    { id: "c2", name: "Anh Lê Văn Tâm", phone: "0912345678", reason: "Gửi ảnh hỏi thuốc cho bé", note: "Trẻ em · Ho/Đau họng", time: "07:40 24/11", done: false },
  ]);

  const [reservations, setReservations] = useLocalState<Reservation[]>("phuhai_reservations_v2", [
    { id: "r1", customer: "Cô Lan", phone: "0933456789", product: "Men vi sinh Enterogermina (Hộp 20 ống)", time: "08:30 24/11", ready: false },
  ]);

  const [products, setProducts] = useLocalState<Product[]>("phuhai_products_v2", initialProducts);
  const [articles, setArticles] = useLocalState<Article[]>("phuhai_articles_v2", initialArticles);

  const value: Store = {
    callbacks,
    addCallback: (c) => setCallbacks((l) => [{ ...c, id: uid(), time: now(), done: false }, ...l]),
    completeCallback: (id, note) => setCallbacks((l) => l.map((c) => (c.id === id ? { ...c, done: true, pharmacistNote: note } : c))),
    reservations,
    reserve: (product, customer, phone) => setReservations((l) => [{ id: uid(), customer, phone, product, time: now(), ready: false }, ...l]),
    markReady: (id) => setReservations((l) => l.map((r) => (r.id === id ? { ...r, ready: true } : r))),
    products,
    addProduct: (p) => setProducts((l) => [{ ...p, id: uid() }, ...l]),
    deleteProduct: (id) => setProducts((l) => l.filter((p) => p.id !== id)),
    articles,
    addArticle: (a) => setArticles((l) => [{ ...a, id: uid() }, ...l]),
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
  name: "Nhà Thuốc Phú Hải",
  pharmacist: "Dược sĩ Bùi Thị Xuân",
  address: "143 Nguyễn Phúc Chu, Phường Trảng Dài, Đồng Nai",
  phone: "0932329912",
  zalo: ["https://", "zalo.me/", "0932329912"].join(""),
  maps: ["https://", "://google.com", "10.976022786905054,106.86563912255914"].join(""),
  adminUser: "dsxuan",
  adminPass: "123456",
};
