import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';

const CategoryListPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const category = location.state?.category;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        switch (category) {
          case 'PLAYER':
            response = await axios.get('https://sportconnect-khom.onrender.com/api/v1/player/getplayerssearch');
            setItems(response.data.users.map(user => ({
              ...user,
              image: user.profileImageUrl,
              name: user.fullName,
              country: user.player?.nationality || t('noNationality'),
              currentClub: user.player?.currentClub || t('noclub'),
              position: user.player?.position || t('noPosition'),
              age: user.player?.age || t('noAge')
            })));
            break;
          case 'CLUB':
            response = await axios.get('https://sportconnect-khom.onrender.com/api/v1/club/getclubssearch');
            setItems(response.data.clubs.map(club => ({
              ...club,
              image: club.contact?.profileImageUrl,
              name: club.clubName,
              country: club.country || t('noCountry'),
              email: club.contact?.email
            })));
            break;
          case 'AGENT':
            response = await axios.get('https://sportconnect-khom.onrender.com/api/v1/agent/getAgentsSearch');
            setItems(response.data.users.map(user => ({
              ...user,
              image: user.profileImage,
              name: user.fullName,
              country: user.agent?.nationality || t('noNationality'),
              specialization: user.agent?.specialization || t('noSpecialization')
            })));
            break;
          case 'COACH':
            response = await axios.get('https://sportconnect-khom.onrender.com/api/v1/recruiter/getRecruitersSearch');
            setItems(response.data.users.map(user => ({
              ...user,
              image: user.profileImageUrl,
              name: user.fullName,
              country: user.recruiter?.nationality || t('noNationality'),
              currentClub: user.recruiter?.currentClub || t('noclub')
            })));
            break;
          default:
            throw new Error('Invalid category');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchData();
    } else {
      setError('No category specified');
      setLoading(false);
    }
  }, [category, t]);

  const handleItemClick = (item) => {
    if (category === 'CLUB') {
      navigate("/pprofile", { state: { clubName: item.email } });
    } else {
      navigate("/pprofile", { state: { email: item.email } });
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    return imageUrl.startsWith('data:') ? imageUrl : `https://sportconnect-khom.onrender.com${imageUrl}`;
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">{t(category.toLowerCase())}</h1>
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li 
              key={index} 
              className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 ease-in-out"
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-center p-4 cursor-pointer">
                {getImageUrl(item.image) ? (
                  <img 
                    src={getImageUrl(item.image)} 
                    alt={item.name} 
                    className="w-16 h-16 rounded-full object-cover mr-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mr-4">
                    <User size={32} className="text-gray-400" />
                  </div>
                )}
                <div className="flex-grow">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-sm text-gray-400">{item.country}</p>
                  {category === 'CLUB' && item.Address && (
                    <p className="text-sm text-gray-400">{t('address')}: {item.Address}</p>
                  )}
                  {(category === 'PLAYER' || category === 'COACH') && (
                    <p className="text-sm text-gray-400">{t('currentClub')}: {item.currentClub}</p>
                  )}
                  {category === 'PLAYER' && item.position && (
                    <p className="text-sm text-gray-400">{t('position')}: {item.position}</p>
                  )}

                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryListPage;