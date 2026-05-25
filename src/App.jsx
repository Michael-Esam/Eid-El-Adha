import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import PageOne from './componans/PageOne'
import PageTwo from './componans/PageTwo'
import PageThree from './componans/PageThree'
import PageFour from './componans/PageFour'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PageOne />} />
          <Route path="/page-two" element={<PageTwo />} />
          <Route path="/page-three" element={<PageThree />} />
          <Route path="/page-four" element={<PageFour />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
