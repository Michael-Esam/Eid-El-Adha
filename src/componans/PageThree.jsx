import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, Link, Navigate, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// ── cache out  component ──────────────────────────────
const imageCache = {};

// ── Countdown Overlay ──────────────────────────────────────
const CountdownOverlay = ({ loaded }) => {
    const [count, setCount] = useState(30);

    useEffect(() => {
        if (loaded) return;
        const id = setInterval(() => {
            setCount(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(id);
    }, [loaded]);

    if (loaded) return null;

    return (
        <div className="card-loading-overlay">
            <span className="card-loading-count">(00:{String(count).padStart(2, '0')})</span>
            <p className="card-loading-text">نُقدر انتظارك لنقدم اعلى جودة التصاميم 🤍</p>
        </div>
    );
};

const FONTS = {
    IBM_PLEX_ARABIC: "'IBM Plex Arabic', sans-serif",
    AYNAMA_CURVED: "'Aynama Curved', sans-serif",
};

const getAssetUrlByFilename = (globMap, filename) => {
    const matchKey = Object.keys(globMap).find((k) => k.endsWith(`/${filename}`));
    return matchKey ? globMap[matchKey] : undefined;
};

const googleAssetUrls = import.meta.glob('../assets/images/google/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' });
const normalAssetUrls = import.meta.glob('../assets/images/normal/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' });

// ── 
const google = [
    { id: 1, image: getAssetUrlByFilename(googleAssetUrls, 'design1.jpg'), textX: 2500, textY: 6490, fontSizeRatio: 0.04, color: '#ffffff', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 2, image: getAssetUrlByFilename(googleAssetUrls, 'design2.jpg'), textX: 2500, textY: 2420, fontSizeRatio: 0.04, color: '#ffffff', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 3, image: getAssetUrlByFilename(googleAssetUrls, 'design3.jpg'), textX: 2500, textY: 1100, fontSizeRatio: 0.04, color: '#000000', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 4, image: getAssetUrlByFilename(googleAssetUrls, 'design4.jpg'), textX: 2500, textY: 6620, fontSizeRatio: 0.04, color: '#000000', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 5, image: getAssetUrlByFilename(googleAssetUrls, 'design5.jpg'), textX: 2500, textY: 2950, fontSizeRatio: 0.04, color: '#eb4335', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 6, image: getAssetUrlByFilename(googleAssetUrls, 'design6.jpg'), textX: 2500, textY: 6620, fontSizeRatio: 0.05, color: '#ffffff', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 7, image: getAssetUrlByFilename(googleAssetUrls, 'design7.jpg'), textX: 2500, textY: 6420, fontSizeRatio: 0.04, color: '#ffffff', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 8, image: getAssetUrlByFilename(googleAssetUrls, 'design8.jpg'), textX: 2500, textY: 2950, fontSizeRatio: 0.04, color: '#ffffff', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 9, image: getAssetUrlByFilename(googleAssetUrls, 'design9.jpg'), textX: 2500, textY: 800, fontSizeRatio: 0.04, color: '#ffffff', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 10, image: getAssetUrlByFilename(googleAssetUrls, 'design10.jpg'), textX: 2500, textY: 3810, fontSizeRatio: 0.04, color: '#000000', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 11, image: getAssetUrlByFilename(googleAssetUrls, 'design11.jpg'), textX: 2300, textY: 1400, fontSizeRatio: 0.05, color: '#ffffff', fontFamily: FONTS.AYNAMA_CURVED },
    { id: 12, image: getAssetUrlByFilename(googleAssetUrls, 'design12.jpg'), textX: 1200, textY: 800, fontSizeRatio: 0.04, color: '#ffffff', fontFamily: FONTS.IBM_PLEX_ARABIC },
];

const normal = [
    { id: 1, image: getAssetUrlByFilename(normalAssetUrls, 'design1.jpg'), textX: 2500, textY: 6490, fontSizeRatio: 0.04, color: '#ffffff', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 2, image: getAssetUrlByFilename(normalAssetUrls, 'design2.jpg'), textX: 2500, textY: 2420, fontSizeRatio: 0.04, color: '#ffffff', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 3, image: getAssetUrlByFilename(normalAssetUrls, 'design3.jpg'), textX: 2500, textY: 1100, fontSizeRatio: 0.04, color: '#000000', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 4, image: getAssetUrlByFilename(normalAssetUrls, 'design4.jpg'), textX: 2500, textY: 6620, fontSizeRatio: 0.04, color: '#000000', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 5, image: getAssetUrlByFilename(normalAssetUrls, 'design5.jpg'), textX: 2500, textY: 2950, fontSizeRatio: 0.04, color: '#eb4335', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 6, image: getAssetUrlByFilename(normalAssetUrls, 'design6.jpg'), textX: 2500, textY: 6620, fontSizeRatio: 0.05, color: '#ffffff', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 7, image: getAssetUrlByFilename(normalAssetUrls, 'design7.jpg'), textX: 2500, textY: 6420, fontSizeRatio: 0.04, color: '#ffffff', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 8, image: getAssetUrlByFilename(normalAssetUrls, 'design8.jpg'), textX: 2500, textY: 2950, fontSizeRatio: 0.04, color: '#ffffff', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 9, image: getAssetUrlByFilename(normalAssetUrls, 'design9.jpg'), textX: 2500, textY: 800, fontSizeRatio: 0.04, color: '#ffffff', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 10, image: getAssetUrlByFilename(normalAssetUrls, 'design10.jpg'), textX: 2500, textY: 3810, fontSizeRatio: 0.04, color: '#000000', fontFamily: FONTS.IBM_PLEX_ARABIC },
    { id: 11, image: getAssetUrlByFilename(normalAssetUrls, 'design11.jpg'), textX: 2300, textY: 1400, fontSizeRatio: 0.05, color: '#ffffff', fontFamily: FONTS.AYNAMA_CURVED },
    { id: 12, image: getAssetUrlByFilename(normalAssetUrls, 'design12.jpg'), textX: 1200, textY: 800, fontSizeRatio: 0.04, color: '#ffffff', fontFamily: FONTS.IBM_PLEX_ARABIC },
];

// ── cache ────────────────────────────────────
function drawCard(canvas, design, userName, variant = 'grid', onReady) {
    if (!canvas || !design?.image) return;
    const ctx = canvas.getContext('2d');

    const render = (img) => {
        const maxSide = variant === 'preview' ? 1200 : 520;
        const scale = Math.min(maxSide / img.naturalWidth, maxSide / img.naturalHeight, 1);
        const W = Math.round(img.naturalWidth * scale);
        const H = Math.round(img.naturalHeight * scale);
        canvas.width = W;
        canvas.height = H;
        ctx.drawImage(img, 0, 0, W, H);
        const name = String(userName || 'User Name').trim() || 'User Name';
        const x = design.textX * (W / img.naturalWidth);
        const y = design.textY * (H / img.naturalHeight);
        const fs = Math.round(H * (design.fontSizeRatio || 0.05));
        ctx.save();
        ctx.font = `400 ${fs}px ${design.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = design.color;
        ctx.fillText(name, x, y);
        ctx.restore();
        if (onReady) onReady();
    };

    if (imageCache[design.image]) {
        render(imageCache[design.image]);
        return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        imageCache[design.image] = img;
        render(img);
    };
    img.src = design.image;
}

// ── PageThree ──────────────────────────────────────────────
const PageThree = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userName = location.state?.name || 'User Name';
    const memberType = location.state?.memberType;
    const designs = memberType === 'gdsc' ? google : normal;

    const [selectedCard, setSelectedCard] = useState(null);
    const [activeCard, setActiveCard] = useState(null);
    const [previewDesign, setPreviewDesign] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loadedCards, setLoadedCards] = useState(new Set());

    const canvasRefs = useRef([]);
    const popupCanvasRef = useRef(null);
    const userNameRef = useRef(userName);

    useEffect(() => { userNameRef.current = userName; }, [userName]);

    useEffect(() => {
        Object.keys(imageCache).forEach(k => delete imageCache[k]);
        setLoadedCards(new Set());
    }, []);

    const setCanvasRef = useCallback((el, index, design) => {
        if (!el) return;
        if (canvasRefs.current[index] === el) return;
        canvasRefs.current[index] = el;
        drawCard(el, design, userNameRef.current, 'grid', () => {
            setLoadedCards(prev => new Set([...prev, index]));
        });
    }, []);

    useEffect(() => {
        if (previewDesign && popupCanvasRef.current)
            drawCard(popupCanvasRef.current, previewDesign, userName, 'preview');
    }, [previewDesign, userName]);

    const handleNext = async () => {
        if (selectedCard === null) {
            setErrorMessage('الرجاء اختيار تصميم أولاً');
            return;
        }
        const design = designs[selectedCard];
        navigate('/page-four', { state: { name: userName, design } });

        const cachedImg = imageCache[design.image];
        const img = cachedImg || await new Promise((resolve, reject) => {
            const i = new Image();
            i.crossOrigin = 'anonymous';
            i.onload = () => { imageCache[design.image] = i; resolve(i); };
            i.onerror = reject;
            i.src = design.image;
        });

        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = img.naturalWidth;
        fullCanvas.height = img.naturalHeight;
        const ctx = fullCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const name = String(userName || 'User Name').trim() || 'User Name';
        const fs = Math.round(img.naturalHeight * (design.fontSizeRatio || 0.05));
        ctx.save();
        ctx.font = `400 ${fs}px ${design.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = design.color;
        ctx.fillText(name, design.textX, design.textY);
        ctx.restore();

        const blob = await new Promise(res => fullCanvas.toBlob(res, 'image/png'));
        if (!blob) return;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `eid-card-${userName}-${timestamp}.png`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!userName) return <Navigate to="/" replace />;

    return (
        <div className="page-container">
            <Header />
            {/* <CountdownOverlay loaded={loadedCards.size >= designs.length} /> */}
            <main className="page-three">
                <div className="card">
                    {/* <h3 className="page-three-title">اختر التصميم المناسب لك</h3> */}
                    <div className="grid-container">
                        {designs.map((design, index) => (
                            <div
                                key={design.id}
                                className={`grid-item ${selectedCard === index ? 'selected' : ''}`}
                                onClick={() => setActiveCard(activeCard === index ? null : index)}
                                role="button"
                                tabIndex={0}
                            >
                                <canvas
                                    ref={el => setCanvasRef(el, index, design)}
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                                {activeCard === index && (
                                    <div className="card-overlay" onClick={e => e.stopPropagation()}>
                                        <button className="btn-view" onClick={e => { e.stopPropagation(); setPreviewDesign(design); }}>عرض</button>
                                        <button className="btn-select" onClick={e => { e.stopPropagation(); setSelectedCard(index); setActiveCard(null); setErrorMessage(''); }}>اختيار</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="action-buttons">
                        <Link to="/page-two" state={{ name: userName }}>
                            <button className="btn-yellow">السابق</button>
                        </Link>
                        <button onClick={handleNext}>التالي</button>
                    </div>
                </div>
            </main>
            {previewDesign && (
                <div className="image-popup-overlay" onClick={() => setPreviewDesign(null)}>
                    <div className="image-popup-content" onClick={e => e.stopPropagation()}>
                        <canvas ref={popupCanvasRef} style={{ maxWidth: '100%', maxHeight: '90vh' }} />
                        <button className="btn-close-popup" onClick={() => setPreviewDesign(null)}>×</button>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default PageThree;
