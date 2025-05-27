import type {Comment} from '../../types';
import {User} from 'lucide-react';

interface CommentItemProps {
    comment: Comment;
}

export default function CommentItem({comment}: CommentItemProps) {
    return (
        <div className="bg-background-beige p-2 rounded-lg shadow text-sm text-gray-700 border border-gray-100">
            <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-700 p-2 rounded-md flex items-center justify-center">
                    <User className="w-4 h-4"/>
                </div>
                <div className="flex flex-col w-full overflow-hidden">
                    <div className="flex justify-between text-xs text-gray-500 mb-1 select-none">
                        <span className="font-semibold truncate max-w-[60%]">{comment.author}</span>
                        <time dateTime={comment.createdAt} className="whitespace-nowrap">
                            {new Date(comment.createdAt).toLocaleString()}
                        </time>
                    </div>
                    <p className="text-sm text-gray-700 break-words">{comment.content}</p>
                </div>
            </div>
        </div>
    );
}