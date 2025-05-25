import type { Story } from '@/types/story';
import StoryPreviewItem from './StoryPreviewItem';

interface StoryCarouselProps {
  stories: Story[];
  onStoryClick: (index: number) => void;
}

export default function StoryCarousel({ stories, onStoryClick }: StoryCarouselProps) {
  return (
    <div className="bg-card/50 backdrop-blur-sm p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-primary mb-3 px-1">Stories</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        {stories.map((story, index) => (
          <StoryPreviewItem
            key={story.id}
            story={story}
            onClick={() => onStoryClick(index)}
          />
        ))}
         {/* Add padding to the end of the scrollable area */}
        <div className="flex-shrink-0 w-px"></div>
      </div>
    </div>
  );
}
