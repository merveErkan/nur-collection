import React from 'react';
import '../styles/SplashScreen.css';
import PanelTemplate from './PanelTemplate';

const SplashScreen = ({ text = "NUR COLLECTION" }) => {
    return (
        <PanelTemplate
            rightContent={
                <div className="panel-container">
                    <div className="splash-container">
                        <h1 className="splash-title">{text}</h1>
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Data is loading, please wait....</p>
                    </div>
                </div>
            }
        ></PanelTemplate>
    );

};

export default SplashScreen;