import type {Comment} from '../../types';
import CommentItem from './CommentItem';

interface CommentListProps {
    comments: Comment[];
}

export default function CommentList({comments}: CommentListProps) {
    if (comments.length === 0) {
        return <p className="text-gray-500">No comments yet.</p>;
    }

    return (
        <div className="flex flex-col gap-4">
            {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment}/>
            ))}
        </div>
    );
}