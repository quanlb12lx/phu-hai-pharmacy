function AskTab() {
  const { addCallback } = useStore();
  const [f, setF] = useState({ name: "", phone: "", who: "Bản thân" });
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<string>();

  return (
    <div className="space-y-4">
      <Card>
        <H2 icon={<MessageCircle className="h-5 w-5 text-emerald-600" />}>
          Gửi yêu cầu tư vấn tới DS. Bùi Thị Xuân
        </H2>
        <p className="mb-4 text-xs text-slate-500">
          Điền thông tin hoặc chụp ảnh vỏ thuốc cũ, DS. Xuân sẽ xem và gọi điện tư vấn ngay ạ.
        </p>

        <div className="space-y-3.5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Tên của mình">
              <input
                className={inputCls}
                value={f.name}
                onChange={(e) => setF({ ...f, name: e.target.value })}
                placeholder="VD: Anh Hùng"
              />
            </Field>
            <Field label="Số điện thoại liên hệ">
              <input
                className={inputCls}
                inputMode="tel"
                value={f.phone}
                onChange={(e) => setF({ ...f, phone: e.target.value })}
                placeholder="09xx xxx xxx"
              />
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
                <Pill
                  key={t}
                  active={tags.includes(t)}
                  onClick={() => setTags(tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t])}
                >
                  {t}
                </Pill>
              ))}
            </div>
          </div>

          <Field label="Ghi chú thêm (không bắt buộc)">
            <input
              className={inputCls}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Đang uống thuốc huyết áp..."
            />
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
                const file = e.target.files?.item(0);
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
              toast.success("Đã gửi thông tin tới DS. Bùi Thị Xuân! Nhà thuốc sẽ gọi lại ngay ạ.");
              setF({ name: "", phone: "", who: "Bản thân" });
              setTags([]);
              setNote("");
              setPhoto(undefined);
            }}
          >
            <CheckCircle2 className="h-4 w-4" />
            Gửi yêu cầu cho DS. Xuân
          </Btn>
        </div>
      </Card>
    </div>
  );
}
