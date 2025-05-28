import {useState} from 'react';
import {Send} from 'lucide-react';
import IconButton from '../UI/IconButton';
import {useApi} from "../../hooks/useApi.ts";

interface CommentFormData {
    content: string;
    author: string;
}

interface CommentFormProps {
    onSubmit: (data: CommentFormData) => Promise<void>;
    initialValues?: Partial<CommentFormData>;
}

export default function CommentForm({onSubmit, initialValues}: CommentFormProps) {
    // Form field states with initial values or empty
    const [content, setContent] = useState(initialValues?.content || '');
    const [author, setAuthor] = useState(initialValues?.author || '');
    const {loading: isSubmitting, error, execute, reset} = useApi<void>({
        onSuccess: () => {
            setContent('');
            setAuthor('');
        },
        onError: (errorMessage) => {
            console.error('Failed to manage comment:', errorMessage);
        }
    });


    // Simple validation: both fields must be non-empty after trim
    const isValid = content.trim().length > 0 && author.trim().length > 0;

    // Native form submit handler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValid || isSubmitting) return;
        reset(); // reset error/loading/data
        try {
            await execute(() => onSubmit({content: content.trim(), author: author.trim()}));
        } catch {
            // error handled by useApi
        }
    };

    // Update content state and clear error on change
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        if (error) reset(); // reset when content change
    };

    // Update author state and clear error on change
    const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthor(e.target.value);
        if (error) reset(); // reset when author change
    };

    // Submit form on Ctrl+Enter inside textarea
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (isValid && !isSubmitting) {
        (async () => {
          reset();
          try {
            await execute(() => onSubmit({ content: content.trim(), author: author.trim() }));
          } catch {
            // error handled by useApi
          }
        })();
      }
    }
  };

    return (
        <div className="flex flex-col gap-2">
            {/* Show error message if any */}
            {error && (
                <div className="text-red-600 text-sm p-2 bg-red-50 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {/* Native HTML form */}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2 rounded-xl border border-customGrayLight p-2 shadow-sm"
                noValidate // Disable native browser validation UI
            >
                {/* Author input with floating label */}
                <div className="relative">
                    <input
                        id="author"
                        type="text"
                        value={author}
                        onChange={handleAuthorChange}
                        disabled={isSubmitting}
                        placeholder=" "
                        className="peer w-full px-2 pt-3 pb-1 text-sm rounded-lg border border-customGrayBorder placeholder-transparent focus:outline-none focus:ring-1 focus:ring-customGrayRing transition disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                    />
                    <label
                        className="absolute left-2 top-1 text-[8px] text-customGrayLabel peer-placeholder-shown:top-2 peer-placeholder-shown:text-xs peer-placeholder-shown:text-customGrayLabelPlaceholder transition-all pointer-events-none">
                        Your name
                    </label>
                </div>

                {/* Comment textarea with floating label and submit button */}
                <div className="relative flex items-end gap-2">
                    <div className="relative w-full">
            <textarea
                id="comment"
                value={content}
                onChange={handleContentChange}
                onKeyDown={handleKeyPress}
                disabled={isSubmitting}
                placeholder=" "
                rows={2}
                className="peer w-full resize-none px-2 pt-4 pb-1 text-sm rounded-lg border border-customGrayBorder placeholder-transparent focus:outline-none focus:ring-1 focus:ring-customGrayRing transition disabled:opacity-50 disabled:cursor-not-allowed"
                required
            />
                        <label
                            className="absolute left-2 top-1 text-[10px] text-customGrayLabel peer-placeholder-shown:top-2 peer-placeholder-shown:text-xs peer-placeholder-shown:text-customGrayLabelPlaceholder transition-all pointer-events-none">
                            Write a comment... (Ctrl+Enter to submit)
                        </label>
                    </div>

                    {/* Submit button with icon */}
                    <IconButton type="submit" disabled={isSubmitting} title="Submit comment">
                        <Send size={18}/>
                    </IconButton>
                </div>
            </form>
        </div>
    );
}
