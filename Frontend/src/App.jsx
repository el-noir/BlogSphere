import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import LoginPage from "./pages/login.jsx";
import RegisterPage from "./pages/register.jsx";
import AddBlogPage from "./pages/addblog.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/add-blog" element={<AddBlogPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
