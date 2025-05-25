'use client';

import { useState, useEffect } from 'react';
import type { Story } from '@/types/story';
import StoryCarousel from '@/components/story/StoryCarousel';
import StoryViewer from '@/components/story/StoryViewer';
import { Spinner } from '@/components/Spinner'; // Assuming you have a Spinner component

export default function HomePage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/stories.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch stories: ${response.status}`);
        }
        const data = await response.json();
        setStories(data);
      } catch (error) {
        console.error("Error fetching stories:", error);
        // Handle error state, e.g., show a message to the user
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const openStoryViewer = (index: number) => {
    setCurrentStoryIndex(index);
  };

  const closeStoryViewer = () => {
    setCurrentStoryIndex(null);
  };

  const navigateInViewer = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < stories.length) {
      setCurrentStoryIndex(newIndex);
    } else {
      closeStoryViewer(); // Close if out of bounds (e.g., after last story)
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner className="w-12 h-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex flex-col items-center py-0 md:py-8">
      <div className="w-full max-w-md mx-auto flex flex-col h-screen md:h-[calc(100vh-4rem)] md:max-h-[800px] bg-card shadow-2xl md:rounded-xl overflow-hidden">
        <StoryCarousel stories={stories} onStoryClick={openStoryViewer} />
        
        <main className="flex-grow p-6 text-center flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary opacity-80 mb-4">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line>
          </svg>
          <h1 className="text-3xl font-bold text-primary mb-2">StoryFlow</h1>
          <p className="text-muted-foreground">
            Tap on a story preview above to start watching.
          </p>
          {stories.length === 0 && !isLoading && (
            <p className="text-destructive mt-4">No stories available at the moment.</p>
          )}
        </main>

        {currentStoryIndex !== null && (
          <StoryViewer
            stories={stories}
            currentIndex={currentStoryIndex}
            onClose={closeStoryViewer}
            onNavigate={navigateInViewer}
          />
        )}
      </div>
    </div>
  );
}
