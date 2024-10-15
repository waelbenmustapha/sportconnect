import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Languages className="mr-2 h-5 w-5" />
            </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 z-10 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              onClick={() => changeLanguage('en')}
              className={`flex gap-2 w-full text-left px-4 py-2 text-sm ${
                i18n.language === 'en' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              }`}
              role="menuitem"
            >
              <p className='w-5'>{t('english')}</p>
              <img src='en.png' className='h-5 w-5'/>

            </button>
            <button
              onClick={() => changeLanguage('fr')}
              className={`flex gap-2 w-full text-left px-4 py-2 text-sm  ${
                i18n.language === 'fr' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              }`}
              role="menuitem"
            >
             <p  className='w-5'>{t('francais')}</p> 
              <img src='fr.png' className='h-5 w-5'/>

            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;