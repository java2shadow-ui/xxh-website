// Home v2 copy — part A: en, zh, ru (ported from approved AI Studio design)
module.exports = {
  en: {
    nav: { catalog: 'Resin Grades', applications: 'Applications', supplyChain: 'Supply Chain', partners: 'Partner Brands', contact: 'Contact', rfq: 'Request Quote' },
    hero: {
      kicker: 'China Plastic City · Yuyao HQ Direct Supply',
      title: 'Global Polymer & Engineering Plastic Supply Chain Partner',
      subtitle: 'Specialized distribution of ABS, PC, PMMA, PA66, POM and other engineering plastics from world-class producers — spot stock, original COA traceability, grade selection support and one-stop global export.',
      searchPh: 'Enter a grade (e.g. PA-757, K8003, 5000S) or resin / application…',
      searchBtn: 'Search',
      statGrades: 'resin grades online',
      statStock: 'spot specifications',
      statBrands: 'producer brands',
      statCoa: 'original COA',
      browse: 'Browse All Grades',
      quote: 'Quick RFQ',
      imgTag: 'VIRGIN POLYMER PELLETS',
      imgBrands: 'CHIMEI · LOTTE · MITSUBISHI · BASF · FORMOSA'
    },
    catalog: {
      kicker: 'ONLINE SPECIFICATIONS & INVENTORY',
      title: 'Engineering Plastic & Polymer Grade Library',
      subtitle: 'Precise physical & mechanical properties, processing guidance and original TDS lookup — every grade links to a full datasheet page.',
      viewAll: 'View all grades →',
      spot: 'Spot Stock',
      mfi: 'MFI', density: 'Density', apps: 'Apps', inquire: 'Quote', tds: 'TDS'
    },
    apps: {
      kicker: 'INDUSTRY SOLUTIONS & END MARKETS',
      title: 'Application Engineering Solutions',
      subtitle: 'From automotive under-hood components to optical lenses — we match the right resin to your end market.',
      automotive: { t: 'Automotive & Mobility', d: 'Heat-resistant, glass-filled and electroplatable resins for interior, exterior and under-hood automotive components.', res: 'PA66-GF30 · PC/ABS · Heat-resistant ABS · POM', browse: 'Browse grades' },
      electronics: { t: '3C Optics & Housings', d: 'Optical-grade PMMA and PC with high transparency and low birefringence for lenses, light guides and device housings.', res: 'PMMA · Optical PC · High-flow ABS', browse: 'Browse grades' },
      appliances: {
        t: 'Smart Home Appliances',
        d: 'High-gloss, paint-free and flame-retardant materials for appliance panels and safety components.',
        items: [
          'High-gloss paint-free molding: CHIMEI PA-757',
          'Transparent water tanks & windows: CHIMEI PA-758',
          'Flame-retardant electrical parts: UL94 V-0 grades'
        ],
        res: 'CHIMEI · FORMOSA · LOTTE', browse: 'Filter ABS'
      },
      industrial: {
        t: 'Industrial & Medical',
        d: 'Wear-resistant, sterilizable and ultra-high-temperature polymers for precision industry and medical devices.',
        items: [
          'Wear-resistant gears: Mitsubishi POM F20-03',
          'Autoclavable medical tools: Solvay PPSU',
          'Aerospace & semiconductor: Victrex PEEK-450G (260°C)'
        ],
        res: 'VICTREX · SOLVAY · MITSUBISHI · DOW', browse: 'Specialty polymers'
      }
    },
    supply: {
      kicker: 'STRATEGIC LOGISTICS & WAREHOUSING',
      title: 'Warehousing & Supply Chain Delivery',
      subtitle: 'Spot inventory at China Plastic City with direct access to Ningbo-Zhoushan Port — for both export and domestic manufacturing.',
      whTitle: 'Spot Ready Dispatch · Serving Global Ports',
      whText: 'Headquartered at China Plastic City (Yuyao), Xianxunhe operates fully digitized warehousing with thousands of tons of high-demand engineering resins in stock. We support FCL and LCL shipments, right next to Ningbo-Zhoushan and Shanghai ports.',
      whCaption: 'Yuyao Polymer Intelligence Warehouse',
      whSub: 'China Plastic City Central Logistics Hub · 25kg Standard Pallets',
      area: 'Storage Area', dispatch: 'Spot Dispatch',
      cta: 'Schedule Inspection / Order',
      calcEntry: 'Container Loading Calculator', calcEntryDesc: 'Estimate 20GP/40HQ containers for your order',
      pillars: [
        { t: 'Original & Traceable', d: '100% original manufacturer bags with batch COA, TDS and MSDS on every shipment.' },
        { t: 'Quality Insured', d: 'SGS / third-party pre-shipment inspection accepted; full traceability from producer to container.' },
        { t: 'Fast Logistics', d: '1–2 days dispatch for stock grades; FOB Ningbo, CIF and DAP terms to Southeast Asia and beyond.' },
        { t: 'Technical Support', d: 'Grade selection, substitution advice and processing guidance from our materials engineers.' }
      ],
      assured: 'Quality & delivery standard',
      trade: {
        title: 'Trade Terms',
        moq: 'MOQ 1 MT per grade · mixed container OK',
        pay: 'T/T 30% deposit · L/C at sight for bulk',
        lead: 'Stock: 1–2 days · futures: 2–4 weeks',
        sample: 'Free samples 0.5–2 kg, freight collect'
      }
    },
    partners: { kicker: 'PRIMARY PARTNER CHEMICAL PRODUCERS' },
    contact: {
      kicker: 'HEADQUARTERS & COMMERCIAL CONTACT',
      title: 'Contact Xianxunhe',
      subtitle: 'Quotation within 30 minutes on business days — spot ex-works or CFR/CIF to your port.',
      aboutTitle: 'About Ningbo Xianxunhe',
      aboutP1: 'Ningbo Xianxunhe New Materials Co., Ltd. is a polymer distribution enterprise headquartered in China Plastic City, Yuyao — the largest plastic raw material trading hub in China.',
      aboutP2: 'We maintain deep supply relationships with leading producers including CHIMEI, Formosa, LG Chem, Mitsubishi, BASF, Covestro and SABIC, covering ABS, PC, PMMA, PA, POM and specialty compounds.',
      aboutP3: 'Serving buyers across Southeast Asia, Russia and beyond with English / Chinese trade teams, full documentation and reliable delivery.',
      hqLabel: 'Headquarters', hqValue: 'China Plastic City, Yuyao, Ningbo, Zhejiang',
      mailLabel: 'Email', phoneLabel: 'WhatsApp / Phone', siteLabel: 'Website',
      hoursLabel: 'Business Hours', hoursValue: 'Mon–Sat 8:30–18:00 (GMT+8)',
      visitNote: 'Note: adjacent to Yuyao North Railway Station and the Hangzhou–Ningbo expressway exit. On-site material inspection welcome by appointment.',
      locLabel: 'HQ', locValue: 'Yuyao, Ningbo',
      domLabel: 'Domain Mail', netLabel: 'Distribution', netValue: 'Global & Domestic'
    },
    footer: {
      desc: 'Premier distributor of engineering plastics and polymer compounds at China Plastic City, Yuyao, Ningbo.',
      featured: 'Featured Resins',
      quickTitle: 'Commercial Inquiries',
      quickDesc: 'Rapid quotation within 30 minutes on business days — spot ex-works or CFR/CIF to your port.',
      rights: '© 2026 Ningbo Xianxunhe New Materials Co., Ltd. All rights reserved.',
      disclaimer: 'Datasheet values on this site are typical values from manufacturer documentation, for reference only; the COA of the shipped lot prevails.'
    },
    rfq: {
      title: 'Quick RFQ & Sample Request',
      sub: 'Tell us the grades and quantity — quotation within 30 minutes on business days.',
      name: 'Your name *', email: 'Email',
      phone: 'Phone / WhatsApp', company: 'Company', prod: 'Grade / product',
      prodPh: 'Type a grade & press Enter — add several',
msg: 'Quantity & destination port *',
      msgPh: 'e.g. PA-757 × 26MT, FOB Ningbo → Ho Chi Minh…',
      send: 'Send Inquiry', sending: 'Sending…', ok: 'Received! We will reply within 30 minutes on business days.', close: 'Close'
    }
  },
  zh: {
    nav: { catalog: '材料牌号库', applications: '应用方案', supplyChain: '仓储与供应链', partners: '原厂合作品牌', contact: '联系我们', rfq: '快速获取报价' },
    hero: {
      kicker: '中国塑料城 · 余姚总部直供',
      title: '全球优质高分子材料与工程塑料供应链整合服务商',
      subtitle: '专注 ABS、PC、PMMA、PA66、POM 等国际知名原厂工程塑料分销，现货直发、原厂质保 COA 溯源、提供选型改性与全球出口一站式服务。',
      searchPh: '输入牌号 (如 PA-757, K8003, 5000S) 或材质/用途搜索…',
      searchBtn: '搜索牌号',
      statGrades: '在线牌号规格',
      statStock: '现货规格',
      statBrands: '原厂品牌',
      statCoa: '原厂正品 COA',
      browse: '浏览所有牌号',
      quote: '在线快速询价',
      imgTag: '原生高分子工程塑料',
      imgBrands: 'CHIMEI · LOTTE · MITSUBISHI · BASF · FORMOSA'
    },
    catalog: {
      kicker: '现货与订货规格数据库',
      title: '工程塑料与高分子材料牌号库',
      subtitle: '提供精确物理机械性能参数、加工成型指引与原厂物性表 (TDS) 在线查阅，每个牌号都有独立详情页。',
      viewAll: '查看全部牌号 →',
      spot: '现货在库',
      mfi: '熔指 MFI', density: '密度', apps: '应用', inquire: '询价', tds: '物性表'
    },
    apps: {
      kicker: '高分子材料工程解决方案',
      title: '行业应用解决方案',
      subtitle: '从汽车发动机舱部件到光学透镜——为您的终端市场匹配最合适的树脂牌号。',
      automotive: { t: '汽车与出行', d: '耐热、玻纤增强与可电镀树脂，用于汽车内饰、外饰与发动机舱部件。', res: 'PA66-GF30 · PC/ABS · 耐热 ABS · POM', browse: '查看相关牌号' },
      electronics: { t: '3C 光学与外壳', d: '高透光、低双折射的光学级 PMMA 与 PC，用于透镜、导光件与设备外壳。', res: 'PMMA · 光学 PC · 高流动 ABS', browse: '查看相关牌号' },
      appliances: {
        t: '智能家电',
        d: '高光免喷涂与阻燃材料，用于家电面板与安全电气部件。',
        items: [
          '高光免喷涂注塑：奇美 PA-757',
          '透明水箱/视窗：奇美 PA-758',
          '安全电气阻燃件：UL94 V-0 级'
        ],
        res: 'CHIMEI · FORMOSA · LOTTE', browse: '筛选家电级 ABS'
      },
      industrial: {
        t: '精密工业与医疗',
        d: '耐磨、可蒸汽灭菌与超耐高温聚合物，用于精密工业与医疗器械。',
        items: [
          '高耐磨传动齿轮：三菱 POM F20-03',
          '医疗灭菌手术工具：索尔维 PPSU',
          '航空及半导体治具：威格斯 PEEK-450G (260°C)'
        ],
        res: 'VICTREX · SOLVAY · MITSUBISHI · DOW', browse: '特种高分子牌号'
      }
    },
    supply: {
      kicker: '仓储与供应链交付体系',
      title: '仓储与供应链交付',
      subtitle: '立足中国塑料城的现货库存，毗邻宁波舟山港——外贸出口与国内制造同步保障。',
      whTitle: '现货即发 · 辐射长三角及全球口岸',
      whText: '作为立足中国塑料城（余姚）的核心分销企业，纤讯和建立了全流程信息化仓储管理体系。常备数千吨工程塑料标准料现货，支持整柜出运、零担混装，并依托毗邻宁波舟山港与上海港的地理优势，为外贸出口及内销制造企业提供准时交付。',
      whCaption: '余姚高分子原料智能仓储中心',
      whSub: '中国塑料城中央物流枢纽 · 25kg 标准托盘',
      area: '仓储占地面积', dispatch: '现货极速出库',
      cta: '预约仓库现货看样 / 订货',
      calcEntry: '装柜计算器', calcEntryDesc: '估算你的订单需要几个柜',
      pillars: [
        { t: '原厂可溯源', d: '100% 原厂原包，随货附批次 COA、TDS 与 MSDS 全套文件。' },
        { t: '品质有保障', d: '接受 SGS / 第三方装船前检验，从生产商到货柜全程可追溯。' },
        { t: '物流快交付', d: '现货牌号 1–2 天发货；FOB 宁波、CIF、DAP 条款直达东南亚及全球。' },
        { t: '技术支持', d: '材料工程师提供牌号选型、替代方案与加工工艺指导。' }
      ],
      assured: '质保与交付标准',
      trade: {
        title: '贸易条款',
        moq: '起订 1 吨/牌号 · 支持拼柜',
        pay: 'T/T 30% 定金 · 大额可开 L/C',
        lead: '现货 1–2 天 · 期货 2–4 周',
        sample: '免费样品 0.5–2kg 运费到付'
      }
    },
    partners: { kicker: '合作品牌与原厂供应网络' },
    contact: {
      kicker: '商务联络与总部位置',
      title: '联系纤讯和',
      subtitle: '工作日 30 分钟内快速出具当日现货出厂价或 CFR/CIF 港口到岸价报价单。',
      aboutTitle: '关于宁波纤讯和',
      aboutP1: '宁波纤讯和新材料有限公司是立足中国塑料城（余姚）的高分子原料分销企业——中国最大的塑料原料集散地。',
      aboutP2: '与奇美、台化、LG 化学、三菱、巴斯夫、科思创、沙伯等原厂保持深度供应关系，覆盖 ABS、PC、PMMA、PA、POM 及特种改性材料。',
      aboutP3: '以中英文外贸团队服务东南亚、俄罗斯及全球买家，单证齐全、交付可靠。',
      hqLabel: '公司总部', hqValue: '浙江省余姚市中国塑料城',
      mailLabel: '邮箱', phoneLabel: 'WhatsApp / 电话', siteLabel: '官网',
      hoursLabel: '营业时间', hoursValue: '周一至周六 8:30–18:00 (GMT+8)',
      visitNote: '注：中塑国际商务中心紧邻余姚高铁北站与杭甬高速出口，欢迎预约现场看货及洽谈合作。',
      locLabel: '企业总部', locValue: '浙江余姚 · 塑料城',
      domLabel: '企业统一邮箱', netLabel: '服务网络', netValue: '全球出口 / 国内'
    },
    footer: {
      desc: '立足浙江余姚中国塑料城，专注于工程塑料、特种高分子原料与改性复合物的国际分销与现货供应。',
      featured: '核心材料牌号',
      quickTitle: '快捷商务通道',
      quickDesc: '工作日 30 分钟内快速出具当日现货出厂价或 CFR/CIF 港口到岸价报价单。',
      rights: '© 2026 宁波纤讯和新材料有限公司 版权所有',
      disclaimer: '本站物性数据为原厂数据表典型值，仅供参考；以实际发货批次 COA 为准。'
    },
    rfq: {
      title: '快速询价与样品申请',
      sub: '告诉我们牌号与数量——工作日 30 分钟内出具报价。',
      name: '您的姓名 *', email: '邮箱',
      phone: '电话 / WhatsApp', company: '公司名称', prod: '牌号 / 产品',
      prodPh: '输入牌号后回车，可添加多个',
msg: '数量与目的港 *',
      msgPh: '例如：PA-757 × 26吨，FOB 宁波 → 胡志明…',
      send: '提交询盘', sending: '提交中…', ok: '已收到！工作日 30 分钟内回复您。', close: '关闭'
    }
  },
  ru: {
    nav: { catalog: 'Марки материалов', applications: 'Применения', supplyChain: 'Логистика', partners: 'Бренды-партнёры', contact: 'Контакты', rfq: 'Запросить цену' },
    hero: {
      kicker: 'China Plastic City · Прямые поставки с базы в Юйяо',
      title: 'Международный поставщик полимеров и инженерных пластиков',
      subtitle: 'Дистрибуция ABS, PC, PMMA, PA66, POM и других инженерных пластиков от мировых производителей — складские остатки, оригинальные COA, подбор марок и экспорт под ключ.',
      searchPh: 'Введите марку (PA-757, K8003, 5000S) или тип полимера…',
      searchBtn: 'Поиск',
      statGrades: 'марок онлайн',
      statStock: 'складских позиций',
      statBrands: 'брендов-производителей',
      statCoa: 'оригинальные COA',
      browse: 'Все марки',
      quote: 'Быстрый запрос',
      imgTag: 'ПЕРВИЧНЫЕ ПОЛИМЕРНЫЕ ГРАНУЛЫ',
      imgBrands: 'CHIMEI · LOTTE · MITSUBISHI · BASF · FORMOSA'
    },
    catalog: {
      kicker: 'БАЗА ХАРАКТЕРИСТИК И СКЛАДА',
      title: 'Библиотека марок инженерных пластиков',
      subtitle: 'Точные физико-механические свойства, рекомендации по переработке и оригинальные TDS — у каждой марки своя страница.',
      viewAll: 'Все марки →',
      spot: 'В наличии',
      mfi: 'ПТР (MFI)', density: 'Плотность', apps: 'Применение', inquire: 'Цена', tds: 'TDS'
    },
    apps: {
      kicker: 'ОТРАСЛЕВЫЕ РЕШЕНИЯ',
      title: 'Отраслевые решения',
      subtitle: 'От деталей под капотом автомобиля до оптических линз — подберём марку под ваш рынок.',
      automotive: { t: 'Автомобилестроение', d: 'Термо- и стеклонаполненные, гальванируемые смолы для интерьера, экстерьера и подкапотных деталей.', res: 'PA66-GF30 · PC/ABS · термо-ABS · POM', browse: 'Смотреть марки' },
      electronics: { t: 'Оптика и корпуса 3C', d: 'Оптические PMMA и PC с высокой прозрачностью и низким двулучепреломлением для линз и корпусов.', res: 'PMMA · оптический PC · высокотекучий ABS', browse: 'Смотреть марки' },
      appliances: {
        t: 'Бытовая техника',
        d: 'Высокоглянцевые безокрасочные и огнестойкие материалы для панелей и электрических узлов.',
        items: [
          'Высокий глянец без покраски: CHIMEI PA-757',
          'Прозрачные баки и окна: CHIMEI PA-758',
          'Огнестойкие детали UL94 V-0'
        ],
        res: 'CHIMEI · FORMOSA · LOTTE', browse: 'Фильтр ABS'
      },
      industrial: {
        t: 'Промышленность и медицина',
        d: 'Износостойкие, стерилизуемые и сверхтермостойкие полимеры для точной промышленности и медицины.',
        items: [
          'Износостойкие шестерни: Mitsubishi POM F20-03',
          'Стерилизуемые мединструменты: Solvay PPSU',
          'Авиация и полупроводники: Victrex PEEK-450G (260°C)'
        ],
        res: 'VICTREX · SOLVAY · MITSUBISHI · DOW', browse: 'Специальные полимеры'
      }
    },
    supply: {
      kicker: 'ЛОГИСТИКА И СКЛАДЫ',
      title: 'Склады и цепочка поставок',
      subtitle: 'Складские запасы в China Plastic City рядом с портом Нинбо—Чжоушань — экспорт и внутренние поставки.',
      whTitle: 'Отгрузка со склада · Порты всего мира',
      whText: 'Штаб-квартира в China Plastic City (Юйяо). Современные склады с тысячами тонн ходовых марок, полная контейнерная и сборная отгрузка, рядом порты Нинбо—Чжоушань и Шанхай.',
      whCaption: 'Интеллектуальный склад полимеров в Юйяо',
      whSub: 'Логистический хаб China Plastic City · поддоны 25 кг',
      area: 'Площадь склада', dispatch: 'Отгрузка со склада',
      cta: 'Записаться на осмотр / заказ',
      calcEntry: 'Калькулятор загрузки контейнера', calcEntryDesc: 'Оцените нужное число контейнеров 20GP/40HQ',
      pillars: [
        { t: 'Оригинал и прослеживаемость', d: '100% оригинальная заводская упаковка, COA, TDS и MSDS к каждой отгрузке.' },
        { t: 'Контроль качества', d: 'Допускаем инспекцию SGS / третьей стороны перед отгрузкой; полная прослеживаемость.' },
        { t: 'Быстрая логистика', d: 'Складские марки — 1–2 дня; условия FOB Нинбо, CIF и DAP в Юго-Восточную Азию и далее.' },
        { t: 'Техподдержка', d: 'Инженеры помогут с подбором марок, заменой и режимами переработки.' }
      ],
      assured: 'Стандарт качества и доставки',
      trade: {
        title: 'Условия сделки',
        moq: 'MOQ 1 т/марку · сборные контейнеры',
        pay: 'T/T 30% депозит · L/C по предъявлении',
        lead: 'Склад 1–2 дня · заказ 2–4 недели',
        sample: 'Бесплатные образцы 0,5–2 кг'
      }
    },
    partners: { kicker: 'ОСНОВНЫЕ БРЕНДЫ-ПАРТНЁРЫ' },
    contact: {
      kicker: 'ШТАБ-КВАРТИРА И КОНТАКТЫ',
      title: 'Связаться с Xianxunhe',
      subtitle: 'Коммерческое предложение в течение 30 минут в рабочие дни — со склада или CFR/CIF до вашего порта.',
      aboutTitle: 'О Ningbo Xianxunhe',
      aboutP1: 'Ningbo Xianxunhe New Materials — дистрибьютор полимерного сырья со штаб-квартирой в China Plastic City (Юйяо), крупнейшем торговом хабе Китая.',
      aboutP2: 'Глубокие отношения с CHIMEI, Formosa, LG Chem, Mitsubishi, BASF, Covestro и SABIC: ABS, PC, PMMA, PA, POM и специальные компаунды.',
      aboutP3: 'Обслуживаем покупателей в Юго-Восточной Азии, России и других регионах на английском и китайском языках.',
      hqLabel: 'Штаб-квартира', hqValue: 'China Plastic City, Юйяо, Нинбо, Чжэцзян',
      mailLabel: 'Email', phoneLabel: 'WhatsApp / Телефон', siteLabel: 'Сайт',
      hoursLabel: 'Часы работы', hoursValue: 'Пн–Сб 8:30–18:00 (GMT+8)',
      visitNote: 'Рядом с ж/д станцией Юйяо-Север и съездом с трассы Ханчжоу—Нинбо. Осмотр товара на складе по записи.',
      locLabel: 'Локация', locValue: 'Юйяо, Нинбо',
      domLabel: 'Корп. почта', netLabel: 'Дистрибуция', netValue: 'Экспорт и Китай'
    },
    footer: {
      desc: 'Ведущий дистрибьютор инженерных пластиков и полимерных компаундов в China Plastic City, Юйяо, Нинбо.',
      featured: 'Основные марки',
      quickTitle: 'Коммерческие запросы',
      quickDesc: 'Быстрое КП в течение 30 минут в рабочие дни — со склада или CFR/CIF до вашего порта.',
      rights: '© 2026 Ningbo Xianxunhe New Materials Co., Ltd. Все права защищены.',
      disclaimer: 'Значения TDS на сайте — типовые величины из документации производителей; приоритет имеет COA отгружаемой партии.'
    },
    rfq: {
      title: 'Быстрый запрос цены',
      sub: 'Укажите марки и количество — ответим в течение 30 минут в рабочие дни.',
      name: 'Ваше имя *', email: 'Email',
      phone: 'Телефон / WhatsApp', company: 'Компания', prod: 'Марка / продукт',
      prodPh: 'Введите марку и нажмите Enter — можно несколько',
msg: 'Количество и порт назначения *',
      msgPh: 'например: PA-757 × 26т, FOB Нинбо → Хошимин…',
      send: 'Отправить запрос', sending: 'Отправка…', ok: 'Получили! Ответим в течение 30 минут в рабочие дни.', close: 'Закрыть'
    }
  }
};
