import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from "@mdi/react";
import { mdiChevronLeft, mdiSoccer, mdiTshirtCrew, mdiCalendar, mdiEarth, mdiVideo, mdiAccountOutline, mdiScale, mdiRuler, mdiShoeSneaker, mdiPlayCircle } from "@mdi/js";
import { useAppContext } from "../../App"; // Make sure this import is correct for your project structure

function Sprofile() {
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [clubLeaderProfileImage, setClubLeaderProfileImage] = useState(null);
  const [pastClubImages, setPastClubImages] = useState([]);
  const [video, setVideo] = useState(null);
  const location = useLocation();
  const { email } = location.state;
  const { id } = useAppContext();
  console.log(email);
  const navigate = useNavigate();
  const [error,setError]=useState();
  const [loading,setLoading]=useState();
  const [videoLoading, setVideoLoading] = useState(false);


  const [players,setPlayers]=useState([]);
  const fetchClubPlayers = async () => {
    try {
  
      setLoading(true);
      const token = localStorage.getItem('token');

      const responses = await axios.post('https://sportconnect-khom.onrender.com/api/v1/user/retrieve-by-email', { email }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = responses.data;
      setUserData(data);

      if (data.club){
        let clubId;
        if (data.club._doc){
          clubId=data.club._doc._id;
        }
        else if (data.club){
          clubId=data.club._id;
        }
        else{
          clubId=data.id;
        }
        console.log(data.club);
        const response = await axios.post('https://sportconnect-khom.onrender.com/api/v1/club/club-players', 
          { clubId }, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
      );
  
      setPlayers(response.data);
      setLoading(false);
    }
    } catch (err) {
      console.error("Error fetching club players:", err);
      setError('Failed to fetch club players');
      setLoading(false);
    }

  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const responsefirst = await axios.post('https://sportconnect-khom.onrender.com/api/v1/user/retrieve-by-email', { email });
        const dataf = responsefirst.data;
  
        const response = await axios.post('https://sportconnect-khom.onrender.com/api/v1/user/retrieve', { id: dataf.id }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
  
        setUserData(data);
        setProfileImage(data.profileImage);
        setBackgroundImage(data.backgroundImage);
        setClubLeaderProfileImage(data.currentClubImage);
        if (data.club){
          fetchClubPlayers();
        }
        console.log("data:",data)
        fetchVideo(data.id);
        if (data.role !== 'club') {
          const fetchPastClubImages = async (pastClubs) => {
            return Promise.all(
              pastClubs.map(async (clubId) => {
                const clubResponse = await axios.post('https://sportconnect-khom.onrender.com/api/v1/club/retrieve', { id: clubId.club }, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                return { 
                  id: clubResponse.data.id,
                  clubName: clubResponse.data.clubName, 
                  image: clubResponse.data.contactProfileImage,
                  email: clubResponse.data.email,
                  year: clubId.year // Include the year from the pastClubs data
                };
              })
            );
          };

          let pastClubImages = [];
          let currentClub = null;
          if (data.player) {
            currentClub = data.player.currentClub;
            pastClubImages = await fetchPastClubImages(data.player.pastClubs);
          } else if (data.agent) {
            currentClub = data.agent.currentClub;
            pastClubImages = await fetchPastClubImages(data.agent.pastClubs);
          } else if (data.recruiter) {
            currentClub = data.recruiter.currentClub;
            pastClubImages = await fetchPastClubImages(data.recruiter.pastClubs);
          }
          
          pastClubImages = pastClubImages.filter(club => club.clubName !== currentClub);
    
          setPastClubImages(pastClubImages);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, [email]);

  const fetchVideo = async (userId) => {
    try {
      setVideoLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://sportconnect-khom.onrender.com/api/v1/player/get-video/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      if (response.data.size > 0) {
        setVideo(URL.createObjectURL(response.data));
      } else {
        console.log("No video data received");
        setVideo(null);
      }
    } catch (error) {
      console.error("Error fetching video:", error);
      setVideo(null);
    }finally {
      setVideoLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatSports = (sports) => {
    if (Array.isArray(sports)) {
      return sports.map(sport => sport.toLowerCase()).join(', ');
    }
    return sports;
  };

  const formatCurrentClub = (club) => {
    if (typeof club === 'object' && club !== null) {
      return club.clubName || 'No current club.';
    }
    return club;
  };

  if (!userData) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
    </div>;
  }

  const filteredRoleData = Object.entries(userData.player || userData.agent || userData.recruiter || userData.club || {})
    .filter(([key]) => 
      key !== "_id" && 
      key !== "__v" && 
      key !== "pastClubs" && 
      key !== "players" && 
      key !== "services" && 
      key !== "agentId" &&
      key !== "id" &&
      key !== "recruiters" && 
      (userData.role !== 'agent' || (key !== 'Recruiters' && key !== 'recruiters'))
    )
    .map(([key, value]) => {
      if (key === 'contact' && typeof value === 'object' && value !== null) {
        return [key, value.email];
      }
      if (key === 'dateOfBirth' || key === 'birthday' || key === 'Birthday') {
        return ['birthday', formatDate(value)];
      }
      if (key === 'sports') {
        return [key, formatSports(value)];
      }
      if (key === 'currentClub') {
        return [key, formatCurrentClub(value)];
      }
      return [key, typeof value === 'object' ? JSON.stringify(value) : value];
    });

    const getClubYear = (club) => {
      if ((userData.role === 'player' && userData.player && userData.player.pastClubs) ||
          (userData.role === 'recruiter' && userData.recruiter && userData.recruiter.pastClubs)) {
        return club.year || 'N/A';
      }
      return 'N/A';
    };
  if (!userData) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto py-8 px-4"
      >
        <button
          onClick={() => {
            if (id){ 
              navigate('/profile', { state: { id:id } });
            }
            else{
              navigate('/welcome')
            }
          }}
          className="mb-4 flex items-center text-gray-400 hover:text-white transition duration-200"
        >
          <Icon path={mdiChevronLeft} size={1} />
          <span className="ml-2">Back</span>
        </button>
  
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div 
            className="h-80 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${backgroundImage || '/football-stadium-background.jpg'})` }}
          />
  
          <div className="px-8 py-6 relative">
            <div className="absolute -top-20 left-8">
              <div 
                className="w-40 h-40 rounded-full bg-cover bg-center border-4 border-gray-800 shadow-lg"
                style={{ backgroundImage: `url(${profileImage || (userData.player ? 'player.png' : userData.agent ? '/agent.png' : userData.recruiter?'/coach.png':userData.club?'/club.png':null)})` }}
              />
            </div>
  
            <div className="mt-24">
              <h1 className="text-4xl font-bold text-white">{userData.fullName}</h1>
              <p className="text-xl text-gray-400 mt-2">{userData.email}</p>
            </div>
  
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.role !== 'club' && filteredRoleData
                .filter(([key]) => key !== 'description' && key !== 'philosophy' && key !== 'services')
                .map(([key, value], index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4 shadow-md flex items-center">
                    <Icon path={getIconForKey(key)} size={1.2} className="text-blue-400 mr-3" />
                    <div>
                      <span className="font-semibold text-gray-300">{formatKey(key)}:</span>
                      <span className="ml-2 text-white">{value}</span>
                    </div>
                  </div>
                ))
              }
              {userData.role === 'club' && (
                <>
                  <div className="bg-gray-700 rounded-lg p-4 shadow-md flex items-center">
                    <Icon path={mdiSoccer} size={1.2} className="text-blue-400 mr-3" />
                    <div>
                      <span className="font-semibold text-gray-300">Club Name:</span>
                      <span className="ml-2 text-white">{userData.currentClubDetails?.clubName || userData.club._doc?.clubName}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 shadow-md flex items-center">
                    <Icon path={mdiEarth} size={1.2} className="text-blue-400 mr-3" />
                    <div>
                      <span className="font-semibold text-gray-300">Country:</span>
                      <span className="ml-2 text-white"> {userData.currentClubDetails?.country || userData.club._doc?.country}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 shadow-md flex items-center">
                    <Icon path={mdiSoccer} size={1.2} className="text-blue-400 mr-3" />
                    <div>
                      <span className="font-semibold text-gray-300">Division:</span>
                      <span className="ml-2 text-white">{userData.currentClubDetails?.division || userData.club._doc?.division}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
  
            {userData.role !== 'club' && (
              <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4 text-white">
                  {userData.agent ? "Services" : userData.recruiter ? "Philosophy" : "Player Bio"}
                </h2>
                <div className="bg-gray-700 rounded-lg p-6 shadow-md">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {userData.agent
                      ? (userData.agent.services || 'No services available.')
                      : userData.recruiter
                      ? (userData.recruiter.philosophy || 'No philosophy available.')
                      : (filteredRoleData.find(([key]) => key === 'description')?.[1] || 'No description available.')}
                  </p>
                </div>
              </div>
            )}
  
            {userData.role !== 'club' && userData.role !== 'agent' && (
              <>
                <div className="mt-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white">
                    {userData.recruiter ? "Current Club:" : "Current Team:"}
                  </h2>
                  <div className="bg-gray-700 rounded-lg p-6 shadow-md flex items-center space-x-6">
                    <div 
                      className="w-24 h-24 rounded-full bg-cover bg-center shadow-md"
                      style={{ backgroundImage: `url(${clubLeaderProfileImage || '/club.png'})` }}
                      onClick={() => navigate('/pprofile', {state: {email: userData.email}})}
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {userData.currentClubDetails?.clubName || 'No current Club.'}
                      </h3>
                      {userData.currentClubDetails && (
                        <p className="text-gray-400 mt-1">
                          {userData.currentClubDetails.Address || 'N/A'}, {userData.currentClubDetails.country || 'N/A'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
  
                <div className="mt-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white">Career History</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {pastClubImages.length === 0 ? (
                      <h3 className="text-xl font-semibold text-white">No Career History.</h3>
                    ) : (
                      pastClubImages.map((club, index) => (
                        <div key={index} className="text-center">

                          <div 
                            className="w-24 h-24 mx-auto rounded-full bg-cover bg-center shadow-md hover:shadow-lg transition duration-200"
                            style={{ backgroundImage: `url(${club.image || '/club.png'})` }}
                            onClick={() => navigate('/pprofile', {state: {email: club.email}})}
                          />
<h3 className="mt-2 text-sm font-medium text-gray-300">
  {club.clubName} ({getClubYear(club)})
</h3>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
  
            {userData.role === 'agent' && (
              <>
                <div className="mt-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white">Players Represented</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {userData.agent.players.map((player, index) => (
                      <div key={index} className="text-center">
                        <div 
                          className="w-24 h-24 mx-auto rounded-full bg-cover bg-center shadow-md hover:shadow-lg transition duration-200"
                          style={{ backgroundImage: `url(${player.profileImage || 'player.png'})` }}
                          onClick={() => navigate("/pprofile", { state: { email: player.email } })}
                        />
                        <h3 className="mt-2 text-sm font-medium text-gray-300">{player.fullName}</h3>
                      </div>
                    ))}
                  </div>
                </div>
  
                <div className="mt-10">
                  <h2 className="text-2xl font-semibold mb-4 text-white">Coaches Represented</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {userData.agent.recruiters && userData.agent.recruiters.map((recruiter, index) => (
                      <div key={index} className="text-center">
                        <div 
                          className="w-24 h-24 mx-auto rounded-full bg-cover bg-center shadow-md hover:shadow-lg transition duration-200"
                          style={{ backgroundImage: `url(${recruiter.profileImage || '/coach.png'})` }}
                          onClick={() => navigate("/pprofile", { state: { email: recruiter.email } })}
                        />
                        <h3 className="mt-2 text-sm font-medium text-gray-300">{recruiter.fullName}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
  
  {userData.role === 'club' && userData.club && (
              <div className="mt-10">
                <h2 className="text-3xl font-semibold mb-6 text-white">Club Details</h2>
                <div className="bg-gray-700 rounded-lg p-6 shadow-md space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-4">General Information</h3>
                      <p className="text-gray-300"><span className="font-semibold">Club Name:</span> {userData.currentClubDetails?.clubName || userData.club._doc?.clubName}</p>
                      <p className="text-gray-300"><span className="font-semibold">Address:</span> {userData.currentClubDetails?.Address || userData.club._doc?.Address}</p>
                      <p className="text-gray-300"><span className="font-semibold">Country:</span> {userData.currentClubDetails?.country || userData.club._doc?.country}</p>
                      <p className="text-gray-300"><span className="font-semibold">Contact Person:</span> {userData.fullName}</p>
                      <p className="text-gray-300"><span className="font-semibold">Contact Email:</span> {userData.email}</p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-4">Club Information</h3>
                      <p className="text-gray-300"><span className="font-semibold">Current Division:</span> {userData.currentClubDetails?.division || userData.club._doc?.division}</p>
                      <p className="text-gray-300"><span className="font-semibold">Number of Teams:</span> {userData.currentClubDetails?.teams || userData.club._doc?.teams}</p>
                      <p className="text-gray-300"><span className="font-semibold">Founded:</span> {userData.currentClubDetails?.dateOfCreation ? new Date(userData.currentClubDetails?.dateOfCreation ).getFullYear() : userData.club._doc?.dateOfCreation ? new Date(userData.club._doc?.dateOfCreation ).getFullYear(): 'N/A'}</p>
                      {userData.currentClubDetails?.web && (
                        <p className="text-gray-300">
                          <span className="font-semibold">Website:</span>{' '}
                          <a href={userData.currentClubDetails.web} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                            {userData.currentClubDetails.web}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
  
                <h2 className="text-2xl font-semibold my-6 text-white">Team Roster</h2>
                {userData.club.players && players.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {players.map((player, index) => (
                      <div key={index} className="text-center">
                        <div 
                          onClick={()=>{navigate('/pprofile',{state:{email:player.user.email}})}}
                          className="w-24 h-24 mx-auto rounded-full bg-cover bg-center shadow-md hover:shadow-lg transition duration-200"
                          style={{ backgroundImage: `url(${player.profileImage || 'player.png'})` }}
                        />
                        <h3 className="mt-2 text-sm font-medium text-gray-300">{player.Name}</h3>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No players currently in the roster.</p>
                )}
              </div>
            )}
          </div>
        </div>
  
        {(userData.role !== 'none' && (videoLoading || video)) && (
  <div className="mt-10">
    <h2 className="text-2xl font-semibold mb-4 text-white text-center">
      {userData.player ? 'Player Video' : userData.club ? 'Club Video' : userData.agent ? 'Agent Video' : userData.recruiter ? 'Recruiter Video' : null}
    </h2>
    {videoLoading ? (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    ) : video ? (
      <div>
        <video 
          key={video} 
          controls 
          className="w-full max-w-3xl mx-auto rounded-lg shadow-lg"
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    ) : null}
  </div>
)}
      </motion.div>
    </div>
  );
}
function getIconForKey(key) {
  switch (key.toLowerCase()) {
    case 'position':
      return mdiTshirtCrew;
    case 'dateofbirth':
    case 'birthday':
      return mdiCalendar;
    case 'nationality':
      return mdiEarth;
    default:
      return mdiSoccer;
  }
  }
  
  function formatKey(key) {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();
  }
export default Sprofile;