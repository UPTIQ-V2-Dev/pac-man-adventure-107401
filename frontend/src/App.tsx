import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PacManPage } from './pages/PacManPage';

export const App = () => {
    return (
        <Router>
            <div className="h-screen w-screen">
                <Routes>
                    <Route path="/" element={<Navigate to="/game" replace />} />
                    <Route path="/game" element={<PacManPage />} />
                </Routes>
            </div>
        </Router>
    );
};
