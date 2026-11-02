/*
 * كلماتي / Kalimati — Banque de mots arabes
 * ------------------------------------------
 * Format final de chaque mot : { ar, harakat, translit, fr, def, cat }
 *   ar        : mot arabe sans voyelles (calculé automatiquement depuis `harakat`)
 *   harakat   : mot arabe vocalisé (avec les harakât) — c'est ce qu'on écrit ici
 *   translit  : translittération latine (forme de pause, sans désinence finale)
 *   fr        : traduction française
 *   def       : explication en arabe simple (affichée quand l'interface est en arabe)
 *   cat       : "verb" | "adjective" | "linking" | "expression" (ajouté par buildLessons)
 * Verbes uniquement :
 *   present / presentTranslit : 1re personne du présent (« je … »), ex. أَكْتُبُ aktubu.
 *   Le verbe est cité, comme dans les dictionnaires arabes, au passé 3e pers. masc. sing.
 *
 * Conventions de translittération : ā ī ū = voyelles longues, ʿ = ʿayn (ع),
 * ʾ = hamza (ء), ḥ (ح), kh (خ), sh (ش), ṣ (ص), ḍ (ض), ṭ (ط), ẓ (ظ),
 * th (ث), dh (ذ), gh (غ), q (ق).
 *
 * Les phrases d'exemple ne sont PAS incluses : l'app affiche le mot vocalisé,
 * sa translittération, sa traduction et l'audio (speechSynthesis).
 *
 * Structure des leçons : 20 mots/jour = 5 verbes + 5 adjectifs
 * + 5 mots de liaison + 5 expressions. Les mots de liaison, moins nombreux,
 * sont RÉUTILISÉS en rotation sur les leçons (révision espacée) — c'est voulu.
 * Ce sont tous des connecteurs qui peuvent ouvrir une phrase (ثُمَّ، لِذَلِكَ…),
 * ce qui permet au générateur de paragraphe de les placer naturellement.
 *
 * Pour ajouter du contenu : ajoute simplement des lignes dans les listes,
 * buildLessons() recalcule tout automatiquement.
 */

/** Retire les harakât (voyelles brèves, tanwīn, shadda, sukūn, alif suscrit, tatwīl). */
const stripHarakat = (s) => s.replace(/[ً-ٰٟـ]/g, "");

const v = (harakat, translit, present, presentTranslit, fr, def) => ({
  ar: stripHarakat(harakat),
  harakat,
  translit,
  present,
  presentTranslit,
  fr,
  def,
});
const w = (harakat, translit, fr, def) => ({ ar: stripHarakat(harakat), harakat, translit, fr, def });

// ── الأفعال · Verbes ─────────────────────────────────────────────────────
export const VERBS = [
  v("كَتَبَ", "kataba", "أَكْتُبُ", "aktubu", "écrire", "خطّ الكلمات بالقلم"),
  v("قَرَأَ", "qaraʾa", "أَقْرَأُ", "aqraʾu", "lire", "نظر في الكتاب ونطق كلماته"),
  v("ذَهَبَ", "dhahaba", "أَذْهَبُ", "adhhabu", "aller", "مضى إلى مكان"),
  v("أَكَلَ", "akala", "آكُلُ", "ākulu", "manger", "تناول الطعام"),
  v("شَرِبَ", "shariba", "أَشْرَبُ", "ashrabu", "boire", "تناول الماء أو العصير"),

  v("نَامَ", "nāma", "أَنَامُ", "anāmu", "dormir", "استراح وأغمض عينيه في الليل"),
  v("فَتَحَ", "fataḥa", "أَفْتَحُ", "aftaḥu", "ouvrir", "عكس أغلق"),
  v("جَلَسَ", "jalasa", "أَجْلِسُ", "ajlisu", "s'asseoir", "قعد"),
  v("قَالَ", "qāla", "أَقُولُ", "aqūlu", "dire", "تكلّم ونطق"),
  v("سَمِعَ", "samiʿa", "أَسْمَعُ", "asmaʿu", "entendre", "أدرك الصوت بأذنه"),

  v("رَأَى", "raʾā", "أَرَى", "arā", "voir", "شاهد بعينه"),
  v("عَرَفَ", "ʿarafa", "أَعْرِفُ", "aʿrifu", "savoir, connaître", "علم الشيء"),
  v("فَهِمَ", "fahima", "أَفْهَمُ", "afhamu", "comprendre", "أدرك المعنى"),
  v("لَعِبَ", "laʿiba", "أَلْعَبُ", "alʿabu", "jouer", "تسلّى ومرح"),
  v("عَمِلَ", "ʿamila", "أَعْمَلُ", "aʿmalu", "travailler", "اشتغل"),

  v("دَرَسَ", "darasa", "أَدْرُسُ", "adrusu", "étudier", "تعلّم بجدّ"),
  v("خَرَجَ", "kharaja", "أَخْرُجُ", "akhruju", "sortir", "عكس دخل"),
  v("دَخَلَ", "dakhala", "أَدْخُلُ", "adkhulu", "entrer", "عكس خرج"),
  v("رَجَعَ", "rajaʿa", "أَرْجِعُ", "arjiʿu", "revenir, rentrer", "عاد إلى المكان"),
  v("أَحَبَّ", "aḥabba", "أُحِبُّ", "uḥibbu", "aimer", "عكس كره"),

  v("أَرَادَ", "arāda", "أُرِيدُ", "urīdu", "vouloir", "رغب في شيء"),
  v("سَافَرَ", "sāfara", "أُسَافِرُ", "usāfiru", "voyager", "انتقل إلى بلد آخر"),
  v("سَاعَدَ", "sāʿada", "أُسَاعِدُ", "usāʿidu", "aider", "قدّم العون"),
  v("تَكَلَّمَ", "takallama", "أَتَكَلَّمُ", "atakallamu", "parler", "تحدّث"),
  v("تَعَلَّمَ", "taʿallama", "أَتَعَلَّمُ", "ataʿallamu", "apprendre", "اكتسب علمًا جديدًا"),

  v("اِسْتَيْقَظَ", "istayqaẓa", "أَسْتَيْقِظُ", "astayqiẓu", "se réveiller", "صحا من النوم"),
  v("طَبَخَ", "ṭabakha", "أَطْبُخُ", "aṭbukhu", "cuisiner", "أعدّ الطعام على النار"),
  v("غَسَلَ", "ghasala", "أَغْسِلُ", "aghsilu", "laver", "نظّف بالماء"),
  v("لَبِسَ", "labisa", "أَلْبَسُ", "albasu", "s'habiller, porter (un vêtement)", "ارتدى الثياب"),
  v("مَشَى", "mashā", "أَمْشِي", "amshī", "marcher", "سار على قدميه"),

  v("رَكَضَ", "rakaḍa", "أَرْكُضُ", "arkuḍu", "courir", "جرى بسرعة"),
  v("ضَحِكَ", "ḍaḥika", "أَضْحَكُ", "aḍḥaku", "rire", "عكس بكى"),
  v("بَكَى", "bakā", "أَبْكِي", "abkī", "pleurer", "نزلت دموعه"),
  v("سَأَلَ", "saʾala", "أَسْأَلُ", "asʾalu", "demander, questionner", "طلب معرفة شيء"),
  v("أَجَابَ", "ajāba", "أُجِيبُ", "ujību", "répondre", "ردّ على السؤال"),

  v("اِشْتَرَى", "ishtarā", "أَشْتَرِي", "ashtarī", "acheter", "أخذ شيئًا مقابل المال"),
  v("بَاعَ", "bāʿa", "أَبِيعُ", "abīʿu", "vendre", "أعطى شيئًا مقابل المال"),
  v("أَخَذَ", "akhadha", "آخُذُ", "ākhudhu", "prendre", "تناول الشيء بيده"),
  v("أَعْطَى", "aʿṭā", "أُعْطِي", "uʿṭī", "donner", "قدّم شيئًا لغيره"),
  v("وَجَدَ", "wajada", "أَجِدُ", "ajidu", "trouver", "عثر على الشيء"),

  v("نَسِيَ", "nasiya", "أَنْسَى", "ansā", "oublier", "عكس تذكّر"),
  v("تَذَكَّرَ", "tadhakkara", "أَتَذَكَّرُ", "atadhakkaru", "se souvenir", "عكس نسي"),
  v("اِنْتَظَرَ", "intaẓara", "أَنْتَظِرُ", "antaẓiru", "attendre", "بقي حتى يأتي أحد"),
  v("بَدَأَ", "badaʾa", "أَبْدَأُ", "abdaʾu", "commencer", "عكس أنهى"),
  v("أَنْهَى", "anhā", "أُنْهِي", "unhī", "terminer, finir", "أكمل الشيء حتى آخره"),

  v("فَكَّرَ", "fakkara", "أُفَكِّرُ", "ufakkiru", "penser, réfléchir", "أعمل عقله"),
  v("شَعَرَ", "shaʿara", "أَشْعُرُ", "ashʿuru", "ressentir, se sentir", "أحسّ"),
  v("اِسْتَمَعَ", "istamaʿa", "أَسْتَمِعُ", "astamiʿu", "écouter", "أصغى بانتباه"),
  v("نَظَرَ", "naẓara", "أَنْظُرُ", "anẓuru", "regarder", "وجّه عينيه إلى شيء"),
  v("زَارَ", "zāra", "أَزُورُ", "azūru", "rendre visite, visiter", "ذهب لرؤية أحد"),

  v("حَمَلَ", "ḥamala", "أَحْمِلُ", "aḥmilu", "porter (un objet)", "رفع الشيء ونقله"),
  v("رَسَمَ", "rasama", "أَرْسُمُ", "arsumu", "dessiner", "صنع صورة بالقلم"),
  v("سَبَحَ", "sabaḥa", "أَسْبَحُ", "asbaḥu", "nager", "تحرّك في الماء"),
  v("غَنَّى", "ghannā", "أُغَنِّي", "ughannī", "chanter", "أنشد بصوت جميل"),
  v("اِبْتَسَمَ", "ibtasama", "أَبْتَسِمُ", "abtasimu", "sourire", "ضحك بلا صوت"),

  v("صَلَّى", "ṣallā", "أُصَلِّي", "uṣallī", "prier", "أدّى الصلاة"),
  v("نَظَّفَ", "naẓẓafa", "أُنَظِّفُ", "unaẓẓifu", "nettoyer", "أزال الوسخ"),
  v("اِتَّصَلَ", "ittaṣala", "أَتَّصِلُ", "attaṣilu", "appeler (au téléphone)", "كلّم أحدًا بالهاتف"),
  v("اِسْتَطَاعَ", "istaṭāʿa", "أَسْتَطِيعُ", "astaṭīʿu", "pouvoir, être capable", "قدر على الشيء"),
  v("وَصَلَ", "waṣala", "أَصِلُ", "aṣilu", "arriver", "بلغ المكان"),

  v("سَكَنَ", "sakana", "أَسْكُنُ", "askunu", "habiter", "أقام في مكان"),
  v("جَرَّبَ", "jarraba", "أُجَرِّبُ", "ujarribu", "essayer", "حاول شيئًا جديدًا"),
  v("صَنَعَ", "ṣanaʿa", "أَصْنَعُ", "aṣnaʿu", "fabriquer, faire", "عمل شيئًا بيده"),
  v("أَغْلَقَ", "aghlaqa", "أُغْلِقُ", "ughliqu", "fermer", "عكس فتح"),
  v("اِسْتَعْمَلَ", "istaʿmala", "أَسْتَعْمِلُ", "astaʿmilu", "utiliser", "انتفع بالشيء"),
];

// ── الصفات · Adjectifs (masculin singulier) ──────────────────────────────
export const ADJECTIVES = [
  w("سَعِيدٌ", "saʿīd", "heureux", "فرحان"),
  w("حَزِينٌ", "ḥazīn", "triste", "عكس سعيد"),
  w("كَبِيرٌ", "kabīr", "grand", "عكس صغير"),
  w("صَغِيرٌ", "ṣaghīr", "petit", "عكس كبير"),
  w("جَمِيلٌ", "jamīl", "beau", "حسن المنظر"),

  w("جَدِيدٌ", "jadīd", "nouveau", "عكس قديم"),
  w("قَدِيمٌ", "qadīm", "ancien, vieux", "عكس جديد"),
  w("طَوِيلٌ", "ṭawīl", "long, grand (de taille)", "عكس قصير"),
  w("قَصِيرٌ", "qaṣīr", "court, petit (de taille)", "عكس طويل"),
  w("سَرِيعٌ", "sarīʿ", "rapide", "عكس بطيء"),

  w("بَطِيءٌ", "baṭīʾ", "lent", "عكس سريع"),
  w("سَهْلٌ", "sahl", "facile", "عكس صعب"),
  w("صَعْبٌ", "ṣaʿb", "difficile", "عكس سهل"),
  w("هَادِئٌ", "hādiʾ", "calme", "ساكن بلا ضجيج"),
  w("مَشْغُولٌ", "mashghūl", "occupé", "عنده عمل كثير"),

  w("مُتْعَبٌ", "mutʿab", "fatigué", "يحتاج إلى الراحة"),
  w("جَائِعٌ", "jāʾiʿ", "affamé (qui a faim)", "يريد أن يأكل"),
  w("عَطْشَانُ", "ʿaṭshān", "assoiffé (qui a soif)", "يريد أن يشرب"),
  w("ذَكِيٌّ", "dhakiyy", "intelligent", "سريع الفهم"),
  w("لَطِيفٌ", "laṭīf", "gentil, agréable", "رقيق المعاملة"),

  w("كَرِيمٌ", "karīm", "généreux", "يعطي كثيرًا"),
  w("قَوِيٌّ", "qawiyy", "fort", "عكس ضعيف"),
  w("ضَعِيفٌ", "ḍaʿīf", "faible", "عكس قوي"),
  w("غَنِيٌّ", "ghaniyy", "riche", "عنده مال كثير"),
  w("فَقِيرٌ", "faqīr", "pauvre", "عكس غني"),

  w("نَظِيفٌ", "naẓīf", "propre", "بلا وسخ"),
  w("ثَقِيلٌ", "thaqīl", "lourd", "عكس خفيف"),
  w("خَفِيفٌ", "khafīf", "léger", "عكس ثقيل"),
  w("حَارٌّ", "ḥārr", "chaud", "عكس بارد"),
  w("بَارِدٌ", "bārid", "froid", "عكس حارّ"),

  w("مَسْرُورٌ", "masrūr", "content", "فرحان وراضٍ"),
  w("مُمْتَازٌ", "mumtāz", "excellent", "جيّد جدًّا"),
  w("مُهِمٌّ", "muhimm", "important", "له قيمة كبيرة"),
  w("مُفِيدٌ", "mufīd", "utile", "فيه فائدة"),
  w("مُمْتِعٌ", "mumtiʿ", "amusant, agréable", "يعطي متعة"),

  w("مُضْحِكٌ", "muḍḥik", "drôle", "يجعلنا نضحك"),
  w("شُجَاعٌ", "shujāʿ", "courageux", "لا يخاف"),
  w("صَبُورٌ", "ṣabūr", "patient", "يصبر ولا يتعجّل"),
  w("نَشِيطٌ", "nashīṭ", "actif, énergique", "عكس كسلان"),
  w("كَسْلَانُ", "kaslān", "paresseux", "عكس نشيط"),

  w("مُرْتَاحٌ", "murtāḥ", "détendu, à l'aise", "يشعر بالراحة"),
  w("قَلِقٌ", "qaliq", "inquiet", "عكس مطمئنّ"),
  w("مُتَحَمِّسٌ", "mutaḥammis", "enthousiaste", "متشوّق ونشيط"),
  w("فَخُورٌ", "fakhūr", "fier", "يشعر بالفخر"),
  w("صَادِقٌ", "ṣādiq", "sincère, honnête", "يقول الحقّ"),

  w("مُؤَدَّبٌ", "muʾaddab", "poli", "حسن الأخلاق"),
  w("وَاضِحٌ", "wāḍiḥ", "clair", "سهل الفهم"),
  w("غَرِيبٌ", "gharīb", "étrange", "غير مألوف"),
  w("لَذِيذٌ", "ladhīdh", "délicieux", "طعمه طيّب"),
  w("رَخِيصٌ", "rakhīṣ", "bon marché", "ثمنه قليل"),

  w("بَعِيدٌ", "baʿīd", "loin, éloigné", "عكس قريب"),
  w("قَرِيبٌ", "qarīb", "proche", "عكس بعيد"),
  w("مَرِيضٌ", "marīḍ", "malade", "عكس سليم"),
  w("حُرٌّ", "ḥurr", "libre", "غير مقيّد"),
  w("وَحِيدٌ", "waḥīd", "seul", "ليس معه أحد"),

  w("مَشْهُورٌ", "mashhūr", "célèbre", "يعرفه الناس"),
  w("رَائِعٌ", "rāʾiʿ", "magnifique, génial", "جميل جدًّا"),
  w("طَيِّبٌ", "ṭayyib", "bon, gentil", "حسن القلب"),
  w("مُسْتَعِدٌّ", "mustaʿidd", "prêt", "جاهز"),
  w("جَادٌّ", "jādd", "sérieux", "يعمل باهتمام"),
];

// ── أدوات الربط · Mots de liaison (connecteurs, réutilisés en rotation) ──
export const LINKING = [
  w("ثُمَّ", "thumma", "puis, ensuite", "بعد ذلك مباشرة"),
  w("لَكِنْ", "lākin", "mais", "للاستدراك"),
  w("لِذَلِكَ", "li-dhālika", "c'est pourquoi", "بسبب ذلك"),
  w("بَعْدَ ذَلِكَ", "baʿda dhālika", "après cela", "في الوقت التالي"),
  w("أَيْضًا", "ayḍan", "aussi", "كذلك"),

  w("فِي البِدَايَةِ", "fī l-bidāya", "au début", "في أوّل الأمر"),
  w("أَخِيرًا", "akhīran", "enfin, finalement", "في الآخر"),
  w("رُبَّمَا", "rubbamā", "peut-être", "يمكن أن يكون"),
  w("عَادَةً", "ʿādatan", "d'habitude", "في أغلب الأيّام"),
  w("أَحْيَانًا", "aḥyānan", "parfois", "في بعض الأوقات"),

  w("دَائِمًا", "dāʾiman", "toujours", "في كلّ وقت"),
  w("قَبْلَ ذَلِكَ", "qabla dhālika", "avant cela", "في الوقت السابق"),
  w("مَعَ ذَلِكَ", "maʿa dhālika", "pourtant, malgré cela", "رغم ذلك"),
  w("فِي الحَقِيقَةِ", "fī l-ḥaqīqa", "en réalité", "في الواقع"),
  w("طَبْعًا", "ṭabʿan", "bien sûr", "بالتأكيد"),

  w("أَوَّلًا", "awwalan", "premièrement", "قبل كلّ شيء"),
  w("ثَانِيًا", "thāniyan", "deuxièmement", "بعد الأوّل"),
  w("فِي النِّهَايَةِ", "fī n-nihāya", "à la fin", "في آخر الأمر"),
  w("غَالِبًا", "ghāliban", "souvent, le plus souvent", "في أكثر الأوقات"),
  w("فَجْأَةً", "fajʾatan", "soudain", "بدون انتظار"),

  w("كَذَلِكَ", "kadhālika", "de même, également", "أيضًا"),
  w("إِذَنْ", "idhan", "donc, alors", "بناءً على ذلك"),
  w("بِصَرَاحَةٍ", "bi-ṣarāḥa", "franchement", "بكلّ صدق"),
  w("بِالتَّالِي", "bi-t-tālī", "par conséquent", "لذلك"),
  w("عَلَى الأَقَلِّ", "ʿalā l-aqall", "au moins", "أقلّ شيء"),

  w("فِي نَفْسِ الوَقْتِ", "fī nafsi l-waqt", "en même temps", "معًا في لحظة واحدة"),
  w("مِنْ جِهَةٍ أُخْرَى", "min jihatin ukhrā", "d'un autre côté", "من ناحية ثانية"),
  w("بِالإِضَافَةِ إِلَى ذَلِكَ", "bi-l-iḍāfati ilā dhālika", "en plus de cela", "زيادة على ذلك"),
  w("عَلَى كُلِّ حَالٍ", "ʿalā kulli ḥāl", "de toute façon", "مهما يكن"),
  w("لِهَذَا السَّبَبِ", "li-hādhā s-sabab", "pour cette raison", "لذلك"),

  w("حَالِيًّا", "ḥāliyyan", "actuellement", "الآن"),
  w("لَاحِقًا", "lāḥiqan", "plus tard", "في وقت بعد الآن"),
];

// ── التعبيرات · Expressions courantes ────────────────────────────────────
export const EXPRESSIONS = [
  w("السَّلَامُ عَلَيْكُمْ", "as-salāmu ʿalaykum", "Bonjour (que la paix soit sur vous)", "تحيّة عند اللقاء"),
  w("وَعَلَيْكُمُ السَّلَامُ", "wa ʿalaykumu s-salām", "Et sur vous la paix (réponse)", "ردّ التحيّة"),
  w("صَبَاحُ الخَيْرِ", "ṣabāḥu l-khayr", "Bonjour (le matin)", "تحيّة الصباح"),
  w("صَبَاحُ النُّورِ", "ṣabāḥu n-nūr", "Bonjour (réponse, le matin)", "ردّ تحيّة الصباح"),
  w("كَيْفَ حَالُكَ؟", "kayfa ḥāluka?", "Comment vas-tu ?", "سؤال عن الحال"),

  w("أَنَا بِخَيْرٍ", "anā bi-khayr", "Je vais bien", "حالي جيّدة"),
  w("الحَمْدُ لِلَّهِ", "al-ḥamdu lillāh", "Louange à Dieu (Dieu merci)", "شكر لله"),
  w("شُكْرًا", "shukran", "Merci", "كلمة شكر"),
  w("عَفْوًا", "ʿafwan", "De rien / pardon", "ردّ على الشكر"),
  w("مَعَ السَّلَامَةِ", "maʿa s-salāma", "Au revoir", "تحيّة عند الذهاب"),

  w("مَسَاءُ الخَيْرِ", "masāʾu l-khayr", "Bonsoir", "تحيّة المساء"),
  w("مَسَاءُ النُّورِ", "masāʾu n-nūr", "Bonsoir (réponse)", "ردّ تحيّة المساء"),
  w("مَرْحَبًا", "marḥaban", "Salut, bienvenue", "تحيّة ترحيب"),
  w("أَهْلًا وَسَهْلًا", "ahlan wa sahlan", "Bienvenue", "ترحيب بالضيف"),
  w("تُصْبِحُ عَلَى خَيْرٍ", "tuṣbiḥu ʿalā khayr", "Bonne nuit", "تحيّة قبل النوم"),

  w("شُكْرًا جَزِيلًا", "shukran jazīlan", "Merci beaucoup", "شكر كبير"),
  w("مِنْ فَضْلِكَ", "min faḍlika", "S'il te plaît", "للطلب بأدب"),
  w("تَفَضَّلْ", "tafaḍḍal", "Je t'en prie, vas-y", "للدعوة أو العرض"),
  w("أَنَا آسِفٌ", "anā āsif", "Je suis désolé", "للاعتذار"),
  w("لَا بَأْسَ", "lā baʾs", "Pas de souci, ce n'est pas grave", "لا مشكلة"),

  w("إِنْ شَاءَ اللهُ", "in shāʾa llāh", "Si Dieu le veut", "عند الحديث عن المستقبل"),
  w("مَا شَاءَ اللهُ", "mā shāʾa llāh", "Comme c'est beau ! (admiration)", "عند الإعجاب بشيء"),
  w("بِسْمِ اللهِ", "bismi llāh", "Au nom de Dieu (avant de commencer)", "قبل البدء بعمل"),
  w("سُبْحَانَ اللهِ", "subḥāna llāh", "Gloire à Dieu (étonnement)", "عند التعجّب"),
  w("جَزَاكَ اللهُ خَيْرًا", "jazāka llāhu khayran", "Que Dieu te récompense (merci)", "دعاء وشكر"),

  w("مَا اسْمُكَ؟", "mā-smuka?", "Comment t'appelles-tu ?", "سؤال عن الاسم"),
  w("تَشَرَّفْنَا", "tasharrafnā", "Enchanté", "عند التعارف"),
  w("مِنْ أَيْنَ أَنْتَ؟", "min ayna anta?", "D'où viens-tu ?", "سؤال عن البلد"),
  w("أَيْنَ تَسْكُنُ؟", "ayna taskun?", "Où habites-tu ?", "سؤال عن مكان السكن"),
  w("إِلَى اللِّقَاءِ", "ilā l-liqāʾ", "À bientôt", "عند الوداع"),

  w("لَا أَعْرِفُ", "lā aʿrif", "Je ne sais pas", "عكس أعرف"),
  w("لَا أَفْهَمُ", "lā afham", "Je ne comprends pas", "عكس أفهم"),
  w("أَعِدْ مِنْ فَضْلِكَ", "aʿid min faḍlik", "Répète, s'il te plaît", "طلب الإعادة"),
  w("بِبُطْءٍ مِنْ فَضْلِكَ", "bi-buṭʾin min faḍlik", "Lentement, s'il te plaît", "طلب الكلام ببطء"),
  w("هَلْ تَتَكَلَّمُ الفَرَنْسِيَّةَ؟", "hal tatakallamu l-faransiyya?", "Parles-tu français ?", "سؤال عن اللغة"),

  w("أَتَكَلَّمُ قَلِيلًا مِنَ العَرَبِيَّةِ", "atakallamu qalīlan mina l-ʿarabiyya", "Je parle un peu arabe", "معرفة بسيطة بالعربية"),
  w("كَمِ السَّاعَةُ؟", "kami s-sāʿa?", "Quelle heure est-il ?", "سؤال عن الوقت"),
  w("بِكَمْ هَذَا؟", "bikam hādhā?", "Combien ça coûte ?", "سؤال عن الثمن"),
  w("أَيْنَ الحَمَّامُ؟", "ayna l-ḥammām?", "Où sont les toilettes ?", "سؤال عن المكان"),
  w("لَحْظَةً مِنْ فَضْلِكَ", "laḥẓatan min faḍlik", "Un instant, s'il te plaît", "طلب الانتظار قليلًا"),

  w("مَبْرُوكٌ", "mabrūk", "Félicitations", "تهنئة"),
  w("اللهُ يُبَارِكُ فِيكَ", "allāhu yubāriku fīk", "Que Dieu te bénisse (réponse à mabrūk)", "ردّ التهنئة"),
  w("بِالتَّوْفِيقِ", "bi-t-tawfīq", "Bonne chance", "دعاء بالنجاح"),
  w("أَحْسَنْتَ", "aḥsanta", "Bravo, bien joué", "مدح على عمل جيّد"),
  w("سَلَامَتُكَ", "salāmatuk", "Prompt rétablissement", "دعاء للمريض"),

  w("بِالهَنَاءِ وَالشِّفَاءِ", "bi-l-hanāʾ wa sh-shifāʾ", "Bon appétit", "قبل الأكل أو بعده"),
  w("عِيدٌ مُبَارَكٌ", "ʿīdun mubārak", "Bonne fête (Aïd)", "تهنئة بالعيد"),
  w("رَمَضَانُ كَرِيمٌ", "ramaḍānu karīm", "Ramadan généreux (vœux)", "تهنئة برمضان"),
  w("كُلُّ عَامٍ وَأَنْتُمْ بِخَيْرٍ", "kullu ʿāmin wa antum bi-khayr", "Meilleurs vœux (chaque année)", "تهنئة بمناسبة سعيدة"),
  w("نَهَارُكَ سَعِيدٌ", "nahāruka saʿīd", "Bonne journée", "تمنّي يوم جميل"),

  w("لَا مُشْكِلَةَ", "lā mushkila", "Pas de problème", "كلّ شيء بخير"),
  w("لَا تَقْلَقْ", "lā taqlaq", "Ne t'inquiète pas", "طمأنة"),
  w("أَنَا مُوَافِقٌ", "anā muwāfiq", "Je suis d'accord", "قبول الرأي"),
  w("فِكْرَةٌ جَيِّدَةٌ", "fikratun jayyida", "Bonne idée", "رأي حسن"),
  w("هَيَّا بِنَا", "hayyā binā", "Allons-y", "دعوة للذهاب"),

  w("عَلَى فِكْرَةٍ", "ʿalā fikra", "Au fait", "لتذكّر شيء"),
  w("مَعَ الأَسَفِ", "maʿa l-asaf", "Malheureusement", "للتعبير عن الحزن"),
  w("يَا سَلَامُ!", "yā salām!", "Oh, génial ! / Incroyable !", "للتعجّب والإعجاب"),
  w("لَا شُكْرَ عَلَى وَاجِبٍ", "lā shukra ʿalā wājib", "Il n'y a pas de quoi", "ردّ على الشكر"),
  w("الجَوُّ جَمِيلٌ اليَوْمَ", "al-jawwu jamīlun l-yawm", "Il fait beau aujourd'hui", "وصف الطقس"),
];

/*
 * Assemble les leçons de 20 mots (5 par catégorie).
 * Les mots de liaison, moins nombreux, sont réutilisés cycliquement
 * (révision espacée intégrée). Renvoie un tableau de leçons.
 */
export function buildLessons() {
  const lessons = [];
  const nVerb = Math.floor(VERBS.length / 5);
  const nAdj = Math.floor(ADJECTIVES.length / 5);
  const nExp = Math.floor(EXPRESSIONS.length / 5);
  const total = Math.max(nVerb, nAdj, nExp);

  const pick = (arr, i) => {
    const out = [];
    for (let k = 0; k < 5; k++) out.push(arr[(i * 5 + k) % arr.length]);
    return out;
  };

  for (let i = 0; i < total; i++) {
    lessons.push({
      day: i + 1,
      words: [
        ...pick(VERBS, i).map((x) => ({ ...x, cat: "verb" })),
        ...pick(ADJECTIVES, i).map((x) => ({ ...x, cat: "adjective" })),
        ...pick(LINKING, i).map((x) => ({ ...x, cat: "linking" })),
        ...pick(EXPRESSIONS, i).map((x) => ({ ...x, cat: "expression" })),
      ],
    });
  }
  return lessons;
}

export const LESSONS = buildLessons();

export const STATS = {
  verbs: VERBS.length,
  adjectives: ADJECTIVES.length,
  linking: LINKING.length,
  expressions: EXPRESSIONS.length,
  get total() {
    return this.verbs + this.adjectives + this.linking + this.expressions;
  },
  lessons: LESSONS.length,
};
