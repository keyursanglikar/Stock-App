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
  Globe, 
  MessageSquare,
  BarChart3,
  Smartphone
} from 'lucide-react';

const translations = {
  en: {
    heroBadge: '✨ 100% Free Forever • Multi-Language • Built for India',
    heroTitle: 'Smart Stock & Expiry Manager with',
    heroTitleHighlight: 'Gemini AI Vision',
    heroDesc: 'Eliminate stock expiry loss and manual billing hassles. Instant batch tracking, AI packaging camera scan, multi-lingual support, and quick POS billing for Indian Kiranas, Medicals & Retailers.',
    downloadBtn: 'Download Android APK (Free)',
    callBtn: 'Call: 9518721792',
    waBtn: 'WhatsApp Inquiry',
    freeFeature1: 'Zero subscription charges — 100% Free SaaS',
    freeFeature2: 'Offline-ready SQLite local sync with cloud backup',
    freeFeature3: 'Camera AI packaging scan powered by Google Gemini',
    featuresTitle: 'Supercharge Your Retail Shop',
    featuresSub: 'Tailor-made for Kirana, Medical/Pharma, Hardware & Mini-Marts across Maharashtra & India.',
    f1Title: 'Gemini AI Vision Ingest',
    f1Desc: 'Point phone camera at carton labels or wholesale invoices. AI instantly extracts batch number, expiry date, and MRP.',
    f2Title: 'FEFO Expiry Protection',
    f2Desc: 'First-Expiring, First-Out alerts ensure expiring inventory is sold first, saving thousands of rupees in unsellable stock.',
    f3Title: 'Fast POS & Thermal Bills',
    f3Desc: 'Scan barcodes or search items with quick touch POS. Generate professional bills and send receipts directly on WhatsApp.',
    f4Title: 'Marathi, Hindi & English',
    f4Desc: 'Seamless one-tap language switching designed so store staff, helpers, and owners can operate comfortably.',
    f5Title: 'Multi-Tenant Security',
    f5Desc: 'Your inventory data is encrypted and partitioned. Manage multiple store branches with centralized owner analytics.',
    f6Title: 'Real-time Stock Ledger',
    f6Desc: 'Concurrency-safe double-entry ledger prevents inventory mismatch and keeps accounts 100% audit-compliant.',
    langSectionTitle: 'Proudly Supporting Regional Indian Languages',
    langSectionDesc: 'Switch languages instantly inside the app with a single tap. Staff and operators can use Marathi or Hindi anytime.',
    companyTitle: 'Crafted & Supported by Softgenix IT Solutions',
    companyDesc: 'We deliver cutting-edge software solutions to empower local small and medium businesses.',
    founder: 'Keyur Sanglikar',
    founderRole: 'Founder & Lead Engineer',
    address: 'Pratap Ganj Peth, Satara, Maharashtra 415002',
    phone: '+91 9518721792'
  },
  mr: {
    heroBadge: '✨ १००% मोफत ॲप • मराठी भाषा सपोर्ट • भारतीय व्यापाऱ्यांसाठी',
    heroTitle: 'किराणा व मेडिकलसाठी स्मार्ट स्टॉक व',
    heroTitleHighlight: 'जेमिनी AI स्कॅनर',
    heroDesc: 'एक्सपायरीचे नुकसान थांबवा आणि जलद बिलिंग करा. बॅच ट्रॅकिंग, मोबाईल कॅमेरा AI बिल स्कॅनर, मराठी भाषा सपोर्ट आणि सोपे बिलिंग.',
    downloadBtn: 'मोफत अँड्रॉइड APK डाउनलोड करा',
    callBtn: 'कॉल करा: 9518721792',
    waBtn: 'व्हॉट्सॲपवर संपर्क करा',
    freeFeature1: 'कोणतेही मासिक शुल्क नाही — कायमस्वरूपी मोफत',
    freeFeature2: 'इंटरनेट नसतानाही चालणारे ऑफलाइन सिंक',
    freeFeature3: 'गुगल जेमिनी AI द्वारे ऑटोमॅटिक बिल वाचन',
    featuresTitle: 'तुमच्या दुकानासाठी आधुनिक फीचर्स',
    featuresSub: 'सातारा, महाराष्ट्र आणि संपूर्ण भारतातील किराणा, मेडिकल आणि रिटेल दुकानांसाठी खास बनवले आहे.',
    f1Title: 'कॅमेरा AI बिल वाचन',
    f1Desc: 'खरेदी बिल किंवा बॉक्सवर कॅमेरा धरा. जेमिनी AI लगेच बॅच नंबर, एक्सपायरी तारीख आणि किंमत भरून घेते.',
    f2Title: 'एक्सपायरी अलर्ट व बचत',
    f2Desc: 'ज्या मालाची एक्सपायरी जवळ आली आहे तो आधी विकला जातो, ज्यामुळे मालाचे नुकसान टळते.',
    f3Title: 'झटपट बिलिंग व व्हॉट्सॲप पावती',
    f3Desc: 'बारकोड स्कॅन करा आणि काही सेकंदात पक्के बिल ग्राहकांच्या व्हॉट्सॲपवर पाठवा.',
    f4Title: 'मराठी, हिंदी व इंग्रजी',
    f4Desc: 'दुकानातील कोणालाही चालवता यावे यासाठी एका क्लिकवर मराठी किंवा हिंदी भाषा बदला.',
    f5Title: 'सुरक्षित डेटा',
    f5Desc: 'तुमचा सर्व स्टॉक डेटा सुरक्षित आणि क्लाउडवर बॅकअप केलेला राहतो.',
    f6Title: 'दररोजचा हिशोब व नफा',
    f6Desc: 'कोणता माल किती विकला गेला आणि किती नफा झाला याचा रोजचा तपशील सहज मिळतो.',
    langSectionTitle: 'आपल्या हक्काच्या मराठी भाषेत उपलब्ध',
    langSectionDesc: 'ॲपमध्ये कधीही एका क्लिकवर मराठी, हिंदी किंवा इंग्रजी भाषा निवडा.',
    companyTitle: 'सॉफ्टजेनिक्स आयटी सोल्युशन्स (सातारा)',
    companyDesc: 'स्थानिक भारतीय व्यापाऱ्यांना आधुनिक तंत्रज्ञानाने सक्षम बनवण्यासाठी आम्ही कटिबद्ध आहोत.',
    founder: 'केयूर सांगलीकर',
    founderRole: 'संस्थापक व मुख्य तंत्रज्ञान अधिकारी',
    address: 'प्रताप गंज पेठ, सातारा, महाराष्ट्र ४१५००२',
    phone: '+91 9518721792'
  },
  hi: {
    heroBadge: '✨ 100% फ्री ऍप • हिंदी और मराठी सपोर्ट • भारतीय दुकानदारों के लिए',
    heroTitle: 'किराना और मेडिकल के लिए स्मार्ट स्टॉक व',
    heroTitleHighlight: 'जेमिनी AI स्कैनर',
    heroDesc: 'एक्सपायरी का नुकसान रोकें और तेज बिलिंग करें। ऑटोमैटिक बैच ट्रैकिंग, कैमरा AI बिल स्कैनर, हिंदी सपोर्ट और आसान बिलिंग।',
    downloadBtn: 'मुफ्त एंड्रॉइड APK डाउनलोड करें',
    callBtn: 'कॉल करें: 9518721792',
    waBtn: 'व्हाट्सएप संपर्क करें',
    freeFeature1: 'कोई मासिक शुल्क नहीं — 100% पूरी तरह मुफ्त',
    freeFeature2: 'बिना इंटरनेट भी काम करने वाला ऑफलाइन सिंक',
    freeFeature3: 'गूगल जेमिनी AI द्वारा ऑटोमैटिक बिल स्कैन',
    featuresTitle: 'अपनी दुकान को बनाएं स्मार्ट',
    featuresSub: 'किराना, मेडिकल, हार्डवेयर और सभी रिटेल दुकानों के लिए खास रूप से तैयार।',
    f1Title: 'कैमरा AI बिल स्कैन',
    f1Desc: 'थोक बिल या डिब्बे पर कैमरा रखें। AI तुरंत बैच नंबर, एक्सपायरी डेट और एमआरपी डिटेक्ट कर लेता है।',
    f2Title: 'एक्सपायरी से सुरक्षा',
    f2Desc: 'जल्द एक्सपायर होने वाला माल पहले बिकेगा, जिससे इन्वेंट्री का नुकसान शून्य हो जाएगा।',
    f3Title: 'फास्ट POS बिलिंग',
    f3Desc: 'बारकोड स्कैन करें और कुछ ही सेकंड में बिल बनाकर ग्राहक को व्हाट्सएप रसीद भेजें।',
    f4Title: 'हिंदी, मराठी और इंग्लिश',
    f4Desc: 'दुकान का कोई भी सहायक या कर्मचारी आसानी से अपनी भाषा में ऍप चला सकता है।',
    f5Title: 'मल्टी-स्टोर सुरक्षा',
    f5Desc: 'आपका सारा डेटा क्लाउड पर एन्क्रिप्टेड और सुरक्षित रहता है।',
    f6Title: 'स्टॉक रिपोर्ट व मुनाफा',
    f6Desc: 'दैनिक बिक्री और लाभ-हानि का पूरा हिसाब किताब एक ही डैशबोर्ड पर।',
    langSectionTitle: 'क्षेत्रीय भारतीय भाषाओं में आसान संचालन',
    langSectionDesc: 'ऍप में कभी भी एक क्लिक से हिंदी, मराठी या अंग्रेजी भाषा का चयन करें।',
    companyTitle: 'सॉफ्टजेनिक्स आईटी सोल्यूशंस द्वारा विकसित',
    companyDesc: 'हम भारतीय छोटे और मध्यम व्यापारियों को आधुनिक सॉफ्टवेयर द्वारा सशक्त बनाते हैं।',
    founder: 'केयूर सांगलीकर',
    founderRole: 'फाउंडर एवं प्रमुख इंजीनियर',
    address: 'प्रताप गंज पेठ, सातारा, महाराष्ट्र ४१५००२',
    phone: '+91 9518721792'
  }
};

export default function App() {
  const [lang, setLang] = useState<'en' | 'mr' | 'hi'>('en');
  const t = translations[lang];

  return (
    <div>
      {/* Top Navigation */}
      <nav className="navbar">
        <div className="container nav-container">
          <div className="brand">
            <div className="logo-badge">S</div>
            <div className="brand-text">
              <h1>StockWise AI</h1>
              <span>Softgenix IT Solutions</span>
            </div>
          </div>

          <div className="nav-links">
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                className={`lang-pill-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
              >
                English
              </button>
              <button 
                className={`lang-pill-btn ${lang === 'mr' ? 'active' : ''}`}
                onClick={() => setLang('mr')}
              >
                मराठी
              </button>
              <button 
                className={`lang-pill-btn ${lang === 'hi' ? 'active' : ''}`}
                onClick={() => setLang('hi')}
              >
                हिन्दी
              </button>
            </div>

            <a 
              href="/downloads/StockWise-v1.0.apk" 
              download="StockWise-v1.0.apk"
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              <Download size={16} /> APK Download
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="badge-tag">
              <Sparkles size={16} />
              <span>{t.heroBadge}</span>
            </div>
            
            <h1 className="hero-title">
              {t.heroTitle} <span>{t.heroTitleHighlight}</span>
            </h1>

            <p className="hero-subtitle">
              {t.heroDesc}
            </p>

            <div className="hero-actions">
              <a 
                href="/downloads/StockWise-v1.0.apk" 
                download="StockWise-v1.0.apk" 
                className="btn-primary"
              >
                <Download size={20} />
                <span>{t.downloadBtn}</span>
              </a>

              <a 
                href="tel:9518721792" 
                className="btn-secondary"
              >
                <Phone size={18} />
                <span>{t.callBtn}</span>
              </a>

              <a 
                href="https://wa.me/919518721792?text=Hi%20Keyur,%20I%20am%20interested%20in%20the%20free%20StockWise%20app%20for%20my%20store." 
                target="_blank" 
                rel="noreferrer"
                className="btn-secondary"
                style={{ color: '#059669', borderColor: '#A7F3D0' }}
              >
                <MessageSquare size={18} />
                <span>{t.waBtn}</span>
              </a>
            </div>

            <div className="highlight-checks">
              <div className="check-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span>{t.freeFeature1}</span>
              </div>
              <div className="check-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span>{t.freeFeature2}</span>
              </div>
              <div className="check-item">
                <CheckCircle2 size={18} className="check-icon" />
                <span>{t.freeFeature3}</span>
              </div>
            </div>
          </div>

          <div className="hero-phone-mockup">
            <div className="phone-card">
              <img 
                src="/assets/app-screens.png" 
                alt="StockWise App Screens Mockup" 
                className="phone-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>{t.featuresTitle}</h2>
            <p>{t.featuresSub}</p>
          </div>

          <div className="grid-3">
            <div className="feature-card">
              <div className="feature-icon-box">
                <Sparkles size={28} />
              </div>
              <h3>{t.f1Title}</h3>
              <p>{t.f1Desc}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <Clock size={28} />
              </div>
              <h3>{t.f2Title}</h3>
              <p>{t.f2Desc}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <Zap size={28} />
              </div>
              <h3>{t.f3Title}</h3>
              <p>{t.f3Desc}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <Globe size={28} />
              </div>
              <h3>{t.f4Title}</h3>
              <p>{t.f4Desc}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <ShieldCheck size={28} />
              </div>
              <h3>{t.f5Title}</h3>
              <p>{t.f5Desc}</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <BarChart3 size={28} />
              </div>
              <h3>{t.f6Title}</h3>
              <p>{t.f6Desc}</p>
            </div>
          </div>

          {/* Regional Language Banner */}
          <div className="lang-banner">
            <div>
              <h3 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '12px' }}>
                {t.langSectionTitle}
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '16px', lineHeight: 1.6 }}>
                {t.langSectionDesc}
              </p>
            </div>
            <div className="lang-chips">
              <div className="lang-chip">🇮🇳 English (Global)</div>
              <div className="lang-chip">🚩 मराठी (महाराष्ट्र)</div>
              <div className="lang-chip">🇮🇳 हिन्दी (भारत)</div>
              <div className="lang-chip">⚡ 1-Tap Toggle</div>
            </div>
          </div>

          {/* Softgenix IT Solutions Contact Info Card */}
          <div className="contact-section">
            <div className="contact-grid">
              <div>
                <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px' }}>
                  DEVELOPED & MAINTAINED BY
                </span>
                <h3 style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px', marginBottom: '14px' }}>
                  {t.companyTitle}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                  {t.companyDesc} Contact Keyur Sanglikar for custom business software, mobile app development, or tailored ERP integrations.
                </p>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <a href="tel:9518721792" className="btn-primary">
                    <Phone size={18} />
                    <span>Call 9518721792</span>
                  </a>
                  <a 
                    href="https://wa.me/919518721792?text=Hello%20Keyur%20Sanglikar,%20I%20would%20like%20to%20discuss%20a%20software%20project." 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-secondary"
                  >
                    <MessageSquare size={18} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-row">
                  <Building size={20} />
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Organization</div>
                    <div style={{ fontWeight: 700 }}>Softgenix IT Solutions</div>
                  </div>
                </div>

                <div className="contact-row">
                  <Smartphone size={20} />
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Contact Person</div>
                    <div style={{ fontWeight: 700 }}>{t.founder} ({t.founderRole})</div>
                  </div>
                </div>

                <div className="contact-row">
                  <Phone size={20} />
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Mobile & WhatsApp</div>
                    <div style={{ fontWeight: 700 }}>{t.phone}</div>
                  </div>
                </div>

                <div className="contact-row">
                  <MapPin size={20} />
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Office Address</div>
                    <div style={{ fontWeight: 700 }}>{t.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <p>© {new Date().getFullYear()} Softgenix IT Solutions. All rights reserved. Satara, Maharashtra, India.</p>
          <p style={{ marginTop: '8px', fontSize: '13px', color: '#94A3B8' }}>
            Built with React, TypeScript & Vite • Optimized for Vercel Deployment
          </p>
        </div>
      </footer>
    </div>
  );
}
