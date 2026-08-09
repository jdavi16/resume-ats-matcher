import ProfileCard from './ProfileCard';
import type { JobProfileData } from './ProfileCard';

interface HistoryHubProps {
  profiles: JobProfileData[];
  getScoreColor: (score: number) => string;
}

const HistoryHub: React.FC<HistoryHubProps> = ({ profiles, getScoreColor }) => {
  if (profiles.length === 0) return null;

  // Sort profiles based from highest compatbility score to lowest
  const sortedProfiles = [...profiles].sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  return (
    <div className='flex flex-col  gap-6 mt-10 w-full select-none'>
      <div className='divider font-bold divider-primary text-lg text-gray-300/50 uppercase tracking-wider'>Historical Analytics Hub</div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
        {sortedProfiles.map((profile, idx) => (
          <ProfileCard key={idx} profile={profile} getScoreColor={getScoreColor} compact={true} />
        ))}
      </div>
    </div>
  );
};

export default HistoryHub;
