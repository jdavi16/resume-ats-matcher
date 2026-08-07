import { Text, Container, ActionIcon, useMantineColorScheme, Group, useComputedColorScheme } from '@mantine/core';
import { IconBrandGithub, IconMoon, IconSun } from '@tabler/icons-react';

import React from 'react';

const Header: React.FC = () => {
  //State to manage the theme
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <header className='header' style={{ height: '84px', width: '100%', marginBottom: '120px', borderBottom: '1px solid light-dark(#545454,#545454)' }}>
      <Container
        style={{
          height: '84px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text size='40px' fw={900} variant='gradient' gradient={{ from: 'indigo', to: 'cyan', deg: 45 }} lh={1.3} ml='20px'>
          Resume ATS Matcher
        </Text>
        <Group>
          <Group justify='center'>
            <Group justify='center'>
              <ActionIcon component='a' variant='default' size='lg' href='https://github.com/jdavi16' target='_blank' aria-label='Github profile'>
                <IconBrandGithub stroke={1.5} />
              </ActionIcon>
            </Group>

            <ActionIcon onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')} variant='default' size='lg' radius='md' aria-label='Toggle Color Scheme'>
              <IconSun stroke={1.5} style={{ display: computedColorScheme === 'light' ? 'block' : 'none' }} />
              <IconMoon stroke={1.5} style={{ display: computedColorScheme === 'dark' ? 'block' : 'none' }} />
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </header>
  );
};

export default Header;
