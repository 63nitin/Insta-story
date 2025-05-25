'use client';

import type { Story } from '@/types/story';
import Image from 'next/image';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Spinner } from '@/components/Spinner';

interface StoryViewerProps {
  stories: Story[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

const DEFAULT_STORY_DURATION = 5000;

export default function StoryViewer({ stories, currentIndex, onClose, onNavigate }: StoryViewerProps) {
  const [progress, setProgress] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const currentStory = stories[currentIndex];
  const storyDuration = currentStory?.duration || DEFAULT_STORY_DURATION;

  const resetTimerAndProgress = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgress(0);
    setIsImageLoading(true);
    startTimeRef.current = Date.now();
  }, []);

  const startTimer = useCallback(() => {
    if (isPaused || !currentStory) return;
    resetTimerAndProgress();

    progressIntervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTimeRef.current;
      const currentProgress = Math.min((elapsedTime / storyDuration) * 100, 100);
      setProgress(currentProgress);
    }, 50);

    timerRef.current = setTimeout(() => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setProgress(100); // Ensure progress bar completes
      if (currentIndex < stories.length - 1) {
        onNavigate(currentIndex + 1);
      } else {
        onClose();
      }
    }, storyDuration - (Date.now() - startTimeRef.current));

  }, [isPaused, currentStory, storyDuration, currentIndex, stories.length, onNavigate, onClose, resetTimerAndProgress]);

  useEffect(() => {
    // Start timer when image is loaded
    if (!isImageLoading && currentStory) {
      startTimer();
    }
    // Cleanup on unmount or when story changes before image load
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isImageLoading, currentStory, startTimer]);


  useEffect(() => {
    // Reset and restart timer when currentIndex changes and viewer is active
    // The actual timer start is deferred until image loads via the above useEffect
    resetTimerAndProgress();
  }, [currentIndex, resetTimerAndProgress]);


  const handlePause = () => {
    setIsPaused(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    // Calculate remaining time if needed for resume
  };

  const handleResume = () => {
    setIsPaused(false);
    // To resume properly, you'd need to calculate remaining time and restart timer
    // For simplicity, we restart the timer or let it be handled by useEffect on currentIndex change
    // For now, we'll rely on the main timer logic which restarts on story change / image load
    // Or more simply:
    startTimeRef.current = Date.now() - (progress / 100) * storyDuration; // Adjust start time
    startTimer();
  };


  const handleInteractionStart = () => {
    if (!isImageLoading) handlePause();
  };
  const handleInteractionEnd = () => {
    if (!isImageLoading) handleResume();
  };


  const navigatePrev = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      // Optionally, could loop or show some indication of first story
    }
  };

  const navigateNext = () => {
    if (currentIndex < stories.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onClose();
    }
  };

  if (!currentStory) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
    >
      {/* Progress Bars */}
      <div className="absolute top-3 left-2 right-2 h-1 flex space-x-1 px-1 z-20">
        {stories.map((_, idx) => (
          <div key={`progress-${idx}`} className="flex-1 h-full bg-white/30 rounded-sm overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-[50ms] ease-linear"
              style={{
                width: idx === currentIndex ? `${progress}%` : (idx < currentIndex ? '100%' : '0%'),
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-6 left-2 right-2 px-2 flex items-center justify-between z-20">
        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8 border-2 border-white/80">
            <AvatarImage src={currentStory.user.avatarUrl} alt={currentStory.user.name} data-ai-hint="profile avatar large" />
            <AvatarFallback className="text-sm bg-muted text-muted-foreground">
              {currentStory.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-white font-semibold text-sm drop-shadow-md">{currentStory.user.name}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 w-8 h-8">
          <X size={20} />
          <span className="sr-only">Close stories</span>
        </Button>
      </div>

      {/* Image Content */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
            <Spinner className="text-white w-10 h-10" />
          </div>
        )}
        <Image
          key={currentStory.id} // Important for re-triggering load on src change
          src={currentStory.imageUrl}
          alt={`${currentStory.user.name}'s story`}
          layout="fill"
          objectFit="contain" // Using contain to ensure whole image is visible
          className={`transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsImageLoading(false)}
          onError={() => {
            setIsImageLoading(false); 
            // Optionally handle image load error, e.g. show a placeholder or skip story
          }}
          priority={true} // Critical content
          data-ai-hint="story content"
          sizes="100vw"
        />
      </div>

      {/* Navigation Tappable Areas */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
        onClick={navigatePrev}
        aria-label="Previous story"
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer"
        onClick={navigateNext}
        aria-label="Next story"
      />

      {/* Optional explicit navigation buttons (hidden by default, shown on hover/focus for accessibility) */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={navigatePrev} 
        className="absolute left-2 top-1/2 -translate-y-1/2 text-white opacity-0 focus:opacity-100 hover:opacity-80 hover:bg-white/20 transition-opacity z-20 p-2 rounded-full"
        disabled={currentIndex === 0}
        aria-label="Previous Story"
      >
        <ChevronLeft size={32} />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={navigateNext} 
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-0 focus:opacity-100 hover:opacity-80 hover:bg-white/20 transition-opacity z-20 p-2 rounded-full"
        disabled={currentIndex === stories.length - 1 && progress >=100} // disable if last story and fully played
        aria-label="Next Story"
      >
        <ChevronRight size={32} />
      </Button>
    </div>
  );
}
