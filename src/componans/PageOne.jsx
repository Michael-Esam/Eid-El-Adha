import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';

const PageOne = () => {
    const location = useLocation();
    const [name, setName] = useState(location.state?.name || '');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleNext = () => {
        const trimmed = name.trim();
        const arabicOnly = /^[\u0600-\u06FF\s]+$/;


        if (!trimmed) {
            setErrorMessage('الرجاء إدخال الاسم');
            return;
        }

        if (!arabicOnly.test(trimmed)) {
            setErrorMessage('الرجاء كتابة الاسم باللغة العربية فقط');
            return;
        }

        navigate('/page-two', { state: { name } });
    };

    return (
        <div className="page-container-one">
            <Header />
            <div className="page-one">
                <div className="card">
                    <h3>أدخل الاسم الثنائي</h3>
                    {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                    )}
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="اسمك يهمنا!"
                            value={name}
                            onChange={(e) => {
                                // Strip any second space (e.g. from paste) — allow max one space
                                let val = e.target.value;
                                const firstSpace = val.indexOf(' ');
                                if (firstSpace !== -1) {
                                    // Keep only up to and including the first space, then the rest with no spaces
                                    val = val.slice(0, firstSpace + 1) + val.slice(firstSpace + 1).replace(/ /g, '');
                                }
                                setName(val);
                                // Error 1: show Arabic-only error while typing non-Arabic
                                const arabicOnly = /^[\u0600-\u06FF\s]*$/;
                                if (val && !arabicOnly.test(val)) {
                                    setErrorMessage('الرجاء كتابة الاسم باللغة العربية فقط');
                                } else {
                                    setErrorMessage('');
                                }
                            }}
                            onKeyDown={(e) => {
                                // Block a second space and show error
                                if (e.key === ' ' && name.includes(' ')) {
                                    e.preventDefault();
                                    setErrorMessage('مسموح بمسافة واحدة فقط');
                                    return;
                                }
                            }}
                            style={errorMessage ? { color: '#fff' } : {}}
                        />
                        <button onClick={handleNext}>التالي</button>
                    </div>
                </div>
            </div>
            <footer>
                <a href='https://linktr.ee/ai.wadod' target='_blank'>تصميم و تطوير <span>ودود</span></a>
            </footer>
        </div>
    );
};

export default PageOne;
