import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search } from 'lucide-react';
import Searching from '../Search/Search';
import { motion } from 'framer-motion';

const Welcome = () => {
  const [players, setPlayers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [agents, setAgents] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersRes, clubsRes, agentsRes, recruitersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/v1/player/getplayerssearch'),
          axios.get('http://localhost:5000/api/v1/club/getclubssearch'),
          axios.get('http://localhost:5000/api/v1/agent/getAgentsSearch'),
          axios.get('http://localhost:5000/api/v1/recruiter/getRecruitersSearch')
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
            className="h-80 bg-cover bg-center relative"
            style={{ backgroundImage: `url('/assets/bgmain.jpg')` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
              <h1 className="text-4xl font-bold mb-4 text-white">CONNECT WITH CLUBS DIRECTLY</h1>
              <div className="w-full max-w-md relative">
               
                </div>
              
            </div>
          </div>

          <div className="px-8 py-6">
            <h2 className="text-2xl font-semibold mb-6 text-white">Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['PLAYER', 'CLUB', 'AGENT', 'COACH'].map((category) => (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-700 rounded-lg p-4 shadow-md text-center"
                >
                  <img
                    src={`/assets/${category.toLowerCase()}.png`}
                    alt={category}
                    className="w-full h-32 object-cover rounded mb-4"
                  />
                  <h3 className="font-semibold text-white">{category}</h3>
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