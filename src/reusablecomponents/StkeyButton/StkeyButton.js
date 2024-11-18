import React from 'react';
import Draggable from 'react-draggable'; // Import Draggable
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './StkeyButton.css'; // Import custom CSS

const StkeyButton = ({ className, icon, isDraggable = true }) => {

    const handleGoBack = () => {
        window.history.back(); // Go back in history
    };

    const ButtonContent = (
        <button
            className={className || 'btn btn-primary stkey-button'}
            title='Back'
        >
            <FontAwesomeIcon onClick={handleGoBack} icon={icon || faAngleLeft} />
        </button>
    );

    return isDraggable ? (
        <Draggable bounds="parent">
            {ButtonContent}
        </Draggable>
    ) : (
        ButtonContent
    );
};

export default StkeyButton;











// import React, { useState } from 'react';
// import Draggable from 'react-draggable'; // Import Draggable
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import './StkeyButton.css'; // Import custom CSS

// const StkeyButton = () => {

//     const handleGoBack = () => {
//         window.history.back(); // Go back in history
//     };

//     return (
//         <Draggable
//             bounds="parent" // Ensure the button stays within the parent container
//         >
//             <button
//                 className="btn btn-primary stkey-button"
//                 onClick={handleGoBack}
//                 title='Back'
//             >
//                 <FontAwesomeIcon icon={faAngleLeft} />
//             </button>
//         </Draggable>
//     );
// };

// export default StkeyButton;
