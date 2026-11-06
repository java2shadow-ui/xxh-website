'use strict';
/* 法务页面文案（隐私政策 / 服务条款）— 6 语言
   结构：LEGAL[lang].privacy = { t: 标题, up: 更新日期, s: [[小标题, 正文], ...] }
   内容为通用 B2B 声明，已按公司实际信息（宁波纤讯和新材料有限公司 / 余姚地址 / 中国法律）填写。 */

const LEGAL = {
  en: {
    privacy: {
      t: 'Privacy Policy', up: 'Last updated: 2 November 2026',
      s: [
        ['Who we are', 'Ningbo Xianxunhe New Materials Co., Ltd., Room 335, Building 1, China Plastic City International Business Center, Yuyao, Ningbo, Zhejiang, China. For any privacy question write to {EMAIL}.'],
        ['Information we collect', 'When you send a quotation request or contact us we collect the name, email address, phone number, company name, resin grades and message that you provide. Our server also records basic technical data such as IP address, browser type and the pages visited.'],
        ['How we use it', 'Your information is used only to answer your inquiry, prepare quotations, arrange samples or shipments, and provide after-sales support. We do not use it for unrelated marketing and we do not sell it.'],
        ['Sharing', 'We never sell or rent personal data. Data is shared only with the service providers needed to fulfil your order — freight forwarder, customs broker, bank — or where required by law.'],
        ['Cookies and analytics', 'We use Google Analytics 4 to understand which pages are useful to buyers. You may block cookies in your browser settings; the website remains fully usable.'],
        ['Retention and your rights', 'Inquiry and order records are retained for up to 36 months for commercial and accounting purposes. You may request access, correction or deletion of your data at any time by email.'],
        ['Changes', 'We may update this policy from time to time. The date shown above indicates the current version.']
      ]
    },
    terms: {
      t: 'Terms of Service', up: 'Last updated: 2 November 2026',
      s: [
        ['Scope', 'This website presents the plastic resin grades we supply and allows you to request quotations. By using the site you accept these terms.'],
        ['Product data', 'Datasheet values are typical values published by the original manufacturer and are provided for material selection only. The certificate of analysis (COA) of the shipped lot prevails. Colour, lot-to-lot variation and processing conditions can affect final results.'],
        ['Quotations and orders', 'Prices, stock levels and lead times shown on this site or quoted by email are indicative until confirmed in writing. No contract of sale exists until we issue a proforma invoice or sales contract that you accept.'],
        ['Trademarks', 'All brand and grade names are the property of their respective owners. We act as an independent distributor; brand names are used solely to identify the goods.'],
        ['Limitation of liability', 'We are not liable for indirect or consequential loss arising from the use of this website or from processing of the material. Our liability is limited to the invoice value of the goods supplied.'],
        ['Governing law', 'These terms are governed by the laws of the People’s Republic of China. Any dispute shall first be settled by friendly negotiation.'],
        ['Contact', 'Ningbo Xianxunhe New Materials Co., Ltd. — {EMAIL} — +86 152 6843 6369.']
      ]
    }
  },
  zh: {
    privacy: {
      t: '隐私政策', up: '最后更新：2026 年 11 月 2 日',
      s: [
        ['我们是谁', '宁波纤讯和新材料有限公司，地址：浙江省余姚市中国塑料城国际商务中心 1 幢 335 室。任何隐私相关问题请联系 {EMAIL}。'],
        ['我们收集哪些信息', '当您提交询价或联系我们时，我们会收集您填写的姓名、邮箱、电话、公司名称、牌号与留言内容。服务器同时记录 IP 地址、浏览器类型、访问页面等基础技术信息。'],
        ['信息用途', '您的信息仅用于回复询价、出具报价、安排样品或发货，以及提供售后服务。我们不会将其用于无关营销，也不会出售。'],
        ['信息共享', '我们绝不出售或出租个人数据。仅在履行订单必需时与服务商共享（货代、报关行、银行），或依法提供。'],
        ['Cookie 与统计', '我们使用 Google Analytics 4 了解哪些页面对买家有用。您可在浏览器中屏蔽 Cookie，网站功能不受影响。'],
        ['保留期限与您的权利', '询价与订单记录为商务及财务目的最多保留 36 个月。您可随时邮件要求查询、更正或删除您的数据。'],
        ['政策更新', '我们可能不时更新本政策，以上日期为当前版本。']
      ]
    },
    terms: {
      t: '服务条款', up: '最后更新：2026 年 11 月 2 日',
      s: [
        ['适用范围', '本网站展示我们供应的塑料牌号并提供询价功能。使用本网站即表示您接受本条款。'],
        ['产品数据', '物性数据为原厂公布的典型值，仅供选材参考。以实际发货批次的 COA（质检报告）为准。颜色、批次差异与加工条件均可能影响最终结果。'],
        ['报价与订单', '网站展示或邮件报出的价格、库存与交期在书面确认前均为参考。我方出具形式发票或销售合同且经您接受后，买卖合同方告成立。'],
        ['商标', '所有品牌与牌号名称归其权利人所有。我方作为独立分销商，仅在识别货物时使用品牌名称。'],
        ['责任限制', '对于因使用本网站或加工该材料产生的间接损失，我方不承担责任。我方责任以所供货物的发票金额为限。'],
        ['适用法律', '本条款适用中华人民共和国法律。争议应先通过友好协商解决。'],
        ['联系方式', '宁波纤讯和新材料有限公司 — {EMAIL} — +86 152 6843 6369。']
      ]
    }
  },
  ru: {
    privacy: {
      t: 'Политика конфиденциальности', up: 'Обновлено: 2 ноября 2026 г.',
      s: [
        ['Кто мы', 'Ningbo Xianxunhe New Materials Co., Ltd., к. 335, корп. 1, Международный деловой центр China Plastic City, г. Юйяо, Нинбо, пров. Чжэцзян, КНР. По вопросам конфиденциальности: {EMAIL}.'],
        ['Какие данные мы собираем', 'При отправке запроса цены или обратной связи мы получаем указанные вами имя, e-mail, телефон, название компании, марки и текст сообщения. Сервер также фиксирует IP-адрес, тип браузера и просмотренные страницы.'],
        ['Как мы используем данные', 'Данные используются только для ответа на запрос, подготовки коммерческого предложения, организации образцов или отгрузки и послепродажной поддержки. Мы не продаём их и не используем для постороннего маркетинга.'],
        ['Передача данных', 'Мы никогда не продаём и не сдаём персональные данные в аренду. Передача возможна только поставщикам услуг, необходимым для исполнения заказа (экспедитор, таможенный брокер, банк), либо по требованию закона.'],
        ['Cookie и аналитика', 'Мы используем Google Analytics 4, чтобы понимать, какие страницы полезны покупателям. Cookie можно отключить в настройках браузера — сайт останется полностью работоспособным.'],
        ['Хранение и ваши права', 'Запросы и заказы хранятся до 36 месяцев в коммерческих и бухгалтерских целях. Вы можете в любое время запросить доступ, исправление или удаление данных по e-mail.'],
        ['Изменения', 'Политика может обновляться; дата выше указывает текущую редакцию.']
      ]
    },
    terms: {
      t: 'Условия использования', up: 'Обновлено: 2 ноября 2026 г.',
      s: [
        ['Область применения', 'Сайт представляет марки пластика, которые мы поставляем, и позволяет запросить цену. Используя сайт, вы принимаете настоящие условия.'],
        ['Данные о продукции', 'Значения в таблицах — типичные данные производителя, приведённые для подбора материала. Приоритет имеет COA фактически отгруженной партии. Цвет, различия между партиями и условия переработки могут влиять на результат.'],
        ['Предложения и заказы', 'Цены, наличие и сроки, указанные на сайте или в переписке, носят справочный характер до письменного подтверждения. Договор купли-продажи возникает после выставления нами проформы-инвойса или контракта и вашего акцепта.'],
        ['Товарные знаки', 'Все наименования брендов и марок принадлежат их правообладателям. Мы выступаем независимым дистрибьютором и используем названия исключительно для идентификации товара.'],
        ['Ограничение ответственности', 'Мы не несём ответственности за косвенные убытки, возникшие из-за использования сайта или переработки материала. Наша ответственность ограничена суммой счёта за поставленный товар.'],
        ['Применимое право', 'Настоящие условия регулируются законодательством Китайской Народной Республики. Споры разрешаются путём дружественных переговоров.'],
        ['Контакты', 'Ningbo Xianxunhe New Materials Co., Ltd. — {EMAIL} — +86 152 6843 6369.']
      ]
    }
  },
  vi: {
    privacy: {
      t: 'Chính sách bảo mật', up: 'Cập nhật: 2 tháng 11 năm 2026',
      s: [
        ['Chúng tôi là ai', 'Ningbo Xianxunhe New Materials Co., Ltd., Phòng 335, Tòa nhà 1, Trung tâm Thương mại Quốc tế China Plastic City, Dư Diêu, Ninh Ba, Chiết Giang, Trung Quốc. Mọi câu hỏi về dữ liệu: {EMAIL}.'],
        ['Thông tin chúng tôi thu thập', 'Khi bạn gửi yêu cầu báo giá hoặc liên hệ, chúng tôi thu thập họ tên, email, điện thoại, tên công ty, mã vật liệu và nội dung bạn nhập. Máy chủ cũng ghi nhận IP, trình duyệt và các trang đã xem.'],
        ['Mục đích sử dụng', 'Thông tin chỉ dùng để trả lời yêu cầu, lập báo giá, sắp xếp mẫu hoặc giao hàng và hỗ trợ sau bán. Chúng tôi không bán dữ liệu và không dùng cho tiếp thị không liên quan.'],
        ['Chia sẻ dữ liệu', 'Chúng tôi không bán hoặc cho thuê dữ liệu cá nhân. Chỉ chia sẻ với đơn vị cần thiết để thực hiện đơn hàng (forwarder, đại lý hải quan, ngân hàng) hoặc theo yêu cầu pháp luật.'],
        ['Cookie và phân tích', 'Chúng tôi dùng Google Analytics 4 để biết trang nào hữu ích. Bạn có thể chặn cookie trong trình duyệt, website vẫn hoạt động đầy đủ.'],
        ['Lưu trữ và quyền của bạn', 'Hồ sơ yêu cầu và đơn hàng được lưu tối đa 36 tháng cho mục đích thương mại và kế toán. Bạn có thể yêu cầu xem, sửa hoặc xóa dữ liệu bất kỳ lúc nào qua email.'],
        ['Thay đổi', 'Chính sách có thể được cập nhật; ngày nêu trên là phiên bản hiện hành.']
      ]
    },
    terms: {
      t: 'Điều khoản dịch vụ', up: 'Cập nhật: 2 tháng 11 năm 2026',
      s: [
        ['Phạm vi', 'Website giới thiệu các mã nhựa chúng tôi cung cấp và cho phép gửi yêu cầu báo giá. Khi sử dụng website, bạn chấp nhận các điều khoản này.'],
        ['Dữ liệu sản phẩm', 'Giá trị trong bảng tính chất là giá trị điển hình do nhà sản xuất công bố, chỉ dùng để chọn vật liệu. COA của lô hàng thực tế là căn cứ cuối cùng. Màu sắc, sai lệch giữa các lô và điều kiện gia công có thể ảnh hưởng kết quả.'],
        ['Báo giá và đơn hàng', 'Giá, tồn kho và thời gian giao hàng hiển thị trên web hoặc trong email chỉ mang tính tham khảo cho đến khi được xác nhận bằng văn bản. Hợp đồng mua bán chỉ hình thành sau khi chúng tôi phát hành proforma invoice hoặc hợp đồng và bạn chấp thuận.'],
        ['Nhãn hiệu', 'Mọi tên thương hiệu và mã vật liệu thuộc về chủ sở hữu tương ứng. Chúng tôi là nhà phân phối độc lập, tên thương hiệu chỉ dùng để nhận diện hàng hóa.'],
        ['Giới hạn trách nhiệm', 'Chúng tôi không chịu trách nhiệm cho thiệt hại gián tiếp phát sinh từ việc dùng website hoặc gia công vật liệu. Trách nhiệm của chúng tôi giới hạn ở giá trị hóa đơn hàng đã cung cấp.'],
        ['Luật áp dụng', 'Các điều khoản này điều chỉnh bởi pháp luật nước Cộng hòa Nhân dân Trung Hoa. Tranh chấp được giải quyết trước hết bằng thương lượng.'],
        ['Liên hệ', 'Ningbo Xianxunhe New Materials Co., Ltd. — {EMAIL} — +86 152 6843 6369.']
      ]
    }
  },
  th: {
    privacy: {
      t: 'นโยบายความเป็นส่วนตัว', up: 'อัปเดตล่าสุด: 2 พฤศจิกายน 2026',
      s: [
        ['เราคือใคร', 'Ningbo Xianxunhe New Materials Co., Ltd. ห้อง 335 อาคาร 1 ศูนย์ธุรกิจนานาชาติ China Plastic City อวี้เหยา หนิงโป เจ้อเจียง จีน ติดต่อเรื่องข้อมูลส่วนบุคคล: {EMAIL}'],
        ['ข้อมูลที่เราเก็บ', 'เมื่อคุณส่งคำขอใบเสนอราคาหรือติดต่อเรา เราจะเก็บชื่อ อีเมล โทรศัพท์ ชื่อบริษัท รหัสวัสดุ และข้อความที่คุณกรอก เซิร์ฟเวอร์ยังบันทึก IP ประเภทเบราว์เซอร์ และหน้าที่เข้าชม'],
        ['วิธีที่เราใช้ข้อมูล', 'ใช้เพื่อตอบคำถาม จัดทำใบเสนอราคา จัดส่งตัวอย่างหรือสินค้า และบริการหลังการขายเท่านั้น เราไม่ขายข้อมูลและไม่ใช้เพื่อการตลาดที่ไม่เกี่ยวข้อง'],
        ['การเปิดเผยข้อมูล', 'เราไม่ขายหรือให้เช่าข้อมูลส่วนบุคคล เปิดเผยเฉพาะผู้ให้บริการที่จำเป็นต่อการปฏิบัติตามคำสั่งซื้อ (ผู้รับจัดการขนส่ง นายหน้าศุลกากร ธนาคาร) หรือตามที่กฎหมายกำหนด'],
        ['คุกกี้และการวิเคราะห์', 'เราใช้ Google Analytics 4 เพื่อดูว่าหน้าใดมีประโยชน์ คุณสามารถปิดคุกกี้ในเบราว์เซอร์ได้ เว็บไซต์ยังใช้งานได้เต็มรูปแบบ'],
        ['การเก็บรักษาและสิทธิของคุณ', 'ข้อมูลคำขอและคำสั่งซื้อเก็บไม่เกิน 36 เดือนเพื่อวัตถุประสงค์ทางธุรกิจและบัญชี คุณสามารถขอเข้าถึง แก้ไข หรือลบข้อมูลได้ตลอดเวลาทางอีเมล'],
        ['การเปลี่ยนแปลง', 'เราอาจปรับปรุงนโยบายนี้ วันที่ด้านบนคือฉบับปัจจุบัน']
      ]
    },
    terms: {
      t: 'ข้อกำหนดการให้บริการ', up: 'อัปเดตล่าสุด: 2 พฤศจิกายน 2026',
      s: [
        ['ขอบเขต', 'เว็บไซต์นี้แสดงเกรดเม็ดพลาสติกที่เราจำหน่ายและให้คุณขอใบเสนอราคา การใช้งานเว็บไซต์ถือว่าคุณยอมรับข้อกำหนดนี้'],
        ['ข้อมูลผลิตภัณฑ์', 'ค่าต่างๆ ในตารางสมบัติเป็นค่าทั่วไปที่ผู้ผลิตประกาศ เพื่อใช้คัดเลือกวัสดุเท่านั้น ให้ยึด COA ของล็อตที่จัดส่งจริงเป็นหลัก สี ความแตกต่างระหว่างล็อต และเงื่อนไขการขึ้นรูปอาจมีผลต่อผลลัพธ์'],
        ['ใบเสนอราคาและคำสั่งซื้อ', 'ราคา สต็อก และเวลาส่งมอบที่แสดงบนเว็บไซต์หรือทางอีเมลเป็นเพียงข้อมูลเบื้องต้นจนกว่าจะยืนยันเป็นลายลักษณ์อักษร สัญญาซื้อขายจะเกิดเมื่อเราออก proforma invoice หรือสัญญาและคุณตอบรับแล้ว'],
        ['เครื่องหมายการค้า', 'ชื่อแบรนด์และเกรดทั้งหมดเป็นทรัพย์สินของเจ้าของแต่ละราย เราเป็นผู้จัดจำหน่ายอิสระ ใช้ชื่อแบรนด์เพียงเพื่อระบุสินค้า'],
        ['ข้อจำกัดความรับผิด', 'เราไม่รับผิดชอบต่อความเสียหายทางอ้อมที่เกิดจากการใช้เว็บไซต์หรือการขึ้นรูปวัสดุ ความรับผิดของเราจำกัดอยู่ที่มูลค่าตามใบแจ้งหนี้ของสินค้าที่จัดส่ง'],
        ['กฎหมายที่ใช้บังคับ', 'ข้อกำหนดนี้อยู่ภายใต้กฎหมายของสาธารณรัฐประชาชนจีน ข้อพิพาทให้เจรจาโดยไมตรีจิตก่อน'],
        ['ติดต่อ', 'Ningbo Xianxunhe New Materials Co., Ltd. — {EMAIL} — +86 152 6843 6369']
      ]
    }
  },
  id: {
    privacy: {
      t: 'Kebijakan Privasi', up: 'Terakhir diperbarui: 2 November 2026',
      s: [
        ['Siapa kami', 'Ningbo Xianxunhe New Materials Co., Ltd., Ruang 335, Gedung 1, China Plastic City International Business Center, Yuyao, Ningbo, Zhejiang, Tiongkok. Pertanyaan privasi: {EMAIL}.'],
        ['Data yang kami kumpulkan', 'Saat Anda mengirim permintaan penawaran atau menghubungi kami, kami menerima nama, email, telepon, nama perusahaan, kode material dan pesan yang Anda isi. Server juga mencatat IP, jenis peramban dan halaman yang dikunjungi.'],
        ['Cara kami menggunakannya', 'Data hanya dipakai untuk menjawab permintaan, menyusun penawaran, mengatur sampel atau pengiriman, dan layanan purna jual. Kami tidak menjualnya dan tidak memakainya untuk pemasaran yang tidak terkait.'],
        ['Pembagian data', 'Kami tidak pernah menjual atau menyewakan data pribadi. Data hanya dibagikan kepada penyedia layanan yang diperlukan untuk memenuhi pesanan (forwarder, broker bea cukai, bank) atau bila diwajibkan hukum.'],
        ['Cookie dan analitik', 'Kami memakai Google Analytics 4 untuk mengetahui halaman yang berguna. Anda dapat memblokir cookie di peramban; situs tetap berfungsi penuh.'],
        ['Penyimpanan dan hak Anda', 'Catatan permintaan dan pesanan disimpan hingga 36 bulan untuk keperluan komersial dan akuntansi. Anda dapat meminta akses, koreksi atau penghapusan kapan saja melalui email.'],
        ['Perubahan', 'Kebijakan ini dapat diperbarui; tanggal di atas menunjukkan versi berlaku.']
      ]
    },
    terms: {
      t: 'Syarat & Ketentuan', up: 'Terakhir diperbarui: 2 November 2026',
      s: [
        ['Ruang lingkup', 'Situs ini menampilkan grade resin plastik yang kami pasok dan memungkinkan Anda meminta penawaran. Dengan memakai situs ini Anda menyetujui ketentuan berikut.'],
        ['Data produk', 'Nilai pada lembar data adalah nilai tipikal yang diterbitkan produsen asli dan hanya untuk pemilihan material. COA dari lot yang dikirim adalah acuan utama. Warna, variasi antar lot dan kondisi pemrosesan dapat memengaruhi hasil akhir.'],
        ['Penawaran dan pesanan', 'Harga, stok dan waktu pengiriman yang ditampilkan atau dikirim melalui email bersifat indikatif sampai dikonfirmasi tertulis. Kontrak jual beli baru terbentuk setelah kami menerbitkan proforma invoice atau kontrak dan Anda menyetujuinya.'],
        ['Merek dagang', 'Semua nama merek dan grade milik pemiliknya masing-masing. Kami bertindak sebagai distributor independen; nama merek hanya untuk mengidentifikasi barang.'],
        ['Batasan tanggung jawab', 'Kami tidak bertanggung jawab atas kerugian tidak langsung akibat penggunaan situs ini atau pemrosesan material. Tanggung jawab kami dibatasi pada nilai faktur barang yang dipasok.'],
        ['Hukum yang berlaku', 'Ketentuan ini tunduk pada hukum Republik Rakyat Tiongkok. Sengketa diselesaikan terlebih dahulu melalui perundingan musyawarah.'],
        ['Kontak', 'Ningbo Xianxunhe New Materials Co., Ltd. — {EMAIL} — +86 152 6843 6369.']
      ]
    }
  }
};

module.exports = { LEGAL };
