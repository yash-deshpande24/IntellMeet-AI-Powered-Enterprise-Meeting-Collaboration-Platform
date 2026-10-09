import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Video, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-md">
          <Video className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black text-indigo-600">404</h1>
          <h2 className="text-2xl font-extrabold">Room or Page Not Found</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            The meeting room code or page URL you are attempting to access does not exist or may have been concluded.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link to="/">
            <Button variant="outline" leftIcon={ArrowLeft}>
              Back to Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="primary" leftIcon={Home}>
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
