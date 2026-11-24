let tracks = [];
let favorites = new Set(JSON.parse(localStorage.getItem("music-favorites") || "[]"));
let currentIndex = -1;
let sortAsc = true;
let sleepTimer;
let repeatMode = localStorage.getItem("music-repeat") || "off";
let sleepAtEnd = false;

const $ = selector => document.querySelector(selector);
const audio = $("#audio");

const translations = {
  en:{yourLibrary:"Your Library",music:"Music",refresh:"Refresh",songs:"songs",favorites:"Favorites",
    searchSongs:"Search songs",allSongs:"All Songs",sort:"Sort",emptyTitle:"No songs found",
    emptyText:"Audio on this device will appear here",chooseSongs:"Refresh Library",likedSongs:"Liked Songs",
    settings:"Settings",accentColor:"Accent Color",appLanguage:"App Language",speed:"Playback Speed",
    sleepTimer:"Sleep Timer",off:"Off",nowPlaying:"Now Playing",library:"Library",volume:"Volume",
    repeat:"Repeat",repeatOne:"Repeat This Song",repeatAll:"Repeat All",custom:"Custom",
    endOfSong:"End of Song",sortTitle:"Title",sortTime:"Date",sortSize:"Size",theme:"Theme",dark:"Dark",light:"Light"},
  ar:{yourLibrary:"مكتبتك",music:"الموسيقى",refresh:"تحديث",songs:"أغنية",favorites:"المفضلة",
    searchSongs:"ابحث في الأغاني",allSongs:"كل الأغاني",sort:"ترتيب",emptyTitle:"لا توجد أغاني",
    emptyText:"ستظهر الأغاني الصوتية على هذا الجهاز هنا",chooseSongs:"تحديث المكتبة",likedSongs:"الأغاني المفضلة",
    settings:"الإعدادات",accentColor:"اللون الأساسي",appLanguage:"لغة التطبيق",speed:"سرعة التشغيل",
    sleepTimer:"توقيت النوم",off:"متوقف",nowPlaying:"يشغل الآن",library:"المكتبة",volume:"الصوت",
    repeat:"إعادة الأغنية",repeatOne:"إعادة هذه الأغنية",repeatAll:"إعادة الكل",custom:"وقت يدوي",
    endOfSong:"بعد نهاية الأغنية",sortTitle:"الاسم",sortTime:"الوقت",sortSize:"الحجم",theme:"الوضع",dark:"داكن",light:"فاتح"},
  zh:{yourLibrary:"你的音乐库",music:"音乐",refresh:"刷新",songs:"首歌曲",favorites:"收藏",
    searchSongs:"搜索歌曲",allSongs:"全部歌曲",sort:"排序",emptyTitle:"未找到歌曲",
    emptyText:"此设备上的音频将显示在这里",chooseSongs:"刷新音乐库",likedSongs:"喜欢的歌曲",
    settings:"设置",accentColor:"强调色",appLanguage:"应用语言",speed:"播放速度",
    sleepTimer:"睡眠定时器",off:"关闭",nowPlaying:"正在播放",library:"音乐库"},
  fr:{yourLibrary:"Votre bibliothèque",music:"Musique",refresh:"Actualiser",songs:"titres",favorites:"Favoris",
    searchSongs:"Rechercher des titres",allSongs:"Tous les titres",sort:"Trier",emptyTitle:"Aucun titre trouvé",
    emptyText:"Les fichiers audio de cet appareil apparaîtront ici",chooseSongs:"Actualiser",likedSongs:"Titres aimés",
    settings:"Paramètres",accentColor:"Couleur",appLanguage:"Langue",speed:"Vitesse de lecture",
    sleepTimer:"Minuteur de sommeil",off:"Désactivé",nowPlaying:"Lecture en cours",library:"Bibliothèque"},
  ja:{yourLibrary:"ライブラリ",music:"ミュージック",refresh:"更新",songs:"曲",favorites:"お気に入り",
    searchSongs:"曲を検索",allSongs:"すべての曲",sort:"並べ替え",emptyTitle:"曲が見つかりません",
    emptyText:"この端末の音声ファイルがここに表示されます",chooseSongs:"ライブラリを更新",likedSongs:"お気に入りの曲",
    settings:"設定",accentColor:"アクセントカラー",appLanguage:"アプリの言語",speed:"再生速度",
    sleepTimer:"スリープタイマー",off:"オフ",nowPlaying:"再生中",library:"ライブラリ"},
  ko:{yourLibrary:"내 라이브러리",music:"음악",refresh:"새로고침",songs:"곡",favorites:"즐겨찾기",
    searchSongs:"노래 검색",allSongs:"모든 노래",sort:"정렬",emptyTitle:"노래를 찾을 수 없음",
    emptyText:"이 기기의 오디오 파일이 여기에 표시됩니다",chooseSongs:"라이브러리 새로고침",likedSongs:"좋아하는 노래",
    settings:"설정",accentColor:"강조 색상",appLanguage:"앱 언어",speed:"재생 속도",
    sleepTimer:"취침 타이머",off:"끄기",nowPlaying:"재생 중",library:"라이브러리"},
  es:{yourLibrary:"Tu biblioteca",music:"Música",songs:"canciones",favorites:"Favoritos",
    searchSongs:"Buscar canciones",allSongs:"Todas las canciones",sort:"Ordenar",emptyTitle:"No se encontraron canciones",
    emptyText:"Los audios de este dispositivo aparecerán aquí",likedSongs:"Canciones favoritas",
    settings:"Ajustes",accentColor:"Color de acento",appLanguage:"Idioma",speed:"Velocidad",
    sleepTimer:"Temporizador",off:"Desactivado",nowPlaying:"Reproduciendo",library:"Biblioteca",
    volume:"Volumen",repeat:"Repetir",repeatOne:"Repetir canción",repeatAll:"Repetir todo",
    custom:"Personalizado",endOfSong:"Al terminar",sortTitle:"Título",sortTime:"Fecha",sortSize:"Tamaño",
    theme:"Tema",dark:"Oscuro",light:"Claro"},
  de:{yourLibrary:"Deine Bibliothek",music:"Musik",songs:"Titel",favorites:"Favoriten",
    searchSongs:"Titel suchen",allSongs:"Alle Titel",sort:"Sortieren",emptyTitle:"Keine Titel gefunden",
    emptyText:"Audiodateien dieses Geräts erscheinen hier",likedSongs:"Lieblingstitel",
    settings:"Einstellungen",accentColor:"Akzentfarbe",appLanguage:"Sprache",speed:"Geschwindigkeit",
    sleepTimer:"Sleeptimer",off:"Aus",nowPlaying:"Wird abgespielt",library:"Bibliothek",
    volume:"Lautstärke",repeat:"Wiederholen",repeatOne:"Titel wiederholen",repeatAll:"Alle wiederholen",
    custom:"Benutzerdefiniert",endOfSong:"Nach dem Titel",sortTitle:"Titel",sortTime:"Datum",sortSize:"Größe",
    theme:"Design",dark:"Dunkel",light:"Hell"},
  it:{yourLibrary:"La tua libreria",music:"Musica",songs:"brani",favorites:"Preferiti",
    searchSongs:"Cerca brani",allSongs:"Tutti i brani",sort:"Ordina",emptyTitle:"Nessun brano trovato",
    emptyText:"Gli audio di questo dispositivo appariranno qui",likedSongs:"Brani preferiti",
    settings:"Impostazioni",accentColor:"Colore principale",appLanguage:"Lingua",speed:"Velocità",
    sleepTimer:"Timer sonno",off:"Disattivato",nowPlaying:"In riproduzione",library:"Libreria",
    volume:"Volume",repeat:"Ripeti",repeatOne:"Ripeti brano",repeatAll:"Ripeti tutto",
    custom:"Personalizzato",endOfSong:"Fine brano",sortTitle:"Titolo",sortTime:"Data",sortSize:"Dimensione",
    theme:"Tema",dark:"Scuro",light:"Chiaro"},
  pt:{yourLibrary:"Sua biblioteca",music:"Música",songs:"músicas",favorites:"Favoritos",
    searchSongs:"Buscar músicas",allSongs:"Todas as músicas",sort:"Ordenar",emptyTitle:"Nenhuma música encontrada",
    emptyText:"Os arquivos de áudio deste dispositivo aparecerão aqui",likedSongs:"Músicas favoritas",
    settings:"Configurações",accentColor:"Cor de destaque",appLanguage:"Idioma",speed:"Velocidade",
    sleepTimer:"Timer de sono",off:"Desativado",nowPlaying:"Tocando agora",library:"Biblioteca",
    volume:"Volume",repeat:"Repetir",repeatOne:"Repetir música",repeatAll:"Repetir tudo",
    custom:"Personalizado",endOfSong:"Ao terminar",sortTitle:"Título",sortTime:"Data",sortSize:"Tamanho",
    theme:"Tema",dark:"Escuro",light:"Claro"},
  ru:{yourLibrary:"Ваша медиатека",music:"Музыка",songs:"треков",favorites:"Избранное",
    searchSongs:"Поиск треков",allSongs:"Все треки",sort:"Сортировка",emptyTitle:"Треки не найдены",
    emptyText:"Аудиофайлы этого устройства появятся здесь",likedSongs:"Любимые треки",
    settings:"Настройки",accentColor:"Основной цвет",appLanguage:"Язык",speed:"Скорость",
    sleepTimer:"Таймер сна",off:"Выключено",nowPlaying:"Сейчас играет",library:"Медиатека",
    volume:"Громкость",repeat:"Повтор",repeatOne:"Повтор трека",repeatAll:"Повторить все",
    custom:"Другое время",endOfSong:"После трека",sortTitle:"Название",sortTime:"Дата",sortSize:"Размер",
    theme:"Тема",dark:"Тёмная",light:"Светлая"},
  tr:{yourLibrary:"Kütüphanen",music:"Müzik",songs:"şarkı",favorites:"Favoriler",
    searchSongs:"Şarkı ara",allSongs:"Tüm şarkılar",sort:"Sırala",emptyTitle:"Şarkı bulunamadı",
    emptyText:"Bu cihazdaki ses dosyaları burada görünecek",likedSongs:"Favori şarkılar",
    settings:"Ayarlar",accentColor:"Vurgu rengi",appLanguage:"Uygulama dili",speed:"Çalma hızı",
    sleepTimer:"Uyku zamanlayıcısı",off:"Kapalı",nowPlaying:"Şimdi çalıyor",library:"Kütüphane",
    volume:"Ses",repeat:"Tekrar",repeatOne:"Bu şarkıyı tekrarla",repeatAll:"Tümünü tekrarla",
    custom:"Özel",endOfSong:"Şarkı bitince",sortTitle:"Başlık",sortTime:"Tarih",sortSize:"Boyut",
    theme:"Tema",dark:"Koyu",light:"Açık"},
  hi:{yourLibrary:"आपकी लाइब्रेरी",music:"संगीत",songs:"गाने",favorites:"पसंदीदा",
    searchSongs:"गाने खोजें",allSongs:"सभी गाने",sort:"क्रमबद्ध करें",emptyTitle:"कोई गाना नहीं मिला",
    emptyText:"इस डिवाइस की ऑडियो फ़ाइलें यहाँ दिखाई देंगी",likedSongs:"पसंदीदा गाने",
    settings:"सेटिंग्स",accentColor:"मुख्य रंग",appLanguage:"ऐप भाषा",speed:"गति",
    sleepTimer:"स्लीप टाइमर",off:"बंद",nowPlaying:"अभी चल रहा है",library:"लाइब्रेरी",
    volume:"आवाज़",repeat:"दोहराएँ",repeatOne:"यह गाना दोहराएँ",repeatAll:"सभी दोहराएँ",
    custom:"कस्टम",endOfSong:"गाने के अंत में",sortTitle:"नाम",sortTime:"तारीख",sortSize:"आकार",
    theme:"थीम",dark:"डार्क",light:"लाइट"}
};

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value || "";
  return div.innerHTML;
}

function getTranslation(lang) {
  const aliases = {
    es:"es", pt:"pt", fr:"fr", de:"de", it:"it", ru:"ru", tr:"tr", hi:"hi",
    ar:"ar", he:"ar", fa:"ar", ur:"ar",
    zh:"zh", ja:"ja", ko:"ko",
    bn:"hi", ne:"hi", ta:"hi", te:"hi", ml:"hi", kn:"hi", mr:"hi", gu:"hi", pa:"hi", si:"hi",
    nl:"de", pl:"de", uk:"ru", cs:"de", sk:"de", hu:"de", ro:"de",
    el:"de", sv:"de", no:"de", da:"de", fi:"de", hr:"de", sr:"ru",
    bg:"ru", sl:"de", et:"de", lv:"de", lt:"de", is:"de",
    ca:"es", eu:"es", gl:"es", af:"de", am:"en", my:"en", km:"en", lo:"en",
    ka:"ru", hy:"ru", az:"tr", uz:"tr", kk:"ru", mn:"ru", zu:"en", xh:"en",
    id:"en", ms:"en", vi:"en", th:"en", sw:"en"
  };
  return translations[aliases[lang] || lang] || translations.en;
}

function trackMarkup(track, index) {
  const liked = favorites.has(track.id);
  const cover = track.albumArt
    ? `<img src="${track.albumArt}" alt="">`
    : `<span>♪</span>`;
  return `<div class="track ${index === currentIndex ? "active" : ""}" data-id="${escapeHTML(track.id)}">
    <div class="cover ${index === currentIndex ? "rotating" : ""}">${cover}</div>
    <button class="track-meta" data-play="${escapeHTML(track.id)}"><strong>${escapeHTML(track.name)}</strong><small>${escapeHTML(track.artist)}</small></button>
    <button class="track-action ${liked ? "liked" : ""}" data-favorite="${escapeHTML(track.id)}" aria-label="Favorite">
      <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z"/></svg>
    </button>
  </div>`;
}

function renderTracks(favoriteOnly = false) {
  const query = $("#searchInput").value.trim().toLowerCase();
  let visible = tracks.filter(track =>
    (!favoriteOnly || favorites.has(track.id)) &&
    (`${track.name} ${track.artist}`.toLowerCase().includes(query))
  );
  const sortMode = $("#sortSelect")?.value || "title";
  visible.sort((a,b) => {
    if (sortMode === "time") return (b.dateAdded || 0) - (a.dateAdded || 0);
    if (sortMode === "size") return (b.size || 0) - (a.size || 0);
    return (a.name || "").localeCompare(b.name || "", undefined, {sensitivity:"base"});
  });
  if (!sortAsc) visible.reverse();
  $("#songCount").textContent = tracks.length;
  $("#trackList").innerHTML = visible.length ? visible.map(track => trackMarkup(track, tracks.indexOf(track))).join("") :
    `<div class="empty-state"><div class="empty-art">♪</div><h3 data-i18n="emptyTitle">${getTranslation($("#languageSelect")?.value || "en").emptyTitle}</h3><p data-i18n="emptyText">${getTranslation($("#languageSelect")?.value || "en").emptyText}</p><button class="primary-button" id="emptyAddButton" data-i18n="chooseSongs">${getTranslation($("#languageSelect")?.value || "en").chooseSongs}</button></div>`;
  $("#favoritesList").innerHTML = tracks.filter(track => favorites.has(track.id)).map(track => trackMarkup(track, tracks.indexOf(track))).join("") ||
    `<div class="empty-state"><h3 data-i18n="emptyTitle">${getTranslation($("#languageSelect")?.value || "en").emptyTitle}</h3></div>`;
  bindTrackActions();
  $("#emptyAddButton")?.addEventListener("click", scanDeviceTracks);
}

function bindTrackActions() {
  document.querySelectorAll("[data-play]").forEach(button => button.addEventListener("click", () => {
    playTrack(tracks.findIndex(track => track.id === button.dataset.play));
  }));
  document.querySelectorAll("[data-favorite]").forEach(button => button.addEventListener("click", () => {
    favorites.has(button.dataset.favorite) ? favorites.delete(button.dataset.favorite) : favorites.add(button.dataset.favorite);
    localStorage.setItem("music-favorites", JSON.stringify([...favorites]));
    renderTracks();
  }));
}

async function playTrack(index) {
  if (index < 0 || index >= tracks.length) return;
  currentIndex = index;
  const track = tracks[index];
  audio.src = track.path;
  audio.playbackRate = Number($("#speedRange").value);
  await audio.play().catch(() => {});
  $("#miniPlayer").hidden = false;
  $("#miniTitle").textContent = track.name;
  $("#miniArtist").textContent = track.artist;
  const art = track.albumArt
    ? `<img src="${track.albumArt}" alt="">`
    : `<span>♪</span>`;
  $("#searchCurrentArt").innerHTML = art;
  $("#miniCover").innerHTML = art;
  updatePlayIcon();
  renderTracks();
}

function updatePlayIcon() {
  $("#miniPlay").innerHTML = audio.paused
    ? `<svg viewBox="0 0 24 24"><path d="m8 5 11 7-11 7Z"/></svg>`
    : `<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7ZM13 5h4v14h-4Z"/></svg>`;
  document.querySelectorAll(".track.active .cover").forEach(cover => {
    cover.classList.toggle("rotating", !audio.paused);
  });
  $("#miniCover").classList.toggle("rotating", !audio.paused);
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  const rtlLanguages = new Set(["ar","he","fa","ur","ps","sd","ku","dv","yi"]);
  document.documentElement.dir = rtlLanguages.has(lang) ? "rtl" : "ltr";
  const words = getTranslation(lang);
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (words[key]) el.textContent = words[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    if (words[el.dataset.i18nPlaceholder]) el.placeholder = words[el.dataset.i18nPlaceholder];
  });
  localStorage.setItem("music-language", lang);
  renderTracks();
}

function setAccent(color) {
  document.documentElement.style.setProperty("--accent", color);
  const hex = color.replace("#","");
  const rgb = [0,2,4].map(i => parseInt(hex.slice(i,i+2),16));
  document.documentElement.style.setProperty("--accent-rgb",rgb.join(","));
  const theme = localStorage.getItem("music-theme") || "dark";
  applyThemeColors(theme, rgb);
  localStorage.setItem("music-accent", color);
  document.querySelectorAll(".swatch").forEach(swatch => swatch.classList.toggle("active", swatch.dataset.color === color));
  if ($("#customColor")) $("#customColor").value = color;
  if (window.MusicNative && typeof window.MusicNative.setAccentColor === "function") {
    window.MusicNative.setAccentColor(color);
  }
}

function mixRgb(rgb, base, ratio) {
  return `rgb(${rgb.map((value,index) => Math.round(value * ratio + base[index] * (1 - ratio))).join(",")})`;
}

function applyThemeColors(theme, accentRgb) {
  const root = document.documentElement;
  if (theme === "light") {
    root.style.setProperty("--bg", mixRgb(accentRgb,[248,248,246],0.035));
    root.style.setProperty("--surface", mixRgb(accentRgb,[255,255,255],0.07));
    root.style.setProperty("--surface-2", mixRgb(accentRgb,[238,238,234],0.10));
    root.style.setProperty("--text","#171717");
    root.style.setProperty("--muted","#686868");
    root.style.setProperty("--menu-bg", mixRgb(accentRgb,[255,255,255],0.08));
    root.style.setProperty("--modal-bg", mixRgb(accentRgb,[248,248,246],0.09));
  } else {
    root.style.setProperty("--bg", mixRgb(accentRgb,[2,2,2],0.035));
    root.style.setProperty("--surface", mixRgb(accentRgb,[14,14,14],0.12));
    root.style.setProperty("--surface-2", mixRgb(accentRgb,[23,23,23],0.16));
    root.style.setProperty("--text","#f7f7f5");
    root.style.setProperty("--muted","#a5a5a0");
    root.style.setProperty("--menu-bg", mixRgb(accentRgb,[24,24,24],0.10));
    root.style.setProperty("--modal-bg", mixRgb(accentRgb,[23,23,23],0.12));
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute("content", theme === "light" ? "#f8f8f6" : "#020202");
}

function scanDeviceTracks() {
  if (window.MusicNative && typeof window.MusicNative.getTracks === "function") {
    try {
      const scanned = JSON.parse(window.MusicNative.getTracks());
      tracks = scanned;
    } catch (_) {}
  }
  renderTracks();
}

function setSleepTimer(minutes) {
  clearTimeout(sleepTimer);
  $("#sleepStatus").textContent = minutes ? `${minutes} min` : getTranslation($("#languageSelect").value).off;
  if (minutes) sleepTimer = setTimeout(() => { audio.pause(); updatePlayIcon(); }, minutes * 60000);
}

function init() {
  const lang = localStorage.getItem("music-language") || "en";
  const accent = localStorage.getItem("music-accent") || "#f1f1ef";
  const theme = localStorage.getItem("music-theme") || "dark";
  $("#languageSelect").value = lang;
  $("#themeSelect").value = theme;
  applyLanguage(lang);
  setAccent(accent);
  scanDeviceTracks();

  $("#searchInput").addEventListener("input", () => renderTracks());
  $("#sortSelect").addEventListener("change", () => { sortAsc = true; renderTracks(); });
  ["settingsModal","playerModal"].forEach(id => {
    $("#" + id).addEventListener("click", event => {
      if (event.target === $("#" + id)) $("#" + id).hidden = true;
    });
  });
  document.querySelectorAll("[data-close-modal]").forEach(button => button.addEventListener("click", () => $("#settingsModal").hidden = true));
  document.querySelectorAll("[data-close-player]").forEach(button => button.addEventListener("click", () => $("#playerModal").hidden = true));
  $("#languageSelect").addEventListener("change", event => applyLanguage(event.target.value));
  $("#themeSelect").addEventListener("change", event => {
    const theme = event.target.value;
    localStorage.setItem("music-theme", theme);
    const accent = localStorage.getItem("music-accent") || "#f1f1ef";
    const hex = accent.replace("#","");
    const rgb = [0,2,4].map(i => parseInt(hex.slice(i,i+2),16));
    applyThemeColors(theme, rgb);
  });
  $("#customColor").addEventListener("input", event => setAccent(event.target.value));
  $("#swatches").addEventListener("click", event => {
    const swatch = event.target.closest("[data-color]");
    if (swatch) setAccent(swatch.dataset.color);
  });
  $("#miniArtButton").addEventListener("click", () => $("#playerModal").hidden = false);
  $("#miniTrackButton").addEventListener("click", () => $("#playerModal").hidden = false);
  $("#miniPlay").addEventListener("click", () => audio.paused ? audio.play().catch(() => {}) : audio.pause());
  $("#miniNext").addEventListener("click", () => tracks.length && playTrack((currentIndex + 1) % tracks.length));
  $("#miniPrev").addEventListener("click", () => tracks.length && playTrack((currentIndex - 1 + tracks.length) % tracks.length));
  audio.addEventListener("play", updatePlayIcon);
  audio.addEventListener("play", () => {
    updatePlayIcon();
    if (window.MusicNative) window.MusicNative.keepPlaying(true);
  });
  audio.addEventListener("pause", () => {
    updatePlayIcon();
    if (window.MusicNative) window.MusicNative.keepPlaying(false);
  });
  audio.addEventListener("ended", () => {
    if (sleepAtEnd) {
      sleepAtEnd = false;
      $("#sleepStatus").textContent = getTranslation($("#languageSelect").value).off;
      return;
    }
    if (repeatMode === "one") {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else if (repeatMode === "all") {
      tracks.length && playTrack((currentIndex + 1) % tracks.length);
    } else {
      if (currentIndex + 1 < tracks.length) playTrack(currentIndex + 1);
    }
  });
  $("#speedRange").addEventListener("input", event => {
    audio.playbackRate = Number(event.target.value);
    $("#speedValue").textContent = `${Number(event.target.value).toFixed(1)}×`;
  });
  $("#repeatSelect").value = repeatMode;
  $("#repeatSelect").addEventListener("change", event => {
    repeatMode = event.target.value;
    localStorage.setItem("music-repeat", repeatMode);
    const words = getTranslation($("#languageSelect").value);
    $("#repeatStatus").textContent = words[repeatMode === "one" ? "repeatOne" : repeatMode === "all" ? "repeatAll" : "off"];
  });
  $("#volumeRange").addEventListener("input", event => {
    audio.volume = Number(event.target.value) / 100;
    $("#volumeValue").textContent = `${event.target.value}%`;
  });
  $("#sleepSelect").addEventListener("change", event => {
    const value = event.target.value;
    clearTimeout(sleepTimer);
    sleepAtEnd = false;
    $("#customSleepRow").hidden = value !== "custom";
    if (value === "current") {
      sleepAtEnd = true;
      $("#sleepStatus").textContent = getTranslation($("#languageSelect").value).endOfSong;
    } else if (value === "custom") {
      $("#customSleepMinutes").addEventListener("change", () => setSleepTimer(Number($("#customSleepMinutes").value)), {once:true});
    } else {
      setSleepTimer(Number(value));
    }
  });
  $("#customSleepMinutes").addEventListener("input", event => setSleepTimer(Number(event.target.value)));
  document.querySelectorAll(".stat-card").forEach(card => card.addEventListener("click", () => renderTracks(card.dataset.filter === "favorites")));
}

window.toggleTopMenu = function () {
  const menu = $("#topMenu");
  menu.hidden = !menu.hidden;
};

window.openFavorites = function () {
  $("#topMenu").hidden = true;
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  $("#favoritesPage").classList.add("active");
  window.scrollTo({top: 0, behavior: "smooth"});
};

window.closeFavorites = function () {
  $("#favoritesPage").classList.remove("active");
  $("#libraryPage").classList.add("active");
  window.scrollTo({top: 0, behavior: "smooth"});
};

window.openSettings = function () {
  $("#topMenu").hidden = true;
  $("#settingsModal").hidden = false;
};

window.closeOverlays = function () {
  if (!$("#settingsModal").hidden) {
    $("#settingsModal").hidden = true;
    return true;
  }
  if (!$("#playerModal").hidden) {
    $("#playerModal").hidden = true;
    return true;
  }
  if (!$("#topMenu").hidden) {
    $("#topMenu").hidden = true;
    return true;
  }
  if ($("#favoritesPage").classList.contains("active")) {
    $("#favoritesPage").classList.remove("active");
    $("#libraryPage").classList.add("active");
    return true;
  }
  return false;
};

init();
