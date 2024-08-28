import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, X, User, LogOut, Cpu } from 'lucide-react';
import { useAppContext } from '../../App';

const Searching = () => {
  const [players, setPlayers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [agents, setAgents] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [user,setUser]=useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { username } = useAppContext();
  const searchRef = useRef(null);
  const {id,setId} = useAppContext();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersRes, clubsRes, agentsRes, recruitersRes] = await Promise.all([
          axios.get('https://sportconnect-khom.onrender.com/api/v1/player/getplayerssearch'),
          axios.get('https://sportconnect-khom.onrender.com/api/v1/club/getclubssearch'),
          axios.get('https://sportconnect-khom.onrender.com/api/v1/agent/getAgentsSearch'),
          axios.get('https://sportconnect-khom.onrender.com/api/v1/recruiter/getRecruitersSearch')
        ]);
        if (id){
          const token=localStorage.getItem('token');
        const response = await axios.post('https://sportconnect-khom.onrender.com/api/v1/user/retrieve', { id }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      
        setUser(response.data)
      }
        setPlayers(playersRes.data.users);
        setClubs(clubsRes.data.clubs);
        setAgents(agentsRes.data.users);
        setRecruiters(recruitersRes.data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    const searchRegex = new RegExp(searchTerm.split('').join('.*'), 'i');
  
    const filteredResults = [
      ...players.filter(user => 
        searchRegex.test(user.fullName) ||
        searchRegex.test(user.player?.nationality) ||
        searchRegex.test(user.player?.country) ||
        searchRegex.test(user.player?.dominantFoot) ||
        searchRegex.test(user.player?.currentClub)
      ).map(p => ({ ...p, type: 'Player', currentClub: p.player?.currentClub || 'No Club' })),
      ...clubs.filter(club => 
        searchRegex.test(club.clubName) ||
        searchRegex.test(club.country) ||
        searchRegex.test(club.Address)
      ).map(c => ({ 
        ...c, 
        type: 'Club',
        fullName: c.clubName, // Add this line to standardize the 'fullName' field
        email: c.contact.email // Add this line to make the email easily accessible
      })),
      ...agents.filter(user => 
        searchRegex.test(user.fullName) ||
        searchRegex.test(user.agent?.nationality) ||
        searchRegex.test(user.agent?.country) ||
        searchRegex.test(user.agent?.currentClub)
      ).map(a => ({ ...a, type: 'Agent', currentClub: a.agent?.currentClub || 'No Club' })),
      ...recruiters.filter(user => 
        searchRegex.test(user.fullName) ||
        searchRegex.test(user.recruiter?.nationality) ||
        searchRegex.test(user.recruiter?.country) ||
        searchRegex.test(user.recruiter?.currentClub)
      ).map(r => ({ ...r, type: 'Recruiter', currentClub: r.recruiter?.currentClub || 'No Club' }))
    ];
    console.log(filteredResults)
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
    console.log(result)
    if (result.type === 'Club') {
      if (result.contact && result.contact.email) {
        navigate("/pprofile", { state: { email: result.contact.email } });
      } else {
        console.error("Club email not found:", result);
        // You might want to show an error message to the user here
      }
    } else {
      navigate("/pprofile", { state: { email: result.email } });
    }
    setShowDropdown(false);
  };
  const getBackgroundImage = (type) => {
    switch (type) {
      case 'Player':
        return '/assets/PLAYER.png';
      case 'Club':
        return '/assets/CLUB.png';
      case 'Agent':
        return '/assets/AGENT.png';
      case 'Recruiter':
        return '/assets/COACH.png';
      default:
        return '/assets/PLAYER.png';
    }
  };
  const getProfileImage = (result) => {
    if (result.profileImage?.startsWith('data:')) {
      return result.profileImage;
    } else if (result.profileImage || result.profileImageUrl || result.contact?.profileImageUrl) {
      return `https://sportconnect-khom.onrender.com${result.profileImage || result.profileImageUrl || result.contact?.profileImageUrl}`;
    } else {
      return getBackgroundImage(result.type);
    }
  };
  return (
    <header className="bg-gradient-to-r from-gray-900 to-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <span className="text-2xl font-bold text-white tracking-wide cursor-pointer" onClick={()=>navigate("/welcome")}>SportConnect</span>
        
        <div className="relative flex-grow max-w-xl mx-auto" ref={searchRef}>
          <input
            type="text"
            placeholder="Search players, clubs, agents, or recruiters"
            className="w-full py-3 px-5 pr-12 rounded-full text-white bg-gray-800 border-2 border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out placeholder-gray-500"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(searchResults.length > 0)}
          />
          <button
            onClick={handleSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition duration-150 ease-in-out"
          >
            <Search size={20} />
          </button>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchResults([]);
                setShowDropdown(false);
              }}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition duration-150 ease-in-out"
            >
              <X size={20} />
            </button>
          )}
          
          {showDropdown && searchResults.length > 0 && (
  <div className="absolute z-10 w-full bg-gray-800 mt-2 rounded-lg shadow-xl max-h-80 overflow-y-auto">
    {searchResults.map((result, index) => (
      <div 
        key={index}
        className="p-3 hover:bg-gray-700 cursor-pointer flex items-center transition duration-150 ease-in-out"
        onClick={() => handleImageClick(result)}
      >
<img
  src={result.profileImage?.startsWith('data:') 
    ? result.profileImage 
    : `https://sportconnect-khom.onrender.com${result.profileImage || result.profileImageUrl || result.contact?.profileImageUrl}`
  }
  alt={result.fullName || result.clubName}
  className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-gray-600"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = getProfileImage(result);
  }}
/>
        <div>
        <p className="font-semibold text-white">{result.fullName || result.clubName}</p>

<p className="text-sm text-gray-400">
            {result.type === 'Club' ? 'Club' : 
             result.type === 'Agent' ? 'Agent' :
             result.type === 'Recruiter' ? 'Coach' : 'Player'}
          </p>
        </div>
      </div>
    ))}
  </div>
)}
        </div>
  
        <nav>
          <ul className="flex items-center space-x-6">
            {(user && id) ? (
              <>
                <li>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('id');
                      localStorage.removeItem('token');
                      setId(null)
                      navigate("/login");
                    }} 
                    className="flex items-center text-gray-300 hover:text-blue-400 transition duration-150 ease-in-out"
                  >
                    <LogOut size={18} className="mr-2" />
                    <span className="font-medium">Logout</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate("/profile")} 
                    className="flex items-center text-gray-300 hover:text-blue-400 transition duration-150 ease-in-out"
                  >
                    <User size={18} className="mr-2" />
                    <span className="font-medium">{user.fullName}</span>
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button 
                  onClick={() => navigate("/login")} 
                  className="bg-gray-800 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700 transition duration-150 ease-in-out"
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Searching;