import React from 'react';
import GetGearForm from '../Forms/GetGearForm.jsx';
import './GetGuiBassGear.css';
import config from "../../../config.jsx";
import PostComment from '../../Components/PostComment.jsx'; // Import PostComment

function GetGuitBassGear() {
    const categories = [
        "Elektrisk Guitar", "Akustisk Guitar", "Semi-Hollow Guitar", "Guitarforstærker",
        "Effekt Pedal", "Tilbehør til Guitar", "Elektrisk Bas", "Akustisk Bas",
        "Kontrabas", "Basforstærker", "Tilbehør til Bas", "Andet"
    ];

    return (
        <GetGearForm
            gearType="Guitar og Basudstyr"
            apiEndpoint={`${config.apiBaseUrl}/api/GuitBassGear`}
            categories={categories}
            gearTypeKey="guitBassType"
            PostCommentComponent={PostComment} // Pass PostComment as a prop
        />
    );
}

export default GetGuitBassGear;