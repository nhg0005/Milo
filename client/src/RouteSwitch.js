// React Router DOM
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import App from "./App";
import HomePage from "./pages/Home_Page/HomePage";
import ProfilePage from './pages/Profile_Page/ProfilePage';
import FriendsPage from "./pages/Friends_Page/FriendsPage";

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/home' element={<HomePage />} />
                <Route path='/profile/:userID' element={<ProfilePage />} />
                <Route path='/friends' element={<FriendsPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default RouteSwitch;