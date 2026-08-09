import { useEffect, useState } from 'react';

import { Group, Container, ActionIcon, useMantineTheme, Autocomplete } from '@mantine/core';
import { IconArrowRight, IconSearch } from '@tabler/icons-react';
import ProfileCard from './ProfileCard';
import HistoryHub from './HistoryHub';
import { ResumeDropzone } from './ResumeDropzone';

interface JobData {
  jobTitle: string;
  compatibilityScore: number;
  missingKeywords: string;
  experienceRequired: number;
  atsPassProbability: number;
  optimizationAdvice: string;
}

const mockJobData = {
  jobTitle: 'Java Developer',
  compatibilityScore: 75,
  missingKeywords: 'Java, SpringBoot, Fuck',
  experienceRequired: 12,
  atsPassProbability: 45,
  optimizationAdvice: 'Get good kid',
};

const mockHistoryData = [
  {
    jobTitle: 'Senior Frontend Engineer',
    compatibilityScore: 88,
    missingKeywords: 'GraphQL, Next.js, Webpack',
    experienceRequired: 5,
    atsPassProbability: 92,
    optimizationAdvice: 'Excellent alignment. Add specific cloud optimization stats.',
  },
  {
    jobTitle: 'Full Stack Developer',
    compatibilityScore: 62,
    missingKeywords: 'Docker, PostgreSQL, Redis',
    experienceRequired: 3,
    atsPassProbability: 65,
    optimizationAdvice: 'Solid codebase exposure, but weak on backend optimization tools.',
  },
  {
    jobTitle: 'Python Data Analyst',
    compatibilityScore: 41,
    missingKeywords: 'Pandas, NumPy, Tableau, SQL',
    experienceRequired: 2,
    atsPassProbability: 35,
    optimizationAdvice: 'The current technical syntax lacks data analytics keywords.',
  },
  {
    jobTitle: 'DevOps System Administrator',
    compatibilityScore: 18,
    missingKeywords: 'Terraform, AWS, CI/CD, Kubernetes, Bash',
    experienceRequired: 6,
    atsPassProbability: 10,
    optimizationAdvice: 'Resume formatting mismatches standard tech automation expectations.',
  },
];

function JobProfile() {
  const [data, setData] = useState<JobData | null>(mockJobData);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useMantineTheme();
  const [historyOptions, setHistoryOptions] = useState<string[]>([]);
  const [allProfiles, setAllProfiles] = useState<JobData[]>(mockHistoryData);
  const [uploadedResumeText, setUploadedResumeText] = useState<string>('');

  // Pass compatibility score and ATS pass probability score to get a color scale for badges
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

    // Warn user about missing resume upload
    if (!uploadedResumeText) {
      setError('Please upload a resume PDF file before running an ATS Scan.');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`http://10.0.1.181:8080/api/match/search?jobTitle=${encodeURIComponent(search)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: search,
          resumeText: uploadedResumeText,
        }),
      });

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
      <ResumeDropzone onTextExtracted={setUploadedResumeText} />
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
