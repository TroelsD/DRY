import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import config from "../../config.jsx";
import './PostComment.css';

const PostComment = ({ musicGearId, onNewComment }) => {
    const [text, setText] = useState('');
    const [error, setError] = useState('');

    const getUserIdByEmail = (email) => {
        const emailToUserIdMap = JSON.parse(localStorage.getItem('emailToUserIdMap'));
        return emailToUserIdMap[email];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = localStorage.getItem('email'); // Assuming email is stored in localStorage
        const userId = getUserIdByEmail(email); // Get userId using email
        const payload = {
            musicGearId,
            userId,
            commentDto: {
                text
            }
        };
        try {
            const response = await axios.post(`${config.apiBaseUrl}/api/Comment`, payload);
            setError('');
            setText('');
            onNewComment(musicGearId, response.data); // Call the callback function with the new comment
        } catch (err) {
            console.error('Validation errors:', err.response.data.errors);
            setError('Failed to post comment.');
        }
    };

    return (
        <div className="post-comment-container">
            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your comment here..."
                    required
                    className="post-comment-textarea"
                />
                <button type="submit" className="post-comment-button">Post Comment</button>
            </form>
            {error && <p className="post-comment-error">{error}</p>}
        </div>
    );
};

PostComment.propTypes = {
    musicGearId: PropTypes.number.isRequired,
    onNewComment: PropTypes.func.isRequired,
};

export default PostComment;