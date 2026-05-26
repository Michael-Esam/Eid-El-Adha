import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { PAGE_ONE_ERRORS } from './PageOneErrors';

const PageOne = () => {
    const location = useLocation();
    const [name, setName] = useState(location.state?.name || '');
    const [errorType, setErrorType] = useState('');
    const navigate = useNavigate();
    const ErrorSvg = errorType ? PAGE_ONE_ERRORS[errorType] : null;

    const handleNext = () => {
        const trimmed = name.trim();
        const arabicOnly = /^[\u0600-\u06FF\s]+$/;


        if (!trimmed) {
            setErrorType('empty');
            return;
        }

        if (!arabicOnly.test(trimmed)) {
            setErrorType('arabic');
            return;
        }

        navigate('/page-two', { state: { name } });
    };

    return (
        <div className="page-container-one">
            <Header />
            <div className="page-one">
                <div className="card">
                    <h3>
                    <svg width="523" height="148" viewBox="0 0 523 148" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M522 8.00027V58.0003" stroke="white" stroke-width="2" stroke-linecap="round"/>
<path d="M493 21.0003C493 21.0992 493 21.1981 493 27.5151C493 33.8322 493 46.3643 493.205 53.236C493.409 60.1077 493.819 60.9393 495 62.0003" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M494.633 6.00027C493.951 6.95866 492.707 9.61664 492.993 10.9767C493.807 14.8535 501.67 12.0573 502 11.5613C498.108 11.3806 493.916 11.1705 490.828 10.8576C488.831 10.7456 485.959 10.7286 483 10.711" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M478.37 49.0003C478.427 49.0003 479.351 49.6262 481.036 50.9857C482.688 52.3183 483.185 55.964 482.942 60.2196C482.845 61.9178 482.12 62.6051 481.414 63.0418C480.709 63.4784 479.87 63.6247 477.726 63.705C475.583 63.7853 472.161 63.7953 468 64.0003" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M433.191 50.3094C435.148 50.3302 441.041 51.2626 448.469 56.4955C450.062 57.6175 450.515 58.4241 450.797 59.2956C451.079 60.1672 451.08 61.2094 450.721 62.0362C449.224 65.4811 441.752 64.8583 431.04 67.0469C421.377 69.0213 415.082 72.294 413.164 72.018C411.486 71.7766 408.99 66.6433 403.728 54.4083C400.211 46.2286 396.317 33.4831 393.257 23.1085C390.198 12.734 388.435 4.97227 387.471 1.4266C386.418 -2.44522 394.104 20.9777 396.916 34.3466C398.809 43.3464 400.946 56.9897 403.119 67.8109C406.841 86.3461 409.679 97.4094 410.092 102.827C410.253 104.938 409.729 105.777 408.689 106.211C403.697 108.29 399.362 105.729 390.314 104.635C386.9 104.222 384.811 103.302 383.263 102.285C378.383 94.706 371.393 79.7135 371 74.7412C371.302 73.8523 371.966 73.2454 374.951 72.4344" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M433 41.0003V44.0003" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M298 28.0003C298 28.1316 298 28.2629 298 36.8449C298 45.4269 298 62.4556 298 80.0003" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M281.999 31.0003C281.999 31.2496 282.095 41.3668 283.186 61.5023C284.286 81.8246 287.23 92.2729 285.431 92.6588C276.101 92.4102 261.954 92.924 255.781 93.2974C254.301 93.443 253.167 93.7175 252 94.0003" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M260 64.0003C260.171 64.5672 263.751 72.0401 272.592 83.0397C276.074 87.8141 278.583 90.8994 280.478 92.8458C281.404 93.7778 282.257 94.5967 283 95.0003" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M253.442 32.0003C254.291 32.2732 257.537 33.4426 261.014 34.2469C261.872 34.4454 262.706 34.3097 263 34.8634C262.171 38.5012 259.506 41.8202 254.295 49.9922C253.152 51.7378 252.585 52.3596 252 53.0003" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M222.026 75.0003C222.213 76.6879 223.044 84.3907 222.998 92.2776C222.99 93.6444 221.81 93.95 220.923 93.6884C214.876 91.9057 213.429 82.4517 213.088 80.7833C212.386 77.3584 215.559 88.6725 215.28 91.0148C215.064 92.8274 212.572 93.5906 210.629 94.1959C209.731 94.4755 208.878 94.0964 208.112 93.4744C204.815 90.7978 205.006 87.3351 204.796 86.2618C204.182 83.1253 206.326 93.754 205.996 95.9005C204.745 104.024 184.427 101.093 181.228 100.845C173.795 100.268 170.826 85.3616 169.869 82.0493C169.483 80.7136 170.03 79.9214 171.288 79.5447C174.559 78.565 177.523 79.748 178.7 80.9362C179.908 82.1565 180.122 85.6396 179.761 89.7738C179.617 91.4295 178.678 92.0541 177.669 92.5383C168.349 97.01 151.888 92.7017 150 90.8631C152.051 94.4062 154.652 100.03 156.693 108.393C157.782 113.945 158.978 122.15 160.21 131" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M120 44.0003C120 44.0564 120.168 59.0159 120.629 83.2955C120.923 92.6445 121.338 95.9595 121.571 98.2286C121.804 100.498 121.843 101.621 122 104" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M111 48.0003C111 48.0561 111 48.1119 110.968 56.731C110.936 65.35 110.872 82.5305 110.718 92.5174C110.471 108.528 108.458 118.285 105.632 123.591C105.228 124.35 103.948 123.898 103.155 123.482C95.7338 119.596 94.5385 104.619 94.2338 104.234C90.4796 99.5034 94.7628 113.887 94.3458 115.282C93.9371 116.649 89.6032 116.104 85.2951 115.68C82.6761 115.422 81.9244 112.672 81.3231 110.845C81.0217 109.93 81.1186 108.93 81.3584 108.958C82.6467 109.108 82.5619 113.301 82.279 116.926C82.1636 118.405 81.4699 119.068 80.6382 119.482C78.832 120.382 75.1777 120.137 71.2737 119.838C66.424 119.466 65.2841 111.601 64.0809 103.038C63.0268 97.588 60.9185 87.8423 59.6002 81.17C58.282 74.4976 57.8177 71.194 57 68.2712" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M91 90.0003H98" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M94 79.0003C94 79.0003 94 79.0003 94 79.753C94 80.5058 94 82.0114 94 83.0003" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M80 95.0003C80 95.0299 80 95.0595 80.0878 95.5384C80.1756 96.0172 80.3512 96.9444 81 99.0003" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M47.7716 86.0003C47.7716 90.3891 48.3201 102.422 48.9849 106.877C49.317 109.103 44.1232 102.373 38.4338 101.101C32.3729 99.7466 27.5509 101.347 26.2712 102.382C24.8113 103.563 25.6368 106.357 26.092 108.453C26.9784 112.535 31.9579 114.131 37.3896 118.742C41.8289 122.511 43.1397 126.703 42.5083 128.451C41.0109 132.596 26.1291 134.594 12.4527 135.924C8.90838 136.268 6.39697 135.38 4.27347 134.683C2.07046 133.96 0.946385 127.892 1.00197 119.754C1.0226 116.733 2.02621 116.007 2.87055 115.581C3.71488 115.155 4.62474 115.062 5.51632 115.054C6.40789 115.046 7.2536 115.124 8.24806 115.489" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M36.5926 81.0003C36.5926 82.7707 37.4126 88.2341 39.5629 91.4698C40.1055 92.2864 40.6692 93.0099 41.1724 93.0002C41.6755 92.9905 42.127 92.1955 41.9674 91.6402C41.0233 90.7936 39.0355 90.147 36.8787 89.4809C35.9015 89.1612 35.1625 88.8788 34 88.2121" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M26.0096 147C25.9738 147 25.9381 147 27.8925 147C29.8469 147 33.7925 147 38 147" stroke="black" stroke-width="2" stroke-linecap="round"/>
</svg>


                    </h3>
                    {ErrorSvg && (
                        <div className="error-message">
                            <ErrorSvg />
                        </div>
                    )}
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="اسمك يهمنا!"
                            value={name}
                            onChange={(e) => {
                                const raw = e.target.value;
                                let val = raw;
                                // No leading spaces
                                val = val.replace(/^\s+/, '');
                                const hadExtraSpace =
                                    raw !== val || (raw.match(/\s/g) || []).length > 1;
                                // Max one space (strip extras from paste, etc.)
                                const firstSpace = val.indexOf(' ');
                                if (firstSpace !== -1) {
                                    val = val.slice(0, firstSpace + 1) + val.slice(firstSpace + 1).replace(/\s/g, '');
                                }
                                setName(val);

                                const arabicOnly = /^[\u0600-\u06FF\s]*$/;
                                if (val && !arabicOnly.test(val)) {
                                    setErrorType('arabic');
                                } else if (hadExtraSpace) {
                                    setErrorType('empty');
                                } else {
                                    setErrorType('');
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key !== ' ') return;
                                // Block leading space or a second space — show same error as empty name
                                if (name.length === 0) {
                                    e.preventDefault();
                                    setErrorType('empty');
                                    return;
                                }
                                if (name.includes(' ')) {
                                    e.preventDefault();
                                    setErrorType('empty');
                                }
                            }}
                            // style={errorType ? { color: '#fff' } : {}}
                        />
                        <button onClick={handleNext}>التالي</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PageOne;
