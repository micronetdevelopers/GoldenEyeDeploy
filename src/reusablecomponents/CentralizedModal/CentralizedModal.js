import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import GoldenEyeLogo from '../../assets/Logos/GOLDEYE_LOGO1_10K.png'
import './CentralizedModal.css'

const CentralizedModal = ({ show, handleClose, title, children }) => {
    const modalRef = React.useRef(null);

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
            ref={modalRef}
            className='GeCentralizedModal'
        >
            <Modal.Header closeButton className='GeCentralizedModalHeader'>
                <Modal.Title>
                    <div className='d-flex'>
                        <img src={GoldenEyeLogo} width="30" height="30" />
                        <h4 className="text-heading GeTitle">{title}</h4>
                    </div>
                </Modal.Title>
                {/* <StkeyButton className="ColseBTNlogin" icon={faXmark} isDraggable={false} /> */}
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            {/* <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => alert("Action executed!")}>
                    Save Changes
                </Button>
            </Modal.Footer> */}
        </Modal>
    );
};

export default CentralizedModal;
