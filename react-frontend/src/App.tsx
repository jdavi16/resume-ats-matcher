import React from 'react';
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import { MantineProvider } from '@mantine/core';
import Header from './Components/Header';
import JobProfile from './Components/JobProfile';

const App: React.FC = () => {
  return (
    <MantineProvider>
      <AppContent />
    </MantineProvider>
  );
};

const AppContent = () => {
  return (
    <div>
      <Header />
      <JobProfile />
    </div>
  );
};

export default App;
