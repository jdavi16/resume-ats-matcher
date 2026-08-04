import { useEffect, useState } from 'react';

import { Group, Container, ActionIcon, useMantineTheme, Autocomplete } from '@mantine/core';
import { IconArrowRight, IconSearch } from '@tabler/icons-react';
import ProfileCard from './ProfileCard';
import HistoryHub from './HistoryHub';

interface JobData {
  jobTitle: string;
  compatibilityScore: number;
  missingKeywords: string;
  experienceRequired: number;
  atsPassProbability: number;
  optimizationAdvice: string;
}

function JobProfile() {
  const [data, setData] = useState<JobData | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useMantineTheme();
  const [historyOptions, setHistoryOptions] = useState<string[]>([]);
  const [allProfiles, setAllProfiles] = useState<JobData[]>([]);

  function getScoreColor(incomingScore: any): string {
    const score = Number(incomingScore);
    //console.log(incomingScore)
    //console.log(score)
    if (score < 25) return 'red';
    if (score < 50) return 'orange';
    if (score === 50) return 'yellow';
    if (score <= 75) return 'lime';
    return 'green';
  }
  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        const response = await fetch('http://10.0.1.181:8080/api/match/cached');

        if (response.ok) {
          const cachedJobList: JobData[] = await response.json();
          setAllProfiles(cachedJobList);

          const namesOnly: string[] = cachedJobList.map((job: any) => job.jobTitle);

          const cleanNames = namesOnly.filter((name) => name !== undefined && name !== null);

          setHistoryOptions(cleanNames);
        }
      } catch (err) {
        console.error('Could not fetch database search history list:', err);
      }
    };
    fetchSearchHistory();
  }, []);

  const handleSearch = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim() === '') return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`http://10.0.1.181:8080/api/match/search?jobTitle=${encodeURIComponent(search)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result: JobData = await response.json();
      setData(result);
      setSearch('');
      setHistoryOptions((prev) => {
        if (!prev.includes(result.jobTitle)) {
          return [...prev, result.jobTitle];
        }
        return prev;
      });

      setAllProfiles((prev) => {
        const exists = prev.some((profile) => profile.jobTitle.toLowerCase() === result.jobTitle.toLowerCase());
        if (!exists) {
          return [...prev, result];
        }
        return prev;
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch scout data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size='sm' style={{ paddingTop: '20px' }}>
      <form onSubmit={handleSearch}>
        <Group align='center' mb='xl'>
          <Autocomplete
            value={search}
            onChange={setSearch}
            placeholder='Search Job Titles...'
            size='md'
            data={historyOptions}
            radius='xl'
            error={error}
            rightSectionWidth={42}
            leftSection={<IconSearch size={18} stroke={1.5} />}
            style={{ flex: 1 }}
            rightSection={
              <ActionIcon size={32} radius='xl' color={theme.primaryColor} variant='filled' aria-label='Search' loading={loading} type='submit'>
                <IconArrowRight size={18} stroke={1.5} />
              </ActionIcon>
            }
          />
        </Group>
      </form>

      {data && <ProfileCard profile={data} getScoreColor={getScoreColor} />}
      <HistoryHub profiles={allProfiles} getScoreColor={getScoreColor} />
    </Container>
  );
}

export default JobProfile;
