/* NOCTELLE — all editable copy & media paths live here.
   Primary language = Indonesian (id), secondary = English (en). */
window.NOCTELLE_DATA = (function () {
  "use strict";

  var W = "assets/img/work/";

  /* Shared tab template for case pages. Each page may override any field. */
  function tabs(o) {
    return [
      { key: "summary", id: "Ringkasan", en: "Project Summary", icon: "star", type: "summary", body: o.summary },
      { key: "info", id: "Info Proyek", en: "Project Info", icon: "people", type: "info", rows: o.info },
      { key: "focus", id: "Fokus Inti", en: "Core Focus", icon: "star", type: "modules", modules: o.focus },
      { key: "breakdown", id: "Bedah Desain", en: "Design Breakdown", icon: "target", type: "modules", modules: o.breakdown },
      { key: "conclusion", id: "Kesimpulan", en: "Conclusion", icon: "check", type: "text", body: o.conclusion },
      { key: "key", id: "Kalimat Kunci", en: "Key Sentence", icon: "star", type: "text", body: o.key }
    ];
  }

  var projects = [
    /* 0 — featured */
    {
      year: "2021.09–2023.11",
      thumb: "assets/img/thumb/t0.webp",
      title: "Taktik Mahkota", titleEn: "Crownfall Tactics",
      desc: "Gim perang strategi daring.<br>Alur taktik yang lebih jernih.",
      sections: [
        { id: "Desain Produk", en: "Product Design", icon: "box", pages: [
          { visual: W + "p0a.webp",
            header: "01 | Ikhtisar: Sistem Turnamen Strategi\n01 | Project Overview: Strategy Tournament System",
            title: "Dari memahami aturan hingga meninjau ulang laga, satu siklus turnamen yang utuh",
            titleEn: "One complete tournament loop, from reading the rules to replaying the battle",
            subtitle: "Crownfall Tactics Mobile",
            tabs: tabs({
              summary: "Proyek desain sistem inti untuk mode turnamen strategi.\nA core system design project for the strategy tournament mode.\n\nTantangannya bukan sekadar membuat halaman turnamen, tetapi merangkai aturan, pendaftaran, alur pertempuran, peran tim, dan ulasan pasca-laga menjadi satu perjalanan yang mudah dipahami dan bisa dijalankan.\nThe challenge was not only drawing tournament screens, but weaving rules, sign-up, battle flow, team roles and post-match review into one journey players can follow and act on.",
              info: [
                ["Peran", "Role", "Desainer Interaksi Utama", "Lead Interaction Designer"],
                ["Durasi", "Timeline", "Lima bulan, tiga musim rilis", "Five months across three seasons"],
                ["Platform", "Platform", "iOS / Android / PC", "iOS / Android / PC"],
                ["Alat", "Tools", "chips:Figma|Prototype,Protopie|Motion,Miro|Flow map"]
              ],
              focus: [
                ["Aturan yang terbaca", "Pemain baru memahami format turnamen dalam satu layar ringkasan, bukan lima halaman teks.\nNew players grasp the format from one summary screen instead of five pages of text."],
                ["Koordinasi tim", "Penanda jalur, sinyal serangan, dan status rekan dirancang agar terbaca dalam dua detik.\nLane markers, attack pings and ally status read in under two seconds."],
                ["Ulasan laga", "Statistik pasca-laga disusun untuk menjawab satu pertanyaan: apa yang harus diubah besok?\nPost-match stats answer one question: what should change tomorrow?"]
              ],
              breakdown: [
                ["01 · Sebelum laga / Pre-match", "Kalender musim, syarat masuk, dan hadiah ditampilkan sebagai satu kartu yang bisa dibuka bertahap.\nSeason calendar, entry rules and rewards collapse into one progressively disclosed card."],
                ["02 · Selama laga / In-match", "Peta taktis memakai lapisan warna terbatas sehingga informasi kritis selalu menang kontras.\nThe tactical map uses a limited colour layer so critical info always wins contrast."],
                ["03 · Setelah laga / Post-match", "Rekap pertempuran menyorot tiga momen penentu dan menautkannya ke rekaman ulang.\nThe recap highlights three decisive moments and links each to the replay."]
              ],
              conclusion: "Waktu rata-rata memahami aturan turun drastis pada uji pengguna, dan partisipasi turnamen musim berikutnya naik signifikan.\nAverage time-to-understand dropped sharply in usability tests, and tournament participation rose the following season.",
              key: "Strategi yang hebat dimulai dari aturan yang terasa sederhana.\nGreat strategy starts with rules that feel simple."
            }) },
          { visual: W + "p0b.webp",
            header: "02 | Tantangan: Aturan Rumit, Partisipasi Jelas\n02 | Design Challenge: Making Complex Rules Understandable",
            title: "Mengubah aturan turnamen berlapis menjadi jalur partisipasi yang jelas",
            titleEn: "Turning layered tournament rules into a clear path to take part",
            subtitle: "Crownfall Tactics Mobile",
            tabs: tabs({
              summary: "Aturan turnamen punya banyak lapisan: kualifikasi, bracket, jadwal, hadiah, dan sanksi.\nTournament rules stack many layers: qualifiers, brackets, schedule, rewards and penalties.\n\nKami memetakan setiap lapisan ke pertanyaan pemain — \"bisakah saya ikut?\", \"kapan saya main?\", \"apa yang saya dapat?\" — lalu menyusun layar sesuai urutan pertanyaan itu.\nWe mapped each layer to a player question — \"can I join?\", \"when do I play?\", \"what do I win?\" — and ordered the screens by those questions.",
              info: [
                ["Peran", "Role", "Desainer Interaksi Utama", "Lead Interaction Designer"],
                ["Metode", "Method", "Pemetaan pertanyaan pemain", "Player-question mapping"],
                ["Uji", "Testing", "12 sesi moderasi", "12 moderated sessions"],
                ["Alat", "Tools", "chips:Figma|Flows,FigJam|Workshops,Maze|Tests"]
              ],
              focus: [["Pertanyaan dulu, layar kemudian", "Setiap layar menjawab satu pertanyaan, tidak lebih.\nEvery screen answers one question, no more."], ["Bahasa yang konsisten", "Satu istilah untuk satu konsep di seluruh mode.\nOne term per concept across every mode."]],
              breakdown: [["Peta pertanyaan / Question map", "Dua puluh tujuh pertanyaan pemain dikelompokkan menjadi lima tahap.\nTwenty-seven player questions grouped into five stages."], ["Kartu aturan / Rule cards", "Aturan panjang dipecah menjadi kartu yang bisa dibuka satu per satu.\nLong rules split into cards opened one at a time."]],
              conclusion: "Tiket bantuan terkait aturan turun hampir setengahnya setelah rilis.\nRule-related support tickets nearly halved after launch.",
              key: "Kejelasan adalah fitur, bukan dekorasi.\nClarity is a feature, not decoration."
            }) }
        ] },
        { id: "Desain Global", en: "Localization Design", icon: "globe", pages: [
          { visual: W + "p0c.webp",
            header: "03 | Lokalisasi Enam Bahasa\n03 | Six-Language Localization",
            title: "Satu sistem tata letak yang tetap rapi di enam bahasa",
            titleEn: "One layout system that stays tidy in six languages",
            subtitle: "Crownfall Tactics Global",
            tabs: tabs({
              summary: "Teks Jerman tiga kali lebih panjang, teks Thailand lebih tinggi, teks Arab berjalan dari kanan.\nGerman runs three times longer, Thai sits taller, Arabic reads right to left.\n\nKami membuat aturan ruang yang lentur agar satu desain bisa dipakai di semua wilayah tanpa disusun ulang.\nWe built elastic spacing rules so one design ships to every region without a rebuild.",
              info: [["Peran", "Role", "Pemimpin UX Global", "Global UX Lead"], ["Cakupan", "Scope", "6 bahasa, 9 wilayah", "6 languages, 9 regions"], ["Alat", "Tools", "chips:Figma|Variables,Lokalise|Strings"]],
              focus: [["Ruang lentur", "Komponen tumbuh mengikuti teks terpanjang.\nComponents grow with the longest string."], ["Uji pseudo-lokal", "Teks palsu panjang dipakai sejak tahap sketsa.\nLong pseudo-text is used from the sketch stage."]],
              breakdown: [["Token tipografi / Type tokens", "Setiap bahasa memiliki skala tinggi baris sendiri.\nEach language has its own line-height scale."]],
              conclusion: "Nol insiden tata letak besar selama dua tahun operasi global.\nZero major layout incidents over two years of global live-ops.",
              key: "Desain yang baik berbicara dalam semua bahasa.\nGood design speaks every language."
            }) }
        ] },
        { id: "Riset Pengguna", en: "User Research", icon: "people", pages: [
          { visual: W + "p0d.webp",
            header: "04 | Riset Pemain Kompetitif\n04 | Competitive Player Research",
            title: "Mendengar pemain sebelum menggambar layar",
            titleEn: "Listening to players before drawing screens",
            subtitle: "Crownfall Tactics Research",
            tabs: tabs({
              summary: "Wawancara, buku harian bermain, dan analisis rekaman laga membentuk dasar keputusan desain.\nInterviews, play diaries and match-replay analysis grounded every design decision.",
              info: [["Peran", "Role", "Peneliti & Desainer", "Researcher & Designer"], ["Peserta", "Participants", "24 pemain, 3 tingkat", "24 players, 3 tiers"], ["Alat", "Tools", "chips:Dovetail|Synthesis,Notion|Diaries"]],
              focus: [["Pola frustrasi", "Kami mencatat di mana pemain berhenti dan mengapa.\nWe logged where players quit and why."]],
              breakdown: [["Persona taktis / Tactical personas", "Tiga persona: perencana, pengejar, dan penonton.\nThree personas: the planner, the chaser and the spectator."]],
              conclusion: "Temuan riset mengubah urutan prioritas fitur untuk dua musim.\nResearch reshaped feature priorities for two seasons.",
              key: "Data memberi arah, cerita memberi alasan.\nData gives direction, stories give reasons."
            }) }
        ] },
        { id: "Pedoman Produk", en: "Product Guidelines", icon: "doc", pages: [
          { visual: W + "p0e.webp",
            header: "05 | Pedoman Kontrol Interaksi\n05 | Interaction Control Guidelines",
            title: "Pedoman kontrol yang dipakai lintas tim",
            titleEn: "Control guidelines shared across teams",
            subtitle: "Crownfall Tactics Guidelines",
            tabs: tabs({
              summary: "Perpustakaan pola interaksi untuk tombol, panel, dan umpan balik pertempuran.\nAn interaction pattern library for buttons, panels and battle feedback.",
              info: [["Peran", "Role", "Penyusun Pedoman", "Guideline Author"], ["Pengguna", "Used by", "4 tim produk", "4 product teams"], ["Alat", "Tools", "chips:Figma|Library,Zeroheight|Docs"]],
              focus: [["Satu sumber kebenaran", "Satu pustaka untuk desain dan implementasi.\nOne library for design and build."]],
              breakdown: [["Status kontrol / Control states", "Delapan status standar untuk setiap kontrol.\nEight standard states for every control."]],
              conclusion: "Waktu serah terima desain ke pengembang menjadi jauh lebih singkat.\nDesign-to-dev handoff time shrank considerably.",
              key: "Konsistensi adalah bentuk hormat kepada pemain.\nConsistency is a form of respect for players."
            }) }
        ] }
      ]
    },
    /* 1 — featured */
    {
      year: "2020.07–2021.09",
      thumb: "assets/img/thumb/t1.webp",
      title: "Serikat Lumen", titleEn: "Lumen Guild",
      desc: "Aplikasi komunitas pemain.<br>Menghubungkan kreator & acara.",
      pages: [
        { visual: W + "p1a.webp", header: "01 | Ikhtisar Komunitas\n01 | Community Overview", title: "Rumah bersama bagi pemain, kreator, dan acara", titleEn: "A shared home for players, creators and events", subtitle: "Lumen Guild App",
          tabs: tabs({ summary: "Aplikasi pendamping gim yang menyatukan forum, panduan, dan kalender acara.\nA companion app uniting forums, guides and an event calendar.\n\nFokus kami adalah membuat konten kreator mudah ditemukan tanpa menenggelamkan diskusi pemain baru.\nOur focus: make creator content easy to find without drowning out new players.", info: [["Peran", "Role", "Desainer Interaksi Utama", "Lead Interaction Designer"], ["Durasi", "Timeline", "14 bulan", "14 months"], ["Alat", "Tools", "chips:Figma|UI,Principle|Motion"]], focus: [["Penemuan konten", "Umpan beranda berbasis minat, bukan popularitas semata.\nInterest-based feed, not popularity alone."]], breakdown: [["Lingkar komunitas / Circles", "Ruang kecil per gim dengan moderasi ringan.\nSmall per-game spaces with light moderation."]], conclusion: "Pengguna aktif harian lingkar komunitas naik sekitar enam puluh persen.\nDaily active users in circles rose by about sixty percent.", key: "Komunitas tumbuh dari percakapan kecil.\nCommunities grow from small conversations." }) },
        { visual: W + "p1b.webp", header: "02 | Alat Kreator\n02 | Creator Tools", title: "Alat sederhana untuk kreator video dan panduan", titleEn: "Simple tools for video and guide creators", subtitle: "Lumen Guild App",
          tabs: tabs({ summary: "Editor ringan untuk memotong klip, menambah anotasi, dan menerbitkan panduan.\nA light editor to trim clips, annotate and publish guides.", info: [["Peran", "Role", "Desainer Produk", "Product Designer"], ["Alat", "Tools", "chips:Figma|UI,After Effects|Motion"]], focus: [["Tiga langkah terbit", "Rekam, tandai, terbitkan.\nRecord, mark, publish."]], breakdown: [["Garis waktu klip / Clip timeline", "Pemangkasan dengan satu jempol.\nOne-thumb trimming."]], conclusion: "Jumlah panduan baru per minggu meningkat dua kali lipat.\nWeekly new guides doubled.", key: "Permudah kreator, maka komunitas ikut hidup.\nEmpower creators and the community comes alive." }) },
        { visual: W + "p1c.webp", header: "03 | Kalender Acara\n03 | Event Calendar", title: "Acara musiman yang tidak pernah terlewat", titleEn: "Seasonal events nobody misses", subtitle: "Lumen Guild App",
          tabs: tabs({ summary: "Kalender pintar dengan pengingat sesuai zona waktu dan minat.\nA smart calendar with time-zone and interest-aware reminders.", info: [["Peran", "Role", "Desainer Interaksi", "Interaction Designer"]], focus: [["Pengingat tepat waktu", "Notifikasi hanya untuk acara yang relevan.\nNotify only for relevant events."]], breakdown: [["Kartu acara / Event card", "Hitung mundur, hadiah, dan tombol ikut dalam satu kartu.\nCountdown, rewards and join in one card."]], conclusion: "Kehadiran acara naik secara konsisten.\nEvent attendance rose consistently.", key: "Waktu yang tepat adalah separuh desain.\nRight timing is half the design." }) },
        { visual: W + "p1d.webp", header: "04 | Uji & Iterasi\n04 | Testing & Iteration", title: "Tiga putaran tinjauan alur bersama tim lintas fungsi", titleEn: "Three rounds of flow review with cross-functional teams", subtitle: "Lumen Guild App",
          tabs: tabs({ summary: "Tinjauan alur rutin untuk menemukan friksi sebelum rilis.\nRegular flow reviews to find friction before release.", info: [["Peran", "Role", "Fasilitator", "Facilitator"]], focus: [["Tinjauan terjadwal", "Setiap rilis melewati tinjauan alur.\nEvery release passes a flow review."]], breakdown: [["Daftar friksi / Friction log", "Setiap temuan diberi skor dampak.\nEach finding gets an impact score."]], conclusion: "Masalah alur kritis tertangkap jauh lebih awal.\nCritical flow issues were caught much earlier.", key: "Iterasi kecil, dampak besar.\nSmall iterations, big impact." }) }
      ]
    },
    /* 2 — featured */
    {
      year: "2020.01–2020.06",
      thumb: "assets/img/thumb/t2.webp",
      title: "Wilayah Abu", titleEn: "Ashen Dominion",
      desc: "Gim SLG perang fantasi.<br>Interaksi kota & sistem.",
      pages: [
        { visual: W + "p2a.webp", header: "01 | Sistem Kota\n01 | City Building Systems", title: "Membangun kota yang terasa hidup di setiap ketukan", titleEn: "A city that feels alive with every tap", subtitle: "Ashen Dominion",
          tabs: tabs({ summary: "Interaksi inti untuk bangunan, peningkatan, barak, dan tugas harian.\nCore interactions for buildings, upgrades, barracks and daily quests.", info: [["Peran", "Role", "Desainer Interaksi Gim", "Game Interaction Designer"], ["Durasi", "Timeline", "6 bulan", "6 months"], ["Alat", "Tools", "chips:Figma|UI,Unity|Prototype"]], focus: [["Umpan balik jelas", "Setiap aksi punya respon visual dan suara.\nEvery action has visual and audio feedback."]], breakdown: [["Panel bangunan / Building panel", "Info, peningkatan, dan bakat dalam satu panel geser.\nInfo, upgrade and talents in one sliding panel."]], conclusion: "Retensi hari ketujuh membaik pada uji tertutup.\nDay-7 retention improved in closed beta.", key: "Kota yang baik terasa seperti rumah.\nA good city feels like home." }) },
        { visual: W + "p2b.webp", header: "02 | Peta Dunia\n02 | World Map", title: "Peta dunia yang mudah dibaca di layar kecil", titleEn: "A world map that reads well on small screens", subtitle: "Ashen Dominion",
          tabs: tabs({ summary: "Lapisan zoom tiga tingkat dengan detail yang muncul bertahap.\nThree zoom tiers revealing detail progressively.", info: [["Peran", "Role", "Desainer Interaksi Gim", "Game Interaction Designer"]], focus: [["Zoom semantik", "Detail berubah sesuai tingkat zoom.\nDetail changes with zoom level."]], breakdown: [["Ikon wilayah / Territory icons", "Ikon diperbesar sesuai kepentingan.\nIcons scale by importance."]], conclusion: "Navigasi peta menjadi lebih cepat.\nMap navigation became faster.", key: "Peta adalah cerita yang bisa dijelajahi.\nA map is a story you can explore." }) },
        { visual: W + "p2c.webp", header: "03 | Kotak Surat & Hadiah\n03 | Mail & Rewards", title: "Aturan pengambilan item yang tenang dan konsisten", titleEn: "Calm, consistent item collection rules", subtitle: "Ashen Dominion",
          tabs: tabs({ summary: "Standar animasi dan alur ambil hadiah untuk kotak surat, login harian, dan acara.\nAnimation and claim-flow standards for mail, daily login and events.", info: [["Peran", "Role", "Desainer Interaksi", "Interaction Designer"]], focus: [["Satu pola ambil", "Semua hadiah diambil dengan pola yang sama.\nEvery reward uses the same claim pattern."]], breakdown: [["Kurva animasi / Motion curves", "Tiga kurva standar untuk semua hadiah.\nThree standard curves for every reward."]], conclusion: "Pola ini dipakai ulang di dua gim lain.\nThe pattern was reused in two other games.", key: "Hadiah terasa lebih manis bila sederhana.\nRewards feel sweeter when simple." }) }
      ]
    },
    /* 3 — featured (AI concept) */
    {
      year: "2026",
      thumb: "assets/img/thumb/t3.webp",
      title: "Interaksi AI", titleEn: "New UX concept",
      desc: "Paradigma baru interaksi AI.<br>Interaksi yang mengalir.",
      pages: [
        { visual: W + "p3a.webp", header: "01 | Esai Interaksi AI: Dari Satu Jalur ke Banyak Jalur\n01 | AI Interaction Insight: From Single-line Turns to Multi-line Collaboration", title: "Masa depan interaksi AI? Jawaban saya: interaksi yang mengalir", titleEn: "What is the future of AI interaction? My answer: flowing interaction", subtitle: "Esai pribadi, 2026 / Personal essay, 2026",
          tabs: tabs({ summary: "Langkah berikutnya dari interaksi AI bukan sekadar membuat obrolan lebih pintar, tetapi mengubah bentuk kerjanya.\nThe next step for AI interaction isn't smarter chat — it's changing the shape of the work.\n\nManusia dan AI bekerja di beberapa jalur sekaligus: merencanakan, mengeksekusi, meninjau, dan menyimpan ingatan.\nPeople and AI work across several lines at once: planning, executing, reviewing and remembering.", info: [["Format", "Format", "Esai visual", "Visual essay"], ["Tahun", "Year", "2026", "2026"], ["Alat", "Tools", "chips:Figma|Diagram,Claude|Thinking partner"]], focus: [["Jalur paralel", "AI menjalankan tugas di latar belakang sementara manusia tetap memegang arah.\nAI runs tasks in the background while people keep direction."], ["Ingatan bersama", "Konteks tidak hilang di antara sesi.\nContext persists between sessions."]], breakdown: [["Jalur AI / AI line", "Menangkap tujuan, merencanakan, mengeksekusi.\nCapture intent, plan, execute."], ["Jalur manusia / Human line", "Menilai, mengarahkan, memutuskan.\nJudge, steer, decide."]], conclusion: "Interaksi bukan lagi garis lurus, melainkan banyak arus yang bergerak bersama.\nInteraction is no longer a line, but many currents moving together.", key: "Interaksi mengalir: banyak jalur, satu tujuan.\nFlowing interaction: many lines, one goal." }) },
        { visual: W + "p3b.webp", header: "02 | Prototipe Konsep\n02 | Concept Prototype", title: "Prototipe meja kerja bersama manusia dan AI", titleEn: "A shared workbench prototype for people and AI", subtitle: "Esai pribadi, 2026 / Personal essay, 2026",
          tabs: tabs({ summary: "Prototipe yang menampilkan tugas AI sebagai kartu hidup yang bisa dijeda, diarahkan, dan ditinjau.\nA prototype showing AI tasks as live cards you can pause, steer and review.", info: [["Format", "Format", "Prototipe interaktif", "Interactive prototype"]], focus: [["Kontrol yang terlihat", "Setiap tugas AI punya status dan tombol jeda.\nEvery AI task shows status and a pause control."]], breakdown: [["Kartu tugas / Task card", "Rencana, kemajuan, dan hasil dalam satu kartu.\nPlan, progress and output in one card."]], conclusion: "Pengguna uji merasa lebih memegang kendali.\nTesters felt more in control.", key: "Kepercayaan lahir dari transparansi.\nTrust is born from transparency." }) }
      ]
    },
    /* 4 — selected */
    {
      year: "2026",
      thumb: "assets/img/thumb/t4.webp",
      title: "Gim Indie", titleEn: "Indie Game",
      desc: "Eksplorasi gim naratif orisinal.<br>Interaksi ringan & emosional.",
      pages: [
        { visual: W + "p4a.webp", header: "2026 | Lentera Kertas\n2026 | Paper Lantern", title: "Lentera Kertas", titleEn: "Paper Lantern — Narrative Adventure Game", subtitle: "Gim petualangan naratif / Narrative adventure game",
          tabs: tabs({ summary: "Gim petualangan hangat tentang seorang anak yang menyalakan lentera untuk menuntun ingatan yang hilang pulang.\nA warm adventure about a child lighting lanterns to guide lost memories home.\n\nDetail proyek masih dirahasiakan sampai pengumuman resmi.\nProject details stay confidential until the official reveal.", info: [["Peran", "Role", "Konsep, interaksi, arah seni", "Concept, interaction, art direction"], ["Status", "Status", "Dalam pengembangan", "In development"], ["Alat", "Tools", "chips:Godot|Engine,Procreate|Art"]], focus: [["Emosi lewat interaksi", "Setiap mekanik membawa makna cerita.\nEvery mechanic carries story meaning."]], breakdown: [["Lentera / Lanterns", "Cahaya sebagai mekanik dan metafora.\nLight as mechanic and metaphor."]], conclusion: "Prototipe pertama sedang diuji bersama komunitas kecil.\nThe first prototype is being tested with a small community.", key: "Cahaya kecil cukup untuk menemukan jalan pulang.\nA small light is enough to find the way home." }) },
        { visual: W + "p4b.webp", header: "2026 | Lentera Kertas\n2026 | Paper Lantern", title: "Suasana & dunia", titleEn: "Mood & world", subtitle: "Gim petualangan naratif / Narrative adventure game",
          tabs: tabs({ summary: "Papan suasana: gua, cahaya obor, dan kertas yang terbakar pelan.\nMood board: caves, torchlight and slowly burning paper.", info: [["Peran", "Role", "Arah seni", "Art direction"]], focus: [["Palet hangat", "Emas, jingga, dan bayangan lembut.\nGold, amber and soft shadow."]], breakdown: [["Pencahayaan / Lighting", "Cahaya sebagai penunjuk arah.\nLight as wayfinding."]], conclusion: "Gaya visual dikunci untuk demo pertama.\nVisual style locked for the first demo.", key: "Suasana adalah narator yang diam.\nMood is a silent narrator." }) },
        { visual: W + "p4c.webp", header: "2026 | Lentera Kertas\n2026 | Paper Lantern", title: "Simbol & antarmuka", titleEn: "Symbols & interface", subtitle: "Gim petualangan naratif / Narrative adventure game",
          tabs: tabs({ summary: "Antarmuka minimal berbentuk bulu dan kertas yang menyatu dengan dunia.\nA minimal feather-and-paper UI blended into the world.", info: [["Peran", "Role", "Desain UI", "UI design"]], focus: [["UI diegetik", "Antarmuka hidup di dalam dunia.\nInterface lives inside the world."]], breakdown: [["Bulu / Feathers", "Penanda pilihan dialog.\nDialogue choice markers."]], conclusion: "Pemain uji jarang membuka menu jeda.\nPlaytesters rarely opened the pause menu.", key: "Antarmuka terbaik nyaris tak terlihat.\nThe best interface is almost invisible." }) }
      ]
    },
    /* 5 — selected */
    {
      year: "2025",
      thumb: "assets/img/thumb/t5.webp",
      title: "Kolaborasi Studio", titleEn: "Outsourcing Projects",
      desc: "Proyek UI gim untuk klien.<br>Visual & standar serah terima.",
      pages: [
        { visual: W + "p5a.webp", header: "2025 | Kolaborasi Studio\n2025 | Outsourcing Projects", title: "UI gim untuk studio mitra", titleEn: "Game UI for partner studios", subtitle: "Proyek klien / Client work",
          tabs: tabs({ summary: "Paket UI lengkap untuk tiga studio mitra, dari layar utama hingga spesifikasi animasi.\nComplete UI packages for three partner studios, from home screens to motion specs.", info: [["Peran", "Role", "Desainer UI Lepas", "Freelance UI Designer"], ["Klien", "Clients", "3 studio (fiktif)", "3 studios (fictional)"], ["Alat", "Tools", "chips:Figma|UI,Spine|Motion"]], focus: [["Standar serah terima", "Setiap file siap dipakai pengembang.\nEvery file is dev-ready."]], breakdown: [["Pustaka komponen / Component kit", "Satu pustaka per klien.\nOne kit per client."]], conclusion: "Semua proyek rampung tepat waktu.\nAll projects shipped on time.", key: "Kualitas yang konsisten membangun kepercayaan.\nConsistent quality builds trust." }) },
        { visual: W + "p5b.webp", header: "2025 | Kolaborasi Studio\n2025 | Outsourcing Projects", title: "Layar kontrol & HUD", titleEn: "Controls & HUD", subtitle: "Proyek klien / Client work",
          tabs: tabs({ summary: "HUD yang menyesuaikan kontroler dan layar sentuh.\nA HUD adapting to controller and touch input.", info: [["Peran", "Role", "Desainer UI", "UI Designer"]], focus: [["Masukan ganda", "Dukungan kontroler dan sentuh.\nController and touch support."]], breakdown: [["Tata letak HUD / HUD layout", "Zona aman untuk setiap perangkat.\nSafe zones for every device."]], conclusion: "HUD lulus sertifikasi platform.\nHUD passed platform certification.", key: "Satu HUD, banyak tangan.\nOne HUD, many hands." }) },
        { visual: W + "p5c.webp", header: "2025 | Kolaborasi Studio\n2025 | Outsourcing Projects", title: "Layar toko & profil", titleEn: "Store & profile screens", subtitle: "Proyek klien / Client work",
          tabs: tabs({ summary: "Toko dalam gim yang jujur dan mudah dibandingkan.\nAn honest, comparable in-game store.", info: [["Peran", "Role", "Desainer UI", "UI Designer"]], focus: [["Harga transparan", "Nilai paket terlihat jelas.\nBundle value is clear."]], breakdown: [["Kartu produk / Product card", "Harga, isi, dan sisa waktu.\nPrice, contents and time left."]], conclusion: "Keluhan pembelian berkurang.\nPurchase complaints dropped.", key: "Kejujuran juga bisa didesain.\nHonesty can be designed too." }) }
      ]
    },
    /* 6 — selected */
    {
      year: "2025",
      thumb: "assets/img/thumb/t6.webp",
      title: "velvet", titleEn: "Velvet Lens AI Camera",
      desc: "Proyek kamera AI bernuansa mimpi.<br>Filter retro & citra dreamcore.",
      pages: [
        { visual: W + "p6a.webp", header: "2025 | Velvet Lens\n2025 | Velvet Lens", title: "Kamera AI bernuansa mimpi", titleEn: "A dreamy AI camera", subtitle: "Manajer Produk / Product Manager",
          tabs: tabs({ summary: "Aplikasi kamera yang mengubah foto sehari-hari menjadi potret retro bernuansa mimpi.\nA camera app turning everyday photos into dreamy retro portraits.", info: [["Peran", "Role", "Manajer Produk & Desainer", "Product Manager & Designer"], ["Durasi", "Timeline", "4 bulan", "4 months"], ["Alat", "Tools", "chips:Figma|UI,Runway|AI tests"]], focus: [["Satu ketuk, satu suasana", "Filter dipilih berdasarkan suasana, bukan parameter.\nFilters picked by mood, not parameters."]], breakdown: [["Galeri suasana / Mood gallery", "Pratinjau langsung untuk setiap gaya.\nLive preview for every style."]], conclusion: "Versi beta dirilis untuk komunitas kecil.\nBeta released to a small community.", key: "Kenangan layak terlihat seperti mimpi.\nMemories deserve to look like dreams." }) },
        { visual: W + "p6b.webp", header: "2025 | Velvet Lens\n2025 | Velvet Lens", title: "Alur pengambilan gambar", titleEn: "Capture flow", subtitle: "Manajer Produk / Product Manager",
          tabs: tabs({ summary: "Alur tiga langkah: bidik, pilih suasana, bagikan.\nThree steps: frame, pick a mood, share.", info: [["Peran", "Role", "Desainer Interaksi", "Interaction Designer"]], focus: [["Tanpa menunggu", "Pratinjau cepat sebelum hasil akhir.\nFast preview before the final render."]], breakdown: [["Layar bidik / Viewfinder", "Kontrol minimal di zona jempol.\nMinimal controls in the thumb zone."]], conclusion: "Waktu dari buka ke bagikan menjadi sangat singkat.\nOpen-to-share time became very short.", key: "Cepat itu juga indah.\nFast is beautiful too." }) },
        { visual: W + "p6c.webp", header: "2025 | Velvet Lens\n2025 | Velvet Lens", title: "Identitas produk", titleEn: "Product identity", subtitle: "Manajer Produk / Product Manager",
          tabs: tabs({ summary: "Identitas visual lembut dengan sentuhan film lama.\nA soft visual identity with an old-film touch.", info: [["Peran", "Role", "Arah visual", "Visual direction"]], focus: [["Rasa analog", "Butiran, bocoran cahaya, dan warna pudar.\nGrain, light leaks and faded colour."]], breakdown: [["Ikon aplikasi / App icon", "Lensa beludru berbentuk bulan.\nA velvet lens shaped like a moon."]], conclusion: "Identitas siap untuk peluncuran.\nIdentity ready for launch.", key: "Lembut, hangat, sedikit misterius.\nSoft, warm, slightly mysterious." }) }
      ]
    },
    /* 7 — selected */
    {
      year: "2024.02–2024.08",
      thumb: "assets/img/thumb/t7.webp",
      title: "Requiem Besi", titleEn: "Iron Requiem",
      desc: "Proyek aksi naratif bergaya klasik.<br>Sejarah, pedang & petualangan.",
      pages: [
        { visual: W + "p7a.webp", header: "2024 | Requiem Besi\n2024 | Iron Requiem", title: "Aksi naratif berskala besar", titleEn: "Large-scale narrative action", subtitle: "Desainer Interaksi Senior / Senior Interaction Designer",
          tabs: tabs({ summary: "Interaksi dan perencanaan pengalaman untuk gim aksi naratif berskala besar.\nInteraction and experience planning for a large-scale narrative action game.", info: [["Peran", "Role", "Desainer Interaksi Senior", "Senior Interaction Designer"], ["Durasi", "Timeline", "7 bulan", "7 months"], ["Alat", "Tools", "chips:Figma|Flows,Unreal|UMG"]], focus: [["Alur sistem", "Menyusun alur fitur dan mendorong iterasi.\nStructure feature flows and drive iteration."]], breakdown: [["Menu perlengkapan / Gear menu", "Perbandingan senjata dalam satu tampilan.\nWeapon comparison in one view."]], conclusion: "Alur fitur utama lolos tinjauan produksi.\nCore feature flows passed production review.", key: "Cerita besar butuh antarmuka yang tenang.\nBig stories need calm interfaces." }) },
        { visual: W + "p7b.webp", header: "2024 | Requiem Besi\n2024 | Iron Requiem", title: "Sistem jurnal & petunjuk", titleEn: "Journal & hint system", subtitle: "Desainer Interaksi Senior / Senior Interaction Designer",
          tabs: tabs({ summary: "Jurnal yang mencatat petunjuk cerita tanpa membocorkan alur.\nA journal capturing story clues without spoilers.", info: [["Peran", "Role", "Desainer Interaksi", "Interaction Designer"]], focus: [["Petunjuk bertingkat", "Tiga tingkat petunjuk sesuai kebutuhan.\nThree hint tiers on demand."]], breakdown: [["Halaman jurnal / Journal page", "Sketsa, catatan, dan peta.\nSketches, notes and maps."]], conclusion: "Pemain uji jarang tersesat.\nPlaytesters rarely got lost.", key: "Petunjuk yang baik terasa seperti penemuan.\nGood hints feel like discoveries." }) },
        { visual: W + "p7c.webp", header: "2024 | Requiem Besi\n2024 | Iron Requiem", title: "Suasana dunia", titleEn: "World mood", subtitle: "Desainer Interaksi Senior / Senior Interaction Designer",
          tabs: tabs({ summary: "Hutan berkabut dan cahaya redup sebagai acuan suasana antarmuka.\nMisty forests and dim light as the UI mood reference.", info: [["Peran", "Role", "Desainer Interaksi", "Interaction Designer"]], focus: [["Kontras rendah", "UI tidak mengalahkan dunia.\nUI never overpowers the world."]], breakdown: [["Palet / Palette", "Abu, perunggu, dan merah tua.\nAsh, bronze and deep red."]], conclusion: "Arah visual disetujui tim seni.\nVisual direction approved by art team.", key: "Dunia lebih dulu, antarmuka mengikuti.\nWorld first, interface follows." }) }
      ]
    },
    /* 8 — selected */
    {
      year: "2019",
      thumb: "assets/img/thumb/t8.webp",
      title: "Mahkota Hampa", titleEn: "Hollow Crown",
      desc: "Pameran proyek fantasi gelap.<br>Adaptasi sistem untuk ponsel.",
      pages: [
        { visual: W + "p8a.webp", header: "2019 | Mahkota Hampa\n2019 | Hollow Crown", title: "Fantasi gelap di layar ponsel", titleEn: "Dark fantasy on a phone screen", subtitle: "Studi adaptasi seluler / Mobile adaptation study",
          tabs: tabs({ summary: "Studi adaptasi sistem inventaris dan keterampilan dari PC ke ponsel.\nA study adapting inventory and skill systems from PC to mobile.", info: [["Peran", "Role", "Desainer UI/UX", "UI/UX Designer"], ["Alat", "Tools", "chips:Sketch|UI,Photoshop|Art"]], focus: [["Zona jempol", "Aksi penting di jangkauan jempol.\nKey actions within thumb reach."]], breakdown: [["Roda keterampilan / Skill wheel", "Enam keterampilan dalam satu roda.\nSix skills in one wheel."]], conclusion: "Studi menjadi acuan untuk proyek berikutnya.\nThe study became a reference for later projects.", key: "Kegelapan pun butuh keterbacaan.\nEven darkness needs legibility." }) },
        { visual: W + "p8b.webp", header: "2019 | Mahkota Hampa\n2019 | Hollow Crown", title: "Cahaya di ruang bawah tanah", titleEn: "Light in the dungeon", subtitle: "Studi adaptasi seluler / Mobile adaptation study",
          tabs: tabs({ summary: "Sistem cahaya sebagai penunjuk bahaya dan harta.\nLight as a signal for danger and treasure.", info: [["Peran", "Role", "Desainer UI/UX", "UI/UX Designer"]], focus: [["Bahasa cahaya", "Biru untuk aman, merah untuk bahaya.\nBlue for safe, red for danger."]], breakdown: [["Peta mini / Minimap", "Ikon menyala saat didekati.\nIcons glow when approached."]], conclusion: "Navigasi ruang bawah tanah lebih intuitif.\nDungeon navigation became more intuitive.", key: "Ikuti cahaya.\nFollow the light." }) },
        { visual: W + "p8c.webp", header: "2019 | Mahkota Hampa\n2019 | Hollow Crown", title: "Arsip & pengetahuan", titleEn: "Archive & lore", subtitle: "Studi adaptasi seluler / Mobile adaptation study",
          tabs: tabs({ summary: "Perpustakaan pengetahuan dunia yang bisa dijelajahi.\nAn explorable library of world lore.", info: [["Peran", "Role", "Desainer UI/UX", "UI/UX Designer"]], focus: [["Bacaan ringan", "Potongan cerita pendek.\nShort lore snippets."]], breakdown: [["Rak buku / Bookshelf", "Koleksi yang terisi saat bermain.\nA collection filled through play."]], conclusion: "Pemain menghabiskan lebih banyak waktu membaca.\nPlayers spent more time reading lore.", key: "Setiap buku adalah pintu.\nEvery book is a door." }) }
      ]
    }
  ];

  var featured = [0, 1, 2, 3];
  var selected = [4, 5, 6, 7, 8];

  var others = {
    "design-system": ["ds1", "ds2", "ds3", "ds4"],
    graphic: ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8"],
    photography: ["ph1", "ph2", "ph3", "ph4", "ph5", "ph6", "ph7", "ph8", "ph9", "ph10", "ph11"]
  };

  return { projects: projects, featured: featured, selected: selected, others: others };
})();
