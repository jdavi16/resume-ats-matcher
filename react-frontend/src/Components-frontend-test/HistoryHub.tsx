import { Divider, SimpleGrid, Stack } from '@mantine/core';
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
    <Stack gap='md' style={{ marginTop: '40px' }}>
      <Divider label='Historical Analytics Hub' labelPosition='center' />

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md'>
        {sortedProfiles.map((profile, idx) => (
          <ProfileCard key={idx} profile={profile} getScoreColor={getScoreColor} compact={true} />
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default HistoryHub;
