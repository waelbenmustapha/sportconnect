import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 text-white py-8"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.aboutUs')}</h3>
            <p className="text-gray-300">{t('footer.aboutUsDescription')}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition">{t('footer.home')}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">{t('footer.players')}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">{t('footer.clubs')}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">{t('footer.agents')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.contact')}</h3>
            <p className="text-gray-300">{t('footer.email')}: connectsport4@gmail.com</p>
            <p className="text-gray-300">{t('footer.phone')}: +216 20 059 443</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.followUs')}</h3>
            <div className="flex flex-wrap gap-4">
              <a href="https://www.facebook.com/profile.php?id=61566982827644&mibextid=kFxxJD" target='_blank' className="text-gray-300 hover:text-white transition">Facebook</a>
              <a href="https://www.tiktok.com/@sport_connect" target='_blank'  className="text-gray-300 hover:text-white transition">Tik Tok</a>
              <a href="https://www.instagram.com/sportconnect5/" target='_blank'  className="text-gray-300 hover:text-white transition">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300">&copy; 2024 Sport connect. {t('footer.allRightsReserved')}</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;