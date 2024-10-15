import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search } from 'lucide-react';
import Searching from '../Search/Search';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Welcome = () => {
  const [players, setPlayers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [agents, setAgents] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersRes, clubsRes, agentsRes, recruitersRes] = await Promise.all([
          axios.get('https://sportconnect-khom.onrender.com/api/v1/player/getplayerssearch'),
          axios.get('https://sportconnect-khom.onrender.com/api/v1/club/getclubssearch'),
          axios.get('https://sportconnect-khom.onrender.com/api/v1/agent/getAgentsSearch'),
          axios.get('https://sportconnect-khom.onrender.com/api/v1/recruiter/getRecruitersSearch')
        ]);
        setPlayers(playersRes.data.users);
        setClubs(clubsRes.data.clubs);
        setAgents(agentsRes.data.users);
        setRecruiters(recruitersRes.data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const searchRegex = new RegExp(searchTerm.split('').join('.*'), 'i');
  
    const filteredResults = [
      ...players.filter(user => searchRegex.test(user.fullName) || searchRegex.test(user.player?.nationality)).map(p => ({ ...p, type: 'Player' })),
      ...clubs.filter(club => searchRegex.test(club.clubName) || searchRegex.test(club.nationality)).map(c => ({ ...c, type: 'Club' })),
      ...agents.filter(user => searchRegex.test(user.fullName) || searchRegex.test(user.agent?.nationality)).map(a => ({ ...a, type: 'Agent' })),
      ...recruiters.filter(user => searchRegex.test(user.fullName) || searchRegex.test(user.recruiter?.nationality)).map(r => ({ ...r, type: 'Recruiter' }))
    ];
  
    setSearchResults(filteredResults);
    setShowDropdown(filteredResults.length > 0);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() !== '') {
      handleSearch();
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleImageClick = (result) => {
    if (result.type === 'Club') {
      navigate("/pprofile", { state: { clubName: result.leader.email } });
    } else {
      navigate("/pprofile", { state: { email: result.email } });
    }
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto py-8 px-4"
      >
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div 
            className="h-60 sm:h-80 bg-cover bg-center relative"
            style={{ backgroundImage: `url('bgmain.jpg')` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white text-center px-4">{t('connect')}</h1>
            </div>
          </div>

          <div className="px-4 sm:px-8 py-6">
            <h2 className="text-2xl font-semibold mb-6 text-white">{t('categories')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {['PLAYER', 'CLUB', 'AGENT', 'COACH'].map((category) => (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={()=>navigate('/list', { state: { category:category } })}
                  className="bg-gray-700 rounded-lg p-4 shadow-md text-center"
                >
                  <img
                    src={`${category.toLowerCase()}.png`}
                    alt={category}
                    className="w-full h-24 sm:h-32 object-cover rounded mb-4"
                  />
                  <h3 className="font-semibold text-white text-sm sm:text-base">{t(category.toLowerCase()).toUpperCase()}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default Welcome;