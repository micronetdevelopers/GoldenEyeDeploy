import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useUser } from '../../Auth/AuthProvider/AuthContext';
import UserProfile from '../UserProfile/UserProfile';
import { useNavigate } from 'react-router-dom';
import userProfilePng from '../../assets/images/User.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const { user, logout } = useUser();

    // Mobile menu toggle handler
    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

    // Logout function
    const handleLogout = async () => {
        try {
            await logout();
            setIsProfileModalOpen(false);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleProfileClick = () => setIsProfileModalOpen(true);
    const closeProfileModal = () => setIsProfileModalOpen(false);

    // Close the mobile menu if the window is resized above 768px
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) setIsMobileMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Role-based authorization
    const isAuthorized = () => user?.roleName === 'superadmin' || user?.roleName === 'admin';
    const isActive = (path) => location.pathname === path ? 'active' : '';

    // Navbar background based on user role
    const getNavbarClass = () => {
        let navbarClass = 'GeopicXNavbar'; // Default class
        if (user?.roleName === 'superadmin') navbarClass += ' superadmin-background';
        else if (user?.roleName === 'admin') navbarClass += ' admin-background';
        else if (user?.roleName === 'user') navbarClass += ' user-background';
        return navbarClass;
    };

    // Centralized navigation links array
    const navLinks = [
        { to: "/", label: "Home", className: "GENavLinkHome" },
        { to: "/about", label: "About Us", className: "GENavLinkAboutUs" },
        { to: "/products", label: "Products", className: "GENavLinkProducts" },
        { to: "/services", label: "Services", className: "GENavLinkServices" },
        { to: "/contact", label: "Contact Us", className: "GENavLinkContactUs" }
    ];

    return (
        <>
            <nav className={getNavbarClass()} id="GENavBarContainer">
                <div className="nav-links GENavLinkContainer">
                    {navLinks.map(link => (
                        <Link key={link.to} to={link.to} className={`${isActive(link.to)} ${link.className}`}>
                            {link.label}
                        </Link>
                    ))}
                    {/* {isAuthorized() && ( */}
                    <>
                        <Link
                            to="/data"
                            className={`nav-link GENavLinkData ${isAuthorized() ? '' : 'disabled'} ${isActive('/data')}`}
                            aria-disabled={!isAuthorized()}
                        >
                            Data
                        </Link>
                        <Link
                            to="/Manage"
                            className={`nav-link GENavLinkManage ${isAuthorized() ? '' : 'disabled'} ${isActive('/Manage')}`}
                            aria-disabled={!isAuthorized()}
                        >
                            Manage
                        </Link>
                    </>
                    {/* )} */}
                </div>

                <div className="GENavAuthBtn">
                    {user ? (
                        <>
                            <div className='flex items-center gap-2'>
                                <span className="GEUserProfileName">{user?.user} ({user?.roleName})</span>
                                <img
                                    src={userProfilePng}
                                    alt="User"
                                    style={{ cursor: 'pointer' }}
                                    width="30"
                                    height="30"
                                    onClick={handleProfileClick}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="GELoginBtn">
                            <Link to="/login" className={isActive('/login')}>Login</Link>
                        </div>
                    )}
                </div>

                <button
                    className="GEMobileMenuToggle"
                    onClick={toggleMobileMenu}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-menu"
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} />
                </button>

                <div
                    id="mobile-menu"
                    className={`GEMobileMenu ${isMobileMenuOpen ? 'GEMobileMenuOpen' : ''}`}
                >
                    {navLinks.map(link => (
                        <Link key={link.to} to={link.to} className={isActive(link.to)} onClick={toggleMobileMenu}>
                            {link.label}
                        </Link>
                    ))}
                    {/* {isAuthorized() && ( */}
                    <>
                        <Link
                            to="/data"
                            className={`nav-link ${isAuthorized() ? '' : 'disabled'} ${isActive('/data')}`}
                            onClick={toggleMobileMenu}
                            aria-disabled={!isAuthorized()}
                        >
                            Data
                        </Link>
                        <Link
                            to="/Manage"
                            className={`nav-link ${isAuthorized() ? '' : 'disabled'} ${isActive('/Manage')}`}
                            onClick={toggleMobileMenu}
                            aria-disabled={!isAuthorized()}
                        >
                            Manage
                        </Link>
                    </>
                    {/* )} */}
                </div>
            </nav>

            {isProfileModalOpen && (
                <UserProfile
                    isOpenprofile={isProfileModalOpen}
                    closeModal={closeProfileModal}
                />
            )}
        </>
    );
};

export default Navbar;


















// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import './Navbar.css';
// import { useUser } from '../../Auth/AuthProvider/AuthContext';
// import UserProfile from '../UserProfile/UserProfile';
// import { useNavigate } from 'react-router-dom';
// import userProfilePng from '../../assets/images/User.png';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faXmark, faBars } from "@fortawesome/free-solid-svg-icons";

// const Navbar = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
//     const { user, logout } = useUser();

//     const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

//     const handleLogout = async () => {
//         try {
//             await logout();
//         } catch (error) {
//             console.error("Logout failed:", error);
//         }
//         setIsProfileModalOpen(false);
//         navigate("/login");
//     };

//     const handleProfileClick = () => setIsProfileModalOpen(true);

//     const closeProfileModal = () => setIsProfileModalOpen(false);

//     useEffect(() => {
//         const handleResize = () => {
//             if (window.innerWidth > 768) setIsMobileMenuOpen(false);
//         };

//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     const isAuthorized = user?.roleName === 'superadmin' || user?.roleName === 'admin';

//     const isActive = (path) => location.pathname === path ? 'active' : '';

//     // Conditionally set the background color class based on the roleName
//     let navbarClass = 'GeopicXNavbar'; // Default class

//     if (user?.roleName === 'superadmin') {
//         navbarClass += ' superadmin-background';
//     } else if (user?.roleName === 'admin') {
//         navbarClass += ' admin-background';
//     } else if (user?.roleName === 'user') {
//         navbarClass += ' user-background';
//     }

//     return (
//         <>
//             <nav className={navbarClass} id='GENavBarContainer'>
//                 <div className="nav-links GENavLinkContainer">
//                     <Link to="/" className={`${isActive('/')} GENavLinkHome`}>Home</Link>
//                     <Link to="/about" className={`${isActive('/about')} GENavLinkAboutUs`}>About Us</Link>
//                     <Link to="/products" className={`${isActive('/products')} GENavLinkProducts`}>Products</Link>
//                     <Link to="/services" className={`${isActive('/services')} GENavLinkServices`}>Services</Link>
//                     <Link to="/contact" className={`${isActive('/contact')} GENavLinkContactUs`}>Contact Us</Link>
//                     <>
//                         <Link
//                             to="/data"
//                             className={`nav-link GENavLinkData ${isAuthorized ? '' : 'disabled'} ${isActive('/data')}`}
//                             aria-disabled={!isAuthorized}
//                         >
//                             Data
//                         </Link>
//                         <Link
//                             to="/Manage"
//                             className={`nav-link GENavLinkManage ${isAuthorized ? '' : 'disabled'} ${isActive('/Manage')}`}
//                             aria-disabled={!isAuthorized}
//                         >
//                             Manage
//                         </Link>
//                     </>
//                 </div>
//                 <div className="GENavAuthBtn">
//                     {user ? (
//                         <>
//                             <span className='GEUserProfileName'>{user?.user} ({user?.roleName}) </span>
//                             <img src={userProfilePng} alt="User" style={{ cursor: 'pointer' }} width="30" height="30" onClick={handleProfileClick} />
//                         </>
//                     ) : (
//                         <div className="GELoginBtn">
//                             <Link to="/login" className={isActive('/login')}>Login</Link>
//                         </div>
//                     )}
//                 </div>
//                 <button
//                     className="GEMobileMenuToggle"
//                     onClick={toggleMobileMenu}
//                     aria-expanded={isMobileMenuOpen}
//                     aria-controls="mobile-menu"
//                     aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
//                 >
//                     {isMobileMenuOpen ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faBars} />}
//                 </button>
//                 <div
//                     id="mobile-menu"
//                     className={`GEMobileMenu ${isMobileMenuOpen ? 'GEMobileMenuOpen' : ''}`}
//                 >
//                     <Link to="/" className={isActive('/')} onClick={toggleMobileMenu}>Home</Link>
//                     <Link to="/about" className={isActive('/about')} onClick={toggleMobileMenu}>About Us</Link>
//                     <Link to="/products" className={isActive('/products')} onClick={toggleMobileMenu}>Products</Link>
//                     <Link to="/services" className={isActive('/services')} onClick={toggleMobileMenu}>Services</Link>
//                     <Link to="/contact" className={isActive('/contact')} onClick={toggleMobileMenu}>Contact Us</Link>
//                     <>
//                         <Link
//                             to="/data"
//                             className={`nav-link ${user ? '' : 'disabled'} ${isActive('/data')}`}
//                             onClick={e => !user && e.preventDefault()}
//                             aria-disabled={!user}
//                         >
//                             Data
//                         </Link>
//                         <Link
//                             to="/Manage"
//                             className={`nav-link ${user ? '' : 'disabled'} ${isActive('/Manage')}`}
//                             onClick={e => !user && e.preventDefault()}
//                             aria-disabled={!user}
//                         >
//                             Manage
//                         </Link>
//                     </>
//                 </div>
//             </nav>
//             {isProfileModalOpen && <UserProfile isOpenprofile={isProfileModalOpen}
//                 closeModal={closeProfileModal} />}
//         </>
//     );
// };

// export default Navbar;
