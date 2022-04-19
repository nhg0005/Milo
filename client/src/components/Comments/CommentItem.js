// Styling
import { useEffect, useState } from 'react';
import './CommentItem.css';

const CommentItem = ({ comment }) => {
    
    // State Hooks
    const [date, setDate] = useState();

    // Lifecycle Hooks
    useEffect(() => {
        // Format the date
        const timestamp = new Date(comment.timestamp).toLocaleString([], { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        setDate(timestamp);

    }, [])

    return (
        <div className='comment'>
            <span className='comment-name'>
                {comment.username.first_name + " " + comment.username.last_name}
                <span className='comment-time'>{date}</span>
            </span>
            <p className='comment-text'>{comment.text}</p>
        </div>
    )
}

export default CommentItem;