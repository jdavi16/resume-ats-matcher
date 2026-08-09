import React, { useEffect, useState } from 'react';
import { ArrowRightIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
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

function JobProfile() {
  const [data, setData] = useState<JobData | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyOptions, setHistoryOptions] = useState<string[]>([]);
  const [allProfiles, setAllProfiles] = useState<JobData[]>([]);
  const [uploadedResumeText, setUploadedResumeText] = useState<string>('');

  // Pass compatibility score and ATS pass probability score to get a color scale for badges
  function getScoreColor(incomingScore: any): string {
    const score = Number(incomingScore);
    //console.log(incomingScore)
    //console.log(score)
    if (score <= 25) return 'badge-error';
    if (score > 25 && score < 75) return 'badge-warning';
    if (score >= 75) return 'badge-success';
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
    <div className='w-full max-w-screen-sm mx-auto pt-5 px-4'>
      <div className='mb-10'>
        <ResumeDropzone onTextExtracted={setUploadedResumeText} />
      </div>

      <form onSubmit={handleSearch}>
        <div className='flex flex-col gap-2'>
          <div className='relative w-full'>
            <div className='absolute inset-y-0 left-4 flex items-center pointer-events-none z-10'>
              <MagnifyingGlassIcon className='text-gray-500 h-5 w-5' />
            </div>
            <input
              type='text'
              list='job-history-options'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search Job Titles...'
              className={`input input-bordered border-gray-700 input-md w-full rounded-full bg-base-100 pl-10 pr-12 shadow-sm focus:outline-none focus:border-primary
                ${error ? 'input-error bg-error/5' : ''}[&-webkit-calender-picker-indicator]:hidden [*::-webkit-calendar-picker-indicator]:hidden`}
              disabled={loading}
            />
            <datalist id='job-history-option'>
              {historyOptions.map((option, idx) => (
                <option key={idx} value={option} />
              ))}
            </datalist>
            <div className='absolute inset-y-0 right-1 flex items-center z-10'>
              <button type='submit' disabled={loading || search.trim() === ''} className='btn btn-primary btn-circle btn-sm shadow-sm'>
                {loading ? <span className='loading loading-spinner loading-xs'></span> : <ArrowRightIcon className='h-5 w-5' />}
              </button>
            </div>
          </div>

          {error && (
            <div className='label pt-0 px-4'>
              <span className='label-text-alt text-error font-medium'>{error}</span>
            </div>
          )}
        </div>
      </form>

      {data && (
        <div className='mb-8'>
          <ProfileCard profile={data} getScoreColor={getScoreColor} />
        </div>
      )}

      <HistoryHub profiles={allProfiles} getScoreColor={getScoreColor} />
    </div>
  );
}

export default JobProfile;
