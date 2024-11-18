import React from 'react'
import "./Header.css"
import Micronetlogo from '../../assets/Logos/MSOLU_10K.png';
import GoldenEyelogo from '../../assets/Logos/GOLDEYE_LOGO_10K.png';


const Header = () => {
    return (
        <>
            <div className="header1">
                <div className="left-side">
                    <img src={GoldenEyelogo} alt="GoldenEye Logo" width="44" height="auto" />
                    <h1 className="heading">Golden Eye</h1>
                </div>
                <div className="right-side">
                    <img src={Micronetlogo} alt="GoldenEye Logo" className="logo" width="30" height="30" />
                    {/* <select className="language-select">
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                    </select> */}
                </div>
            </div>
        </>
    )
}

export default Header;