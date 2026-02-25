/**
 * Header and footer UI strings per locale.
 * Keys match locale path: "" = en, "es", "fr", "pt", "ru"
 */
export type HeaderFooterLocale = "en" | "es" | "fr" | "pt" | "ru"

export interface HeaderFooterTranslations {
  // Nav
  home: string
  new: string
  trending: string
  categories: string
  blog: string
  playRandom: string
  // Auth
  hi: string
  signedInAs: string
  myProfile: string
  myFavorites: string
  myLikes: string
  myUploads: string
  uploadSound: string
  signOut: string
  joinFree: string
  signIn: string
  createAccount: string
  createFreeAccount: string
  // Mobile
  menu: string
  language: string
  closeMenu: string
  toggleMenu: string
  // Search
  searchPlaceholder: string
  searchButton: string
  selectLanguage: string
  // Footer
  footerTagline: string
  links: string
  resources: string
  contact: string
  followUs: string
  aboutUs: string
  contactUs: string
  privacyPolicy: string
  termsConditions: string
  disclaimer: string
  dmcaPolicy: string
  cookiePolicy: string
  haveQuestions: string
  allRightsReserved: string
  categoriesSection: string
  homeLink: string
  playRandomLink: string
  newSoundsLink: string
  trendingLink: string
  signInLink: string
  createAccountLink: string
  blogLink: string
}

const TRANSLATIONS: Record<HeaderFooterLocale, HeaderFooterTranslations> = {
  en: {
    home: "HOME",
    new: "NEW",
    trending: "TRENDING",
    categories: "CATEGORIES",
    blog: "BLOG",
    playRandom: "PLAY RANDOM",
    hi: "Hi",
    signedInAs: "Signed in as",
    myProfile: "My Profile",
    myFavorites: "My Favorites",
    myLikes: "My Likes",
    myUploads: "My Uploads",
    uploadSound: "Upload Sound",
    signOut: "Sign out",
    joinFree: "JOIN FREE",
    signIn: "Sign in",
    createAccount: "Create Account",
    createFreeAccount: "Create free account",
    menu: "Menu",
    language: "Language",
    closeMenu: "Close mobile menu",
    toggleMenu: "Toggle menu",
    searchPlaceholder: "Search sounds...",
    searchButton: "Search",
    selectLanguage: "Select language",
    footerTagline: "Free sound buttons and meme soundboard with thousands of sounds. Play, share, and enjoy!",
    links: "Links",
    resources: "Resources",
    contact: "Contact",
    followUs: "Follow Us",
    aboutUs: "About Us",
    contactUs: "Contact Us",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
    disclaimer: "Disclaimer",
    dmcaPolicy: "DMCA Policy",
    cookiePolicy: "Cookie Policy",
    haveQuestions: "Have questions or feedback?",
    allRightsReserved: "All rights reserved.",
    categoriesSection: "Categories",
    homeLink: "Home",
    playRandomLink: "Play Random",
    newSoundsLink: "New Sounds",
    trendingLink: "Trending",
    signInLink: "Sign In",
    createAccountLink: "Create Account",
    blogLink: "Blog",
  },
  es: {
    home: "INICIO",
    new: "NUEVOS",
    trending: "TENDENCIA",
    categories: "CATEGORÍAS",
    blog: "BLOG",
    playRandom: "REPRODUCIR ALEATORIO",
    hi: "Hola",
    signedInAs: "Conectado como",
    myProfile: "Mi perfil",
    myFavorites: "Mis favoritos",
    myLikes: "Mis me gusta",
    myUploads: "Mis subidas",
    uploadSound: "Subir sonido",
    signOut: "Cerrar sesión",
    joinFree: "REGISTRARSE GRATIS",
    signIn: "Iniciar sesión",
    createAccount: "Crear cuenta",
    createFreeAccount: "Crear cuenta gratis",
    menu: "Menú",
    language: "Idioma",
    closeMenu: "Cerrar menú",
    toggleMenu: "Abrir menú",
    searchPlaceholder: "Buscar botones de sonido...",
    searchButton: "Buscar",
    selectLanguage: "Seleccionar idioma",
    footerTagline: "Botones de sonido y meme soundboard gratis con miles de sonidos. ¡Reproduce, comparte y disfruta!",
    links: "Enlaces",
    resources: "Recursos",
    contact: "Contacto",
    followUs: "Síguenos",
    aboutUs: "Sobre nosotros",
    contactUs: "Contáctanos",
    privacyPolicy: "Política de privacidad",
    termsConditions: "Términos y condiciones",
    disclaimer: "Aviso legal",
    dmcaPolicy: "Política DMCA",
    cookiePolicy: "Política de cookies",
    haveQuestions: "¿Preguntas o comentarios?",
    allRightsReserved: "Todos los derechos reservados.",
    categoriesSection: "Categorías",
    homeLink: "Inicio",
    playRandomLink: "Reproducir aleatorio",
    newSoundsLink: "Nuevos sonidos",
    trendingLink: "Tendencia",
    signInLink: "Iniciar sesión",
    createAccountLink: "Crear cuenta",
    blogLink: "Blog",
  },
  fr: {
    home: "ACCUEIL",
    new: "NOUVEAUX",
    trending: "TENDANCE",
    categories: "CATÉGORIES",
    blog: "BLOG",
    playRandom: "JOUER ALÉATOIRE",
    hi: "Bonjour",
    signedInAs: "Connecté en tant que",
    myProfile: "Mon profil",
    myFavorites: "Mes favoris",
    myLikes: "Mes j'aime",
    myUploads: "Mes téléchargements",
    uploadSound: "Télécharger un son",
    signOut: "Déconnexion",
    joinFree: "INSCRIPTION GRATUITE",
    signIn: "Connexion",
    createAccount: "Créer un compte",
    createFreeAccount: "Créer un compte gratuit",
    menu: "Menu",
    language: "Langue",
    closeMenu: "Fermer le menu",
    toggleMenu: "Ouvrir le menu",
    searchPlaceholder: "Rechercher des boutons sonores...",
    searchButton: "Rechercher",
    selectLanguage: "Choisir la langue",
    footerTagline: "Boutons sonores et meme soundboard gratuits avec des milliers de sons. Jouez, partagez et profitez !",
    links: "Liens",
    resources: "Ressources",
    contact: "Contact",
    followUs: "Suivez-nous",
    aboutUs: "À propos",
    contactUs: "Nous contacter",
    privacyPolicy: "Politique de confidentialité",
    termsConditions: "Conditions générales",
    disclaimer: "Mentions légales",
    dmcaPolicy: "Politique DMCA",
    cookiePolicy: "Politique des cookies",
    haveQuestions: "Des questions ou des retours ?",
    allRightsReserved: "Tous droits réservés.",
    categoriesSection: "Catégories",
    homeLink: "Accueil",
    playRandomLink: "Jouer aléatoire",
    newSoundsLink: "Nouveaux sons",
    trendingLink: "Tendance",
    signInLink: "Connexion",
    createAccountLink: "Créer un compte",
    blogLink: "Blog",
  },
  pt: {
    home: "INÍCIO",
    new: "NOVOS",
    trending: "EM ALTA",
    categories: "CATEGORIAS",
    blog: "BLOG",
    playRandom: "TOCAR ALEATÓRIO",
    hi: "Olá",
    signedInAs: "Conectado como",
    myProfile: "Meu perfil",
    myFavorites: "Meus favoritos",
    myLikes: "Minhas curtidas",
    myUploads: "Meus envios",
    uploadSound: "Enviar som",
    signOut: "Sair",
    joinFree: "CADASTRE-SE GRÁTIS",
    signIn: "Entrar",
    createAccount: "Criar conta",
    createFreeAccount: "Criar conta grátis",
    menu: "Menu",
    language: "Idioma",
    closeMenu: "Fechar menu",
    toggleMenu: "Abrir menu",
    searchPlaceholder: "Buscar botões de som...",
    searchButton: "Buscar",
    selectLanguage: "Selecionar idioma",
    footerTagline: "Botões de som e meme soundboard grátis com milhares de sons. Reproduza, compartilhe e curta!",
    links: "Links",
    resources: "Recursos",
    contact: "Contato",
    followUs: "Siga-nos",
    aboutUs: "Sobre nós",
    contactUs: "Fale conosco",
    privacyPolicy: "Política de privacidade",
    termsConditions: "Termos e condições",
    disclaimer: "Aviso legal",
    dmcaPolicy: "Política DMCA",
    cookiePolicy: "Política de cookies",
    haveQuestions: "Dúvidas ou sugestões?",
    allRightsReserved: "Todos os direitos reservados.",
    categoriesSection: "Categorias",
    homeLink: "Início",
    playRandomLink: "Tocar aleatório",
    newSoundsLink: "Novos sons",
    trendingLink: "Em alta",
    signInLink: "Entrar",
    createAccountLink: "Criar conta",
    blogLink: "Blog",
  },
  ru: {
    home: "ГЛАВНАЯ",
    new: "НОВЫЕ",
    trending: "В ТРЕНДЕ",
    categories: "КАТЕГОРИИ",
    blog: "БЛОГ",
    playRandom: "СЛУЧАЙНОЕ ВОСПРОИЗВЕДЕНИЕ",
    hi: "Привет",
    signedInAs: "Вход выполнен как",
    myProfile: "Мой профиль",
    myFavorites: "Избранное",
    myLikes: "Понравилось",
    myUploads: "Мои загрузки",
    uploadSound: "Загрузить звук",
    signOut: "Выйти",
    joinFree: "РЕГИСТРАЦИЯ",
    signIn: "Войти",
    createAccount: "Создать аккаунт",
    createFreeAccount: "Создать бесплатный аккаунт",
    menu: "Меню",
    language: "Язык",
    closeMenu: "Закрыть меню",
    toggleMenu: "Открыть меню",
    searchPlaceholder: "Поиск звуковых кнопок...",
    searchButton: "Поиск",
    selectLanguage: "Выбрать язык",
    footerTagline: "Бесплатные звуковые кнопки и мем саундборд с тысячами звуков. Слушайте, делитесь и наслаждайтесь!",
    links: "Ссылки",
    resources: "Ресурсы",
    contact: "Контакты",
    followUs: "Мы в соцсетях",
    aboutUs: "О нас",
    contactUs: "Связаться с нами",
    privacyPolicy: "Политика конфиденциальности",
    termsConditions: "Условия использования",
    disclaimer: "Правовая информация",
    dmcaPolicy: "Политика DMCA",
    cookiePolicy: "Политика cookies",
    haveQuestions: "Вопросы или предложения?",
    allRightsReserved: "Все права защищены.",
    categoriesSection: "Категории",
    homeLink: "Главная",
    playRandomLink: "Случайное воспроизведение",
    newSoundsLink: "Новые звуки",
    trendingLink: "В тренде",
    signInLink: "Войти",
    createAccountLink: "Создать аккаунт",
    blogLink: "Блог",
  },
}

export function getHeaderFooterTranslations(locale: HeaderFooterLocale): HeaderFooterTranslations {
  return TRANSLATIONS[locale] ?? TRANSLATIONS.en
}

/** Get locale from pathname (e.g. /es/trending -> "es") */
export function getLocaleFromPathname(pathname: string | null): HeaderFooterLocale {
  if (!pathname) return "en"
  if (pathname.startsWith("/ru")) return "ru"
  if (pathname.startsWith("/pt")) return "pt"
  if (pathname.startsWith("/fr")) return "fr"
  if (pathname.startsWith("/es")) return "es"
  return "en"
}
