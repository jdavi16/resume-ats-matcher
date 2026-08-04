import { Text, Group, ActionIcon, useMantineColorScheme } from '@mantine/core'
import React from 'react'

const Header: React.FC = () => {
  //State to manage the theme
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  //Toggle the theme
  const handleToggle = () => {
    setColorScheme(isDark ? 'light' : 'dark')
  }
  return (
    <header style={{ width: '100%', marginBottom: '40px' }}>
      <Group
        justify='space-between'
        align='center'
        style={{
          width: '100%',
          paddingBottom: '20px ',
          borderBottom: '1px solid var(--mantine-color-default-border)',
        }}
      >
        <Text
          size='40px'
          fw={900}
          variant='gradient'
          gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
          lh={1.3}
        >
          Resume ATS Matcher
        </Text>

        <ActionIcon
          id='theme-toggle'
          onClick={handleToggle}
          variant='subtle'
          size='xl'
          radius='md'
          color={isDark ? 'white' : 'gray'}
          aria-label='Toggle Color Scheme'
        >
          <svg
            className='sun-and-moon'
            aria-hidden='true'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            style={{
              transform: isDark ? 'rotate(-25deg)' : 'none',
              transition: 'transform 0.25s ease',
            }}
          >
            <circle
              className='sun'
              cx='12'
              cy='12'
              r='6'
              mask='url(#moon-mask)'
              fill='currentColor'
              style={{ transition: 'all 0.25s ease' }}
            />
            <g
              className='sun-beams'
              stroke='currentColor'
              strokeWidth='2'
              style={{
                opacity: isDark ? 0 : 1,
                transition: 'opacity 0.15s ease',
              }}
            >
              <line
                x1='12'
                y1='1'
                x2='12'
                y2='3'
              />
              <line
                x1='12'
                y1='21'
                x2='12'
                y2='23'
              />
              <line
                x1='4.22'
                y1='4.22'
                x2='5.64'
                y2='5.64'
              />
              <line
                x1='18.36'
                y1='18.36'
                x2='19.78'
                y2='19.78'
              />
              <line
                x1='1'
                y1='12'
                x2='3'
                y2='12'
              />
              <line
                x1='21'
                y1='12'
                x2='23'
                y2='12'
              />
              <line
                x1='4.22'
                y1='19.78'
                x2='5.64'
                y2='18.36'
              />
              <line
                x1='18.36'
                y1='5.64'
                x2='19.78'
                y2='4.22'
              />
            </g>
            <mask id='moon-mask'>
              <rect
                x='0'
                y='0'
                width='100%'
                height='100%'
                fill='white'
              />
              
              <circle
                cx={isDark ? '18' : '24'}
                cy='10'
                r='6'
                fill='black'
                style={{ transition: 'cx 0.25s ease' }}
              />
            </mask>
          </svg>
        </ActionIcon>
      </Group>
    </header>
  )
}

export default Header
