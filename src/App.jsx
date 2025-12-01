import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddBookPage from "./pages/AddBookPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";

function App() {
    return (
        <Router>
            <Header />

            <div className="container mt-3">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/add" element={<AddBookPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
