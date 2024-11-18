import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faUserEdit, faLock } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../Auth/AuthProvider/AuthContext';
import CentralizedModal from '../CentralizedModal/CentralizedModal';
import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '../apiService/ApiService'; // Import the service
import UpdateProfile from '../UpdateProfile/UpdateProfile';
import '../../reusablecomponents/UserProfile/UserProfile.css';

const UserProfile = ({ isOpenprofile, closeModal }) => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const profileModalRef = useRef(null);

    // State to manage the visibility of the "Update Profile" modal
    const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);

    // Handle opening the Update Profile modal
    const openUpdateProfileModal = () => setShowUpdateProfileModal(true);
    const closeUpdateProfileModal = () => setShowUpdateProfileModal(false);

    // React Query hook to handle the profile fetch
    const { data: userProfile, isLoading, isError, error } = useQuery({
        queryKey: ['userProfile', user?.user], // queryKey must be an array
        queryFn: () => fetchUserProfile(user?.user, user?.access), // Fetch function with username and token
        enabled: showUpdateProfileModal, // Fetch only when the modal is open
    });

    // Handle logout functionality
    const handleLogout = async () => {
        try {
            await logout();
            console.log('Logout successful');
            closeModal();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Handle change password functionality
    const handleChangePassword = () => {
        closeModal();
        const username = encodeURIComponent(user?.user);
        const roleName = encodeURIComponent(user?.roleName);
        const accessToken = encodeURIComponent(user?.access);
        window.location.href = `/ChangePassword?username=${username}&roleName=${roleName}&accessToken=${accessToken}`;
    };

    return (
        <div className="card_waper d-none d-md-block" ref={profileModalRef}>
            <header className="card-header">
                <button className="close-btn" onClick={closeModal}>×</button>
                <div className="avatar">{user?.user?.charAt(0).toUpperCase()}</div>
                <h5 className="card-title mb-1 text-white">{user?.user}</h5>
            </header>

            <div className="card-body d-flex flex-column">
                <Link className="text-info text-left" onClick={openUpdateProfileModal}>
                    <FontAwesomeIcon icon={faUserEdit} /> Update Profile
                </Link>

                <Link className="text-info text-left mt-4" onClick={handleChangePassword}>
                    <FontAwesomeIcon icon={faLock} /> Change Password
                </Link>

                <button className="btn btn-sm mt-4 btn-danger ml-2" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                </button>
            </div>

            {/* Centralized Modal for Update Profile */}
            <CentralizedModal
                show={showUpdateProfileModal}
                handleClose={closeUpdateProfileModal}
                title="Update Profile"
            >
                {isLoading && <p>Loading...</p>}
                {isError && <p>Error fetching profile data: {error.message}</p>}
                {!isLoading && userProfile && (
                    <UpdateProfile closeModal={closeUpdateProfileModal} userProfile={userProfile} />
                )}
            </CentralizedModal>
        </div>
    );
};

export default UserProfile;












// import React, { useRef, useEffect, useState, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faRightFromBracket, faUserEdit, faLock } from '@fortawesome/free-solid-svg-icons';
// import { useUser } from '../../Auth/AuthProvider/AuthContext';
// import CentralizedModal from '../CentralizedModal/CentralizedModal';
// import '../../reusablecomponents/UserProfile/UserProfile.css';
// import UpdateProfile from '../UpdateProfile/UpdateProfile'

// const UserProfile = ({ isOpenprofile, closeModal }) => {
//     const { user, logout } = useUser();
//     const navigate = useNavigate();
//     const profileModalRef = useRef(null);

//     // State to manage the visibility of the "Update Profile" modal
//     const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);

//     // Handle opening the Update Profile modal
//     const openUpdateProfileModal = () => setShowUpdateProfileModal(true);
//     const closeUpdateProfileModal = () => setShowUpdateProfileModal(false);

//     // Handle logout functionality
//     const handleLogout = async () => {
//         try {
//             await logout();
//             console.log('Logout successful');
//             closeModal();
//             navigate("/login");
//         } catch (error) {
//             console.error("Logout failed:", error);
//         }
//     };

//     // Handle change password functionality
//     const handleChangePassword = () => {
//         closeModal();
//         const username = encodeURIComponent(user?.user);
//         const roleName = encodeURIComponent(user?.roleName);
//         const accessToken = encodeURIComponent(user?.access);
//         window.location.href = `/ChangePassword?username=${username}&roleName=${roleName}&accessToken=${accessToken}`;
//     };

//     return (
//         <div className="card_waper d-none d-md-block" ref={profileModalRef}>
//             <header className="card-header">
//                 <button className="close-btn" onClick={closeModal}>×</button>
//                 <div className="avatar">{user?.user?.charAt(0).toUpperCase()}</div>
//                 <h5 className="card-title mb-1 text-white">{user?.user}</h5>
//             </header>

//             <div className="card-body d-flex flex-column">
//                 <Link className="text-info text-left" onClick={openUpdateProfileModal}>
//                     <FontAwesomeIcon icon={faUserEdit} /> Update Profile
//                 </Link>

//                 <Link className="text-info text-left mt-4" onClick={handleChangePassword}>
//                     <FontAwesomeIcon icon={faLock} /> Change Password
//                 </Link>

//                 <button className="btn btn-sm mt-4 btn-danger ml-2" onClick={handleLogout}>
//                     <FontAwesomeIcon icon={faRightFromBracket} /> Logout
//                 </button>
//             </div>

//             {/* Centralized Modal for Update Profile */}
//             <CentralizedModal
//                 show={showUpdateProfileModal}
//                 handleClose={closeUpdateProfileModal}
//                 title="Update Profile"
//             >
//                 <UpdateProfile closeModal={closeUpdateProfileModal} />
//             </CentralizedModal>
//         </div>
//     );
// };



// export default UserProfile;
