import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import './index.css';
import BioSampleDetailPage from "./pages/BioSampleDetailPage.tsx";
import BioSampleListPage from "./pages/BioSampleListPage.tsx";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/biosamples" replace/>}/>
                <Route path="/biosamples" element={<BioSampleListPage/>}/>
                <Route path="/biosamples/:id" element={<BioSampleDetailPage/>}/>
            </Routes>
        </Router>
    );
}
