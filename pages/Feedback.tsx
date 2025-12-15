import React, { useState } from 'react';
import { Star, Send, Aperture } from 'lucide-react';

const Feedback: React.FC = () => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-900 p-4 text-center animate-fade-in">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center mb-4">
                    <Send size={32} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Thank You!</h1>
                <p className="text-gray-500 dark:text-gray-400">Your feedback helps improve Vortex Incident.</p>
                <button onClick={() => window.location.reload()} className="mt-8 text-primary-500 hover:underline">Return to Home</button>
            </div>
        );
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 p-4 transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-dark-700 animate-slide-up relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600"></div>
            
            <div className="flex justify-center mb-6">
                <div className="p-3 bg-primary-50 dark:bg-dark-700 rounded-full">
                    <Aperture className="text-primary-600 dark:text-primary-500 w-8 h-8" />
                </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2 dark:text-white">Rate your Experience</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8">How was the resolution of incident <span className="font-mono bg-gray-100 dark:bg-dark-700 px-1 rounded text-primary-600">#INC-3920</span>?</p>

            <div className="flex justify-center space-x-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        className="transition transform hover:scale-110 focus:outline-none"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(rating)}
                    >
                        <Star 
                            size={40} 
                            className={`${star <= (hover || rating) ? 'fill-primary-500 text-primary-500' : 'text-gray-300 dark:text-dark-600'} transition-colors`} 
                        />
                    </button>
                ))}
            </div>

            <textarea 
                className="w-full p-4 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-xl mb-6 focus:ring-2 focus:ring-primary-500 outline-none dark:text-white placeholder-gray-400"
                rows={4}
                placeholder="Optional: Tell us more about your experience..."
            ></textarea>

            <button 
                onClick={() => setSubmitted(true)}
                disabled={rating === 0}
                className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Submit Feedback
            </button>
        </div>
    </div>
  );
};

export default Feedback;