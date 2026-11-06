// Home v2 copy — part B: vi, th
module.exports = {
  vi: {
    nav: { catalog: 'Mã vật liệu', applications: 'Ứng dụng', supplyChain: 'Chuỗi cung ứng', partners: 'Thương hiệu đối tác', contact: 'Liên hệ', rfq: 'Xin báo giá' },
    hero: {
      kicker: 'China Plastic City · Cung ứng trực tiếp từ Yuyao',
      title: 'Đối tác chuỗi cung ứng polymer & nhựa kỹ thuật toàn cầu',
      subtitle: 'Phân phối ABS, PC, PMMA, PA66, POM và các nhựa kỹ thuật từ các nhà sản xuất hàng đầu thế giới — hàng sẵn, COA gốc truy xuất nguồn gốc, tư vấn chọn mã và xuất khẩu trọn gói.',
      searchPh: 'Nhập mã vật liệu (PA-757, K8003, 5000S) hoặc loại nhựa / ứng dụng…',
      searchBtn: 'Tìm kiếm',
      statGrades: 'mã vật liệu online',
      statStock: 'quy cách sẵn hàng',
      statBrands: 'thương hiệu sản xuất',
      statCoa: 'COA chính hãng',
      browse: 'Xem tất cả mã',
      quote: 'Xin báo giá',
      imgTag: 'HẠT POLYMER NGUYÊN SINH',
      imgBrands: 'CHIMEI · LOTTE · MITSUBISHI · BASF · FORMOSA'
    },
    catalog: {
      kicker: 'CƠ SỞ DỮ LIỆU THÔNG SỐ & KHO',
      title: 'Thư viện mã nhựa kỹ thuật & polymer',
      subtitle: 'Thông số cơ lý chính xác, hướng dẫn gia công và tra cứu TDS gốc trực tuyến — mỗi mã có trang chi tiết riêng.',
      viewAll: 'Xem tất cả mã →',
      spot: 'Sẵn hàng',
      mfi: 'MFI', density: 'Khối lượng riêng', apps: 'Ứng dụng', inquire: 'Báo giá', tds: 'TDS'
    },
    apps: {
      kicker: 'GIẢI PHÁP NGÀNH',
      title: 'Giải pháp ứng dụng ngành',
      subtitle: 'Từ chi tiết khoang động cơ ô tô đến ống kính quang học — chúng tôi chọn đúng loại nhựa cho thị trường của bạn.',
      automotive: { t: 'Ô tô & Đi lại', d: 'Nhựa chịu nhiệt, tăng cường sợi thủy tinh và mạ được cho chi tiết nội thất, ngoại thất và khoang động cơ.', res: 'PA66-GF30 · PC/ABS · ABS chịu nhiệt · POM', browse: 'Xem các mã' },
      electronics: { t: 'Quang học & vỏ 3C', d: 'PMMA và PC cấp quang học trong suốt cao, tán xạ kép thấp cho ống kính, tấm dẫn sáng và vỏ thiết bị.', res: 'PMMA · PC quang học · ABS lưu động cao', browse: 'Xem các mã' },
      appliances: {
        t: 'Gia dụng thông minh',
        d: 'Vật liệu bóng cao không cần sơn và chống cháy cho panel gia dụng và bộ phận điện an toàn.',
        items: [
          'Bóng cao không cần sơn: CHIMEI PA-757',
          'Bồn nước / cửa sổ trong suốt: CHIMEI PA-758',
          'Bộ phận điện chống cháy UL94 V-0'
        ],
        res: 'CHIMEI · FORMOSA · LOTTE', browse: 'Lọc ABS'
      },
      industrial: {
        t: 'Công nghiệp & Y tế',
        d: 'Polymer chịu mài mòn, tiệt trùng được và siêu chịu nhiệt cho công nghiệp chính xác và thiết bị y tế.',
        items: [
          'Bánh răng chịu mài mòn: Mitsubishi POM F20-03',
          'Dụng cụ y tế tiệt trùng: Solvay PPSU',
          'Hàng không & bán dẫn: Victrex PEEK-450G (260°C)'
        ],
        res: 'VICTREX · SOLVAY · MITSUBISHI · DOW', browse: 'Polymer đặc biệt'
      }
    },
    supply: {
      kicker: 'LOGISTICS & KHO VẬN',
      title: 'Kho vận & chuỗi cung ứng',
      subtitle: 'Hàng sẵn tại China Plastic City, cạnh cảng Ningbo–Zhoushan — phục vụ cả xuất khẩu và sản xuất nội địa.',
      whTitle: 'Xuất kho ngay · Phục vụ các cảng toàn cầu',
      whText: 'Trụ sở tại China Plastic City (Yuyao), Xianxunhe vận hành kho vận số hóa với hàng nghìn tấn nhựa kỹ thuật sẵn hàng. Hỗ trợ nguyên container và ghép hàng, sát cảng Ningbo–Zhoushan và Thượng Hải.',
      whCaption: 'Trung tâm kho thông minh Yuyao',
      whSub: 'Trung tâm logistics China Plastic City · Pallet tiêu chuẩn 25kg',
      area: 'Diện tích kho', dispatch: 'Xuất kho nhanh',
      cta: 'Đặt lịch xem hàng / Đặt hàng',
      calcEntry: 'Máy tính xếp container', calcEntryDesc: 'Ước tính số container 20GP/40HQ cho đơn hàng',
      pillars: [
        { t: 'Chính hãng & truy xuất', d: '100% bao bì gốc nhà máy, kèm COA, TDS và MSDS theo từng lô hàng.' },
        { t: 'Chất lượng đảm bảo', d: 'Chấp nhận kiểm tra SGS / bên thứ ba trước khi xếp container; truy xuất toàn trình.' },
        { t: 'Logistics nhanh', d: 'Mã sẵn hàng xuất trong 1–2 ngày; điều kiện FOB Ningbo, CIF, DAP đến Đông Nam Á.' },
        { t: 'Hỗ trợ kỹ thuật', d: 'Kỹ sư vật liệu tư vấn chọn mã, phương án thay thế và quy trình gia công.' }
      ],
      assured: 'Chuẩn chất lượng & giao hàng',
      trade: {
        title: 'Điều kiện giao dịch',
        moq: 'MOQ 1 tấn/mã · ghép container',
        pay: 'T/T 30% đặt cọc · L/C cho đơn lớn',
        lead: 'Sẵn hàng 1–2 ngày · đặt trước 2–4 tuần',
        sample: 'Mẫu miễn phí 0,5–2kg'
      }
    },
    partners: { kicker: 'CÁC NHÀ SẢN XUẤT ĐỐI TÁC CHÍNH' },
    contact: {
      kicker: 'TRỤ SỞ & LIÊN HỆ',
      title: 'Liên hệ Xianxunhe',
      subtitle: 'Báo giá trong 30 phút giờ làm việc — giá xuất kho hoặc CFR/CIF đến cảng của bạn.',
      aboutTitle: 'Về Ningbo Xianxunhe',
      aboutP1: 'Ningbo Xianxunhe New Materials là doanh nghiệp phân phối polymer đặt trụ sở tại China Plastic City, Yuyao — trung tâm giao dịch nguyên liệu nhựa lớn nhất Trung Quốc.',
      aboutP2: 'Quan hệ cung ứng sâu với CHIMEI, Formosa, LG Chem, Mitsubishi, BASF, Covestro, SABIC: ABS, PC, PMMA, PA, POM và vật liệu đặc biệt.',
      aboutP3: 'Phục vụ khách hàng Đông Nam Á, Nga và toàn cầu bằng đội ngũ thương mại tiếng Anh / tiếng Trung, chứng từ đầy đủ.',
      hqLabel: 'Trụ sở chính', hqValue: 'China Plastic City, Yuyao, Ningbo, Chiết Giang',
      mailLabel: 'Email', phoneLabel: 'WhatsApp / Điện thoại', siteLabel: 'Website',
      hoursLabel: 'Giờ làm việc', hoursValue: 'T2–T7 8:30–18:00 (GMT+8)',
      visitNote: 'Gần ga Yuyao Bắc và nút cao tốc Hàng Châu—Ningbo. Đặt lịch xem hàng trực tiếp theo hẹn.',
      locLabel: 'Trụ sở', locValue: 'Yuyao, Ningbo',
      domLabel: 'Email doanh nghiệp', netLabel: 'Phân phối', netValue: 'Xuất khẩu & nội địa'
    },
    footer: {
      desc: 'Nhà phân phối hàng đầu về nhựa kỹ thuật và compound polymer tại China Plastic City, Yuyao, Ningbo.',
      featured: 'Mã vật liệu chính',
      quickTitle: 'Yêu cầu thương mại',
      quickDesc: 'Báo giá nhanh trong 30 phút giờ làm việc — xuất kho hoặc CFR/CIF đến cảng của bạn.',
      rights: '© 2026 Ningbo Xianxunhe New Materials Co., Ltd. Mọi quyền được bảo lưu.',
      disclaimer: 'Thông số TDS trên trang là giá trị điển hình từ tài liệu nhà sản xuất, chỉ để tham khảo; COA của lô hàng giao là căn cứ cuối cùng.'
    },
    rfq: {
      title: 'Xin báo giá nhanh',
      sub: 'Cho chúng tôi biết mã và số lượng — báo giá trong 30 phút giờ làm việc.',
      name: 'Tên của bạn *', email: 'Email',
      phone: 'Điện thoại / WhatsApp', company: 'Công ty', prod: 'Mã liệu / sản phẩm',
      prodPh: 'Nhập mã liệu rồi Enter — thêm được nhiều mã',
msg: 'Số lượng & cảng đích *',
      msgPh: 'ví dụ: PA-757 × 26 tấn, FOB Ningbo → TP.HCM…',
      send: 'Gửi yêu cầu', sending: 'Đang gửi…', ok: 'Đã nhận được! Chúng tôi sẽ trả lời trong 30 phút giờ làm việc.', close: 'Đóng'
    }
  },
  th: {
    nav: { catalog: 'รหัสวัสดุ', applications: 'การใช้งาน', supplyChain: 'โซ่อุปทาน', partners: 'แบรนด์พันธมิตร', contact: 'ติดต่อเรา', rfq: 'ขอใบเสนอราคา' },
    hero: {
      kicker: 'China Plastic City · ส่งตรงจากสำนักงานใหญ่หยูเหยา',
      title: 'พันธมิตรซัพพลายเชนวัสดุพอลิเมอร์และพลาสติกวิศวกรรมระดับโลก',
      subtitle: 'จัดจำหน่าย ABS, PC, PMMA, PA66, POM และพลาสติกวิศวกรรมจากผู้ผลิตชั้นนำ — สต็อกพร้อมส่ง COA ต้นฉบับ ตรวจสอบย้อนกลับได้ พร้อมให้คำปรึกษาเลือกเกรดและส่งออกครบวงจร',
      searchPh: 'พิมพ์รหัสเกรด (PA-757, K8003, 5000S) หรือชนิดพลาสติก/การใช้งาน…',
      searchBtn: 'ค้นหา',
      statGrades: 'รหัสวัสดุออนไลน์',
      statStock: 'สเปกพร้อมส่ง',
      statBrands: 'แบรนด์ผู้ผลิต',
      statCoa: 'COA แท้',
      browse: 'ดูทุกรหัส',
      quote: 'ขอใบเสนอราคา',
      imgTag: 'เม็ดพอลิเมอร์บริสุทธิ์',
      imgBrands: 'CHIMEI · LOTTE · MITSUBISHI · BASF · FORMOSA'
    },
    catalog: {
      kicker: 'ฐานข้อมูลสเปกและสต็อก',
      title: 'คลังรหัสพลาสติกวิศวกรรมและพอลิเมอร์',
      subtitle: 'สมบัติเชิงกายภาพและเชิงกลที่แม่นยำ คำแนะนำกระบวนการขึ้นรูป และ TDS ต้นฉบับ — ทุกรหัสมีหน้ารายละเอียดของตัวเอง',
      viewAll: 'ดูทุกรหัส →',
      spot: 'มีสต็อก',
      mfi: 'MFI', density: 'ความหนาแน่น', apps: 'การใช้งาน', inquire: 'เสนอราคา', tds: 'TDS'
    },
    apps: {
      kicker: 'โซลูชันอุตสาหกรรม',
      title: 'โซลูชันการใช้งานตามอุตสาหกรรม',
      subtitle: 'จากชิ้นส่วนใต้ฝากระโปรงรถยนต์ถึงเลนส์ทางแสง — เราเลือกเรซินให้ตรงกับตลาดของคุณ',
      automotive: { t: 'ยานยนต์', d: 'เรซินทนความร้อน เสริมใยแก้ว และชุบไฟฟ้าได้ สำหรับชิ้นส่วนภายใน ภายนอก และใต้ฝากระโปรง', res: 'PA66-GF30 · PC/ABS · ABS ทนร้อน · POM', browse: 'ดูรหัสที่เกี่ยวข้อง' },
      electronics: { t: 'ทัศนศาสตร์ & ชิ้นส่วน 3C', d: 'PMMA และ PC ระดับทัศนศาสตร์โปร่งใสสูง ไบรฟรินเจนซ์ต่ำ สำหรับเลนส์ ไกด์ไฟ และเคสอุปกรณ์', res: 'PMMA · PC ทัศนศาสตร์ · ABS ไหลสูง', browse: 'ดูรหัสที่เกี่ยวข้อง' },
      appliances: {
        t: 'เครื่องใช้ไฟฟ้าอัจฉริยะ',
        d: 'วัสดุเงาสูงไม่ต้องพ่นสี และทนไฟ สำหรับแผงเครื่องใช้ไฟฟ้าและชิ้นส่วนไฟฟ้า',
        items: [
          'ฉากเงาสูงไม่พ่นสี: CHIMEI PA-757',
          'ถังน้ำ/หน้าต่างโปร่งใส: CHIMEI PA-758',
          'ชิ้นส่วนไฟฟ้าทนไฟ UL94 V-0'
        ],
        res: 'CHIMEI · FORMOSA · LOTTE', browse: 'กรอง ABS'
      },
      industrial: {
        t: 'อุตสาหกรรมแม่นยำ & การแพทย์',
        d: 'พอลิเมอร์ทนสึก นึ่งฆ่าเชื้อได้ และทนความร้อนสูงพิเศษ สำหรับอุตสาหกรรมแม่นยำและอุปกรณ์การแพทย์',
        items: [
          'เฟืองทนสึก: Mitsubishi POM F20-03',
          'เครื่องมือแพทย์นึ่งฆ่าเชื้อได้: Solvay PPSU',
          'อวกาศ & เซมิคอนดักเตอร์: Victrex PEEK-450G (260°C)'
        ],
        res: 'VICTREX · SOLVAY · MITSUBISHI · DOW', browse: 'พอลิเมอร์พิเศษ'
      }
    },
    supply: {
      kicker: 'โลจิสติกส์และคลังสินค้า',
      title: 'คลังสินค้าและการส่งมอบ',
      subtitle: 'สต็อกพร้อมส่งที่ China Plastic City ใกล้ท่าเรือหนิงโป–โจวชาน — รองรับทั้งส่งออกและในประเทศ',
      whTitle: 'ส่งของทันที · ต่อยอดทั่วโลก',
      whText: 'สำนักงานใหญ่ที่ China Plastic City (หยูเหยา) เซียนซวิ้นเหอบริหารคลังสินค้าดิจิทัลครบวงจร มีพลาสติกวิศวกรรมสต็อกหลายพันตัน รองรับตู้เต็มและรวมสินค้า ใกล้ท่าเรือหนิงโป–โจวชานและเซี่ยงไฮ้',
      whCaption: 'ศูนย์คลังสินค้าอัจฉริยะหยูเหยา',
      whSub: 'ศูนย์โลจิสติกส์กลาง China Plastic City · พาเลทมาตรฐาน 25kg',
      area: 'พื้นที่คลังสินค้า', dispatch: 'ส่งของทันที',
      cta: 'นัดชมสินค้า / สั่งซื้อ',
      calcEntry: 'เครื่องคิดเลขตู้คอนเทนเนอร์', calcEntryDesc: 'ประเมินตู้ 20GP/40HQ สำหรับออเดอร์ของคุณ',
      pillars: [
        { t: 'ของแท้ ตรวจสอบได้', d: '100% บรรจุภัณฑ์ต้นฉบับจากโรงงาน พร้อม COA, TDS และ MSDS ทุกล็อต' },
        { t: 'คุณภาพรับประกัน', d: 'รับการตรวจสอบ SGS / บุคคลที่สามก่อนส่ง ตรวจย้อนกลับตลอดสาย' },
        { t: 'โลจิสติกส์รวดเร็ว', d: 'สต็อกส่งใน 1–2 วัน เงื่อนไข FOB หนิงโป, CIF, DAP ถึงอาเซียนและทั่วโลก' },
        { t: 'สนับสนุนเทคนิค', d: 'วิศวกรวัสดุช่วยเลือกเกรด ทดแทน และแนะนำการขึ้นรูป' }
      ],
      assured: 'มาตรฐานคุณภาพและการส่งมอบ',
      trade: {
        title: 'เงื่อนไขการค้า',
        moq: 'MOQ 1 ตัน/เกรด · รวมคอนเทนเนอร์ได้',
        pay: 'T/T มัดจำ 30% · L/C สำหรับล็อตใหญ่',
        lead: 'สต็อก 1–2 วัน · สั่งผลิต 2–4 สัปดาห์',
        sample: 'ตัวอย่างฟรี 0.5–2kg'
      }
    },
    partners: { kicker: 'ผู้ผลิตพันธมิตรหลัก' },
    contact: {
      kicker: 'สำนักงานใหญ่และการติดต่อ',
      title: 'ติดต่อเซียนซวิ้นเหอ',
      subtitle: 'ใบเสนอราคาภายใน 30 นาทีในวันทำการ — ราคาส่งจากคลัง หรือ CFR/CIF ถึงท่าเรือของคุณ',
      aboutTitle: 'เกี่ยวกับหนิงโป เซียนซวิ้นเหอ',
      aboutP1: 'หนิงโป เซียนซวิ้นเหอ นิว แมททีเรียลส์ เป็นผู้จัดจำหน่ายพอลิเมอร์ที่ตั้งอยู่ที่ China Plastic City หยูเหยา — ศูนย์กลางการค้าวัตถุดิบพลาสติกที่ใหญ่ที่สุดของจีน',
      aboutP2: 'มีความสัมพันธ์ด้านการส่งมอบกับ CHIMEI, Formosa, LG Chem, Mitsubishi, BASF, Covestro, SABIC ครอบคลุม ABS, PC, PMMA, PA, POM และวัสดุพิเศษ',
      aboutP3: 'ให้บริการลูกค้าในอาเซียน รัสเซีย และทั่วโลก ด้วยทีมการค้าภาษาอังกฤษ/จีน เอกสารครบถ้วน',
      hqLabel: 'สำนักงานใหญ่', hqValue: 'China Plastic City, หยูเหยา, หนิงโป, เจ้อเจียง',
      mailLabel: 'อีเมล', phoneLabel: 'WhatsApp / โทรศัพท์', siteLabel: 'เว็บไซต์',
      hoursLabel: 'เวลาทำการ', hoursValue: 'จันทร์–เสาร์ 8:30–18:00 (GMT+8)',
      visitNote: 'หมายเหตุ: ใกล้สถานีรถไฟหยูเหยาเหนือและทางออกทางด่วนหางโจว–หนิงโป ยินดีรับนัดชมสินค้าถึงคลัง',
      locLabel: 'ที่ตั้ง', locValue: 'หยูเหยา, หนิงโป',
      domLabel: 'อีเมลองค์กร', netLabel: 'การจัดจำหน่าย', netValue: 'ส่งออกและในประเทศ'
    },
    footer: {
      desc: 'ผู้จัดจำหน่ายพลาสติกวิศวกรรมและคอมปาวด์พอลิเมอร์ชั้นนำที่ China Plastic City หยูเหยา หนิงโป',
      featured: 'เกรดหลัก',
      quickTitle: 'การสอบถามเชิงพาณิชย์',
      quickDesc: 'ใบเสนอราคารวดเร็วภายใน 30 นาทีในวันทำการ — ส่งจากคลังหรือ CFR/CIF ถึงท่าเรือของคุณ',
      rights: '© 2026 Ningbo Xianxunhe New Materials Co., Ltd. สงวนลิขสิทธิ์',
      disclaimer: 'ค่า TDS บนเว็บไซต์เป็นค่าทั่วไปจากเอกสารผู้ผลิต เพื่ออ้างอิงเท่านั้น COA ของล็อตที่ส่งมอบเป็นเกณฑ์สุดท้าย'
    },
    rfq: {
      title: 'ขอใบเสนอราคาด่วน',
      sub: 'บอกเราถึงเกรดและจำนวน — เสนอราคาภายใน 30 นาทีในวันทำการ',
      name: 'ชื่อของคุณ *', email: 'อีเมล',
      phone: 'โทรศัพท์ / WhatsApp', company: 'บริษัท', prod: 'เกรด / ผลิตภัณฑ์',
      prodPh: 'พิมพ์เกรดแล้วกด Enter — เพิ่มได้หลายเกรด',
msg: 'ปริมาณและท่าเรือปลายทาง *',
      msgPh: 'เช่น PA-757 × 26ตัน, FOB หนิงโป → โฮจิมินห์…',
      send: 'ส่งคำขอ', sending: 'กำลังส่ง…', ok: 'ได้รับแล้ว! เราจะตอบกลับภายใน 30 นาทีในวันทำการ', close: 'ปิด'
    }
  }
};
