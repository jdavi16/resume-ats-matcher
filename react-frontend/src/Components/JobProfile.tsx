import { useEffect, useState } from 'react'

import {
  Card,
  Title,
  Group,
  Container,
  ActionIcon,
  useMantineTheme,
  Divider,
  Stack,
  Badge,
  Autocomplete,
  Chip
} from '@mantine/core'
import { IconArrowRight, IconSearch } from '@tabler/icons-react'

interface ScoutData {
  jobTitle: string
  compatibilityScore: number
  missingKeywords: string
  experienceRequired: number
  atsPassProbability: number
  optimizationAdvice: string
}

function JobProfile() {
  const [data, setData] = useState<ScoutData | null>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const theme = useMantineTheme()

  const [historyOptions, setHistoryOptions] = useState<string[]>([])
  const [checkedKeywords, setCheckedKeywords] = useState<string[]>([])
  function getScoreColor(incomingScore: any): string {

    const score = Number(incomingScore)
    //console.log(incomingScore)
    //console.log(score)
    if (score < 25) return 'red';
    if (score < 50) return 'orange';
    if (score === 50) return 'yellow';
    if (score <= 75) return 'lime';
    return 'green'
  }
  useEffect(() => {
    const fetchSearchHistory = async() => {
      try {

        const response = await fetch('http://10.0.1.181:8080/api/cached')

        if (response.ok){
          const cachedJobList = await response.json()


          const namesOnly: string[] = cachedJobList.map((job:any) => job.jobTitle)

          const cleanNames = namesOnly.filter((name) => name !== undefined && name !== null)
          
          setHistoryOptions(cleanNames)
        }
      } catch(err){
        console.error('Could not fetch database search history list:', err)
      }
    }
    fetchSearchHistory();
  }, [])

  const handleSearch = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (search.trim() === '') return

    setLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await fetch(
        `http://10.0.1.181:8080/api/match/search?jobTitle=${encodeURIComponent(search)}`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      

      const result: ScoutData = await response.json()
      setData(result)
      setSearch('')
      setCheckedKeywords([])
      setHistoryOptions((prev) => {
        if(!prev.includes(result.jobTitle)) {
          return [...prev, result.jobTitle]
        }
        return prev 
      })
    } catch (err: any) {
      setError(err.message || 'Failed to fetch scout data')
    } finally {
      setLoading(false)
    }
  }
  


  return (
    <Container
      size='sm'
      style={{ paddingTop: '20px' }}
    >
      <form onSubmit={handleSearch}>
        <Group
          align='center'
          mb='xl'
        >
          <Autocomplete
            value={search}
            onChange={setSearch}
            placeholder='Search Job Titles...'
            size='md'
            data={historyOptions}
            radius='xl'
            error={error}
            rightSectionWidth={42}
            leftSection={
              <IconSearch
                size={18}
                stroke={1.5}
              />
            }
            style={{ flex: 1 }}
            rightSection={
              <ActionIcon
                size={32}
                radius='xl'
                color={theme.primaryColor}
                variant='filled'
                aria-label='Search'
                loading={loading}
                type='submit'
              >
                <IconArrowRight
                  size={18}
                  stroke={1.5}
                />
              </ActionIcon>
            }
          />
        </Group>
      </form>

      {data && (
        <Card
          style={{
            marginTop: '20px',
            border: '1px solid #ccc',
            padding: '30px',
            borderRadius: '8px',
          }}
        >
          <Card.Section
            style={{
              padding: '10px',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <Stack
              display='flex'
              justify='center'
              align='center'
            >
              <Title
                order={1}
                textWrap='wrap'
              >
                Scouting Report
              </Title>
              <Title
                order={2}
                textWrap='wrap'
              >
                <strong>Job Title:</strong> {data.jobTitle}
              </Title>
            </Stack>
          </Card.Section>
          <Group
            display='flex'
            justify='center'
            style={{ margin: '15px' }}
          >
            <Badge size='xl' color={getScoreColor(data.compatibilityScore)}>Compatability: {data.compatibilityScore}%</Badge>
            <Badge size='xl'>{data.experienceRequired} years</Badge>
            <Badge size='xl' color={getScoreColor(data.atsPassProbability)}>ATS: {data.atsPassProbability}%</Badge>
            <Stack gap='xs' align='center' style={{margin: '15px 0', width: '100%'}}>
              <Badge size='lg' variant='light' color='orange'>Missing Keywords</Badge>
                <Group justify='center' gap='xs'>
                  {data.missingKeywords.split(',').map((keyword, index) => {
                    const trimmedKeyword = keyword.trim();
                    const isChecked = checkedKeywords.includes(trimmedKeyword);

                    return(
                      <Chip key={index} checked={isChecked} variant='filled'
                      color={isChecked ? "green" : "red"}
                      size='md' onChange={() => {
                        setCheckedKeywords((prev) => prev.includes(trimmedKeyword) ? prev.filter((item) => item !== trimmedKeyword) : [...prev, trimmedKeyword])
                      }}
                      >{trimmedKeyword}</Chip>
                    )
                  })}
                </Group>
            </Stack>
          </Group>
          <Divider />

          <Card.Section
            style={{
              padding: '10px',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <Title
              order={3}
              textWrap='wrap'
            >
              {data.optimizationAdvice}
            </Title>
          </Card.Section>
        </Card>
      )}
    </Container>
  )
}

export default JobProfile
