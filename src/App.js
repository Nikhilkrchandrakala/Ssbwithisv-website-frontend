import './App.css';
import './custom.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from './pages/Home/Home';
import About from "./pages/About";
import Magnize from './pages/Magnize';
import HalfOfFame from './pages/HalfOfFame';
import Courses from './pages/Courses';
import GtoTrain from './pages/Home/GtoTrain';
import ScrollToTop from './components/ScrollToTop';
import SsbPage from './pages/SsbPage';
import Contact from './pages/Contact';
import Login from './pages/Login';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import RefundCancellation from './pages/RefundCancellation';
import CookieBanner from './pages/CookieBanner';

// import LoadingScreen from './components/LoadingScreen';

import { Toaster } from 'react-hot-toast';
import LoadingScreen from './pages/LoadingScreen';
import Blogs from './pages/blogs/Blogs';
import BlogsDetails from './pages/blogs/BlogsDetails';
import SignIn from './pages/register/SignIn';
import SignUp from './pages/register/SignUp';
import AccountRecovery from './pages/register/AccountRecovery';
import Successful from './pages/register/Successful';
import AuthRoute from './components/AuthRoute';

function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // ⏳ splash screen duration (2 sec)

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <CookieBanner />

      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutssbwithisv" element={<About />} />
        <Route path="/Magazine" element={<Magnize />} />
        <Route path="/HalfOfFame" element={<HalfOfFame />} />
        <Route path="/Courses" element={<Courses />} />
        <Route path="/ssbVirtualTrainingXperience" element={<GtoTrain />} />
        <Route path="/aboutSSB" element={<SsbPage />} />
        <Route path="/Contactus" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/TermsConditions" element={<TermsConditions />} />
        <Route path="/RefundCancellation" element={<RefundCancellation />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogsDetails" element={<BlogsDetails />} />
        <Route element={<AuthRoute />}>
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/AccountRecovery" element={<AccountRecovery />} />
        </Route>
        <Route path="/Successful" element={<Successful />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
