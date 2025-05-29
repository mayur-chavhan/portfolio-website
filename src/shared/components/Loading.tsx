import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const content = (
    <div
      className={`flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <Loader2
        className={`${sizeClasses[size]} text-primary-600 dark:text-primary-400 animate-spin`}
      />
      {text && (
        <p
          className={`${textSizeClasses[size]} font-medium text-gray-600 dark:text-gray-400`}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="dark:bg-dark-200 fixed inset-0 z-50 flex items-center justify-center bg-white">
        {content}
      </div>
    );
  }

  return content;
};

// Skeleton loading component for content placeholders
interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
  rounded = false,
}) => {
  return (
    <div
      className={`
        ${width} ${height} 
        ${rounded ? 'rounded-full' : 'rounded'} 
        dark:bg-dark-100 animate-pulse 
        bg-gray-200 
        ${className}
      `}
    />
  );
};

// Card skeleton for loading states
export const CardSkeleton: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`dark:bg-dark-100 rounded-lg bg-white p-6 shadow-md ${className}`}
    >
      <div className="space-y-4">
        <Skeleton height="h-6" width="w-3/4" />
        <div className="space-y-2">
          <Skeleton height="h-4" width="w-full" />
          <Skeleton height="h-4" width="w-5/6" />
          <Skeleton height="h-4" width="w-4/6" />
        </div>
        <div className="flex space-x-2">
          <Skeleton height="h-8" width="w-20" rounded />
          <Skeleton height="h-8" width="w-16" rounded />
        </div>
      </div>
    </div>
  );
};

export default Loading;
