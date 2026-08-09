import { GithubLogoIcon, MoonIcon, SunIcon } from '@phosphor-icons/react';
import React, { useEffect } from 'react';
import { themeChange } from 'theme-change';

const Header: React.FC = () => {
  //State to manage the theme

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <header className='navbar bg-base-100 h-24 mb-30 border-b-2 border-gray-700 shadow-md px-4 md:px-8'>
      <div className='navbar-start'>
        <h1 className='text-3xl font-black ml-5 select-none whitespace-nowrap'>Resume ATS Matcher</h1>
      </div>
      <div className='navbar-end gap-3'>
        <a href='https://github.com/jdavi16' target='_blank' rel='noopener' className='btn btn-outline btn-square border border-gray-700'>
          <GithubLogoIcon className='h-7 w-7' />
        </a>
        <label className='btn btn-outline btn-square border border-gray-700 swap swap-rotate'>
          <input type='checkbox' value='dracula' data-set-theme />
          <SunIcon className='swap-off h-7 w-10 fill-current' />
          <MoonIcon className='swap-on h-7 w-10 fill-current' />
        </label>
      </div>
    </header>
  );
};

export default Header;
