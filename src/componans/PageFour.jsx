import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { FaWhatsapp, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Header from './Header';


const PageFour = () => {
    const location = useLocation();
    const { name, design } = location.state || {};
    const canvasRef = useRef(null);
    const [imageBlob, setImageBlob] = useState(null);
    const [isReady, setIsReady] = useState(false);

    // Share payload (without file)
    const sharePayload = useMemo(() => ({ title: 'Eid Mubarak', text: 'Eid Mubarak' }), []);

    // Universal share function – uses Web Share if available, otherwise downloads
    const shareImage = async () => {
        if (!imageBlob) return;

        const file = new File([imageBlob], 'eid-card.png', { type: 'image/png' });

        // Check if Web Share with files is supported
        if (typeof navigator.share === 'function' &&
            typeof navigator.canShare === 'function' &&
            navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    ...sharePayload,
                    files: [file]
                });
                return; // success
            } catch (err) {
                console.log('Share cancelled or failed', err);
                // fall through to download
            }
        }

        // Fallback: download the image
        const url = URL.createObjectURL(imageBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `eid-card-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Draw the card on canvas (same logic as PageThree)
    useEffect(() => {
        if (!name || !design || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            const maxSide = 1200;
            const scale = Math.min(maxSide / img.naturalWidth, maxSide / img.naturalHeight, 1);
            const W = Math.round(img.naturalWidth * scale);
            const H = Math.round(img.naturalHeight * scale);

            canvas.width = W;
            canvas.height = H;
            ctx.clearRect(0, 0, W, H);
            ctx.drawImage(img, 0, 0, W, H);

            const safeName = String(name || 'User Name').trim() || 'User Name';

            // Use same coordinate calculations as PageThree
            const x = design.textX * (W / img.naturalWidth);
            const y = design.textY * (H / img.naturalHeight);
            const fs = Math.round(H * (design.fontSizeRatio || 0.05));

            ctx.save();
            ctx.font = `400 ${fs}px ${design.fontFamily}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = design.color;
            ctx.fillText(safeName, x, y);
            ctx.restore();

            canvas.toBlob(blob => {
                if (!blob) return;
                setImageBlob(blob);
                setIsReady(true);
            }, 'image/png', 1);
        };

        img.onerror = err => console.error('Failed to load image', err);
        img.src = design.image;
    }, [name, design]);
    const shareWhatsapp = async () => {
        if (!imageBlob) return;
        const file = new File([imageBlob], 'eid-card.png', { type: 'image/png' });
        const canShare =
            typeof navigator.share === 'function' &&
            typeof navigator.canShare === 'function' &&
            navigator.canShare({ files: [file] });

        if (canShare) {
            try {
                await navigator.share({ title: '', files: [file] });
            } catch (err) { console.log(err); }
        } else {
            window.open('https://web.whatsapp.com/', '_blank');
        }
    };

    const shareX = async () => {
        if (!imageBlob) return;
        const url = URL.createObjectURL(imageBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'eid-card.png';
        a.click();
        URL.revokeObjectURL(url);
        setTimeout(() => {
            window.open('https://twitter.com/intent/tweet?text=""', '_blank');
        }, 500);
    };

    // Redirect if no data
    if (!name || !design) return <Navigate to="/" replace />;

    return (
        <div className="page-container">
            <Header />
            <main className="page-four">
                <div className="card split-card">
                    <div className="share-section">
                        <h3>كل عام وانتم الخير</h3>
                        <p className="share-subtitle">شاركوا فرحتكم مع احبابكم!</p>
                        <div className="share-buttons-grid">
                            {/* All buttons use the same share function – will open native share sheet */}
                            <button
                                className="share-btn whatsapp"
                                onClick={shareWhatsapp}
                                disabled={!isReady}
                                title="Share via WhatsApp"
                            >
                                <FaWhatsapp size={28} />
                            </button>
                            <button
                                className="share-btn x-br"
                                onClick={shareX}
                                disabled={!isReady}
                                title="Share via X"
                            >
                                <FaXTwitter size={28} />
                            </button>
                            <button
                                className="share-btn instagram"
                                onClick={shareImage}
                                disabled={!isReady}
                                title="Share via Instagram"
                            >
                                <img src="/instagram.png" alt="Instagram" style={{ width: 28, height: 28 }} />

                            </button>
                            <button
                                className="share-btn snapchat"
                                onClick={shareImage}
                                disabled={!isReady}
                                title="Share via Snapchat"
                            >
                                <img src="/snap.png" alt="Snapchat" style={{ width: 28, height: 28 }} />
                            </button>
                            <button
                                className="share-btn tiktok"
                                onClick={shareImage}
                                disabled={!isReady}
                                title="Share via TikTok"
                            >
                                <img src={ICONS.tiktok} alt="TikTok" style={{ width: 28, height: 28 }} />
                            </button>
                            <button
                                className="share-btn linkedin"
                                onClick={shareImage}
                                disabled={!isReady}
                                title="Share via LinkedIn"
                            >
                                <FaLinkedinIn size={28} />
                            </button>
                        </div>
                    </div>
                    <div className="canvas-section">
                        <div className="page-four-preview">
                            {/* <CountdownOverlay loaded={isReady} /> */}
                            <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>
                    </div>
                </div>
            </main>
            <footer>
                <a href='https://linktr.ee/ai.wadod' target='_blank' rel="noopener noreferrer">
                    تصميم و تطوير <span>ودود</span>
                </a>
            </footer>
        </div>
    );
};

export default PageFour;