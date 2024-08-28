import React, { useEffect, useState,useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from "@mdi/react";
import { mdiCamera,mdiPlayCircle,mdiScale,mdiRuler,mdiAccountOutline, mdiPencil,mdiCheck,mdiVideo , mdiPlus, mdiChevronLeft, mdiSoccer,mdiAccountTie,mdiAccountMultiple, mdiTshirtCrew, mdiCalendar, mdiEarth, mdiCancel, mdiShoeSneaker, mdiClose } from "@mdi/js";
import "./Profile.css";
import Searching from "../Search/Search";
import Modal from './Modal'; // Import the Modal component
import AddPlayerModal from "./addPlayerModal";
import Modals from './Modals';
import Select from 'react-select';



function Profile() {
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [clubLeaderProfileImage, setClubLeaderProfileImage] = useState(null);
  const [pastClubImages, setPastClubImages] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [showClubList, setShowClubList] = useState(false);
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [video, setVideo] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const fileInputRef = useRef(null);

  const SPORTS_LIST = [
    'Football', 'Basketball', 'Volleyball', 'Badminton', 
    'Handball', 'Tennis', 'Ice Hockey', 'Table Tennis', 
    'Squash', 'Gymnastics', 'Indoor Athletics', 'Wrestling', 
    'Boxing', 'Martial Arts'
  ];
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const location = useLocation();
  const [isEditPastClubModalOpen, setIsEditPastClubModalOpen] = useState(false);
  const [selectedPastClubForEdit, setSelectedPastClubForEdit] = useState(null);

  const [showCurrentClubList, setShowCurrentClubList] = useState(false);
  const [currentClub, setCurrentClub] = useState(null);
  const [players, setPlayers] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [showRecruiterList, setShowRecruiterList] = useState(false);
  const  id  = localStorage.getItem('id');
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [isAddPlayerModalClubOpen, setIsAddPlayerModalClubOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [selectedPlayerinfo, setSelectedPlayerinfo] = useState(null);
  const [isPlayerModalInfoOpen, setIsPlayerModalInfoOpen] = useState(false);
  const [isAddCoachModalOpen, setIsAddCoachModalOpen] = useState(false);
  const [isCurrentClubModalOpen,setIsCurrentClubModalOpen]=useState(false);
  const [isAddPastClubModalOpen, setIsAddPastClubModalOpen] = useState(false);
  const navigate = useNavigate();
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const response = await axios.post('http://localhost:5000/api/v1/user/retrieve', { id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = response.data;
      setUserData(data);
      setProfileImage(data.profileImage);
      setBackgroundImage(data.backgroundImage);

      if (data.role !== 'club' && data.role!== 'agent') {
        setClubLeaderProfileImage(data.currentClubImage);
        const fetchPastClubImages = async (pastClubs) => {
          return Promise.all(
            pastClubs.map(async (clubId) => {
              const clubResponse = await axios.post('http://localhost:5000/api/v1/club/retrieve', { id: clubId.club }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              return { 
                id:clubResponse.data.id,
                clubName: clubResponse.data.clubName, 
                image: clubResponse.data.contactProfileImage,
                email: clubResponse.data.email
              };
            })
          );
        };

        let pastClubImages = [];
        let currentClub = null;
        if (data.player) {
          currentClub = data.player.currentClub;
          pastClubImages = await fetchPastClubImages(data.player.pastClubs);
        } else if (data.recruiter) {
          currentClub = data.recruiter.currentClub;
          pastClubImages = await fetchPastClubImages(data.recruiter.pastClubs);
        }
        if (data.role === 'recruiter') {
          currentClub = data.recruiter.currentClub;
          pastClubImages = await fetchPastClubImages(data.recruiter.pastClubs);
        }
        // Filter out the current club from pastClubImages
        pastClubImages = pastClubImages.filter(club => club.clubName !== currentClub);
  
        setPastClubImages(pastClubImages);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchClubPlayers = async () => {
    try {
  
      setLoading(true);
      const token = localStorage.getItem('token');
      const responses = await axios.post('http://localhost:5000/api/v1/user/retrieve', { id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = responses.data;
      setUserData(data);
      console.log(data.club)
      if (data.club){
        const clubId=data.club.id;
        const response = await axios.post('http://localhost:5000/api/v1/club/club-players', 
          { clubId }, // Send clubId in the request body
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
  
  const fetchPlayersAndRecruiters = async () => {
    try {
      const token = localStorage.getItem('token');
      const [playersResponse, recruitersResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/v1/player/getplayerssearch', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:5000/api/v1/recruiter/getRecruitersSearch', {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);
      setPlayers(playersResponse.data.users);
      setRecruiters(recruitersResponse.data.users);
    } catch (error) {
      console.error("Error fetching players and recruiters:", error);
    }
  };
  const fetchVideo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/v1/player/get-video/${id}?t=${new Date().getTime()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      const videoUrl = URL.createObjectURL(response.data);
      setVideo(videoUrl);
    } catch (error) {
      console.error("Error fetching video:", error);
      setVideo(null);
    }
  };
  useEffect(() => {



 
    fetchVideo();
    fetchUserData();
    fetchClubPlayers();
    fetchPlayersAndRecruiters();
  }, [id]);
  const handleCurrentClubSelect = async (clubId) => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/v1/club/update-club', 
        { userId: id, clubId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const responses = await axios.post('http://localhost:5000/api/v1/user/retrieve', { id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = responses.data;
      setUserData(data);
      setProfileImage(data.profileImage);
      setBackgroundImage(data.backgroundImage);
      setClubLeaderProfileImage(data.currentClubImage);

      setShowCurrentClubList(false);
    } catch (error) {
      console.error("Error setting current club:", error);
    }
  };


  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setIsPlayerModalInfoOpen(true);
  };

  const PlayerDataModal = ({ player, isOpen, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedPlayer, setEditedPlayer] = useState(player);
  
    if (!player) return null;
  
    const playerInfo = [
      { icon: mdiAccountOutline, label: 'Name', key: 'Name' },
      { icon: mdiAccountOutline, label: 'Age', key: 'age' },
      { icon: mdiEarth, label: 'Nationality', key: 'nationality' },
      { icon: mdiScale, label: 'Weight', key: 'weight', unit: 'kg' },
      { icon: mdiRuler, label: 'Height', key: 'height', unit: 'cm' },
      { icon: mdiShoeSneaker, label: 'Dominant Foot', key: 'dominantFoot' },
      { icon: mdiTshirtCrew, label: 'Position', key: 'position' },
      { icon: mdiSoccer, label: 'Category', key: 'Category' },
      { icon: mdiPlayCircle, label: 'Goals', key: 'goals' },
      { icon: mdiPlayCircle, label: 'Passes', key: 'passes' },
      { icon: mdiPlayCircle, label: 'Matches', key: 'matches' },
    ];
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedData(prevData => {
        if (name === 'birthday') {
          // For date inputs, we receive the value in YYYY-MM-DD format
          return {
            ...prevData,
            player: {
              ...prevData.player,
              dateOfBirth: new Date(value) // Convert string to Date object
            }
          };
        }
        // ... rest of the function remains the same
      });
    };
    const handleSave = async () => {
      try {
        const response = await axios.put('http://localhost:5000/api/v1/club/update-player', {
          playerId: player._id,
          updatedData: editedPlayer
        });
        console.log("Player data updated:", response.data);
        setIsEditing(false);
        // You might want to update the player data in the parent component here
        // onSave(response.data.player);
      } catch (error) {
        console.error("Error updating player data:", error);
      }
    };
    const renderField = (item) => {
      if (isEditing && player.editable) {
        return (
          <input
            type="text"
            value={editedPlayer[item.key]}
            onChange={(e) => handleInputChange(item.key, e.target.value)}
            className="bg-gray-700 text-white px-2 py-1 rounded w-full"
          />
        );
      }
      return (
        <span className="ml-2">
          {editedPlayer[item.key]}
          {item.unit && ` ${item.unit}`}
        </span>
      );
    };
  
    return (
      <Modals isOpen={isOpen} onClose={()=>{
        fetchClubPlayers();
        onClose();
      }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{player.Name}</h2>
          {player.editable && (
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <Icon path={isEditing ? mdiCheck : mdiPencil} size={1} className="mr-2" />
              {isEditing ? 'Save' : 'Edit'}
            </button>
          )}
        </div>
        <div className="mt-4">
          <div className="w-32 h-32 mx-auto rounded-full bg-cover bg-center mb-4"
               style={{ backgroundImage: `url(${player.profileImage || '/default-player-avatar.jpg'})` }} />
          <div className="grid grid-cols-2 gap-4">
            {playerInfo.map((item, index) => (
              <div key={index} className="flex items-center">
                <Icon path={item.icon} size={1} className="text-blue-400 mr-2" />
                <span className="font-semibold">{item.label}:</span>
                {renderField(item)}
              </div>
            ))}
          </div>
        </div>
      </Modals>
    );
  };


  const BACKEND_URL = 'http://localhost:5000';
  const handleRemovePlayerAgent = async (playerId) => {
    try {
      console.log(playerId)
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/v1/agent/removePlayer', 
        { agentId: userData.agent.agentId, playerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserData(); // Refresh user data
    } catch (error) {
      console.error("Error removing player:", error);
    }
  };

  const handleRemoveRecruiterAgent = async (recruiterId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/v1/agent/removeRecruiter', 
        { agentId: userData.agent.agentId, recruiterId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserData(); // Refresh user data
    } catch (error) {
      console.error("Error removing recruiter:", error);
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("video", file);
  
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/v1/player/upload-video/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      // After successful upload, fetch the updated video
      await fetchVideo();
  
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video. Please try again.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    const id=localStorage.getItem('id')
    try {
      await axios.post(`http://localhost:5000/api/v1/user/upload-image/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      setProfileImage(URL.createObjectURL(file));
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const handleBackgroundImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post(`http://localhost:5000/api/v1/user/upload-background-image/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setBackgroundImage(URL.createObjectURL(file));
    } catch (error) {
      console.error("Error uploading background image:", error);
    }
  };

  const handleClubImageClick = async () => {
    try {
      setIsAddPastClubModalOpen(true);
      setShowClubList(true);
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.error("No authentication token found.");
        return;
      }
  
      const response = await axios.get('http://localhost:5000/api/v1/club/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      let availableClubs = response.data;



      setClubs(availableClubs);
      setShowClubList(true);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleCurrentClubImageClick = async () => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.error("No authentication token found.");
        return;
      }
  
      const response = await axios.get('http://localhost:5000/api/v1/club/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      let availableClubs = response.data;



      setClubs(availableClubs);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };
  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
  
      if (!token) {
        console.error("No authentication token found.");
        return;
      }
  
      if (!userId) {
        console.error("No user ID found.");
        return;
      }
  
      const response = await axios.delete('http://localhost:5000/api/v1/user/deleteuser', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { id: userId }, // Send the ID in the request body
      });
  
      if (response.status === 200) {
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error("Error deleting account:", error.response ? error.response.data : error.message);
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
      return club.clubName || 'N/A';
    }
    return club;
  };
  const handleClubSelect = (clubId) => {
    setSelectedClubId(clubId);
    setShowYearSelector(true);
  };
  const handleRemovePlayer = async (playerId) => {
    const clubId=userData.club._id;


    try {
      await axios.post('http://localhost:5000/api/v1/club/remove-player-from-club', { clubId, playerId });
      fetchClubPlayers()
      console.log(`Player ${playerId} removed successfully`);
    } catch (error) {
      console.error("Error removing player:", error);
    }
  };
  const handleYearSelect = async (event) => {
    const year = parseInt(event.target.value);
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.error("No authentication token found.");
        return;
      }
  
      const response = await axios.post(
        'http://localhost:5000/api/v1/club/add-past-club', 
        { userId: id, clubId: selectedClubId, year },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const newClub = response.data;
      setPastClubImages(prevClubs => [...prevClubs, { 
        id: newClub.id,
        clubName: newClub.clubName,
        image: newClub.contactProfileImage,
        email: newClub.contactEmail,
        year: year  // Include the year here
      }]);
  
      setShowClubList(false);
      setShowYearSelector(false);
      fetchUserData();  // This will update the userData with the new past club
    } catch (error) {
      console.error("Error adding past club:", error);
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 50; i--) {
      years.push(i);
    }
    return years;
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
    key !== "recruiters" && 
    key !== "currentClub" &&
    key !== "agentId" && // Add this line to filter out agentId
    (userData.role !== 'agent' || (key !== 'Recruiters' && key !== 'recruiters'))
  )
  .map(([key, value]) => {
    if (key === 'contact' && typeof value === 'object' && value !== null) {
      return [key, value.email];
    }
    if (key === 'dateOfBirth') {
      return ['birthday', formatDate(value)];
    }
    if (key === 'sports') {
      return [key, formatSports(value)];
    }
    return [key, typeof value === 'object' ? JSON.stringify(value) : value];
  });
  const getClubYear = (club) => {
    if (userData.role === 'player' && userData.player && userData.player.pastClubs) {
      // First, try to match by _id
      const pastClub = userData.player.pastClubs.find(pc => pc.club === club.id);
      // If not found, try matching by clubName
      if (pastClub) {
        return pastClub.year;
      }
      
      return pastClub ? pastClub.year : 'N/A';
    }
    
    // Add similar checks for agent and recruiter if needed
    return 'N/A';
  };
 

  const handleAddPlayer = async (playerId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/v1/agent/addPlayer', 
        { agentId: id, playerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserData(); // Refresh user data
      setShowPlayerList(false);
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };


  const handleAddRecruiter = async (recruiterIdd) => {
    try {
      const recruiterId=recruiterIdd.recruiter.id;
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/v1/agent/addRecruiter', 
        { agentId: id, recruiterId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserData(); // Refresh user data
      setShowRecruiterList(false);
    } catch (error) {
      console.error("Error adding recruiter:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedData({
      fullName: userData.fullName,
      email: userData.email,
      player: userData.role === 'player' ? { 
        ...userData.player,
        description: userData.player.description,
        gender: userData.player.gender
      } : {},
      agent: userData.role === 'agent' ? { 
        ...userData.agent,
        services: userData.agent.services,
        dateOfBirth: new Date(userData.agent.dateOfBirth),
        sports: userData.agent.sports || [],
        gender: userData.agent.gender
      } : {},
      recruiter: userData.role === 'recruiter' ? { 
        ...userData.recruiter,
        philosophy: userData.recruiter.philosophy,
        gender: userData.recruiter.gender
      } : {},
      currentClubDetails: userData.role === 'club' ? { ...userData.currentClubDetails } : {},
    });
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevData => {
      let newData = { ...prevData };
      if (name === 'gender') {
        switch (userData.role) {
          case 'player':
            newData.player = { ...newData.player, gender: value };
            break;
          case 'agent':
            newData.agent = { ...newData.agent, gender: value };
            break;
          case 'recruiter':
            newData.recruiter = { ...newData.recruiter, gender: value };
            break;
          default:
            newData[name] = value;
        }
      }
      if (name === 'birthday') {
        // For date inputs, we receive the value in YYYY-MM-DD format
        if (userData.role === 'agent') {
          newData.agent = {
            ...newData.agent,
            dateOfBirth: new Date(value) // Convert string to Date object
          };
        } else if (userData.role === 'player') {
          newData.player = {
            ...newData.player,
            dateOfBirth: new Date(value)
          };
        }
      }else if (userData.role === 'agent') {
        newData.agent = { 
          ...newData.agent, 
          [name]: name === 'info' ? value : newData.agent?.[name] || value 
        };
      } else {
        // Handle other fields
        if (['fullName', 'email'].includes(name)) {
          newData[name] = value;
        } else {
          switch (userData.role) {
            case 'player':
              newData.player = { 
                ...newData.player, 
                [name]: name === 'info' ? value : newData.player?.[name] || value 
              };
              break;
            case 'agent':
              newData.agent = { 
                ...newData.agent, 
                [name]: name === 'info' ? value : newData.agent?.[name] || value 
              };
              break;
            case 'recruiter':
              newData.recruiter = { 
                ...newData.recruiter, 
                [name]: name === 'info' ? value : newData.recruiter?.[name] || value 
              };
              break;
            case 'club':
              newData.currentClubDetails = { ...newData.currentClubDetails, [name]: value };
              break;
            default:
              newData[name] = value;
          }
        }
      }
  
      return newData;
    });
  };


  const handleEditPastClub = (club) => {
    setSelectedPastClubForEdit(club);
    setIsEditPastClubModalOpen(true);
    handleCurrentClubImageClick(); // This will fetch the list of clubs
  };

  const handleUpdatePastClub = async (newClubId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/v1/club/update-past-club',
        {
          userId: id,
          oldClubId: selectedPastClubForEdit.id,
          newClubId: newClubId,
          year: selectedPastClubForEdit.year
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Update the pastClubImages state
        setPastClubImages(prevClubs => 
          prevClubs.map(club => 
            club.id === selectedPastClubForEdit.id 
              ? { ...club, ...response.data.updatedClub } 
              : club
          )
        );
        setIsEditPastClubModalOpen(false);
        fetchUserData(); // Refresh user data
      }
    } catch (error) {
      console.error("Error updating past club:", error);
    }
  };
  const handleSaveClick = async () => {
    try {
      let roleSpecificData = {};
      let info = '';
  
      const formatDate = (date) => {
        if (date instanceof Date) {
          // Create a new Date object with the same date at 00:00:00 UTC
          const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
          return utcDate.toISOString();
        }
        return date; // If it's already a string, return as is
      };
  
      switch (userData.role) {
        case 'player':
          info = editedData.player?.description || '';
          roleSpecificData = { 
            playerData: { 
              ...editedData.player, 
              description: info,
              dateOfBirth: formatDate(editedData.player?.dateOfBirth),
              gender: editedData.player?.gender
            } 
          };
          break;
        case 'agent':
          info = editedData.agent?.services || '';
          roleSpecificData = { 
            agentData: { 
              ...editedData.agent, 
              services: info,
              dateOfBirth: formatDate(editedData.agent?.dateOfBirth),
              sports: editedData.agent?.sports || [],
              gender: editedData.agent?.gender
            } 
          };
          break;
        case 'recruiter':
          info = editedData.recruiter?.philosophy || '';
          roleSpecificData = { 
            recruiterData: { 
              ...editedData.recruiter, 
              philosophy: info,
              gender: editedData.recruiter?.gender
            } 
          };
          break;
        case 'club':
          roleSpecificData = { currentClubDetails: editedData.currentClubDetails };
          break;
        default:
          break;
      }
  
      const dataToUpdate = {
        userId: localStorage.getItem('id'),
        fullName: editedData.fullName || userData.fullName,
        info: info,
        ...roleSpecificData
      };
  
      console.log('User ID:', userData.id);
      console.log('Data being sent to server:', dataToUpdate);
  
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        alert('You are not authenticated. Please log in again.');
        return;
      }
  
      const response = await axios.put(
        'http://localhost:5000/api/v1/user/update-user-info', 
        dataToUpdate,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Server response:', response.data);
  
      if (response.data.user) {
        setUserData(response.data.user);
        setIsEditing(false);
        alert('User information updated successfully');
      } else {
        console.error('Failed to update user info');
        alert('Failed to update user information. Please try again.');
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      if (error.response) {
        console.error('Server responded with:', error.response.data);
        alert(`Error: ${error.response.data.message || 'An unknown error occurred'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('No response from server. Please check your internet connection.');
      } else {
        console.error('Error setting up request:', error.message);
        alert('An error occurred while sending the request.');
      }
    }
  };
 
  const renderEditableField = (key, value) => {
    if (isEditing) {
      let editedValue;
      
      // Determine the edited value based on the user role and key
      if (['fullName', 'email'].includes(key)) {
        editedValue = editedData[key];
      } else {
        switch (userData.role) {
          case 'player':
            editedValue = key === 'birthday' ? editedData.player?.dateOfBirth : 
                          key === 'info' ? editedData.player?.description :
                          editedData.player?.[key];
            break;
          case 'agent':
            editedValue = key === 'birthday' ? editedData.agent?.dateOfBirth : 
                          key === 'info' ? editedData.agent?.services :
                          editedData.agent?.[key];
            break;
          case 'recruiter':
            editedValue = key === 'info' ? editedData.recruiter?.philosophy :
                          editedData.recruiter?.[key];
            break;
          case 'club':
            editedValue = editedData.currentClubDetails?.[key];
            break;
          default:
            editedValue = editedData[key];
        }
      }
      
      // Use the original value if editedValue is undefined
      editedValue = editedValue ?? value;
  
      if (key === 'info') {
        return (
          <textarea
            name={key}
            value={editedValue}
            onChange={handleInputChange}
            className="bg-gray-600 text-white px-2 py-1 rounded w-full h-32"
          />
        );
      }
      if (key === 'gender') {
        return (
          <select
            name={key}
            value={editedValue}
            onChange={handleInputChange}
            className="bg-gray-600 text-white px-2 py-1 rounded w-full"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        );
      }
      if (key === 'birthday') {
        // Convert the date to a string in YYYY-MM-DD format
        const dateObj = new Date(editedValue);
        const formattedDate = dateObj.toISOString().split('T')[0];
        return (
          <input
            type="date"
            name={key}
            value={formattedDate}
            onChange={handleInputChange}
            className="bg-gray-600 text-white px-2 py-1 rounded w-full"
          />
        );
      }
  
      if (key === 'sports' && userData.role === 'agent') {
        const sportOptions = SPORTS_LIST.map(sport => ({ value: sport, label: sport }));
        return (
          <Select
            isMulti
            name="sports"
            options={sportOptions}
            value={sportOptions.filter(option => editedData.agent?.sports.includes(option.value))}
            onChange={(selectedOptions) => {
              setEditedData(prevData => ({
                ...prevData,
                agent: {
                  ...prevData.agent,
                  sports: selectedOptions.map(option => option.value)
                }
              }));
            }}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: 'transparent',
                borderColor: 'white',
                color: 'white',
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: '#1f2937',
                color: 'white',
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#374151' : 'transparent',
                color: 'white',
              }),
              multiValue: (provided) => ({
                ...provided,
                backgroundColor: '#4b5563',
              }),
              multiValueLabel: (provided) => ({
                ...provided,
                color: 'white',
              }),
              multiValueRemove: (provided) => ({
                ...provided,
                color: 'white',
                ':hover': {
                  backgroundColor: '#ef4444',
                  color: 'white',
                },
              }),
              input: (provided) => ({
                ...provided,
                color: 'white',
              }),
            }}
          />
        );
      }
  
      return (
        <input
          type="text"
          name={key}
          value={editedValue}
          onChange={handleInputChange}
          className="bg-gray-600 text-white px-2 py-1 rounded w-full"
        />
      );
    }
    
    // Display format when not editing
    if (key === 'birthday') {
      const dateObj = new Date(value);
      return <span className="ml-2 text-white">{dateObj.toLocaleDateString()}</span>;
    }
  
    if (key === 'sports' && userData.role === 'agent') {
      return <span className="ml-2 text-white">{Array.isArray(value) ? value.join(', ') : value}</span>;
    }
    
    return <span className="ml-2 text-white">{value || 'N/A'}</span>;
  };
const handleSportsChange = (e) => {
  const selectedSports = Array.from(e.target.selectedOptions, option => option.value);
  setEditedData(prevData => ({
    ...prevData,
    agent: {
      ...prevData.agent,
      sports: selectedSports
    }
  }));
};


  const handleAddPlayerS = async ({ clubId, playerData }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axios.post('http://localhost:5000/api/v1/club/add-player', {
        clubId:userData.club.id,
        playerData,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
      });
  
      const result = response.data;
      
      // Update the local state with the new player and updated club data
      setUserData(prevData => ({
        ...prevData,
        club: result.updatedClub,
      }));
  
      // Show a success message to the user
      alert('Player added successfully');
    } catch (error) {
      console.error('Error adding player:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        // Here you might want to redirect to the login page or refresh the token
      } else {
        alert(error.response?.data?.message || 'Failed to add player. Please try again.');
      }
    }
  };
  const getProfileImageUrl = () => {
    if (profileImage) {
      return profileImage;
    } else if (userData.player) {
      return '/assets/PLAYER.png';
    } else if (userData.agent) {
      return '/assets/AGENT.png'; // Assuming you have an agent default image
    } else if (userData.recruiter) {
      return '/assets/RECRUITER.png'; // Assuming you have a recruiter default image
    } else if (userData.club) {
      return '/assets/CLUB.png'; // Assuming you have a club default image
    } else {
      return '/assets/DEFAULT.png'; // A general default image
    }
  };
const pastClubNames = pastClubImages.map(club => club.clubName);
return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto py-8 px-4"
    >
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-gray-400 hover:text-white transition duration-200"
      >
        <Icon path={mdiChevronLeft} size={1} />
        <span className="ml-2">Back</span>
      </button>

      <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div 
          className="h-80 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backgroundImage || '/football-stadium-background.jpg'})` }}
        >
          <label htmlFor="background-image-upload" className="absolute bottom-4 right-4 bg-gray-800 rounded-full p-2 cursor-pointer shadow-md hover:bg-gray-700 transition duration-200">
            <Icon path={mdiCamera} size={1} className="text-white" />
            <input
              type="file"
              id="background-image-upload"
              className="hidden"
              onChange={handleBackgroundImageUpload}
            />
          </label>
        </div>

        <div className="px-8 py-6 relative">
          <div className="absolute -top-20 left-8">
            <label htmlFor="profile-image-upload" className="relative">
              <div 
                className="w-40 h-40 rounded-full bg-cover bg-center border-4 border-gray-800 shadow-lg"
                style={{ backgroundImage: `url(${profileImage?profileImage: userData.player?'/assets/PLAYER.png':userData.agent?'/assets/PLAYER.png':null})` }}
              >
                <div className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2 cursor-pointer shadow-md hover:bg-gray-700 transition duration-200">
                  <Icon path={mdiCamera} size={0.8} className="text-white" />
                </div>
              </div>
              <input
                type="file"
                id="profile-image-upload"
                className="hidden"
                onChange={handleProfileImageUpload}
              />
            </label>
          </div>

          <div className="mt-24">

          <h1 className="text-4xl font-bold text-white">
  {renderEditableField('fullName', userData.role === 'club' ? userData.currentClubDetails.clubName : userData.fullName)}
</h1>            

            <p className="text-xl text-gray-400 mt-2">{userData.email}</p>
          </div>
          <div className="mt-6">
        <button
          onClick={isEditing ? handleSaveClick : handleEditClick}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <Icon path={isEditing ? mdiCheck : mdiPencil} size={1} className="mr-2" />
          {isEditing ? 'Save Changes' : 'Edit Info'}
        </button>
      </div>
<div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{userData.role !== 'club' && filteredRoleData
        .filter(([key]) => key !== 'description' && key !== 'philosophy' && key !== 'services')
        .map(([key, value], index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-4 shadow-md flex items-center">
            <Icon path={getIconForKey(key)} size={1.2} className="text-blue-400 mr-3" />
            <div>
              <span className="font-semibold text-gray-300">{formatKey(key)}:</span>
              {renderEditableField(key, value)}
            </div>
          </div>
        ))}
        {userData.role === 'club' && (
          <>
            <div className="bg-gray-700 rounded-lg p-4 shadow-md flex items-center">
              <Icon path={mdiSoccer} size={1.2} className="text-blue-400 mr-3" />
              <div>
                <span className="font-semibold text-gray-300">Club Name:</span>
                {renderEditableField('clubName', userData.currentClubDetails.clubName)}
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 shadow-md flex items-center">
              <Icon path={mdiEarth} size={1.2} className="text-blue-400 mr-3" />
              <div>
                <span className="font-semibold text-gray-300">Country:</span>
                {renderEditableField('country', userData.currentClubDetails.country)}
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 shadow-md flex items-center">
              <Icon path={mdiSoccer} size={1.2} className="text-blue-400 mr-3" />
              <div>
                <span className="font-semibold text-gray-300">Division:</span>
                {renderEditableField('division', userData.currentClubDetails.division)}
              </div>
            </div>
          </>
        )}
          </div>

          {userData.role !== 'club' && (
            <div>
              <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4 text-white">
                  {userData.agent ? "Services" : userData.recruiter ? "Philosophy" : "Player Bio"}
                </h2>
                <div className="bg-gray-700 rounded-lg p-6 shadow-md">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {renderEditableField('info',userData.agent
                      ? (userData.agent.services || 'No services available.')
                      : userData.recruiter
                      ? (userData.recruiter.philosophy || 'No philosophy available.')
                      : (filteredRoleData.find(([key]) => key === 'description')?.[1] || 'No description available.')
                    )
                  }
                  </p>
                </div>
              </div>
            </div>
          )}
{userData.role !== 'club' && userData.role !== 'agent' && (
  <>
    <div className="mt-10"> 
      <h2 className="text-2xl font-semibold mb-4 text-white">
        {userData.recruiter ? "Current Club:" : "Current Team:"}
      </h2>
      {currentClub ? (
        <div className="bg-gray-700 rounded-lg p-6 shadow-md flex items-center space-x-6">
          <div 
            className="w-24 h-24 rounded-full bg-cover bg-center shadow-md"
            style={{ backgroundImage: `url(${currentClub.image || '/default-club-logo.jpg'})` }}
            onClick={() => navigate("/pprofile", { state: { email: currentClub.email } })}
          ></div>
          <div>
            <h3 className="text-xl font-semibold text-white">{currentClub.clubName}</h3>
          </div>
        </div>
      ) : (
        <div 
          className="w-full flex items-center bg-gray-700 rounded-lg p-6 shadow-md cursor-pointer hover:bg-gray-600 transition duration-200"
          onClick={() => {
            setShowCurrentClubList(true);
            setIsCurrentClubModalOpen(true)
            handleCurrentClubImageClick();
          }}
        >
          <Icon path={mdiPlus} size={2} className="text-gray-400" />
        </div>
      )}

      <div className="bg-gray-700 rounded-lg p-6 shadow-md flex items-center space-x-6 mt-4">
        <div 
          className="w-24 h-24 rounded-full bg-cover bg-center shadow-md"
          style={{ backgroundImage: `url(${clubLeaderProfileImage || '/default-club-logo.jpg'})` }}
          onClick={() => navigate("/pprofile", { state: { email: userData.player ? userData.player.currentClub.email : userData.email } })}
        ></div>
        <div>
          <h3 className="text-xl font-semibold text-white">
            {userData.currentClubDetails?.clubName || 'No Current Club.'}
          </h3>
          {userData.currentClubDetails && (
            <p className="text-gray-400 mt-1">
              {userData.currentClubDetails.Address || ''}, {userData.currentClubDetails.country || ''}
            </p>
          )}
        </div>
      </div>
    </div>

    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-white">Career History</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {pastClubImages.map((club, index) => (
            <div key={index} className="text-center relative">
              <div 
                className="w-24 h-24 mx-auto rounded-full bg-cover bg-center shadow-md hover:shadow-lg transition duration-200"
                style={{ backgroundImage: `url(${club.image || '/assets/CLUB.png'})` }}
                onClick={() => navigate("/pprofile", { state: { email: club.email } })}
              >
                <button
                  className="absolute top-0 right-0 bg-blue-500 rounded-full p-1 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditPastClub(club);
                  }}
                >
                  <Icon path={mdiPencil} size={0.8} />
                </button>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-300">
                {club.clubName} At {club.year || 'N/A'}
              </h3>
            </div>
          ))}
        <div 
          className="w-full flex items-center bg-gray-700 rounded-lg p-6 shadow-md cursor-pointer hover:bg-gray-600 transition duration-200"
          onClick={handleClubImageClick}
        >
          <Icon path={mdiPlus} size={2} className="text-gray-400" />
        </div>
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
              <div key={index} className="text-center relative">
                <div 
                  className="w-24 h-24 mx-auto rounded-full bg-cover bg-center shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
                  style={{ backgroundImage: `url(${player.profileImage || '/assets/PLAYER.png'})` }}
                  onClick={() => navigate("/pprofile", { state: { email: player.email } })}
                >
                  <button
                    className="absolute top-0 right-0 bg-red-500 rounded-full p-1 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePlayerAgent(player._id._id);
                    }}
                  >
                    <Icon path={mdiClose} size={0.8} />
                  </button>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-300">{player.fullName}</h3>
              </div>
            ))}
        <div 
          className="w-24 h-24 mx-auto rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-600 transition duration-200 shadow-md"
          onClick={() => {
            fetchPlayersAndRecruiters();
            setShowPlayerList(true)
            setIsAddPlayerModalOpen(true);
          }}
        >
          <Icon path={mdiPlus} size={2} className="text-gray-400" />
        </div>
      </div>
    </div>

    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-white">Coaches Represented</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {userData.agent.recruiters && userData.agent.recruiters.map((recruiter, index) => (
              <div key={index} className="text-center relative">
                <div 
                  className="w-24 h-24 mx-auto rounded-full bg-cover bg-center shadow-md hover:shadow-lg transition duration-200"
                  style={{ backgroundImage: `url(${recruiter.profileImage || '/assets/COACH.png'})` }}
                  onClick={() => navigate("/pprofile", { state: { email: recruiter.email } })}
                >
                  <button
                    className="absolute top-0 right-0 bg-red-500 rounded-full p-1 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveRecruiterAgent(recruiter._id);
                    }}
                  >
                    <Icon path={mdiClose} size={0.8} />
                  </button>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-300">{recruiter.fullName}</h3>
              </div>
            ))}
        <div 
          className="w-24 h-24 mx-auto rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-600 transition duration-200 shadow-md"
          onClick={() => {
            fetchPlayersAndRecruiters();
            setShowRecruiterList(true)
            setIsAddCoachModalOpen(true);
          }}
        >
          <Icon path={mdiPlus} size={2} className="text-gray-400" />
        </div>
      </div>
    </div>
  </>
)}

{userData.role === 'club' && (
  <div className="mt-10">
    <h2 className="text-3xl font-semibold mb-6 text-white">Club Details</h2>
    <div className="bg-gray-700 rounded-lg p-6 shadow-md space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-2xl font-semibold text-white mb-4">General Information</h3>
          {['clubName', 'Address', 'country'].map((field) => (
            <p key={field} className="text-gray-300">
              <span className="font-semibold">{formatKey(field)}:</span>
              {isEditing ? (
                <input
                  type="text"
                  name={field}
                  value={editedData.currentClubDetails[field] || ''}
                  onChange={handleInputChange}
                  className="ml-2 bg-gray-600 text-white px-2 py-1 rounded"
                />
              ) : (
                <span className="ml-2">{userData.currentClubDetails[field]}</span>
              )}
            </p>
          ))}
          <p className="text-gray-300">
            <span className="font-semibold">Contact Person:</span>
            <span className="ml-2">{userData.fullName}</span>
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Contact Email:</span>
            <span className="ml-2">{userData.email}</span>
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-white mb-4">Club Information</h3>
          {['division', 'teams'].map((field) => (
            <p key={field} className="text-gray-300">
              <span className="font-semibold">{formatKey(field)}:</span>
              {isEditing ? (
                <input
                  type="text"
                  name={field}
                  value={editedData.currentClubDetails[field] || ''}
                  onChange={handleInputChange}
                  className="ml-2 bg-gray-600 text-white px-2 py-1 rounded"
                />
              ) : (
                <span className="ml-2">{userData.currentClubDetails[field]}</span>
              )}
            </p>
          ))}
          <p className="text-gray-300">
            <span className="font-semibold">Founded:</span>
            {isEditing ? (
              <input
                type="date"
                name="dateOfCreation"
                value={editedData.currentClubDetails.dateOfCreation.split('T')[0]}
                onChange={handleInputChange}
                className="ml-2 bg-gray-600 text-white px-2 py-1 rounded"
              />
            ) : (
              <span className="ml-2">{new Date(userData.currentClubDetails.dateOfCreation).getFullYear()}</span>
            )}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Website:</span>
            {isEditing ? (
              <input
                type="text"
                name="web"
                value={editedData.currentClubDetails.web || ''}
                onChange={handleInputChange}
                className="ml-2 bg-gray-600 text-white px-2 py-1 rounded"
              />
            ) : (
              userData.currentClubDetails.web && (
                <a href={userData.currentClubDetails.web} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-400 hover:underline">
                  {userData.currentClubDetails.web}
                </a>
              )
            )}
          </p>
        </div>
      </div>
    </div>
    <h2 className="text-2xl font-semibold my-6 text-white">Team Roster</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
    {players.map((player, index) => (
          <div key={index} className="text-center relative">
            <div 
              className="w-24 h-24 mx-auto rounded-full bg-cover bg-center shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
              style={{ backgroundImage: `url(${player.profileImage || '/default-player-avatar.jpg'})` }}
              onClick={() => handlePlayerClick(player)}
            >
              <button
                className="absolute top-0 right-0 bg-red-500 rounded-full p-1 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePlayer(player._id);
                }}
              >
                <Icon path={mdiClose} size={0.8} />
              </button>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-300">{player.Name}</h3>
          </div>
        ))}
      <div 
        className="w-24 h-24 mx-auto rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-600 transition duration-200 shadow-md"
        onClick={() => setIsAddPlayerModalClubOpen(true)}
      >
        <Icon path={mdiPlus} size={2} className="text-gray-400" />
      </div>
    </div>
    <div className="mt-6">
        <button
          onClick={()=>{deleteAccount(userData)}}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <Icon path={mdiCancel} size={1} className="mr-2" />
          Delete Account
        </button>
      </div>
    {/* Add Player Modal */}
    <AddPlayerModal 
  isOpen={isAddPlayerModalClubOpen} 
  onClose={() => {
    fetchClubPlayers();
    setIsAddPlayerModalClubOpen(false)
  }}
  onSubmit={handleAddPlayerS}  // This is where you pass handleAddPlayer
  clubId={userData.club._id}
/>
  </div>
          )}
        </div>
      </div>

      {userData.role === 'player' && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">Player Video</h2>
          <input
            type="file"
            ref={fileInputRef}
            accept="video/*"
            className="hidden"
            onChange={handleVideoUpload}
          />
          {video && (
            <button 
              className="w-full max-w-3xl mx-auto h-16 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded-lg p-4 shadow-md cursor-pointer transition duration-200 text-white mb-4"
              onClick={triggerFileInput}
            >
              <Icon path={mdiVideo} size={1.5} className="text-white mr-2" />
              <span className="font-semibold">Change Video</span>
            </button>
          )}
          {video ? (
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
          ) : (
            <div 
              className="w-full max-w-3xl mx-auto h-64 flex items-center justify-center bg-gray-700 rounded-lg p-6 shadow-md cursor-pointer hover:bg-gray-600 transition duration-200"
              onClick={triggerFileInput}
            >
              <Icon path={mdiVideo} size={4} className="text-gray-400" />
            </div>
          )}
        </div>
      )}




    </motion.div>
    <Modal
  isOpen={isAddPlayerModalOpen}
  onClose={() => setIsAddPlayerModalOpen(false)}
  title="Add Player"
>
  {/* Debug: Check if players data is available */}

  {players.length > 0 ? (
    <>

      {players.length>0 ? (
        <ul className="space-y-2">
          {players.map((player) => (
            <li
              key={player.id}
              onClick={() => {
                handleAddPlayer(player.id);
                setIsAddPlayerModalOpen(false);
              }}
              className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors flex items-center"
            >
              <Icon path={mdiAccountMultiple} size={1} className="text-blue-400 mr-3" />

              <span className="text-gray-300">{player.fullName}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No players to show.</p>
      )}
    </>
  ) : (
    <p>Loading players...</p>
  )}
</Modal>
<Modal
        isOpen={isEditPastClubModalOpen}
        onClose={() => setIsEditPastClubModalOpen(false)}
        title="Edit Past Club"
      >
        <ul className="space-y-2">
          {clubs.map((club) => (
            <li 
              key={club._id}
              onClick={() => handleUpdatePastClub(club._id)}
              className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors flex items-center"
            >
              <Icon path={mdiSoccer} size={1} className="text-blue-400 mr-3" />
              <span className="text-gray-300">{club.clubName}</span>
            </li>
          ))}
        </ul>
      </Modal>
<PlayerDataModal
        isOpen={isPlayerModalInfoOpen}
        onClose={() => setIsPlayerModalInfoOpen(false)}
        player={selectedPlayer}
      />

      {/* Add Coach Modal */}
      <Modal
        isOpen={isAddCoachModalOpen}
        onClose={() => setIsAddCoachModalOpen(false)}
        title="Add Coach"
      >
        {/* Add your coach selection UI here */}
        {showRecruiterList && (
          <ul className="space-y-2"> 
            {recruiters.map((recruiter) => (
              <li 
                key={recruiter.recruiter._id}
                onClick={() => {
                  handleAddRecruiter(recruiter);
                  setIsAddCoachModalOpen(false);
                }}
                className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors flex items-center"
              >
                <Icon path={mdiAccountTie} size={1} className="text-blue-400 mr-3" />
                <span className="text-gray-300">{recruiter.fullName}</span>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      {/* Add Past Club Modal */}
      <Modal
        isOpen={isAddPastClubModalOpen}
        onClose={() => setIsAddPastClubModalOpen(false)}
        title="Add Past Club"
      >
        {/* Add your past club selection UI here */}
        {showClubList && (
          <ul className="space-y-2">

            {clubs.map((club) => (
              <li 
                key={club._id}
                onClick={() => {
                  handleClubSelect(club._id);
                  setIsAddPastClubModalOpen(false);
                  setShowYearSelector(true);
                }}
                className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors flex items-center"
              >
                <Icon path={mdiSoccer} size={1} className="text-blue-400 mr-3" />
                <span className="text-gray-300">{club.clubName}</span>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      {/* Year Selector Modal */}
      <Modal
  isOpen={showYearSelector}
  onClose={() => setShowYearSelector(false)}
  title="Select Year"
>
  <div className="flex items-center">
    <select
      value={selectedYear}
      onChange={handleYearSelect}
      className="bg-gray-700 text-white rounded-md p-2 w-full"
    >
      <option default >Select Year.</option>
      {generateYearOptions().map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  </div>
</Modal>
      <Modal
  isOpen={isCurrentClubModalOpen}
  onClose={() => setIsCurrentClubModalOpen(false)}
  title="Select Current Club"
>
  <ul className="space-y-2">
    {clubs.map((club) => (
      <li 
        key={club._id}
        onClick={() => {
          handleCurrentClubSelect(club._id);
          setIsCurrentClubModalOpen(false);
        }}
        className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors flex items-center"
      >
        <Icon path={mdiSoccer} size={1} className="text-blue-400 mr-3" />
        <span className="text-gray-300">{club.clubName}</span>
      </li>
    ))}
  </ul>
</Modal>
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

export default Profile;