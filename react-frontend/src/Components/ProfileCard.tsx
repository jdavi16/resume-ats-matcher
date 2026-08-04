import React, { useState, useEffect } from 'react';
import { Card, Chip, Title, Group, Badge, Divider, Stack, Text } from '@mantine/core';

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
      <Card withBorder shadow='xs' padding='md' radius='md'>
        <Stack gap='xs'>
          <Title order={4} style={{ fontSize: '16px' }} lineClamp={1}>
            {profile.jobTitle}
          </Title>
          <Group gap='xs'>
            <Badge size='sm' variant='outline' color='blue'>
              {profile.experienceRequired} Years Exp
            </Badge>
            <Badge size='sm' color={getScoreColor(profile.compatibilityScore)}>
              Match: {profile.compatibilityScore}%
            </Badge>
            <Badge size='sm' color={getScoreColor(profile.atsPassProbability)}>
              ATS: {profile.atsPassProbability}%
            </Badge>
          </Group>
          <Text size='xs' color='dimmed' lineClamp={2} style={{ fontStyle: 'italic' }}>
            {profile.optimizationAdvice}
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card style={{ marginTop: '20px', border: '1px solid #ccc', padding: '30px', borderRadius: '8px' }}>
      <Card.Section style={{ padding: '10px', justifyContent: 'center', display: 'flex' }}>
        <Stack display='flex' justify='center' align='center'>
          <Title order={1} textWrap='wrap'>
            Job Profile
          </Title>
          <Title order={2} textWrap='wrap'>
            <strong>Job Title:</strong> {profile.jobTitle}
          </Title>
        </Stack>
      </Card.Section>
      <Group display='flex' justify='center' style={{ margin: '15px' }}>
        <Badge size='xl' variant='outline' color='blue'>
          {profile.experienceRequired} years
        </Badge>
        <Badge size='xl' color={getScoreColor(profile.compatibilityScore)}>
          Compatibility: {profile.compatibilityScore}%
        </Badge>
        <Badge size='xl' color={getScoreColor(profile.atsPassProbability)}>
          ATS Match: {profile.atsPassProbability}%
        </Badge>
      </Group>
      <Stack gap='xs' align='center' style={{ margin: '15px 0', width: '100%' }}>
        <Text fw={700} size='sm' color='dimmed'>
          Missing ATS Keywords
        </Text>
        <Group justify='center' gap='xs'>
          {profile.missingKeywords.split(',').map((keyword, index) => {
            const trimmedKeyword = keyword.trim();
            const isChecked = checkedKeywords.includes(trimmedKeyword);

            return (
              <Chip
                key={index}
                checked={isChecked}
                variant={isChecked ? 'filled' : 'outline'}
                size='md'
                onChange={() => {
                  setCheckedKeywords((prev) => (prev.includes(trimmedKeyword) ? prev.filter((item) => item !== trimmedKeyword) : [...prev, trimmedKeyword]));
                }}
                styles={{
                  label: {
                    borderColor: isChecked ? 'var(--mantine-color-green-filled)' : 'var(--mantine-color-orange-outline)',
                    color: isChecked ? 'white' : 'var(--mantine-color-orange-text)',
                    backgroundColor: isChecked ? 'var(--mantine-color-green-filled)' : 'transparent',
                    transition: 'all 0.2s ease',
                  },
                }}>
                {trimmedKeyword}
              </Chip>
            );
          })}
        </Group>
      </Stack>

      <Divider my='md' />

      <Card.Section>
        <Title order={3} textWrap='wrap' style={{ textAlign: 'center', fontStyle: 'italic', padding: '0 15px' }} fw={500}>
          "{profile.optimizationAdvice}"
        </Title>
      </Card.Section>
    </Card>
  );
};

export default ProfileCard;
