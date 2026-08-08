import React from 'react';
import '@mantine/dropzone/styles.css';
import { MantineProvider } from '@mantine/core';
import Header from './Components-frontend-test/Header';
import JobProfile from './Components-frontend-test/JobProfile';
import './App.css';

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
