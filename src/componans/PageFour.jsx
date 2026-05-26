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
<path d="M21.5279 105.423C21.5128 105.408 21.4977 105.393 22.0359 105.378C22.5741 105.363 23.6661 105.348 24.7911 105.332" stroke="black" stroke-width="4" stroke-linecap="round"/>
<path d="M28.8003 105.187H30.8081" stroke="black" stroke-width="4" stroke-linecap="round"/>
</svg>

</h3>
                        <p className="share-subtitle"><svg width="281" height="53" viewBox="0 0 281 53" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M279.099 10.1992C279.099 12.274 278.946 17.9313 278.424 20.1712C278.325 20.5949 278.167 20.8666 277.973 21.098C277.778 21.3293 277.51 21.5007 277.231 21.4948C276.638 21.4821 275.741 19.0603 274.755 16.7076C273.545 13.8204 273.697 21.2721 273.028 22.3594C272.781 22.7612 272.423 22.6323 272.211 22.2855C271.17 20.5803 271.405 19.0043 270.474 17.6288C270.128 17.1167 269.4 16.5791 269.115 16.415C268.427 16.0189 270.115 19.3624 270.238 22.1773C270.262 22.7296 270.001 23.0365 269.72 23.2301C268.429 24.1205 263.876 24.6956 261.065 25.1877C259.533 22.7039 257.636 16.4629 256.693 12.0119C256.107 9.66667 255.305 7.14597 254.283 5.09363" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M251.941 20.0255C251.941 21.4652 251.812 25.4315 250.068 30.9619C249.554 32.3426 249.126 33.1937 248.798 33.8051C248.471 34.4164 248.257 34.7621 247.839 35.2407" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M267.624 6.4698C267.633 6.4698 267.642 6.4698 268.406 6.45906C269.17 6.44833 270.689 6.42686 272.197 6.32264C273.706 6.21842 275.158 6.03211 276.743 5.84015" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M272.528 1C272.516 1 272.503 1 272.491 1.29803C272.478 1.59606 272.466 2.19212 272.453 2.67722" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M244.142 12.7916C241 12.8127 234.556 12.9899 234.246 13.3154C233.424 14.1774 235.918 15.5952 239.607 22.3779C240.399 23.8349 240.423 24.2289 240.356 24.5323C240.227 25.1166 238.942 25.7247 235.839 26.8461C230.359 28.8267 225.795 29.5767 224.219 29.7432C223.584 29.8103 223.28 29.7955 223.114 29.2129C222.634 27.5254 223.026 25.9608 223.34 25.3911C223.497 25.1054 223.815 24.9332 224.111 24.8103C224.407 24.6874 224.715 24.6462 224.953 24.7473C225.99 25.1877 225.775 27.4566 225.782 36.0736C225.783 37.843 225.625 38.1518 225.442 38.4145C225.258 38.6772 225.008 38.8839 224.747 39.07C224.487 39.2562 224.225 39.4156 223.629 39.3328" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M215.453 19C215.453 19.0189 215.476 19.5825 215.661 20.9118C215.824 21.6873 216.125 22.6677 216.643 25.3093C217.161 27.9509 217.887 32.2241 218.918 37.3116" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M193.872 20.1622V34.0751" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M171.544 26.1025C173.37 26.1181 177.629 26.2801 179.08 27.1317C179.967 27.6528 180.265 28.5133 180.315 29.1981C180.343 29.5906 180.332 30.0775 180.223 30.4787C180.02 31.2268 177.941 31.9969 173.92 33.2998C165.316 36.0884 162.545 36.7823 160.481 36.1934C158.754 35.7008 159.65 33.3245 159.803 32.9573C159.982 32.5282 160.298 34.4578 160.203 35.7178C160.164 36.2309 159.832 36.44 159.527 36.622C158.048 37.506 155.371 37.4967 153.324 37.2623C151.566 37.0611 150.886 34.268 150.275 33.0436C150.107 32.7071 150.409 32.8727 150.595 33.1942C151.01 33.9111 151.022 35.2187 150.904 36.4848C150.68 38.8909 144.728 37.7421 142.939 37.4622C141.509 37.2385 140.221 34.4857 138.422 31.3074C137.118 28.5527 136.127 25.4506 135.414 22.4428C135.157 21.2402 135.11 20.6951 135.03 19.9879" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M162.222 40.3164V40.7784" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M154.396 40.8799V43.8275" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M131.862 21.1083C130.696 21.1083 126.237 21.4904 123.111 22.1783C122.111 22.3981 122.397 22.7021 122.899 22.9445C125.103 24.0071 126.374 24.5503 130.077 28.4252C133.166 31.6571 134.38 34.26 134.254 34.757C134.127 35.2619 130.83 36.0112 125.81 37.2451C121.925 38.2 119.651 37.7893 118.798 37.579C117.156 37.1747 116.265 35.5147 115.593 34.2753C115.302 33.7395 115.238 32.2717 115.324 30.4334C115.356 29.7417 115.715 29.578 116.112 29.483C116.509 29.3879 117.021 29.3763 117.386 29.4682C117.752 29.5601 117.955 29.7558 118.069 30.0052C118.301 30.5164 118.244 31.3373 118.213 32.1992C118.187 32.8811 117.452 33.3494 116.61 33.7509C115.767 34.1534 112.805 34.3583 109.509 35.0343C109.548 36.4141 110.678 37.6859 111.374 39.1758C111.838 40.2847 112.529 42.11 113.571 44.4825" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M87.6865 22.5641C87.6998 22.5641 87.7423 24.2193 87.8579 27.0945C88.0609 29.0494 88.3161 30.2345 88.6337 31.9557C88.8228 33.2488 89.0687 35.3941 89.3221 37.5928" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M83.0804 23.077C83.0804 23.127 83.0804 23.177 83.1097 24.9396C83.139 26.7022 83.1975 30.176 83.2946 32.5982C83.5192 38.2049 83.5649 39.602 83.3572 39.894C82.4131 41.2211 78.9217 40.045 77.2997 39.2031C75.163 38.0939 73.4038 36.3466 72.3058 35.2403C71.0395 33.9646 70.6531 32.998 70.4411 32.3244C70.3892 32.1595 70.3918 31.9784 70.4901 31.8113C70.7172 31.4255 71.2683 31.2756 71.7249 31.1891C72.9674 30.9535 74.8241 32.5428 75.6201 33.3392C76.5282 34.2476 75.5917 36.668 74.9438 37.446C74.4573 38.0303 72.8912 37.7733 71.4471 37.7578C69.6423 37.7385 67.5901 35.0178 66.595 33.6736C65.6833 32.4422 67.3642 38.0592 67.4127 39.9818C67.4541 41.6254 67.4297 44.6267 67.415 46.3006C67.4003 47.9745 67.3703 48.2305 67.2119 48.8587C67.0534 49.487 66.7673 50.4797 66.207 51.3627" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M71.9439 26.1986L71.9238 26.218" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M50.6039 34.0529C51.2532 34.0537 53.045 34.1324 55.3074 35.1641C55.8568 35.4146 56.1351 35.6782 56.3497 36.0273C56.8127 36.7807 56.8196 37.6761 56.7823 38.2912C56.7169 39.3681 54.2333 40.81 51.9195 41.9234C47.405 44.0958 45.7295 43.3431 43.9806 42.8883C40.398 41.9568 39.6526 40.2659 38.3527 38.56C37.3815 37.2854 36.0288 34.9991 34.7415 32.6569C33.4542 30.3148 32.3376 27.9398 31.6997 26.6529C31.0618 25.3659 30.9366 25.239 30.7806 25.1849C29.9593 24.9005 28.7873 25.9197 27.2848 27.5687C26.1596 28.8036 25.8661 31.0774 26.1083 31.9071C26.1585 32.0788 26.3175 32.1918 26.465 32.2733C26.6125 32.3549 26.7933 32.3786 27.7026 32.3782C28.6118 32.3778 30.2441 32.3526 31.9259 32.3266" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M23.5405 23.279H26.5178" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M1 19.7805C1 19.773 1 19.7656 1.00737 20.1425C1.01474 20.5194 1.02949 21.281 1.70183 24.8228C2.37418 28.3646 3.70368 34.6636 5.19779 41.4811" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M6.66745 49.9557C6.68968 49.9441 6.84194 49.7863 7.06939 49.4543C7.18234 49.2894 7.18424 49.0706 7.09877 48.9357C7.0133 48.8009 6.8133 48.7411 6.64648 48.7676C6.47967 48.7942 6.3521 48.9089 6.2881 49.1514C6.22409 49.3938 6.22751 49.7605 6.29092 50.0098C6.35432 50.259 6.47762 50.3797 6.60256 50.3784C6.72751 50.377 6.85037 50.2498 6.90929 50.0761C6.9682 49.9024 6.95944 49.6859 6.89788 49.6496C6.83631 49.6134 6.72221 49.7638 6.74719 49.8651C6.77217 49.9664 6.93969 50.0141 7.11618 49.832" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M195.3 14.9808C195.085 15.0002 194.495 15.1664 193.848 15.7119C193.623 15.9008 193.618 16.2248 193.663 16.5447C193.683 16.6874 193.791 16.7686 193.89 16.8307C194.292 17.0856 194.985 17.0989 195.652 17.1031C195.834 17.1043 196.041 17.0954 196.11 17.1298C196.101 17.2305 195.123 17.2989 193.515 17.3754C192.804 17.4518 192.308 17.6047 191.797 17.7623" stroke="black" stroke-width="2" stroke-linecap="round"/>
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