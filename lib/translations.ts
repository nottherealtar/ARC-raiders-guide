export type Language = 'ar' | 'en';

export interface Translations {
  navbar: {
    events: string; allEvents: string; viewAll: string; activeNow: string;
    upcoming: string; noEvents: string; endsIn: string; startsIn: string;
    profile: string; myListings: string; myTrades: string; messages: string;
    adminPanel: string; login: string;
  };
  sidebar: {
    home: string; blog: string; guides: string; loadouts: string; marketplace: string;
    chats: string; myListings: string; database: string; arcs: string; items: string;
    quests: string; traders: string; maps: string; dam: string; spaceport: string;
    buriedCity: string; blueGate: string; stellaMontis: string; trackers: string;
    blueprintTracker: string; workshopPlanner: string; skillTree: string;
    weaponsTierList: string; eventTimer: string; discord: string;
  };
  footer: {
    tagline: string; quickLinks: string; items: string; maps: string; traders: string;
    events: string; community: string; blog: string; marketplace: string; dashboard: string;
    allRightsReserved: string; dataFrom: string; disclaimer: string;
  };
  home: {
    mapsTitle: string; itemsTitle: string; viewAllItems: string;
    newsTitle: string; viewAllArticles: string;
  };
  explore: {
    badge: string; subtitle: string; tagDatabase: string; tagMaps: string; tagCommunity: string;
    categories: {
      guides: { title: string; highlights: readonly string[] };
      items: { title: string; highlights: readonly string[] };
      arcs: { title: string; highlights: readonly string[] };
      quests: { title: string; highlights: readonly string[] };
      traders: { title: string; highlights: readonly string[] };
      skillTree: { title: string; highlights: readonly string[] };
      loadouts: { title: string; highlights: readonly string[] };
    };
  };
  auth: {
    loginTitle: string; loginDescription: string; email: string; password: string;
    loginButton: string; loggingIn: string; orContinueWith: string; discord: string;
    noAccount: string; registerNow: string; registerTitle: string; registerDescription: string;
    continueWithDiscord: string; orContinueWithEmail: string; username: string; name: string;
    passwordMinLength: string; confirmPassword: string; embarkId: string; optional: string;
    embarkIdExample: string; createAccountButton: string; creatingAccount: string;
    alreadyHaveAccount: string; signIn: string; logout: string; error: string;
  };
  items: { title: string; description: string };
  arcs: { title: string; description: string };
  traders: { title: string; description: string };
  language: { switchToEnglish: string; switchToArabic: string };
}

const translationMap: Record<Language, Translations> = {
  ar: {
    // Navbar
    navbar: {
      events: 'حدث',
      allEvents: 'الأحداث',
      viewAll: 'عرض الكل',
      activeNow: 'نشطة الآن',
      upcoming: 'قادمة',
      noEvents: 'لا توجد أحداث حاليًا',
      endsIn: 'ينتهي في',
      startsIn: 'يبدأ في',
      profile: 'ملفي الشخصي',
      myListings: 'قوائمي',
      myTrades: 'صفقاتي',
      messages: 'الرسائل',
      adminPanel: 'لوحة التحكم',
      login: 'تسجيل الدخول',
    },
    // Sidebar
    sidebar: {
      home: 'الرئيسية',
      blog: 'المدونة',
      guides: 'الأدلة',
      loadouts: 'الحمولات',
      marketplace: 'السوق',
      chats: 'المحادثات',
      myListings: 'قوائمي',
      database: 'قاعدة البيانات',
      arcs: 'آركس',
      items: 'العناصر',
      quests: 'المهام',
      traders: 'التجار',
      maps: 'الخرائط',
      dam: 'السد',
      spaceport: 'الميناء الفضائي',
      buriedCity: 'المدينة المدفونة',
      blueGate: 'البوابة الزرقاء',
      stellaMontis: 'ستيلا مونتيس',
      trackers: 'المتتبعات',
      blueprintTracker: 'متتبع المخططات',
      workshopPlanner: 'مخطط الورشة',
      skillTree: 'شجرة المهارات',
      weaponsTierList: 'تصنيف الأسلحة',
      eventTimer: 'مؤقت الأحداث',
      discord: 'ديسكورد',
    },
    // Footer
    footer: {
      tagline: 'دليلك الشامل للعبة ARC Raiders - قواعد بيانات، خرائط، أدلة، وأدوات',
      quickLinks: 'روابط سريعة',
      items: 'العناصر',
      maps: 'الخرائط',
      traders: 'التجار',
      events: 'الأحداث',
      community: 'المجتمع',
      blog: 'المدونة',
      marketplace: 'السوق',
      dashboard: 'لوحة التحكم',
      allRightsReserved: 'جميع الحقوق محفوظة.',
      dataFrom: 'البيانات مقدمة من',
      disclaimer: 'حقوق الملكية الفكرية وجميع المحتويات الخاصة بلعبة ARC Raiders تعود إلى Embark Studios. هذا الموقع هو مشروع من صنع المعجبين فقط، ولا يمثل أو يتبع شركة Embark Studios بأي شكل من الأشكال.',
    },
    // Home page
    home: {
      mapsTitle: 'خرائط آرك رايدرز',
      itemsTitle: 'عناصر آرك رايدرز',
      viewAllItems: 'عرض جميع العناصر ←',
      newsTitle: 'الأخبار والأدلة',
      viewAllArticles: 'عرض جميع المقالات ←',
    },
    // ExploreGrid
    explore: {
      badge: '🎮 دليل ARC Raiders الشامل',
      subtitle: 'مركزك الشامل لعالم ARC Raiders - قاعدة بيانات، أدلة، خرائط، وأدوات احترافية',
      tagDatabase: '📊 قاعدة البيانات',
      tagMaps: '🗺️ الخرائط',
      tagCommunity: '💬 المجتمع',
      categories: {
        guides: {
          title: 'الأدلة',
          highlights: [
            'مسارات مختصرة مع نصائح الاشتباك',
            'إعدادات جاهزة للفرد أو الفريق',
            'لمحات ميتا محدثة مع كل تحديث',
          ],
        },
        items: {
          title: 'العناصر',
          highlights: [
            'مدخلات التصنيع وقيم البيع',
            'مقارنات أفضل القطع لكل خانة',
            'فلاتر سريعة لتخطيط العتاد',
          ],
        },
        arcs: {
          title: 'الآركس',
          highlights: [
            'نقاط الضعف ومستويات التهديد',
            'جداول لوت حسب نوع الاشتباك',
            'تكتيكات للمناطق عالية الخطورة',
          ],
        },
        quests: {
          title: 'المهام',
          highlights: [
            'خطوات واضحة لكل هدف',
            'قائمة العناصر المطلوبة',
            'أسرع خطوط الإخلاء',
          ],
        },
        traders: {
          title: 'التجار',
          highlights: [
            'مسارات فتح السمعة',
            'هوامش الربح حسب المستوى',
            'تذكير بمخزون الأسبوع',
          ],
        },
        skillTree: {
          title: 'شجرة المهارات',
          highlights: [
            'مسارات أساسية لكل أسلوب',
            'عقد تآزر تستحق الأولوية',
            'نصائح للتخطيط قبل إعادة التوزيع',
          ],
        },
        loadouts: {
          title: 'العتاد',
          highlights: [
            'تجهيزات متوازنة حسب الميزانية',
            'أفضل توليفات الأسلحة',
            'أولوية الخانات المساندة',
          ],
        },
      },
    },
    // Auth
    auth: {
      loginTitle: 'تسجيل الدخول',
      loginDescription: 'أدخل بيانات الاعتماد للوصول إلى حسابك',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      loginButton: 'تسجيل الدخول',
      loggingIn: 'جاري تسجيل الدخول...',
      orContinueWith: 'أو تابع باستخدام',
      discord: 'ديسكورد',
      noAccount: 'ليس لديك حساب؟',
      registerNow: 'سجل الآن',
      registerTitle: 'إنشاء حساب',
      registerDescription: 'سجل للبدء مع دليل Arc Raiders',
      continueWithDiscord: 'تابع باستخدام ديسكورد',
      orContinueWithEmail: 'أو تابع باستخدام البريد الإلكتروني',
      username: 'اسم المستخدم',
      name: 'الاسم',
      passwordMinLength: 'يجب أن تكون 8 أحرف على الأقل',
      confirmPassword: 'تأكيد كلمة المرور',
      embarkId: 'معرف Embark',
      optional: 'اختياري',
      embarkIdExample: 'مثال: NullPlayer77#7351',
      createAccountButton: 'إنشاء حساب',
      creatingAccount: 'جاري إنشاء الحساب...',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      signIn: 'سجل الدخول',
      logout: 'تسجيل الخروج',
      error: 'حدث خطأ',
    },
    // Items page
    items: {
      title: 'العناصر',
      description: 'تصفح وابحث عن جميع العناصر في آرك رايدرز. صفي حسب النوع والندرة والمزيد.',
    },
    // Arcs page
    arcs: {
      title: 'وحدات ARC',
      description: 'تصفح جميع وحدات ARC. اطلع على معلومات تفصيلية عن كل وحدة والمواد التي تحصل عليها عند تدميرها.',
    },
    // Traders page
    traders: {
      title: 'التجار',
      description: 'تصفح العناصر المتاحة من جميع التجار. كل تاجر متخصص في أنواع مختلفة من المعدات والإمدادات.',
    },
    // Language switcher
    language: {
      switchToEnglish: 'English',
      switchToArabic: 'العربية',
    },
  },
  en: {
    // Navbar
    navbar: {
      events: 'Event',
      allEvents: 'Events',
      viewAll: 'View All',
      activeNow: 'Active Now',
      upcoming: 'Upcoming',
      noEvents: 'No events currently',
      endsIn: 'Ends in',
      startsIn: 'Starts in',
      profile: 'My Profile',
      myListings: 'My Listings',
      myTrades: 'My Trades',
      messages: 'Messages',
      adminPanel: 'Admin Panel',
      login: 'Login',
    },
    // Sidebar
    sidebar: {
      home: 'Home',
      blog: 'Blog',
      guides: 'Guides',
      loadouts: 'Loadouts',
      marketplace: 'Marketplace',
      chats: 'Chats',
      myListings: 'My Listings',
      database: 'Database',
      arcs: 'ARCs',
      items: 'Items',
      quests: 'Quests',
      traders: 'Traders',
      maps: 'Maps',
      dam: 'Dam Battlegrounds',
      spaceport: 'The Spaceport',
      buriedCity: 'Buried City',
      blueGate: 'Blue Gate',
      stellaMontis: 'Stella Montis',
      trackers: 'Trackers',
      blueprintTracker: 'Blueprint Tracker',
      workshopPlanner: 'Workshop Planner',
      skillTree: 'Skill Tree',
      weaponsTierList: 'Weapons Tier List',
      eventTimer: 'Event Timer',
      discord: 'Discord',
    },
    // Footer
    footer: {
      tagline: 'Your complete ARC Raiders guide – database, maps, guides, and tools',
      quickLinks: 'Quick Links',
      items: 'Items',
      maps: 'Maps',
      traders: 'Traders',
      events: 'Events',
      community: 'Community',
      blog: 'Blog',
      marketplace: 'Marketplace',
      dashboard: 'Dashboard',
      allRightsReserved: 'All rights reserved.',
      dataFrom: 'Data provided by',
      disclaimer: 'ARC Raiders intellectual property and all related content belong to Embark Studios. This site is a fan project and is not affiliated with or endorsed by Embark Studios in any way.',
    },
    // Home page
    home: {
      mapsTitle: 'ARC Raiders Maps',
      itemsTitle: 'ARC Raiders Items',
      viewAllItems: 'View all items →',
      newsTitle: 'News & Guides',
      viewAllArticles: 'View all articles →',
    },
    // ExploreGrid
    explore: {
      badge: '🎮 The Complete ARC Raiders Guide',
      subtitle: 'Your one-stop hub for ARC Raiders – database, guides, maps, and professional tools',
      tagDatabase: '📊 Database',
      tagMaps: '🗺️ Maps',
      tagCommunity: '💬 Community',
      categories: {
        guides: {
          title: 'Guides',
          highlights: [
            'Optimized routes with engagement tips',
            'Ready-made setups for solo or squad',
            'Updated meta snapshots each patch',
          ],
        },
        items: {
          title: 'Items',
          highlights: [
            'Crafting inputs and sell values',
            'Best-in-slot comparisons per slot',
            'Quick filters for gear planning',
          ],
        },
        arcs: {
          title: 'ARCs',
          highlights: [
            'Weak points and threat levels',
            'Loot tables by engagement type',
            'High-risk area tactics',
          ],
        },
        quests: {
          title: 'Quests',
          highlights: [
            'Clear steps for each objective',
            'Required items checklist',
            'Fastest extraction routes',
          ],
        },
        traders: {
          title: 'Traders',
          highlights: [
            'Reputation unlock paths',
            'Profit margins per level',
            'Weekly stock reminders',
          ],
        },
        skillTree: {
          title: 'Skill Tree',
          highlights: [
            'Core paths for each playstyle',
            'Synergy nodes worth prioritizing',
            'Tips for planning before respec',
          ],
        },
        loadouts: {
          title: 'Loadouts',
          highlights: [
            'Budget-balanced builds',
            'Best weapon combinations',
            'Support slot priority',
          ],
        },
      },
    },
    // Auth
    auth: {
      loginTitle: 'Sign In',
      loginDescription: 'Enter your credentials to access your account',
      email: 'Email',
      password: 'Password',
      loginButton: 'Sign In',
      loggingIn: 'Signing in...',
      orContinueWith: 'Or continue with',
      discord: 'Discord',
      noAccount: "Don't have an account?",
      registerNow: 'Register now',
      registerTitle: 'Create Account',
      registerDescription: 'Register to get started with the Arc Raiders guide',
      continueWithDiscord: 'Continue with Discord',
      orContinueWithEmail: 'Or continue with email',
      username: 'Username',
      name: 'Name',
      passwordMinLength: 'Must be at least 8 characters',
      confirmPassword: 'Confirm Password',
      embarkId: 'Embark ID',
      optional: 'optional',
      embarkIdExample: 'Example: NullPlayer77#7351',
      createAccountButton: 'Create Account',
      creatingAccount: 'Creating account...',
      alreadyHaveAccount: 'Already have an account?',
      signIn: 'Sign in',
      logout: 'Logout',
      error: 'An error occurred',
    },
    // Items page
    items: {
      title: 'Items',
      description: 'Browse and search all items in ARC Raiders. Filter by type, rarity, and more.',
    },
    // Arcs page
    arcs: {
      title: 'ARC Units',
      description: 'Browse all ARC units. View detailed information about each unit and the materials obtained when destroyed.',
    },
    // Traders page
    traders: {
      title: 'Traders',
      description: 'Browse items available from all traders. Each trader specializes in different types of equipment and supplies.',
    },
    // Language switcher
    language: {
      switchToEnglish: 'English',
      switchToArabic: 'العربية',
    },
  },
};

export const translations = translationMap;
