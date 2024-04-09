import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreateBook from './pages/CreateBook';
import UpdateBook from './pages/UpdateBook';
import BookPage from './pages/BookPage';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';
import Disclaimer from './pages/Disclaimer';
import SupportUs from './pages/SupportUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditons from './pages/TermsConditons';
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/search' element={<Search />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/disclaimer' element={<Disclaimer />} />
        <Route path='/support' element={<SupportUs />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/terms&conditions' element={<TermsConditons />} />        
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-book' element={<CreateBook />} />
          <Route path='/update-book/:bookId' element={<UpdateBook />} />
        </Route>
        <Route path='/book/:bookSlug' element={<BookPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}