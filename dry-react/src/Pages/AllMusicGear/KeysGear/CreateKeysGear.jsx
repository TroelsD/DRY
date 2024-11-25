import React from 'react';
import GearForm from '../../Forms/GearForm.jsx';
import config from "../../../../config.jsx";

function CreateKeysGear() {
    const categories = [
        "Synthsizere", "Keyboards", "Klaverer", "Stage Pianos", "Flygler",
        "Orgler", "Akkordeons", "Tilbehør til klaverer og flygler", "Andet"
    ];

    return <GearForm gearType="Keys Gear" categories={categories} apiEndpoint={`${config.apiBaseUrl}/api/KeysGear`} />;
}

export default CreateKeysGear;