import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateAdminUser from './CreateAdminUser/CreateAdminUser';
import './Manage.css';
import CentraliseButton from '../../reusablecomponents/CentraliseButton/CentraliseButton';

const ManageUser = () => (
    <Card body className="mt-3">
        <h2>Manage Users</h2>
        {/* Add your form or content for managing users here */}
    </Card>
);

const Manage = () => {
    const [selectedOption, setSelectedOption] = useState('create'); // Default to 'create'

    const handleButtonClick = (option) => {
        setSelectedOption(option);
    };

    return (
        <Container className="GEManage mt-5 mb-3 p-3">
            <Row className="justify-content-center">
                <Col md={6} className="d-flex justify-content-center">
                    <CentraliseButton
                        onClick={() => handleButtonClick('create')}
                        type="submit"
                        text="CREATE USER"
                        variant={selectedOption === 'create' ? '#2b6e5b' : '#d2dce3'}
                        padding="4px 4px"
                        hoverBgColor={selectedOption === 'create' ? '#2b6e5bcf' : '#d2dce3'}
                        hoverTextColor="white"
                        width="150px"
                        fontsize='15px'
                        className={selectedOption === 'create' ? 'GEManageActiveButton me-2' : 'GEManageInactiveButton me-2'}
                    />
                    <CentraliseButton
                        onClick={() => handleButtonClick('manage')}
                        type="submit"
                        text="MANAGE USER"
                        variant={selectedOption === 'manage' ? '#2b6e5b' : '#d2dce3'}
                        padding="4px 4px"
                        hoverBgColor={selectedOption === 'manage' ? '#2b6e5bcf' : '#d2dce3'}
                        hoverTextColor="white"
                        width="150px"
                        fontsize='15px'
                        className={selectedOption === 'manage' ? 'GEManageActiveButton me-5' : 'GEManageInactiveButton me-5'}
                    />
                </Col>
            </Row>
            <div className='d-flex justify-content-center'>
                <hr className="Horizontal-Line mb-1 mt-15 w-75"></hr>
            </div>
            <Row className="mt-2">
                <Col md={12}>
                    {selectedOption === 'create' ? <CreateAdminUser /> : <ManageUser />}
                </Col>
            </Row>
        </Container>
    );
};

export default Manage;










// import React, { useState } from 'react';
// import { Container, Row, Col, Form, Card } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import CreateAdminUser from './CreateAdminUser/CreateAdminUser'

// const ManageUser = () => (
//     <Card body className="mt-3">
//         <h2>Manage Users</h2>
//         {/* Add your form or content for managing users here */}
//     </Card>
// );

// const Manage = () => {
//     const [selectedOption, setSelectedOption] = useState('create'); // Default to 'create'

//     const handleChange = (event) => {
//         setSelectedOption(event.target.value);
//     };

//     return (
//         <Container className="mt-4">
//             <Row className="justify-content-center">
//                 <Col md={4}>
//                     <Form className="d-flex align-items-center">
//                         <Form.Check
//                             type="radio"
//                             label="Create User"
//                             value="create"
//                             checked={selectedOption === 'create'}
//                             onChange={handleChange}
//                             className="me-3"
//                         />
//                         <Form.Check
//                             type="radio"
//                             label="Manage Users"
//                             value="manage"
//                             checked={selectedOption === 'manage'}
//                             onChange={handleChange}
//                         />
//                     </Form>
//                 </Col>
//             </Row>
//             <Row className="mt-4">
//                 <Col md={12}>
//                     {selectedOption === 'create' ? <CreateAdminUser /> : <ManageUser />}
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default Manage;
