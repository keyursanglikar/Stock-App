import { useState } from 'react';
import { 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Building, 
  CheckCircle2, 
  Zap, 
  Clock, 
  MessageSquare,
  BarChart3,
  Smartphone,
  ScanLine,
  RefreshCw,
  Award
} from 'lucide-react';

const content = {
  en: {
    badge: '100% Free Forever • Multi-Language • Powered by Gemini AI',
    titleMain: 'India’s #1 Smart Stock & Expiry Manager with',
    titleHighlight: 'Gemini AI Vision',
    desc: 'Eliminate stock expiry loss and manual billing hassles. Instant batch tracking, camera AI packaging scan, multi-lingual support, and high-speed POS billing tailored for Kiranas, Medical stores, and Retailers.',
    downloadApk: 'Download APK (v1.0 Free)',
    downloadSub: 'Direct Android APK • No Google Play needed',
    callNow: 'Call 9518721792',
    waInquiry: 'WhatsApp Inquiry',
    freePoint1: 'Zero Monthly or Annual Charges — 100% Free SaaS',
    freePoint2: 'Offline-Ready SQLite sync with secure cloud backup',
    freePoint3: 'Live Camera packaging reading powered by Google Gemini',
    
    // Stats
    stat1Val: '100%', stat1Lbl: 'Free for SMBs',
    stat2Val: '0 Sec', stat2Lbl: 'Offline POS Billing',
    stat3Val: '99.4%', stat3Lbl: 'AI Vision Accuracy',
    stat4Val: '3 Languages', stat4Lbl: 'English, मराठी, हिन्दी',

    // Features
    featTag: 'POWERFUL RETAIL ENGINE',
    featTitle: 'Everything Your Shop Needs to Grow',
    featSub: 'Designed specifically for the fast-paced daily workflow of Indian retail shops.',
    f1Title: 'Gemini AI Packaging Vision',
    f1Desc: 'Scan carton labels and wholesale invoices with your phone camera. Gemini AI extracts batch numbers, expiry dates, and MRP in 2 seconds.',
    f2Title: 'FEFO Expiry Shield',
    f2Desc: 'Automated First-Expiring, First-Out picking alerts ensure older stock is sold before it expires, saving thousands in inventory loss.',
    f3Title: 'Superfast POS & WhatsApp Bills',
    f3Desc: 'Scan barcodes or search items with single-tap quick billing. Generate GST/Non-GST thermal bills and share receipts directly to customer WhatsApp.',
    f4Title: 'Marathi, Hindi & English UI',
    f4Desc: 'Seamless one-tap language switching so your counter staff, helpers, and shop owners can operate comfortably in their preferred language.',
    f5Title: 'Multi-Store & Role Security',
    f5Desc: 'Secure multi-tenant data architecture. Manage multiple godowns or branches with strict owner vs cashier permission controls.',
    f6Title: 'Audit-Safe Stock Ledger',
    f6Desc: 'Every stock movement, sale, return, and wastage is recorded in an immutable double-entry ledger with real-time profit tracking.',

    // Regional
    langTitle: 'Proudly Supporting Regional Indian Languages',
    langDesc: 'Built with pride for merchants across Maharashtra and India. Switch between English, Marathi, and Hindi seamlessly anytime in the app.',
    
    // Company
    devTag: 'OFFICIAL DEVELOPER & IT PARTNER',
    devTitle: 'Softgenix IT Solutions (Satara)',
    devDesc: 'We create high-performance web, mobile, and AI solutions to empower modern businesses. For custom enterprise software, mobile apps, or cloud integrations, reach out to Keyur Sanglikar directly.',
    founder: 'Keyur Sanglikar',
    founderRole: 'Founder & Lead Software Architect',
    address: 'Pratap Ganj Peth, Satara, Maharashtra 415002',
    phone: '+91 9518721792'
  },
  mr: {
    badge: '१००% मोफत ॲप • मराठी भाषा सपोर्ट • जेमिनी AI समर्थित',
    titleMain: 'किराणा व मेडिकल दुकानांसाठी आधुनिक स्टॉक व',
    titleHighlight: 'जेमिनी AI स्कॅनर',
    desc: 'मालाची मुदत संपल्यामुळे होणारे नुकसान पूर्णपणे थांबवा. मोबाईल कॅमेरा AI बिल स्कॅनर, बॅच व एक्सपायरी ट्रॅकिंग, मराठी भाषा आणि झटपट बिलिंग.',
    downloadApk: 'मोफत अँड्रॉइड APK डाउनलोड करा',
    downloadSub: 'थेट अँड्रॉइड APK • प्लेस्टोअरची गरज नाही',
    callNow: 'कॉल करा: 9518721792',
    waInquiry: 'व्हॉट्सॲप मेसेज करा',
    freePoint1: 'कोणतेही मासिक शुल्क नाही — १००% मोफत ॲप',
    freePoint2: 'इंटरनेट नसतानाही चालणारे ऑफलाइन सिंक',
    freePoint3: 'गुगल जेमिनी AI द्वारे ऑटोमॅटिक बिल वाचन',

    // Stats
    stat1Val: '१००%', stat1Lbl: 'कायमस्वरूपी मोफत',
    stat2Val: '० सेकंद', stat2Lbl: 'ऑफलाइन फास्ट बिलिंग',
    stat3Val: '९९.४%', stat3Lbl: 'AI अचूकता',
    stat4Val: '३ भाषा', stat4Lbl: 'मराठी, हिन्दी, English',

    // Features
    featTag: 'व्यापाऱ्यांसाठी खास फीचर्स',
    featTitle: 'तुमच्या दुकानाचा कारभार करा सुलभ व डिजिटल',
    featSub: 'सातारा, महाराष्ट्र आणि संपूर्ण भारतातील किरकोळ व घाऊक व्यापाऱ्यांसाठी बनवलेले ॲप.',
    f1Title: 'कॅमेरा AI बिल वाचन',
    f1Desc: 'खरेदी बिल किंवा बॉक्सवर कॅमेरा धरा. जेमिनी AI लगेच बॅच नंबर, एक्सपायरी तारीख आणि किंमत भरून घेते.',
    f2Title: 'एक्सपायरी अलर्ट व बचत',
    f2Desc: 'ज्या मालाची एक्सपायरी जवळ आली आहे तो आधी विकला जातो, ज्यामुळे मालाचे नुकसान टळते.',
    f3Title: 'झटपट बिलिंग व व्हॉट्सॲप पावती',
    f3Desc: 'बारकोड स्कॅन करा आणि काही सेकंदात पक्के बिल ग्राहकांच्या व्हॉट्सॲपवर पाठवा.',
    f4Title: 'मराठी, हिंदी व इंग्रजी',
    f4Desc: 'दुकानातील कोणालाही चालवता यावे यासाठी एका क्लिकवर मराठी किंवा हिंदी भाषा बदला.',
    f5Title: 'सुरक्षित डेटा व बॅकअप',
    f5Desc: 'तुमचा सर्व स्टॉक डेटा सुरक्षित आणि क्लाउडवर सुरक्षित बॅकअप केलेला राहतो.',
    f6Title: 'दररोजचा हिशोब व नफा',
    f6Desc: 'कोणता माल किती विकला गेला आणि किती नफा झाला याचा रोजचा तपशील सहज मिळतो.',

    // Regional
    langTitle: 'आपल्या हक्काच्या मराठी भाषेत उपलब्ध',
    langDesc: 'दुकानातील कामगार किंवा मदतनीस कोणालाही सहज वापरता यावे यासाठी ॲपमध्ये मराठी भाषा सपोर्ट देण्यात आला आहे.',

    // Company
    devTag: 'अधिकृत डेव्हलपर व तंत्रज्ञान भागीदार',
    devTitle: 'सॉफ्टजेनिक्स आयटी सोल्युशन्स (सातारा)',
    devDesc: 'स्थानिक भारतीय व्यापाऱ्यांना आधुनिक तंत्रज्ञानाने सक्षम बनवण्यासाठी आम्ही कटिबद्ध आहोत. नवीन सॉफ्टवेअर किंवा ॲप बनवण्यासाठी संपर्क करा.',
    founder: 'केयूर सांगलीकर',
    founderRole: 'संस्थापक व मुख्य तंत्रज्ञान अधिकारी',
    address: 'प्रताप गंज पेठ, सातारा, महाराष्ट्र ४१५००२',
    phone: '+91 9518721792'
  },
  hi: {
    badge: '100% फ्री ऍप • हिंदी और मराठी सपोर्ट • जेमिनी AI समर्थित',
    titleMain: 'किराना और मेडिकल के लिए स्मार्ट स्टॉक व',
    titleHighlight: 'जेमिनी AI स्कैनर',
    desc: 'एक्सपायरी का नुकसान रोकें और तेज बिलिंग करें। ऑटोमैटिक बैच ट्रैकिंग, कैमरा AI बिल स्कैनर, हिंदी सपोर्ट और आसान बिलिंग।',
    downloadApk: 'मुफ्त एंड्रॉइड APK डाउनलोड करें',
    downloadSub: 'डायरेक्ट एंड्रॉइड APK • प्लेस्टोर की आवश्यकता नहीं',
    callNow: 'कॉल करें: 9518721792',
    waInquiry: 'व्हाट्सएप पूछताछ',
    freePoint1: 'कोई मासिक शुल्क नहीं — 100% पूरी तरह मुफ्त',
    freePoint2: 'बिना इंटरनेट भी काम करने वाला ऑफलाइन सिंक',
    freePoint3: 'गूगल जेमिनी AI द्वारा ऑटोमैटिक बिल स्कैन',

    // Stats
    stat1Val: '100%', stat1Lbl: 'आजीवन मुफ्त',
    stat2Val: '0 सेकंड', stat2Lbl: 'ऑफलाइन फास्ट बिलिंग',
    stat3Val: '99.4%', stat3Lbl: 'AI सटीकता',
    stat4Val: '3 भाषाएं', stat4Lbl: 'हिंदी, मराठी, English',

    // Features
    featTag: 'दुकानदारों के लिए खास सुविधाएं',
    featTitle: 'अपनी दुकान को बनाएं सुपरफास्ट और स्मार्ट',
    featSub: 'किराना, मेडिकल, हार्डवेयर और सभी रिटेल दुकानों के लिए खास रूप से तैयार।',
    f1Title: 'कैमरा AI बिल स्कैन',
    f1Desc: 'थोक बिल या डिब्बे पर कैमरा रखें। AI तुरंत बैच नंबर, एक्सपायरी डेट और एमआरपी डिटेक्ट कर लेता है।',
    f2Title: 'एक्सपायरी से सुरक्षा',
    f2Desc: 'जल्द एक्सपायर होने वाला माल पहले बिकेगा, जिससे इन्वेंट्री का नुकसान शून्य हो जाएगा।',
    f3Title: 'फास्ट POS व व्हाट्सएप बिल',
    f3Desc: 'बारकोड स्कैन करें और कुछ ही सेकंड में बिल बनाकर ग्राहक को व्हाट्सएप रसीद भेजें।',
    f4Title: 'हिंदी, मराठी और इंग्लिश',
    f4Desc: 'दुकान का कोई भी सहायक या कर्मचारी आसानी से अपनी भाषा में ऍप चला सकता है।',
    f5Title: 'मल्टी-स्टोर सुरक्षा',
    f5Desc: 'आपका सारा डेटा क्लाउड पर एन्क्रिप्टेड और सुरक्षित रहता है।',
    f6Title: 'स्टॉक रिपोर्ट व मुनाफा',
    f6Desc: 'दैनिक बिक्री और लाभ-हानि का पूरा हिसाब किताब एक ही डैशबोर्ड पर।',

    // Regional
    langTitle: 'क्षेत्रीय भारतीय भाषाओं में आसान संचालन',
    langDesc: 'ऍप में कभी भी एक क्लिक से हिंदी, मराठी या अंग्रेजी भाषा का चयन करें।',

    // Company
    devTag: 'डेवलपर और टेक्नोलॉजी पार्टनर',
    devTitle: 'सॉफ्टजेनिक्स आईटी सोल्यूशंस (सातारा)',
    devDesc: 'हम भारतीय छोटे और मध्यम व्यापारियों को आधुनिक सॉफ्टवेयर द्वारा सशक्त बनाते हैं। कस्टमाइज्ड सॉफ्टवेयर के लिए संपर्क करें।',
    founder: 'केयूर सांगलीकर',
    founderRole: 'फाउंडर एवं प्रमुख इंजीनियर',
    address: 'प्रताप गंज पेठ, सातारा, महाराष्ट्र ४१५००२',
    phone: '+91 9518721792'
  }
};

export default function App() {
  const [lang, setLang] = useState<'en' | 'mr' | 'hi'>('en');
  const t = content[lang];

  const handleDownload = () => {
    // Robust direct download trigger
    const link = document.createElement('a');
    link.href = '/downloads/StockWise-v1.0.apk';
    link.setAttribute('download', 'StockWise-v1.0.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="landing-root">
      {/* Navbar */}
      <header className="header-nav">
        <div className="container nav-wrapper">
          <a href="#" className="brand-link">
            <div className="brand-icon">S</div>
            <div>
              <div className="brand-title">StockWise AI</div>
              <div className="brand-sub">Softgenix IT Solutions</div>
            </div>
          </a>

          <div className="nav-controls">
            <div className="lang-switch">
              <button 
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
              >
                English
              </button>
              <button 
                className={`lang-btn ${lang === 'mr' ? 'active' : ''}`}
                onClick={() => setLang('mr')}
              >
                मराठी
              </button>
              <button 
                className={`lang-btn ${lang === 'hi' ? 'active' : ''}`}
                onClick={() => setLang('hi')}
              >
                हिन्दी
              </button>
            </div>

            <button onClick={handleDownload} className="btn-cta-main" style={{ padding: '10px 18px', fontSize: '14px' }}>
              <Download size={16} /> APK
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-layout">
          <div>
            <div className="pill-announcement">
              <Sparkles size={16} />
              <span>{t.badge}</span>
            </div>

            <h1 className="hero-heading">
              {t.titleMain} <span className="gradient-text">{t.titleHighlight}</span>
            </h1>

            <p className="hero-description">
              {t.desc}
            </p>

            <div className="cta-group">
              <button onClick={handleDownload} className="btn-cta-main">
                <Download size={20} />
                <span>{t.downloadApk}</span>
              </button>

              <a href="tel:9518721792" className="btn-cta-secondary">
                <Phone size={18} />
                <span>{t.callNow}</span>
              </a>

              <a 
                href="https://wa.me/919518721792?text=Hello%20Keyur,%20I%20am%20interested%20in%20the%20free%20StockWise%20app%20for%20my%20business." 
                target="_blank" 
                rel="noreferrer"
                className="btn-cta-wa"
              >
                <MessageSquare size={18} />
                <span>{t.waInquiry}</span>
              </a>
            </div>

            <div className="trust-badges">
              <div className="badge-item">
                <CheckCircle2 size={18} />
                <span>{t.freePoint1}</span>
              </div>
              <div className="badge-item">
                <CheckCircle2 size={18} />
                <span>{t.freePoint2}</span>
              </div>
              <div className="badge-item">
                <CheckCircle2 size={18} />
                <span>{t.freePoint3}</span>
              </div>
            </div>
          </div>

          <div className="hero-mockup-wrap">
            <div className="phone-outer-frame">
              <img 
                src="/assets/app-screens.png" 
                alt="StockWise App Screens Mockup" 
                className="phone-screen-img"
              />
            </div>
            
            <div className="float-tag">
              <div className="float-tag-icon">
                <Award size={20} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>VERIFIED QUALITY</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>100% Free SaaS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="stats-ribbon">
        <div className="container stats-grid">
          <div>
            <div className="stat-num">{t.stat1Val}</div>
            <div className="stat-label">{t.stat1Lbl}</div>
          </div>
          <div>
            <div className="stat-num">{t.stat2Val}</div>
            <div className="stat-label">{t.stat2Lbl}</div>
          </div>
          <div>
            <div className="stat-num">{t.stat3Val}</div>
            <div className="stat-label">{t.stat3Lbl}</div>
          </div>
          <div>
            <div className="stat-num">{t.stat4Val}</div>
            <div className="stat-label">{t.stat4Lbl}</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">{t.featTag}</span>
            <h2 className="section-title">{t.featTitle}</h2>
            <p className="section-subtitle">{t.featSub}</p>
          </div>

          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-box-icon icon-orange">
                <ScanLine size={30} />
              </div>
              <h3>{t.f1Title}</h3>
              <p>{t.f1Desc}</p>
            </div>

            <div className="feature-box">
              <div className="feature-box-icon icon-amber">
                <Clock size={30} />
              </div>
              <h3>{t.f2Title}</h3>
              <p>{t.f2Desc}</p>
            </div>

            <div className="feature-box">
              <div className="feature-box-icon icon-blue">
                <Zap size={30} />
              </div>
              <h3>{t.f3Title}</h3>
              <p>{t.f3Desc}</p>
            </div>

            <div className="feature-box">
              <div className="feature-box-icon icon-green">
                <RefreshCw size={30} />
              </div>
              <h3>{t.f4Title}</h3>
              <p>{t.f4Desc}</p>
            </div>

            <div className="feature-box">
              <div className="feature-box-icon icon-purple">
                <ShieldCheck size={30} />
              </div>
              <h3>{t.f5Title}</h3>
              <p>{t.f5Desc}</p>
            </div>

            <div className="feature-box">
              <div className="feature-box-icon icon-red">
                <BarChart3 size={30} />
              </div>
              <h3>{t.f6Title}</h3>
              <p>{t.f6Desc}</p>
            </div>
          </div>

          {/* Regional Banner */}
          <div className="regional-banner">
            <div>
              <h3>{t.langTitle}</h3>
              <p>{t.langDesc}</p>
            </div>
            <div className="lang-grid-cards">
              <div className="lang-card-pill">
                <div className="lang-card-title">🚩 मराठी (Marathi)</div>
                <div className="lang-card-sub">महाराष्ट्रातील व्यापाऱ्यांसाठी</div>
              </div>
              <div className="lang-card-pill">
                <div className="lang-card-title">🇮🇳 हिन्दी (Hindi)</div>
                <div className="lang-card-sub">उत्तर व मध्य भारतासाठी</div>
              </div>
              <div className="lang-card-pill">
                <div className="lang-card-title">🌐 English</div>
                <div className="lang-card-sub">Standard Universal Mode</div>
              </div>
              <div className="lang-card-pill">
                <div className="lang-card-title">⚡ Instant Toggle</div>
                <div className="lang-card-sub">One-tap language shift</div>
              </div>
            </div>
          </div>

          {/* Softgenix Profile Section */}
          <div className="company-showcase">
            <div className="company-layout">
              <div className="company-left">
                <span className="section-tag">{t.devTag}</span>
                <h2>{t.devTitle}</h2>
                <p>{t.devDesc}</p>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <a href="tel:9518721792" className="btn-cta-main">
                    <Phone size={18} />
                    <span>Call 9518721792</span>
                  </a>
                  <a 
                    href="https://wa.me/919518721792?text=Hello%20Keyur,%20I%20would%20like%20to%20discuss%20a%20software%20requirement." 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-cta-wa"
                  >
                    <MessageSquare size={18} />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="company-contact-card">
                <div className="contact-detail-row">
                  <div className="contact-detail-icon">
                    <Building size={22} />
                  </div>
                  <div className="contact-detail-info">
                    <div className="label">Company</div>
                    <div className="val">Softgenix IT Solutions</div>
                  </div>
                </div>

                <div className="contact-detail-row">
                  <div className="contact-detail-icon">
                    <Smartphone size={22} />
                  </div>
                  <div className="contact-detail-info">
                    <div className="label">Lead Engineer</div>
                    <div className="val">{t.founder} ({t.founderRole})</div>
                  </div>
                </div>

                <div className="contact-detail-row">
                  <div className="contact-detail-icon">
                    <Phone size={22} />
                  </div>
                  <div className="contact-detail-info">
                    <div className="label">Direct Phone & WhatsApp</div>
                    <div className="val">{t.phone}</div>
                  </div>
                </div>

                <div className="contact-detail-row">
                  <div className="contact-detail-icon">
                    <MapPin size={22} />
                  </div>
                  <div className="contact-detail-info">
                    <div className="label">Headquarters Address</div>
                    <div className="val">{t.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Mobile Download Bar */}
      <div className="mobile-bottom-bar">
        <button onClick={handleDownload} className="btn-cta-main" style={{ flex: 1, justifyContent: 'center' }}>
          <Download size={18} /> APK (Free)
        </button>
        <a href="tel:9518721792" className="btn-cta-secondary" style={{ padding: '14px 18px' }}>
          <Phone size={18} />
        </a>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-brand">
            <div className="brand-icon" style={{ width: '32px', height: '32px', fontSize: '18px' }}>S</div>
            <strong style={{ fontSize: '18px' }}>StockWise AI</strong>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} Softgenix IT Solutions. All rights reserved. Pratap Ganj Peth, Satara, Maharashtra.
          </p>
          <p className="footer-subcopy">
            Built with React & Vite • Optimized for Vercel • Dedicated to Indian Kirana & Retail Commerce
          </p>
        </div>
      </footer>
    </div>
  );
}
