import type { Story } from '@/types/story';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StoryPreviewItemProps {
  story: Story;
  onClick: () => void;
}

export default function StoryPreviewItem({ story, onClick }: StoryPreviewItemProps) {
  return (
    <div
      className="flex-shrink-0 w-24 h-36 rounded-lg overflow-hidden shadow-lg relative cursor-pointer transform hover:scale-105 active:scale-95 transition-transform duration-150 ease-in-out group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View ${story.user.name}'s story`}
    >
      <Image
        src={story.imageUrl}
        alt={`${story.user.name}'s story preview`}
        layout="fill"
        objectFit="cover"
        className="group-hover:brightness-90 transition-all"
        data-ai-hint="story preview"
        sizes="(max-width: 768px) 10vw, 100px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-2 left-2 right-2">
        <div className="flex items-center space-x-1.5">
          <Avatar className="w-6 h-6 border-2 border-primary group-hover:border-accent transition-colors">
            <AvatarImage src={story.user.avatarUrl} alt={story.user.name} data-ai-hint="profile avatar" />
            <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
              {story.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-white text-xs font-semibold truncate drop-shadow-sm">
            {story.user.name}
          </span>
        </div>
      </div>
    </div>
  );
}
