import React, { useState, useEffect } from 'react';

export interface JobProfileData {
  jobTitle: string;
  compatibilityScore: number;
  missingKeywords: string;
  experienceRequired: number;
  atsPassProbability: number;
  optimizationAdvice: string;
}

interface ProfileCardProps {
  profile: JobProfileData;
  getScoreColor: (score: number) => string;
  compact?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, getScoreColor, compact = false }) => {
  //Checkbox tracker moved from JobProfile.tsx
  const [checkedKeywords, setCheckedKeywords] = useState<string[]>([]);

  //Reset checkboxes whenver job title changes
  useEffect(() => {
    setCheckedKeywords([]);
  }, [profile.jobTitle]);
  // Compact View
  if (compact) {
    return (
      <div className='card bg-base-100 border border-gray-700 shadow-sm rounded-lg'>
        <div className='card-body p-4 flex flex-col gap-2'>
          <h4 className='text-base font-bold text-base-content truncate'>{profile.jobTitle}</h4>
          <div className='flex flex-nowrap gap-2 items-center overflow-x-auto pb-1'>
            <span className='badge badge-sm badge-primary rounded-full font-small shrink-0'>{profile.experienceRequired} Years Exp</span>
            <span className={`badge badge-sm rounded-full font-medium border-none bg-opacity-15 shrink-0 ${getScoreColor(profile.compatibilityScore)}`}>Comp: {profile.compatibilityScore}%</span>
            <span className={`badge badge-sm rounded-full font-medium border-none bg-opacity-15 shrink-0 ${getScoreColor(profile.atsPassProbability)}`}>ATS: {profile.atsPassProbability}%</span>
          </div>
          <p className='text-xs text-base-content/60 italic line-clamp-2 mt-1'>{profile.optimizationAdvice}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full  flex justify-center mt-10'>
      <div className='card card-border border-gray-700 bg-base-200 p-6 rounded-xl shadow-xl w-full'>
        {/** Top Section */}
        <div className='flex flex-col items-center text-center gap-2 mb-6'>
          <h1 className='text-3xl font-black text-base-content wrap-break-word whitespace-normal leading-snug'>Job Profile</h1>
          <h2 className='text-2xl font-normal text-base-content wrap-break-word whitespace-normal leading-snug'>
            <strong>Job Title:</strong> {profile.jobTitle}
          </h2>
        </div>

        {/** Badges Row */}
        <div className='flex flex-wrap justify-center mb-6 gap-3'>
          <div className='badge badge-lg badge-primary rounded-full py-3 px-4 font-medium'>{profile.experienceRequired} years</div>
          <div className={`badge badge-lg rounded-full py-3 px-4 font-medium ${getScoreColor(profile.compatibilityScore)}`}>Compatibility: {profile.compatibilityScore}%</div>
          <div className={`badge badge-lg rounded-full py-3 px-4 font-medium ${getScoreColor(profile.atsPassProbability)}`}>ATS Match: {profile.atsPassProbability}%</div>
        </div>

        {/**Missing Keywords */}
        <div className='flex flex-col w-full items-center text-center gap-4 mb-6'>
          <div className='divider text-sm font-bold text-base-content/60 tracking-wide uppercase'>Missing ATS Keywords</div>
          <div className='flex flex-wrap justify-center gap-1'>
            {profile.missingKeywords.split(',').map((keyword, index) => {
              const trimmedKeyword = keyword.trim();
              const isChecked = checkedKeywords.includes(trimmedKeyword);
              return (
                <button
                  key={index}
                  type='button'
                  onClick={() => setCheckedKeywords((prev) => (prev.includes(trimmedKeyword) ? prev.filter((item) => item !== trimmedKeyword) : [...prev, trimmedKeyword]))}
                  className={`badge badge-lg rounded-full cursor-pointer select-none font-medium px-4 py-3 border transition-all duration-200
                  ${isChecked ? 'bg-success border-success text-success-content shadow-sm' : 'bg-transparent border-primary text-primary hover:bg-primary/5'}`}>
                  {trimmedKeyword}
                </button>
              );
            })}
          </div>
        </div>

        <div className='flex flex-col items-center w-full'>
          <div className='divider w-full font-bold text-sm text-base-content/50 uppercase tracking-wider'>Optimization Advice</div>
          <p className='text-lg font-medium italic text-center text-base-content/80 max-w-xl px-4 mt-2 leading-relaxed'>"{profile.optimizationAdvice}"</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
