import { ExpandableDescription } from '@/components/ui/ExpandableDescription';
import { Author } from './Author';
import { UserType } from '@/api/types/posts';

interface InformationProps {
  onDescriptionExpand?: (expanded: boolean) => void;
  animationTransition?: {
    duration: number;
    ease: number[] | string;
  };
  isFollowing: boolean;
  longDescription: string;
  user: UserType;
}

export function Information({
  onDescriptionExpand,
  animationTransition,
  isFollowing,
  longDescription,
  user,
}: InformationProps) {
  const handleExpandChange = (expanded: boolean) => {
    if (onDescriptionExpand) {
      onDescriptionExpand(expanded);
    }
  };

  return (
    <div
      className='flex flex-col gap-4'
      style={{
        paddingBottom: longDescription?.trim() ? '20px' : '0px',
      }}
    >
      <Author isFollowing={isFollowing} user={user} />
      <ExpandableDescription
        text={longDescription}
        onExpandChange={handleExpandChange}
        animationTransition={animationTransition}
      />
    </div>
  );
}
