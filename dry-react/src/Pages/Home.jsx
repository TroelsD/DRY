import React, { useEffect, useState } from 'react';
import './Home.css';
import config from '../../config.jsx';
import HomeGearCard from "./HomeGearCard.jsx";

function Home() {
    const [musicGear, setMusicGear] = useState([]);

    useEffect(() => {
        const fetchMusicGear = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/api/MusicGear`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMusicGear(Array.isArray(data.items) ? data.items : []);
            } catch (error) {
                console.error('Error fetching music gear:', error);
            }
        };
        fetchMusicGear();
    }, []);

    return (
        <div className="home-container">
            <h1>Her skal være et hero billede med en div i</h1>
            <div className="carousel-container">
                {musicGear.map((item) => (
                    <HomeGearCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}

export default Home;