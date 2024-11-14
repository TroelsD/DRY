import React, { useState, useEffect } from 'react';
import SellCard from "./SellCard.jsx";
import config from '../../../config.jsx';
import './MyProfile.css';

function MyProfile() {
    const [gear, setGear] = useState([]);
    const [users, setUsers] = useState({});
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [showSellCards, setShowSellCards] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No token found');

                const payload = JSON.parse(atob(token.split('.')[1]));
                const email = payload.sub;
                if (!email) throw new Error('Email not found in token');

                const userResponse = await fetch(`${config.apiBaseUrl}/api/User`, {
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!userResponse.ok) throw new Error('Failed to fetch users');

                const users = await userResponse.json();
                const user = users.find(user => user.email === email);
                if (!user) throw new Error('User not found');

                setUserId(user.id);
                setUserName(user.name);
                setUserEmail(user.email);

            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const fetchUserGear = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/api/MusicGear/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                const gearWithComments = await Promise.all(data.map(async (item) => {
                    try {
                        const commentsResponse = await fetch(`${config.apiBaseUrl}/api/Comment/api/MusicGear/${item.id}/comments`);
                        if (!commentsResponse.ok) {
                            return { ...item, comments: [] };
                        }
                        const commentsData = await commentsResponse.json();
                        return { ...item, comments: commentsData };
                    } catch (error) {
                        console.error(error);
                        return { ...item, comments: [] };
                    }
                }));

                setGear(gearWithComments);

                const userResponse = await fetch(`${config.apiBaseUrl}/api/User`);
                if (!userResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const userData = await userResponse.json();
                const userMap = userData.reduce((acc, user) => {
                    acc[user.id] = user;
                    return acc;
                }, {});
                setUsers(userMap);
            } catch (error) {
                console.error('Error fetching user gear or users:', error);
            }
        };

        fetchUserGear();
    }, [userId]);

    const handleImageClick = (src) => {
        // Handle image click if needed
    };

    const handleCommentPosted = async (gearId) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/api/Comment/api/MusicGear/${gearId}/comments`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const commentsData = await response.json();
            setGear((prevGear) =>
                prevGear.map((item) =>
                    item.id === gearId ? { ...item, comments: commentsData } : item
                )
            );
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const toggleShowAllImages = () => {
        // Implement the function to toggle showing all images
    };

    const toggleShowComments = () => {
        // Implement the function to toggle showing comments
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!userName || !userEmail || userEmail === "string" || userName === "string") {
            console.error('Invalid user data');
            return;
        }

        const confirmed = window.confirm('Er du sikker på at du vil gemme disse ændringer?');
        if (!confirmed) return;

        try {
            const userResponse = await fetch(`${config.apiBaseUrl}/api/User`);
            if (!userResponse.ok) {
                throw new Error('Failed to fetch users');
            }
            const users = await userResponse.json();
            const userExists = users.some(user => (user.name === userName || user.email === userEmail) && user.id !== userId);

            if (userExists) {
                setErrorMessage('Brugernavn eller Mail er optaget');
                return;
            }

            const response = await fetch(`${config.apiBaseUrl}/api/User/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ id: userId, name: userName, email: userEmail })
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            setIsEditing(false);
            setErrorMessage('');
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setErrorMessage('');
    };

    return (
        <div className="my-profile">
            <h1 className="ninja">🥷</h1>
            {isEditing ? (
                <div className="edit-profile">
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="input-field"
                    />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            ) : (
                <div className="profile-info">
                    <h2> GearNinja: {userName}</h2>
                    <p><strong>Brugernavn:</strong> {userName}</p>
                    <p><strong>Email:</strong> {userEmail}</p>
                    <button onClick={handleEdit}>Edit</button>
                </div>
            )}

            <button onClick={() => setShowSellCards(!showSellCards)}>
                {showSellCards ? 'Skjul mine annoncer' : 'Se alle mine annoncer'}
            </button>
            {showSellCards && (
                <div className="gear-list">
                    {gear.map((item) => (
                        <SellCard
                            key={item.id}
                            item={item}
                            users={users}
                            handleImageClick={handleImageClick}
                            handleCommentPosted={handleCommentPosted}
                            toggleShowAllImages={toggleShowAllImages}
                            toggleShowComments={toggleShowComments}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyProfile;