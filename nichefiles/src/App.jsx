import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Read from './pages/Read';
import Learning from './pages/Learning';
import Header from './components/Header/Header';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main style={{ padding: '0rem 2rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/read/:slug" element={<Read />} />
            <Route path="/learning" element={<Learning />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;