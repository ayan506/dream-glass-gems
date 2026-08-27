/**
 * Default DG Assistant knowledge base.
 *
 * Every entry is fully editable in the admin panel (Assistant tab) and stored in
 * the database, so these values are only the starting point.
 *
 * Placeholders available inside any answer:
 *   {phone}     - contractor mobile (first number in Contact)
 *   {phone2}    - second number, if any
 *   {whatsapp}  - WhatsApp number
 *   {hours}     - business hours line
 *   {address}   - studio address
 */
export type Faq = {
  id: string;
  /** Comma separated trigger keywords/phrases (any language/script). */
  tags: string;
  en: string;
  hi: string;
  hinglish: string;
};

export type AssistantSettings = {
  enabled: boolean;
  title: string;
  /** Opening message shown when the chat is first opened. */
  welcomeEn: string;
  welcomeHi: string;
  welcomeHinglish: string;
  /** Shown when nothing matches — must point to the contractor mobile. */
  fallbackEn: string;
  fallbackHi: string;
  fallbackHinglish: string;
  /** Quick-reply chips shown under the chat. */
  suggestions: string[];
  faqs: Faq[];
};

const f = (id: string, tags: string, en: string, hi: string, hinglish: string): Faq => ({
  id,
  tags,
  en,
  hi,
  hinglish,
});

export const DEFAULT_FAQS: Faq[] = [
  // ---- greetings & courtesy -------------------------------------------------
  f(
    "g1",
    "assalamualaikum, assalam u alaikum, salam, salaam, अस्सलामुअलैकुम, सलाम",
    "Walaikum Assalam! Welcome to Dream Glass Collection. How may I help you today — products, pricing or a site visit?",
    "वालेकुम अस्सलाम! ड्रीम ग्लास कलेक्शन में आपका स्वागत है। बताइए, मैं आपकी क्या मदद कर सकता हूँ — प्रोडक्ट, कीमत या साइट विज़िट?",
    "Walaikum Assalam! Dream Glass Collection me aapka swagat hai. Bataiye kya help chahiye — products, price ya site visit?",
  ),
  f(
    "g2",
    "namaste, namaskar, नमस्ते, नमस्कार, pranam",
    "Namaste! Welcome to Dream Glass Collection. Tell me what you're planning — railings, shower enclosure, facade or mirrors?",
    "नमस्ते! ड्रीम ग्लास कलेक्शन में आपका स्वागत है। बताइए आप क्या बनवाना चाहते हैं — रेलिंग, शॉवर एन्क्लोज़र, फसाड या मिरर?",
    "Namaste! Dream Glass Collection me aapka swagat hai. Bataiye kya plan kar rahe hain — railing, shower enclosure, facade ya mirror?",
  ),
  f(
    "g3",
    "hello, hi, hey, hii, hlo, gm, good morning, good evening, good afternoon",
    "Hello! I'm the DG Assistant. Ask me about products, prices, installation time or booking a site visit.",
    "नमस्ते! मैं DG असिस्टेंट हूँ। प्रोडक्ट, कीमत, इंस्टॉलेशन टाइम या साइट विज़िट के बारे में पूछिए।",
    "Hello! Main DG Assistant hoon. Products, price, installation time ya site visit ke baare me poochh sakte hain.",
  ),
  f(
    "g4",
    "kaise ho, kaise hain, how are you, kaisi ho, कैसे हो, कैसे हैं, kya haal hai",
    "I'm doing great, thank you for asking! How can I help you with your glass work today?",
    "मैं बिल्कुल ठीक हूँ, पूछने के लिए धन्यवाद! बताइए आपके ग्लास के काम में मैं क्या मदद करूँ?",
    "Main bilkul badhiya hoon, poochhne ke liye shukriya! Bataiye aapke glass ke kaam me kya help karun?",
  ),
  f(
    "g5",
    "thanks, thank you, shukriya, dhanyavad, धन्यवाद, thx",
    "Happy to help! Anything else you'd like to know?",
    "मदद करके खुशी हुई! और कुछ जानना चाहेंगे?",
    "Khushi hui help karke! Aur kuch janna chahenge?",
  ),
  f(
    "g6",
    "bye, goodbye, alvida, tata, khuda hafiz, फिर मिलते हैं",
    "Thank you for visiting Dream Glass Collection. Call {phone} whenever you're ready — have a great day!",
    "ड्रीम ग्लास कलेक्शन में आने के लिए धन्यवाद। जब भी तैयार हों {phone} पर कॉल करें — आपका दिन शुभ हो!",
    "Dream Glass Collection visit karne ke liye thanks. Jab bhi ready ho {phone} par call kijiye — have a great day!",
  ),

  // ---- company --------------------------------------------------------------
  f(
    "c1",
    "who are you, about, company, dream glass, kaun ho, आप कौन, kya karte ho, tumhara kaam",
    "Dream Glass Collection is a studio of designer glasses established in 2008 in Moradabad — railings, toughened glass, facades, partitions, shower enclosures, mirrors, ACP and skylights. 1000+ projects delivered.",
    "ड्रीम ग्लास कलेक्शन 2008 में मुरादाबाद में शुरू हुआ डिज़ाइनर ग्लास स्टूडियो है — रेलिंग, टफन्ड ग्लास, फसाड, पार्टिशन, शॉवर एन्क्लोज़र, मिरर, ACP और स्काईलाइट। 1000+ प्रोजेक्ट पूरे हुए हैं।",
    "Dream Glass Collection 2008 se Moradabad me designer glass studio hai — railing, toughened glass, facade, partition, shower enclosure, mirror, ACP aur skylight. 1000+ projects complete kiye hain.",
  ),
  f(
    "c2",
    "experience, kitne saal, how old, since when, kab se, अनुभव",
    "We've been in architectural glass since 2008 — 21+ years of hands-on fabrication and installation experience.",
    "हम 2008 से आर्किटेक्चरल ग्लास में हैं — 21+ साल का फैब्रिकेशन और इंस्टॉलेशन का अनुभव।",
    "Hum 2008 se architectural glass me hain — 21+ saal ka fabrication aur installation experience.",
  ),
  f(
    "c3",
    "timing, hours, open, kab khulta, समय, khula, closing time, sunday, holiday, chhutti",
    "We're open every day of the week, 10:00 AM to 8:00 PM.",
    "हम सप्ताह के सातों दिन खुले रहते हैं, सुबह 10:00 बजे से रात 8:00 बजे तक।",
    "Hum hafte ke saaton din khule rehte hain, subah 10:00 AM se raat 8:00 PM tak.",
  ),
  f(
    "c4",
    "address, location, where, kahan, पता, shop, studio, showroom, office",
    "Our studio is at {address}. You'll find a map at the bottom of this page — or call {phone} for directions.",
    "हमारा स्टूडियो {address} में है। इस पेज के नीचे मैप दिया है — या {phone} पर कॉल करके रास्ता पूछ लें।",
    "Hamara studio {address} me hai. Page ke neeche map diya hai — ya {phone} par call karke rasta poochh lijiye.",
  ),
  f(
    "c5",
    "contact, phone, number, call, mobile, संपर्क, नंबर, baat karni hai, talk to owner",
    "You can reach us directly on {phone} (also {phone2}). WhatsApp: {whatsapp}.",
    "आप हमसे सीधे {phone} पर बात कर सकते हैं (या {phone2})। व्हाट्सएप: {whatsapp}।",
    "Aap direct {phone} par baat kar sakte hain (ya {phone2}). WhatsApp: {whatsapp}.",
  ),
  f(
    "c6",
    "whatsapp, wa, व्हाट्सएप",
    "WhatsApp us on {whatsapp} — send your site photos and measurements and we'll revert with an estimate.",
    "{whatsapp} पर व्हाट्सएप करें — साइट की फोटो और नाप भेजिए, हम अनुमानित कीमत भेज देंगे।",
    "{whatsapp} par WhatsApp kijiye — site ki photo aur measurement bhejiye, hum estimate bhej denge.",
  ),

  // ---- products -------------------------------------------------------------
  f(
    "p1",
    "products, what do you sell, catalogue, items, categories, kya milta hai, प्रोडक्ट, सामान",
    "Ten categories: Railings, Toughened Glass, Facades, Partitions, Shower Enclosures, Decorative Glass, ACP, Mirrors, Staircases and Skylights. Scroll to Our Products to browse them.",
    "दस श्रेणियाँ: रेलिंग, टफन्ड ग्लास, फसाड, पार्टिशन, शॉवर एन्क्लोज़र, डेकोरेटिव ग्लास, ACP, मिरर, स्टेयरकेस और स्काईलाइट। 'Our Products' सेक्शन में देखिए।",
    "Das categories: Railing, Toughened Glass, Facade, Partition, Shower Enclosure, Decorative Glass, ACP, Mirror, Staircase aur Skylight. 'Our Products' section me dekhiye.",
  ),
  f(
    "p2",
    "railing, balcony railing, glass railing, रेलिंग, sidhi railing, handrail",
    "We build frameless balcony and staircase railings in 12mm toughened glass with SS spigots or base channel, with optional wooden or steel handrails.",
    "हम 12mm टफन्ड ग्लास में फ्रेमलेस बालकनी और सीढ़ी रेलिंग बनाते हैं — SS स्पिगॉट या बेस चैनल के साथ, लकड़ी/स्टील हैंडरेल का विकल्प भी है।",
    "Hum 12mm toughened glass me frameless balcony aur staircase railing banate hain — SS spigot ya base channel ke saath, wooden/steel handrail optional.",
  ),
  f(
    "p3",
    "shower, enclosure, bathroom glass, शॉवर, बाथरूम, cubicle, partition bathroom",
    "Frameless shower enclosures in 10mm toughened glass with premium gold, black or chrome hardware — made to your exact bathroom measurement.",
    "10mm टफन्ड ग्लास के फ्रेमलेस शॉवर एन्क्लोज़र — गोल्ड, ब्लैक या क्रोम हार्डवेयर के साथ, आपके बाथरूम की सटीक नाप पर।",
    "10mm toughened glass ke frameless shower enclosure — gold, black ya chrome hardware ke saath, aapke bathroom ki exact measurement par.",
  ),
  f(
    "p4",
    "facade, curtain wall, structural glazing, spider, फसाड, elevation glass, building glass",
    "Structural glass facades, curtain walls and spider glazing for commercial buildings — engineered drawings, certified glass and high-rise installation teams.",
    "कमर्शियल बिल्डिंग के लिए स्ट्रक्चरल ग्लास फसाड, कर्टेन वॉल और स्पाइडर ग्लेज़िंग — इंजीनियर्ड ड्रॉइंग, सर्टिफाइड ग्लास और हाई-राइज़ इंस्टॉलेशन टीम।",
    "Commercial buildings ke liye structural glass facade, curtain wall aur spider glazing — engineered drawing, certified glass aur high-rise installation team.",
  ),
  f(
    "p5",
    "partition, office glass, cabin, acoustic, पार्टिशन, office cabin",
    "Slim-profile office partitions in single or double glazed acoustic glass, with optional blinds, frosted film and glass doors.",
    "स्लिम प्रोफाइल ऑफिस पार्टिशन — सिंगल या डबल ग्लेज़्ड अकॉस्टिक ग्लास, ब्लाइंड्स, फ्रॉस्टेड फिल्म और ग्लास डोर के विकल्प के साथ।",
    "Slim profile office partition — single ya double glazed acoustic glass, blinds, frosted film aur glass door option ke saath.",
  ),
  f(
    "p6",
    "mirror, led mirror, mirrors, शीशा, आईना, dressing mirror, backlit",
    "Custom mirrors — backlit LED, anti-fog, antique, bevelled and any shape you need for bathrooms, dressing areas or feature walls.",
    "कस्टम मिरर — बैकलिट LED, एंटी-फॉग, एंटीक, बेवल्ड और किसी भी शेप में, बाथरूम, ड्रेसिंग एरिया या फीचर वॉल के लिए।",
    "Custom mirror — backlit LED, anti-fog, antique, bevelled aur kisi bhi shape me — bathroom, dressing area ya feature wall ke liye.",
  ),
  f(
    "p7",
    "acp, cladding, aluminium composite, elevation, signage, एसीपी",
    "Fire-rated ACP cladding for elevations, grooved panels and signage — supplied and installed with concealed framing.",
    "एलिवेशन के लिए फायर-रेटेड ACP क्लैडिंग, ग्रूव्ड पैनल और साइनेज — कंसील्ड फ्रेमिंग के साथ सप्लाई और इंस्टॉलेशन।",
    "Elevation ke liye fire-rated ACP cladding, grooved panel aur signage — concealed framing ke saath supply aur installation.",
  ),
  f(
    "p8",
    "toughened, tempered, safety glass, thickness, mm, टफन्ड, motai",
    "We supply toughened safety glass from 6mm to 19mm, edge polished and cut to your drawing — with heat-soak tested options.",
    "हम 6mm से 19mm तक टफन्ड सेफ्टी ग्लास देते हैं — एज पॉलिश्ड, आपकी ड्रॉइंग के अनुसार कटिंग और हीट-सोक टेस्टेड विकल्प के साथ।",
    "Hum 6mm se 19mm tak toughened safety glass dete hain — edge polished, aapki drawing ke hisaab se cutting aur heat-soak tested option ke saath.",
  ),
  f(
    "p9",
    "skylight, canopy, roof glass, स्काईलाइट, canopy glass",
    "Laminated glass skylights and canopies — weather sealed, with structural support and drainage detailing.",
    "लैमिनेटेड ग्लास स्काईलाइट और कैनोपी — वेदर सील्ड, स्ट्रक्चरल सपोर्ट और ड्रेनेज डिटेलिंग के साथ।",
    "Laminated glass skylight aur canopy — weather sealed, structural support aur drainage detailing ke saath.",
  ),
  f(
    "p10",
    "decorative, fluted, frosted, back painted, design glass, डेकोरेटिव, डिज़ाइन ग्लास",
    "Decorative glass — fluted, frosted, lacquered/back-painted, tinted and custom art glass for feature walls and doors.",
    "डेकोरेटिव ग्लास — फ्लूटेड, फ्रॉस्टेड, लैकर्ड/बैक-पेंटेड, टिंटेड और कस्टम आर्ट ग्लास, फीचर वॉल और दरवाज़ों के लिए।",
    "Decorative glass — fluted, frosted, lacquered/back-painted, tinted aur custom art glass, feature wall aur doors ke liye.",
  ),
  f(
    "p11",
    "staircase, stairs glass, सीढ़ी, staircase railing",
    "Staircase glass railings with clamps or base channel and a wooden or SS handrail — designed to match your stair profile.",
    "सीढ़ी की ग्लास रेलिंग — क्लैंप या बेस चैनल और लकड़ी/SS हैंडरेल के साथ, आपकी सीढ़ी के प्रोफाइल के अनुसार।",
    "Staircase glass railing — clamp ya base channel aur wooden/SS handrail ke saath, aapki stairs ke profile ke hisaab se.",
  ),
  f(
    "p12",
    "glass door, sliding door, patch fitting, दरवाजा, door",
    "Toughened glass doors — sliding, patch-fitted or floor-spring hinged, with a wide choice of handles and locks.",
    "टफन्ड ग्लास डोर — स्लाइडिंग, पैच फिटिंग या फ्लोर स्प्रिंग वाले, हैंडल और लॉक की कई वैरायटी के साथ।",
    "Toughened glass door — sliding, patch fitting ya floor spring wale, handle aur lock ki kaafi variety ke saath.",
  ),

  // ---- commercial -----------------------------------------------------------
  f(
    "q1",
    "price, rate, cost, kitna, kimat, कीमत, दाम, charge, quotation, quote, estimate, budget",
    "Pricing depends on glass thickness, hardware and total area, so we quote after a measurement. Share your size on WhatsApp {whatsapp} or call {phone} for a same-day estimate after a site visit.",
    "कीमत ग्लास की मोटाई, हार्डवेयर और कुल एरिया पर निर्भर करती है, इसलिए नाप के बाद ही सही रेट बताते हैं। {whatsapp} पर साइज़ भेजें या {phone} पर कॉल करें — साइट विज़िट के बाद सही रेट बताया जाता है।",
    "Price glass ki thickness, hardware aur total area par depend karta hai, isliye measurement ke baad hi exact rate batate hain. {whatsapp} par size bhejiye ya {phone} par call kijiye — site visit ke baad exact rate batate hain.",
  ),
  f(
    "q2",
    "free quote, get quote, form, enquiry, quotation form, muft",
    "Fill the Get Free Quote form on this page with your name, mobile and requirement — our team calls back the same day.",
    "इस पेज पर 'Get Free Quote' फॉर्म भरें — नाम, मोबाइल और ज़रूरत लिखें, हमारी टीम उसी दिन कॉल करेगी।",
    "Is page par 'Get Free Quote' form bhariye — naam, mobile aur requirement likhiye, hamari team usi din call karegi.",
  ),
  f(
    "q3",
    "site visit, survey, measurement, naap, visit, माप, सर्वे, inspection",
    "Site visit and measurement can be booked on {phone} and we'll schedule a visit at your convenience.",
    "साइट विज़िट और माप के लिए {phone} पर बुक करें, आपकी सुविधा के अनुसार विज़िट तय कर देंगे।",
    "Site visit aur measurement ke liye {phone} par book kijiye, aapki convenience se visit schedule kar denge.",
  ),
  f(
    "q4",
    "time, how long, duration, kitne din, delivery, kab tak, समय लगेगा, lead time",
    "Typical residential work is completed in 5–10 days after measurement; large facades run on a project schedule shared with you upfront.",
    "आमतौर पर घरेलू काम नाप के बाद 5–10 दिन में पूरा होता है; बड़े फसाड प्रोजेक्ट का शेड्यूल पहले ही साझा कर दिया जाता है।",
    "Normally residential kaam measurement ke baad 5–10 din me complete hota hai; bade facade projects ka schedule pehle hi share kar dete hain.",
  ),
  f(
    "q5",
    "warranty, guarantee, garanti, वारंटी, after sales, service",
    "Toughened glass and hardware carry the manufacturer warranty, and our installation is covered by after-care support — call {phone} anytime for service.",
    "टफन्ड ग्लास और हार्डवेयर पर निर्माता की वारंटी होती है, और हमारी इंस्टॉलेशन पर आफ्टर-केयर सपोर्ट मिलता है — सर्विस के लिए {phone} पर कॉल करें।",
    "Toughened glass aur hardware par manufacturer warranty hoti hai, aur installation par after-care support milta hai — service ke liye {phone} par call kijiye.",
  ),
  f(
    "q6",
    "payment, advance, emi, cash, upi, online payment, भुगतान, paise",
    "We work on an advance with the balance on completion. Cash, UPI, cheque and bank transfer are all accepted — details are confirmed with your quotation.",
    "हम एडवांस लेकर काम शुरू करते हैं और बाकी भुगतान काम पूरा होने पर। कैश, UPI, चेक और बैंक ट्रांसफर स्वीकार हैं — पूरी जानकारी कोटेशन के साथ दी जाती है।",
    "Hum advance lekar kaam start karte hain, baaki payment kaam complete hone par. Cash, UPI, cheque aur bank transfer accepted hain — details quotation ke saath milti hain.",
  ),
  f(
    "q7",
    "installation, fitting, labour, install, फिटिंग, इंस्टॉलेशन, mistri",
    "Installation is done by our own trained in-house teams — no third-party contractors — including high-rise and villa sites.",
    "इंस्टॉलेशन हमारी अपनी ट्रेंड इन-हाउस टीम करती है — कोई थर्ड-पार्टी ठेकेदार नहीं — हाई-राइज़ और विला साइट्स सहित।",
    "Installation hamari apni trained in-house team karti hai — koi third-party contractor nahi — high-rise aur villa sites bhi.",
  ),
  f(
    "q8",
    "area, city, deliver, service area, moradabad, delhi, noida, ncr, kahan kaam, outstation",
    "We serve Moradabad and across Uttar Pradesh and Delhi NCR, and take up large projects elsewhere in India. Call {phone} to confirm your location.",
    "हम मुरादाबाद, पूरे उत्तर प्रदेश और दिल्ली NCR में सेवा देते हैं, और भारत में कहीं भी बड़े प्रोजेक्ट लेते हैं। अपनी लोकेशन के लिए {phone} पर कॉल करें।",
    "Hum Moradabad, poore Uttar Pradesh aur Delhi NCR me service dete hain, aur India me kahin bhi bade projects lete hain. Apni location confirm karne ke liye {phone} par call kijiye.",
  ),
  f(
    "q9",
    "sample, showroom visit, dekhna hai, demo, catalog, brochure, pdf, download",
    "You can download our brochure from the Brochure section on this page, or visit the studio to see live samples of glass and hardware.",
    "आप इस पेज के ब्रोशर सेक्शन से हमारा ब्रोशर डाउनलोड कर सकते हैं, या स्टूडियो आकर ग्लास और हार्डवेयर के सैंपल देख सकते हैं।",
    "Aap is page ke Brochure section se brochure download kar sakte hain, ya studio aakar glass aur hardware ke samples dekh sakte hain.",
  ),
  f(
    "q10",
    "gallery, photos, work, portfolio, projects, तस्वीरें, kaam dekhna",
    "Scroll to the Gallery section to see our completed designer glass and mirror work, and the Projects section for larger installations.",
    "हमारे पूरे किए गए डिज़ाइनर ग्लास और मिरर के काम के लिए Gallery सेक्शन देखें, और बड़े इंस्टॉलेशन के लिए Projects सेक्शन।",
    "Complete kiye gaye designer glass aur mirror work ke liye Gallery section dekhiye, aur bade installations ke liye Projects section.",
  ),
  f(
    "q11",
    "custom, made to order, special design, apni design, कस्टम, own design",
    "Yes — everything is made to order. Send your drawing or a reference photo and we'll fabricate to that exact design.",
    "जी हाँ — सब कुछ ऑर्डर पर बनता है। अपनी ड्रॉइंग या रेफरेंस फोटो भेजिए, हम उसी डिज़ाइन में बना देंगे।",
    "Ji haan — sab kuch order par banta hai. Apni drawing ya reference photo bhejiye, hum usi design me bana denge.",
  ),
  f(
    "q12",
    "safety, is glass safe, bachche, kids, break, टूटना, strength",
    "We use toughened safety glass, which is 4–5× stronger than normal glass and crumbles into blunt granules instead of sharp shards — safe for homes with children.",
    "हम टफन्ड सेफ्टी ग्लास इस्तेमाल करते हैं, जो सामान्य कांच से 4–5 गुना मजबूत है और टूटने पर नुकीले टुकड़ों की जगह छोटे दाने बनते हैं — बच्चों वाले घरों के लिए सुरक्षित।",
    "Hum toughened safety glass use karte hain, jo normal glass se 4–5 guna strong hai aur tootne par sharp tukdon ki jagah chhote granules banta hai — bachchon wale ghar ke liye safe.",
  ),
  f(
    "q13",
    "maintenance, cleaning, saaf, care, scratch, spots, हार्ड वाटर",
    "Clean with a soft cloth and mild glass cleaner; avoid abrasive pads. For hard-water spots we can apply a nano coating on request.",
    "मुलायम कपड़े और हल्के ग्लास क्लीनर से साफ करें; खुरदरे स्क्रब का इस्तेमाल न करें। हार्ड वाटर के दाग के लिए हम नैनो कोटिंग भी कर सकते हैं।",
    "Soft cloth aur mild glass cleaner se saaf kijiye; abrasive scrub avoid kijiye. Hard water spots ke liye hum nano coating bhi kar dete hain.",
  ),
  f(
    "q14",
    "repair, replace, broken, toot gaya, crack, टूट गया, damage",
    "We handle glass replacement and repair too. Send a photo on WhatsApp {whatsapp} or call {phone} and we'll arrange a quick site check.",
    "हम ग्लास रिप्लेसमेंट और रिपेयर भी करते हैं। {whatsapp} पर फोटो भेजें या {phone} पर कॉल करें, हम जल्दी साइट चेक करा देंगे।",
    "Hum glass replacement aur repair bhi karte hain. {whatsapp} par photo bhejiye ya {phone} par call kijiye, jaldi site check karwa denge.",
  ),
  f(
    "q15",
    "offer, discount, sale, scheme, छूट, ऑफर, chhoot",
    "Current offers are listed near the top of this page. For a personalised discount on a larger order, speak to our team on {phone}.",
    "मौजूदा ऑफर इस पेज के ऊपर दिए गए हैं। बड़े ऑर्डर पर विशेष छूट के लिए {phone} पर हमारी टीम से बात करें।",
    "Current offers is page ke upar diye gaye hain. Bade order par special discount ke liye {phone} par team se baat kijiye.",
  ),
  f(
    "q16",
    "emergency, urgent, jaldi, turant, asap, fast",
    "For urgent requirements call {phone} directly — we prioritise emergency replacements and short-deadline sites.",
    "अर्जेंट काम के लिए सीधे {phone} पर कॉल करें — हम इमरजेंसी रिप्लेसमेंट और कम समय वाली साइटों को प्राथमिकता देते हैं।",
    "Urgent kaam ke liye seedha {phone} par call kijiye — hum emergency replacement aur short-deadline sites ko priority dete hain.",
  ),
  f(
    "q17",
    "bulk, builder, dealer, contractor, wholesale, project rate, thok",
    "We work regularly with builders, architects and contractors on project rates. Call {phone} to discuss volumes and terms.",
    "हम बिल्डर्स, आर्किटेक्ट्स और ठेकेदारों के साथ प्रोजेक्ट रेट पर नियमित काम करते हैं। मात्रा और शर्तों के लिए {phone} पर कॉल करें।",
    "Hum builders, architects aur contractors ke saath project rate par regular kaam karte hain. Volume aur terms discuss karne ke liye {phone} par call kijiye.",
  ),
  f(
    "q18",
    "review, testimonial, rating, feedback, samiksha, kaisa kaam",
    "Client reviews are shown in the testimonials section of this page — with real ratings from architects, project heads and homeowners.",
    "क्लाइंट रिव्यू इस पेज के टेस्टिमोनियल सेक्शन में दिए गए हैं — आर्किटेक्ट, प्रोजेक्ट हेड और घर मालिकों की असली रेटिंग के साथ।",
    "Client reviews is page ke testimonial section me hain — architects, project heads aur homeowners ki real ratings ke saath.",
  ),
  f(
    "q19",
    "job, vacancy, hiring, naukri, career, work with you",
    "For work or partnership enquiries, please call {phone} during business hours and ask for the studio manager.",
    "काम या साझेदारी के लिए कार्य समय में {phone} पर कॉल करके स्टूडियो मैनेजर से बात करें।",
    "Kaam ya partnership ke liye business hours me {phone} par call karke studio manager se baat kijiye.",
  ),
  f(
    "q20",
    "gst, bill, invoice, tax, receipt, बिल",
    "Yes, we provide a proper GST invoice for every order.",
    "जी हाँ, हर ऑर्डर पर पूरी GST बिल दी जाती है।",
    "Ji haan, har order par proper GST invoice diya jata hai.",
  ),
  f(
    "q21",
    "double glazed, dgu, insulated, soundproof, awaz, noise",
    "Double glazed (DGU) units cut outside noise and heat significantly — ideal for bedrooms facing roads and for offices.",
    "डबल ग्लेज़्ड (DGU) यूनिट बाहर का शोर और गर्मी काफी कम कर देती है — सड़क की तरफ के बेडरूम और ऑफिस के लिए बेहतरीन।",
    "Double glazed (DGU) unit bahar ka noise aur heat kaafi kam karti hai — road facing bedroom aur office ke liye best.",
  ),
  f(
    "q22",
    "color, tint, shade, rang, रंग, options",
    "Glass is available clear, tinted (grey, bronze, blue, green), frosted, reflective and lacquered in almost any colour.",
    "ग्लास क्लियर, टिंटेड (ग्रे, ब्रॉन्ज़, ब्लू, ग्रीन), फ्रॉस्टेड, रिफ्लेक्टिव और लगभग किसी भी रंग में लैकर्ड मिलता है।",
    "Glass clear, tinted (grey, bronze, blue, green), frosted, reflective aur almost kisi bhi colour me lacquered milta hai.",
  ),
  f(
    "q23",
    "hardware, spigot, clamp, fitting brand, ss, stainless",
    "We use imported SS-316 spigots, clamps and patch fittings suited to Indian weather, with gold, black, satin and chrome finishes.",
    "हम भारतीय मौसम के अनुकूल इम्पोर्टेड SS-316 स्पिगॉट, क्लैंप और पैच फिटिंग इस्तेमाल करते हैं — गोल्ड, ब्लैक, साटिन और क्रोम फिनिश में।",
    "Hum Indian weather ke hisaab se imported SS-316 spigot, clamp aur patch fitting use karte hain — gold, black, satin aur chrome finish me.",
  ),
  f(
    "q24",
    "help, support, madad, sahayata, kya kar sakte ho",
    "I can help with products, pricing guidance, timelines, site visits and contact details. What would you like to know?",
    "मैं प्रोडक्ट, कीमत की जानकारी, समय, साइट विज़िट और संपर्क में मदद कर सकता हूँ। आप क्या जानना चाहेंगे?",
    "Main products, pricing guidance, timeline, site visit aur contact details me help kar sakta hoon. Aap kya janna chahenge?",
  ),
];

export const DEFAULT_ASSISTANT: AssistantSettings = {
  enabled: true,
  title: "DG Assistant",
  welcomeEn:
    "Hello! I'm the DG Assistant. Ask me about products, prices, timelines or booking a site visit.",
  welcomeHi:
    "नमस्ते! मैं DG असिस्टेंट हूँ। प्रोडक्ट, कीमत, समय या साइट विज़िट के बारे में पूछिए।",
  welcomeHinglish:
    "Hello! Main DG Assistant hoon. Products, price, timeline ya site visit ke baare me poochhiye.",
  fallbackEn:
    "I don't have that answer yet. Please call our contractor directly on {phone} — the team will help you right away. (WhatsApp: {whatsapp})",
  fallbackHi:
    "इसका जवाब मेरे पास अभी नहीं है। कृपया हमारे ठेकेदार को सीधे {phone} पर कॉल करें — टीम तुरंत मदद करेगी। (व्हाट्सएप: {whatsapp})",
  fallbackHinglish:
    "Iska jawab abhi mere paas nahi hai. Please hamare contractor ko direct {phone} par call kijiye — team turant help karegi. (WhatsApp: {whatsapp})",
  suggestions: ["Products", "Price", "Timing", "Site visit", "Contact"],
  faqs: DEFAULT_FAQS,
};
