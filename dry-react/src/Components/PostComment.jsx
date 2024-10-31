import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import config from "../../config.jsx";
import './PostComment.css';

const PostComment = ({ musicGearId, userId, onNewComment }) => {
    const [text, setText] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            musicGearId,
            userId,
            text
        };
        console.log('Request Payload:', payload);
        try {
            const response = await axios.post(`${config.apiBaseUrl}/api/Comment`, payload);
            setSuccess('Comment posted successfully!');
            setError('');
            setText('');
            onNewComment(musicGearId, response.data); // Call the callback function with the new comment
        } catch (err) {
            console.error('Error response:', err.response);
            setError('Failed to post comment.');
            setSuccess('');
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
            {success && <p className="post-comment-success">{success}</p>}
        </div>
    );
};

PostComment.propTypes = {
    musicGearId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    onNewComment: PropTypes.func.isRequired, // Add prop type for onNewComment
};

export default PostComment;