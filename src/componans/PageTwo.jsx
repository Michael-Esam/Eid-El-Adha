import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';

const PageTwo = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const userName = location.state?.name;

    const handleNext = () => {
        if (!selectedOption) {
            setErrorMessage('الرجاء اختيار أحد الخيارات للمتابعة');
            return;
        }
        navigate('/page-three', {
            state: {
                name: userName,
                memberType: selectedOption,
            }
        });
    };

    useEffect(() => {
        if (!userName) navigate('/');
    }, [userName, navigate]);

    return (
        <div className="page-container-tow">
            <Header />
            <div className="page-two">
                <div className="card">
                    <div className="card-content">

                        <h3>علاقتك بمجموعة مطوري جوجل :</h3>
                        <button
                            className={`btn-choice ${selectedOption === 'gdsc' ? 'selected' : ''}`}
                            onClick={() => { setSelectedOption('gdsc'); setErrorMessage(''); }}
                        >
                            مستفيد/ة
                        </button>
                        <button
                            className={`btn-choice blue ${selectedOption === 'other' ? 'selected' : ''}`}
                            onClick={() => { setSelectedOption('other'); setErrorMessage(''); }}
                        >
                            لا
                        </button>
                    </div>
                    {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                    )}
                    <div className="action-buttons">
                        <Link to="/"><button className="yellow">السابق</button></Link>
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

export default PageTwo;
