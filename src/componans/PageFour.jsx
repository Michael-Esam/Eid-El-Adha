import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { FaWhatsapp, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Header from './Header';
import Footer from './Footer';


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
        if (!name || !design?.image) return;

        let cancelled = false;

        const frameId = requestAnimationFrame(() => {
            const canvas = canvasRef.current;
            if (!canvas || cancelled) return;

            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                if (cancelled) return;
                const maxSide = 1200;
                const scale = Math.min(maxSide / img.naturalWidth, maxSide / img.naturalHeight, 1);
                const W = Math.round(img.naturalWidth * scale);
                const H = Math.round(img.naturalHeight * scale);

                canvas.width = W;
                canvas.height = H;
                ctx.clearRect(0, 0, W, H);
                ctx.drawImage(img, 0, 0, W, H);

                const safeName = String(name || 'User Name').trim() || 'User Name';

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
                    if (cancelled || !blob) return;
                    setImageBlob(blob);
                    setIsReady(true);
                }, 'image/png', 1);
            };

            img.onerror = err => console.error('Failed to load image', err);
            img.src = design.image;
        });

        return () => {
            cancelled = true;
            cancelAnimationFrame(frameId);
        };
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
                        <h3><svg width="334" height="129" viewBox="0 0 334 129" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M331.406 23.0238C331.342 23.0238 330.12 23.0519 327.837 23.1658C325.769 23.269 319.949 24.8083 312.781 26.8722C310.413 27.554 310.769 27.959 311.41 28.2826C312.954 29.0621 314.321 29.5509 316.78 32.1903C318.965 34.5364 322.799 39.1574 325.009 41.8467C327.219 44.5359 327.623 45.2124 327.605 45.6616C327.572 46.4648 325.96 46.5406 322.598 47.3367C315.207 49.0872 310.273 51.2803 309.077 51.3783C308.248 51.4462 306.961 51.4185 306.1 51.2952C304.8 51.109 302.499 48.4462 299.46 44.9093C298.335 43.601 298.13 43.2218 296.09 37.0226C294.051 30.8235 290.203 18.8008 288.261 12.8928C286.32 6.98492 286.402 7.55614 286.732 8.77388C287.062 9.99162 287.638 11.8386 289.526 18.3715C291.413 24.9044 294.595 36.0673 296.329 42.5543C299.223 53.3786 298.36 57.02 298.044 57.7537C296.151 62.1387 286.605 64.0387 284.542 64.0928C283.531 64.1194 282.671 63.5887 281.857 62.8929C280.904 61.581 279.61 58.0542 278.433 53.7141C278.026 52.0679 278.005 51.5511 278.251 50.7127" stroke="black" stroke-width="4" stroke-linecap="round"/>
<path d="M255.087 42.5154C254.524 42.4498 250.519 43.7772 247.445 45.7995C245.647 46.9827 244.767 48.5607 244.42 49.3624C244.081 50.148 244.119 51.5301 244.262 53.0413C244.425 54.7618 249.594 57.1767 252.492 58.7553C255.149 60.2029 259.449 59.42 261.958 59.4606C262.083 59.4626 258.878 59.5026 255.059 60.0719C251.24 60.6413 246.649 61.7583 242.368 62.4439C238.086 63.1296 234.253 63.35 232.188 63.2557C230.122 63.1613 229.939 62.7454 229.165 59.8472C228.39 56.949 227.029 51.5811 225.725 44.393C224.421 37.2049 223.216 28.3593 222.31 20.8007C221.404 13.2422 220.833 7.2388 220.508 4.33145C220.183 1.4241 220.12 1.7947 220.055 2.4916" stroke="black" stroke-width="4" stroke-linecap="round"/>
<path d="M198.42 37.6546C200.419 37.6702 205.486 37.8501 210.223 39.8335C211.237 40.2581 211.461 40.5527 211.649 40.8574C213.199 43.3703 213.668 47.5262 213.443 48.119C213.185 48.796 207.937 49.9668 200.773 51.9286C197.492 52.827 195.904 52.7896 194.058 52.3222C188.875 51.0098 188.563 45.4627 188.488 45.1373C188.716 45.5609 189.725 47.2065 192.616 53.8252C194.694 59.2122 198.012 68.7171 201.716 78.9898" stroke="black" stroke-width="4" stroke-linecap="round"/>
<path d="M167.584 63.1117C165.012 63.1587 158.892 63.0926 157.178 62.3338C153.802 60.8384 151.353 54.6347 150.503 52.2292C150.258 51.5354 151.313 51.0082 152.088 50.6849C153.056 50.2814 154.668 50.357 156.425 50.592C159.308 50.9775 161.251 54.1693 164.579 56.2003C166.55 57.4028 167.784 59.2879 169.358 63.2308C169.823 64.3947 169.658 65.3029 169.304 66.317C168.861 67.5838 165.574 71.6626 161.441 77.372C159.326 79.9965 158.369 80.736 157.078 81.7749C156.194 82.6036 154.845 84.0446 153.405 85.2272" stroke="black" stroke-width="4" stroke-linecap="round"/>
<path d="M136.634 44.1431C136.634 44.1323 136.634 44.1216 136.855 51.5964C137.076 59.0712 137.518 74.032 138.146 90.2763" stroke="black" stroke-width="4" stroke-linecap="round"/>
<path d="M137.688 28.2952C137.688 28.3668 137.688 29.0189 137.879 30.0596C138.295 32.3176 142.38 33.3013 144.491 33.9789C144 34.2085 141.386 34.3945 137.245 34.7338C135.126 34.9928 132.972 35.4281 130.752 35.8766" stroke="black" stroke-width="4" stroke-linecap="round"/>
<path d="M122.833 55.5904C122.833 55.5671 122.845 58.6019 122.877 64.5225C122.906 70.0048 122.749 73.2103 122.318 74.1416C121.598 75.6937 120.05 76.1417 119.302 76.3413C114.864 77.5261 110.962 66.0852 110.524 64.6625C110.034 63.0681 112.95 70.7263 113.231 74.5164C113.344 76.0368 105.339 76.9397 101 77.9151C98.0399 78.5805 93.1694 76.1863 89.778 74.0326C84.4164 70.6277 84.0737 66.6158 83.2613 64.5413C82.9596 63.7708 82.983 62.7747 83.0952 61.7422C83.1448 61.2865 83.4702 61.0251 83.8281 60.8067C85.4046 59.8445 88.1844 60.9272 92.5212 62.3749C93.4148 62.6732 93.817 62.9657 94.1003 63.2755C95.6573 64.9789 94.5267 68.2897 94.1625 68.8473C93.3437 70.1011 83.8883 70.3111 78.6115 69.8392C77.8299 69.7693 77.1808 68.9903 76.5679 68.8377C77.8739 70.3269 80.6059 73.3181 83.1502 78.6549C85.0322 82.8846 88.114 90.2034 91.4002 97.9506" stroke="black" stroke-width="4" stroke-linecap="round"/>
<path d="M106.215 56.9684H114.491" stroke="black" stroke-width="4" stroke-linecap="round"/>
<path d="M121.686 48.4574H122.691" stroke="black" stroke-width="4" stroke-linecap="round"/>
<path d="M60.3608 39.5791C60.3608 39.6024 60.3608 39.6257 60.3969 44.4162C60.4329 49.2068 60.5049 58.7638 60.9519 66.4919C61.3989 74.22 62.2186 79.8295 62.6569 82.9818C63.0951 86.134 63.127 86.6591 63.1599 87.2" stroke="black" stroke-width="4" stroke-linecap="round"/>
<path d="M51.9191 37.4415C51.9191 37.4527 51.9191 37.464 51.9063 43.3646C51.8936 49.2653 51.8682 61.055 51.7107 69.5868C51.5533 78.1186 51.2647 83.0352 50.9246 85.4794C50.5846 87.9235 50.2019 87.7462 49.8775 87.3712C48.174 85.4019 48.2496 82.168 45.3566 73.4177C43.7967 68.6995 41.2942 66.7066 39.2841 65.3434C37.5548 64.1707 35.0788 65.0914 31.6892 66.665C25.2754 69.6426 41.8046 69.0425 43.3507 70.6819C45.2637 72.7104 46.7799 77.7492 47.3344 80.7439C47.6084 82.2236 45.2362 82.9349 40.7641 84.4582C31.496 87.6152 28.9291 88.2364 27.083 88.0155C23.7768 87.6198 22.4937 82.3947 22.392 82.3729C18.8985 81.6246 23.7779 88.2228 23.6483 90.0981C23.5988 90.8144 23.2542 91.0116 22.8574 91.1507C20.5673 91.9532 17.8002 92.2185 15.7127 92.1432C14.8002 92.1103 13.9815 90.8654 12.5428 89.3235C10.5224 87.1582 6.96065 82.943 3.56987 77.8479C2.30061 75.9406 2.04633 75.346 2.00241 75.2277C1.90264 74.9588 3.35375 79.249 5.18897 90.321C6.03362 97.9829 6.70234 109.793 6.98061 116.535C7.25888 123.277 7.12643 124.593 6.31667 126.052" stroke="black" stroke-width="4" stroke-linecap="round"/>
<path d="M30.0376 54.84C30.0488 54.84 30.06 54.84 30.1717 54.9923C30.2834 55.1446 30.4953 55.4492 30.7867 55.7944" stroke="black" stroke-width="4" stroke-linecap="round"/>
</svg>
</h3>
                        <p className="share-subtitle"><svg width="281" height="49" viewBox="0 0 281 49" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M279.099 6.1058C279.099 8.18065 278.946 13.8379 278.424 16.0779C278.325 16.5015 278.167 16.7732 277.973 17.0046C277.778 17.2359 277.51 17.4073 277.231 17.4014C276.638 17.3887 275.741 14.9669 274.755 12.6143C273.545 9.72701 273.697 17.1787 273.028 18.266C272.781 18.6678 272.423 18.5389 272.211 18.1921C271.17 16.4869 271.405 14.9109 270.474 13.5354C270.128 13.0233 269.4 12.4857 269.115 12.3216C268.427 11.9255 270.115 15.269 270.238 18.0839C270.262 18.6362 270.001 18.9431 269.72 19.1367C268.429 20.0271 263.876 20.6022 261.065 21.0943C259.533 18.6105 257.636 12.3695 256.693 7.91847C256.107 5.57329 255.305 3.05259 254.283 1.00024" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M251.941 15.9321C251.941 17.3718 251.812 21.3381 250.068 26.8685C249.554 28.2492 249.126 29.1004 248.798 29.7117C248.471 30.323 248.257 30.6687 247.839 31.1473" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M244.142 8.69824C241 8.71935 234.556 8.89648 234.246 9.22201C233.424 10.084 235.918 11.5018 239.607 18.2845C240.399 19.7415 240.423 20.1355 240.356 20.4389C240.227 21.0233 238.942 21.6313 235.839 22.7528C230.359 24.7333 225.795 25.4833 224.219 25.6499C223.584 25.7169 223.28 25.7021 223.114 25.1195C222.634 23.432 223.026 21.8674 223.34 21.2977C223.497 21.012 223.815 20.8398 224.111 20.7169C224.407 20.594 224.715 20.5529 224.953 20.6539C225.99 21.0943 225.775 23.3632 225.782 31.9802C225.783 33.7496 225.625 34.0584 225.442 34.3211C225.258 34.5838 225.008 34.7905 224.747 34.9766C224.487 35.1628 224.225 35.3222 223.629 35.2394" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M215.453 14.9066C215.453 14.9255 215.476 15.4891 215.661 16.8185C215.824 17.5939 216.125 18.5743 216.643 21.2159C217.161 23.8575 217.887 28.1308 218.918 33.2182" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M193.872 16.0688V29.9817" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M171.544 22.0091C173.37 22.0247 177.629 22.1868 179.08 23.0384C179.967 23.5594 180.265 24.42 180.315 25.1047C180.343 25.4972 180.332 25.9841 180.223 26.3854C180.02 27.1334 177.941 27.9035 173.92 29.2064C165.316 31.995 162.545 32.6889 160.481 32.1C158.754 31.6074 159.65 29.2311 159.803 28.8639C159.982 28.4348 160.298 30.3644 160.203 31.6244C160.164 32.1375 159.832 32.3466 159.527 32.5286C158.048 33.4126 155.371 33.4033 153.324 33.1689C151.566 32.9677 150.886 30.1746 150.275 28.9502C150.107 28.6137 150.409 28.7793 150.595 29.1009C151.01 29.8177 151.022 31.1254 150.904 32.3914C150.68 34.7976 144.728 33.6487 142.939 33.3688C141.509 33.1451 140.221 30.3923 138.422 27.2141C137.118 24.4594 136.127 21.3572 135.414 18.3494C135.157 17.1468 135.11 16.6017 135.03 15.8945" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M131.862 17.0149C130.696 17.0149 126.237 17.397 123.111 18.0849C122.111 18.3048 122.397 18.6087 122.899 18.8511C125.103 19.9138 126.374 20.4569 130.077 24.3318C133.166 27.5637 134.38 30.1666 134.254 30.6637C134.127 31.1685 130.83 31.9178 125.81 33.1517C121.925 34.1066 119.651 33.696 118.798 33.4856C117.156 33.0813 116.265 31.4213 115.593 30.1819C115.302 29.6462 115.238 28.1783 115.324 26.34C115.356 25.6483 115.715 25.4846 116.112 25.3896C116.509 25.2945 117.021 25.2829 117.386 25.3748C117.752 25.4667 117.955 25.6624 118.069 25.9118C118.301 26.423 118.244 27.2439 118.213 28.1058C118.187 28.7877 117.452 29.2561 116.61 29.6575C115.767 30.06 112.805 30.2649 109.509 30.9409C109.548 32.3207 110.678 33.5925 111.374 35.0824C111.838 36.1914 112.529 38.0167 113.571 40.3891" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M87.6865 18.4708C87.6998 18.4708 87.7423 20.1259 87.8579 23.0011C88.0609 24.956 88.3161 26.1411 88.6337 27.8623C88.8228 29.1554 89.0687 31.3007 89.3221 33.4994" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M83.0804 18.9836C83.0804 19.0336 83.0804 19.0836 83.1097 20.8462C83.139 22.6089 83.1975 26.0826 83.2946 28.5048C83.5192 34.1115 83.5649 35.5086 83.3572 35.8006C82.4131 37.1278 78.9217 35.9516 77.2997 35.1097C75.163 34.0006 73.4038 32.2532 72.3058 31.147C71.0395 29.8712 70.6531 28.9047 70.4411 28.231C70.3892 28.0661 70.3918 27.885 70.4901 27.7179C70.7172 27.3321 71.2683 27.1823 71.7249 27.0957C72.9674 26.8601 74.8241 28.4495 75.6201 29.2458C76.5282 30.1542 75.5917 32.5746 74.9438 33.3527C74.4573 33.9369 72.8912 33.6799 71.4471 33.6644C69.6423 33.6451 67.5901 30.9244 66.595 29.5803C65.6833 28.3488 67.3642 33.9658 67.4127 35.8884C67.4541 37.532 67.4297 40.5333 67.415 42.2072C67.4003 43.8811 67.3703 44.1371 67.2119 44.7653C67.0534 45.3936 66.7673 46.3863 66.207 47.2693" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M71.9439 22.1052L71.9238 22.1246" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M50.6039 29.9595C51.2532 29.9603 53.045 30.039 55.3074 31.0707C55.8568 31.3213 56.1351 31.5848 56.3497 31.9339C56.8127 32.6873 56.8196 33.5827 56.7823 34.1978C56.7169 35.2747 54.2333 36.7166 51.9195 37.83C47.405 40.0024 45.7295 39.2497 43.9806 38.7949C40.398 37.8634 39.6526 36.1726 38.3527 34.4666C37.3815 33.1921 36.0288 30.9057 34.7415 28.5636C33.4542 26.2215 32.3376 23.8464 31.6997 22.5595C31.0618 21.2725 30.9366 21.1456 30.7806 21.0915C29.9593 20.8071 28.7873 21.8263 27.2848 23.4753C26.1596 24.7103 25.8661 26.984 26.1083 27.8137C26.1585 27.9854 26.3175 28.0984 26.465 28.1799C26.6125 28.2615 26.7933 28.2852 27.7026 28.2848C28.6118 28.2844 30.2441 28.2592 31.9259 28.2332" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M23.5405 19.1856H26.5178" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M1 15.6871C1 15.6797 1 15.6722 1.00737 16.0491C1.01474 16.426 1.02949 17.1876 1.70183 20.7294C2.37418 24.2712 3.70368 30.5702 5.19779 37.3877" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M195.3 10.8875C195.085 10.9068 194.495 11.073 193.848 11.6185C193.623 11.8074 193.618 12.1314 193.663 12.4513C193.683 12.594 193.791 12.6752 193.89 12.7374C194.292 12.9922 194.985 13.0056 195.652 13.0097C195.834 13.0109 196.041 13.002 196.11 13.0364C196.101 13.1371 195.123 13.2055 193.515 13.282C192.804 13.3584 192.308 13.5113 191.797 13.6689" stroke="black" stroke-width="2" stroke-linecap="round"/>
</svg>
</p>
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
                                <img src="/tik-tok.png" alt="TikTok" style={{ width: 28, height: 28 }} />
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
            <Footer />
        </div>
    );
};

export default PageFour;