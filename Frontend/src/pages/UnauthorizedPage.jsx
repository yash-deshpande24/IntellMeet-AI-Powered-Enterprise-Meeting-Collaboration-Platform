import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-black text-rose-600">403</h1>
          <h2 className="text-2xl font-extrabold">Access Restricted</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            You do not have the required enterprise clearance or workspace permissions to view this room or administrative resource.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link to="/dashboard">
            <Button variant="primary" leftIcon={Home}>
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
