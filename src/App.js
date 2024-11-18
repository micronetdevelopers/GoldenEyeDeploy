import './App.css';
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from './reusablecomponents/Header/Header';
import Navbar from './reusablecomponents/Navbar/Navbar';
import Login from '../src/Auth/Login/Login'
import Home from '../src/Pages/Home/Home';
import { UserProvider } from '../src/Auth/AuthProvider/AuthContext'
import Products from './Pages/Products/Products';
import Services from './Pages/Services/Services';
import Contact from './Pages/Contact/Contact';
import Manage from './Auth/Manage/Manage';
import About from './Pages/About/About';
import ChangePassword from './Auth/ChangePassword/ChangePassword';
import ScrollToTop from './reusablecomponents/ScrollToTop/ScrollToTop'
// import RootContainer from './Data-management/Search/maincontainer';
import OpenSearchMap from './Data-management/OpenSearchMap';
import 'ol/ol.css'; // Import OpenLayers CSS
import MultiStepForm from './Data-management/Tasking/SearchComponents/MultiStepForm';

function App() {
  return (

    <UserProvider>
      <Router>
        <ScrollToTop />
        <header className="GoldenEyeHeader">
          <Header />
          <Navbar />
        </header>
        <main className="GoldenEyeMainBodySection" id='MainContentBody'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/Products" element={<Products />} />
            <Route path="/Services" element={<Services />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/Manage' element={<Manage />} />
            <Route path='/ChangePassword' element={<ChangePassword />} />
            {/* <Route path="*" element={<Navigate to="/" />} /> */}

            <Route path="/Data" element={<OpenSearchMap />} ></Route>

          </Routes>
        </main>
        <footer className="GoldenEyeCopyWritefooter">
          <p>&copy; Copyright 2024 Micronet Solutions. All Right Reserved </p>
        </footer>
      </Router>
    </UserProvider>

  );
}

export default App;
