// ✏️  Edit everything about the wedding here — in both English (en) and Hindi (hi).
// Items marked TODO are still placeholders.

export type L = { en: string; hi: string };

export const wedding = {
  groom: {
    name: { en: "Atul", hi: "अतुल" },
  },
  bride: {
    name: { en: "Rinki", hi: "रिंकी" },
  },

  /** Main wedding ceremony, local time (ISO 8601 with offset) — used by the countdown */
  date: "2027-02-16T19:00:00+05:30",
  dateLabel: { en: "16 February 2027", hi: "16 फ़रवरी 2027" },
  weekday: { en: "Tuesday", hi: "मंगलवार" },
  city: { en: "New Delhi", hi: "नई दिल्ली" },

  // TODO: exact venue name & address in Delhi
  venue: {
    name: { en: "The Royal Palace", hi: "द रॉयल पैलेस" },
    address: {
      en: "New Delhi, Delhi",
      hi: "नई दिल्ली, दिल्ली",
    },
    mapUrl: "https://maps.google.com/?q=New+Delhi",
  },

  rsvp: {
    deadline: { en: "31 January 2027", hi: "31 जनवरी 2027" },
    /** TODO: WhatsApp number in international format, digits only */
    whatsapp: "919999999999",
    phone: "+91 99999 99999",
  },

  events: [
    {
      key: "haldi",
      name: { en: "Haldi", hi: "हल्दी" },
      tagline: { en: "A splash of turmeric & blessings", hi: "हल्दी की रंगत, बड़ों का आशीर्वाद" },
      date: { en: "14 Feb 2027", hi: "14 फ़रवरी 2027" },
      time: { en: "10:00 AM", hi: "सुबह 10:00 बजे" },
      venue: { en: "Courtyard", hi: "प्रांगण" },
      dress: { en: "Shades of yellow", hi: "पीले रंग के परिधान" },
      image: "/images/events/haldi.webp",
      tone: "from-amber-300 via-yellow-400 to-amber-500",
    },
    {
      key: "mehndi",
      name: { en: "Mehndi", hi: "मेहंदी" },
      tagline: { en: "Henna, music & laughter", hi: "मेहंदी, गीत और ढेर सारी हँसी" },
      date: { en: "14 Feb 2027", hi: "14 फ़रवरी 2027" },
      time: { en: "4:00 PM", hi: "शाम 4:00 बजे" },
      venue: { en: "Garden Lawns", hi: "उद्यान लॉन" },
      dress: { en: "Greens & florals", hi: "हरे व फूलों वाले परिधान" },
      image: "/images/events/mehndi.webp",
      tone: "from-lime-500 via-emerald-600 to-emerald-800",
    },
    {
      key: "sangeet",
      name: { en: "Sangeet", hi: "संगीत" },
      tagline: { en: "An evening of song & dance", hi: "गीत और नृत्य से सजी एक शाम" },
      date: { en: "15 Feb 2027", hi: "15 फ़रवरी 2027" },
      time: { en: "7:30 PM", hi: "शाम 7:30 बजे" },
      venue: { en: "Durbar Hall", hi: "दरबार हॉल" },
      dress: { en: "Indo-western glam", hi: "इंडो-वेस्टर्न परिधान" },
      image: "/images/events/sangeet.webp",
      tone: "from-fuchsia-600 via-purple-700 to-indigo-900",
    },
    {
      key: "wedding",
      name: { en: "Wedding", hi: "विवाह" },
      tagline: { en: "Pheras under the stars", hi: "तारों की छाँव में सात फेरे" },
      date: { en: "16 Feb 2027", hi: "16 फ़रवरी 2027" },
      time: { en: "7:00 PM", hi: "शाम 7:00 बजे" },
      venue: { en: "The Royal Mandap", hi: "शाही मंडप" },
      dress: { en: "Traditional finery", hi: "पारंपरिक परिधान" },
      image: "/images/events/wedding.webp",
      tone: "from-rose-700 via-red-800 to-[#4a0a12]",
    },
  ],
} as const;

export type WeddingEvent = (typeof wedding.events)[number];

/** UI strings */
export const ui = {
  nav: {
    couple: { en: "Couple", hi: "वर-वधू" },
    events: { en: "Events", hi: "कार्यक्रम" },
    venue: { en: "Venue", hi: "स्थल" },
    rsvp: { en: "RSVP", hi: "उपस्थिति" },
  },
  monogram: { en: "A&R", hi: "अ&र" },
  shubhVivah: { en: "॥ Shubh Vivah ॥", hi: "॥ शुभ विवाह ॥" },
  withFamilies: { en: "Together with their families", hi: "परिवारजनों के आशीर्वाद सहित" },
  countdown: {
    title: { en: "Counting down to forever", hi: "शुभ घड़ी की प्रतीक्षा" },
    days: { en: "Days", hi: "दिन" },
    hours: { en: "Hours", hi: "घंटे" },
    minutes: { en: "Minutes", hi: "मिनट" },
    seconds: { en: "Seconds", hi: "सेकंड" },
  },
  couple: {
    eyebrow: { en: "Two hearts, one journey", hi: "दो दिल, एक सफ़र" },
    title: { en: "The Couple", hi: "वर-वधू" },
    groom: { en: "The Groom", hi: "वर" },
    bride: { en: "The Bride", hi: "वधू" },
    quote: {
      en: "Two souls, seven vows, one forever. We would be honoured to have you with us as we begin this beautiful journey.",
      hi: "दो आत्माएँ, सात वचन, जन्मों का साथ। इस सुंदर सफ़र की शुरुआत में आपकी उपस्थिति हमारा सौभाग्य होगी।",
    },
  },
  events: {
    eyebrow: { en: "Join the festivities", hi: "उत्सव में शामिल हों" },
    title: { en: "Wedding Events", hi: "मांगलिक कार्यक्रम" },
    time: { en: "Time", hi: "समय" },
    venue: { en: "Venue", hi: "स्थान" },
    dress: { en: "Dress", hi: "पोशाक" },
    swipe: { en: "Swipe to see all events", hi: "सभी कार्यक्रम देखने के लिए स्वाइप करें" },
  },
  venue: {
    eyebrow: { en: "Where the magic happens", hi: "जहाँ होगा यह शुभ मिलन" },
    title: { en: "The Venue", hi: "विवाह स्थल" },
    note: {
      en: "All ceremonies will be held at the venue in New Delhi. Parking and accommodation details will be shared closer to the date.",
      hi: "सभी कार्यक्रम नई दिल्ली स्थित विवाह स्थल पर ही आयोजित होंगे। पार्किंग एवं ठहरने की जानकारी समय नज़दीक आने पर साझा की जाएगी।",
    },
    directions: { en: "Get Directions", hi: "रास्ता देखें" },
  },
  rsvp: {
    eyebrow: { en: "Kindly respond", hi: "कृपया सूचित करें" },
    title: { en: "Will you join us?", hi: "क्या आप पधारेंगे?" },
    before: { en: "Your presence would make our celebration complete. Please let us know by", hi: "आपकी उपस्थिति से ही हमारा उत्सव पूर्ण होगा। कृपया" },
    after: { en: ".", hi: " तक सूचित करें।" },
    whatsapp: { en: "RSVP on WhatsApp", hi: "WhatsApp पर बताएँ" },
    call: { en: "Call Us", hi: "कॉल करें" },
    message: {
      en: `Hi! I'd love to attend the wedding of ${wedding.groom.name.en} & ${wedding.bride.name.en}.\nName:\nNumber of guests:\nEvents attending:`,
      hi: `नमस्ते! हम ${wedding.groom.name.hi} और ${wedding.bride.name.hi} के विवाह में सम्मिलित होंगे।\nनाम:\nमेहमानों की संख्या:\nकिन कार्यक्रमों में आएँगे:`,
    },
  },
  footer: {
    blessings: { en: "With love & blessings from both families", hi: "दोनों परिवारों के प्रेम एवं आशीर्वाद सहित" },
  },
  card: {
    download: { en: "Download Invitation (PDF)", hi: "निमंत्रण पत्र डाउनलोड करें (PDF)" },
    preparing: { en: "Preparing your card…", hi: "निमंत्रण पत्र तैयार हो रहा है…" },
    failed: { en: "Couldn't create the card. Please try again.", hi: "निमंत्रण पत्र नहीं बन सका। कृपया पुनः प्रयास करें।" },
    ganesh: { en: "|| Shri Ganeshaya Namah ||", hi: "॥ श्री गणेशाय नमः ॥" },
    invite: {
      en: "cordially invite you and your family to grace the wedding celebrations",
      hi: "के शुभ विवाह समारोह में आप सपरिवार सादर आमंत्रित हैं",
    },
    rsvp: { en: "Kindly respond by", hi: "कृपया सूचित करें" },
    mapHint: { en: "Tap here for directions on Google Maps", hi: "रास्ता देखने के लिए यहाँ टैप करें" },
  },
} as const;

/** Clickable destinations, shared by the website and the PDF card */
export const links = {
  map: wedding.venue.mapUrl,
  tel: `tel:${wedding.rsvp.phone.replace(/\s/g, "")}`,
  whatsapp: (lang: keyof L) =>
    `https://wa.me/${wedding.rsvp.whatsapp}?text=${encodeURIComponent(ui.rsvp.message[lang])}`,
};
