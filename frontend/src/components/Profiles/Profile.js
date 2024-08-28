import React, { useEffect, useState,useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from "@mdi/react";
import { mdiCamera,mdiPlayCircle,mdiScale,mdiRuler,mdiAccountOutline, mdiPencil,mdiCheck,mdiVideo , mdiPlus, mdiChevronLeft, mdiSoccer,mdiAccountTie,mdiAccountMultiple, mdiTshirtCrew, mdiCalendar, mdiEarth, mdiCancel, mdiShoeSneaker, mdiClose, mdiCandle } from "@mdi/js";
import "./Profile.css";
import Select from 'react-select';
import Searching from "../Search/Search";
import Modal from './Modal'; // Import the Modal component
import AddPlayerModal from "./addPlayerModal";
import Modals from './Modals';
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import countries from './../PlayerS/countries.json';
import nationalities from './../PlayerS/nationalities.json';
import { Upload } from 'lucide-react';

import { setIn } from "formik";
function Profile() {
  const [userData, setUserData] = useState(null);
  const [uploadedImageUrl,setUploadedImageUrl]=useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [clubLeaderProfileImage, setClubLeaderProfileImage] = useState(null);
  const [pastClubImages, setPastClubImages] = useState([]);
  const [scfileurl,setScfileurl]=useState(null);
  const [clubs, setClubs] = useState([]);
  const [showClubList, setShowClubList] = useState(false);
  const [selectedSports, setSelectedSports] = useState([]);
  const [info,setInfo]=useState('');
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [birthday,setBirthday]=useState(null);
  const [age,setAge]=useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [video, setVideo] = useState(null);
  const [selectedPastClubForEdit, setSelectedPastClubForEdit] = useState(null);
  const [isEditPastClubModalOpen, setIsEditPastClubModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [newClubId,setNewClubId]=useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showYearSelectorEdit, setShowYearSelectorEdit] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const location = useLocation();
  const [showCurrentClubList, setShowCurrentClubList] = useState(false);
  const [currentClub, setCurrentClub] = useState(null);
  const [players, setPlayers] = useState([]);
  const [playerss, setPlayerss] = useState([]);
  const [selectedFileP, setSelectedFileP] = useState(null);

  const [recruiters, setRecruiters] = useState([]);
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [showRecruiterList, setShowRecruiterList] = useState(false);
  const  id  = localStorage.getItem('id');
  const SPORTS_LIST = [
    'Football', 'Basketball', 'Volleyball', 'Badminton', 
    'Handball', 'Tennis', 'Ice Hockey', 'Table Tennis', 
    'Squash', 'Gymnastics', 'Indoor Athletics', 'Wrestling', 
    'Boxing', 'Martial Arts'
  ];
  const [scplayer,setScplayer]=useState(null);
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
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  const handleFileSelect = (event) => {
    setSelectedFileP(event.target.files[0]);
    setProfileImage(URL.createObjectURL(event.target.files[0]));

  };
  const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  };

  useEffect(()=>{
    handleProfileImageUploadd(scplayer);

  },[scplayer,selectedFileP])

  const onFileChange = (e) => {
    handleFileSelect(e);
  };
  const calculateAge = (birthday) => {
  
    if (!birthday) {
      console.log("Birthday is undefined or null");
      setAge(null);
      return;
    }
  
    const birthDate = new Date(birthday);
  
    if (isNaN(birthDate.getTime())) {
      console.log("Invalid date");
      setAge(null);
      return;
    }
  
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
  
    // Check if birthday hasn't occurred this year yet
    if (
      today.getMonth() < birthDate.getMonth() || 
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
  
    setAge(age);
  };
  
  const fetchVideo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/v1/player/get-video/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      setVideo(URL.createObjectURL(response.data));
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        navigate("/welcome");
        console.error("No authentication token found.");
        return;
      }

      const response = await axios.post('http://localhost:5000/api/v1/user/retrieve', { id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      const dat=data.agent?data.agent.dateOfBirth:data.player?data.player.birthday:data.recruiter?data.recruiter.dateOfBirth:null;
      setBirthday(formatDateForInput(dat));
      calculateAge(formatDateForInput(dat))
      const inf=data.agent?data.agent.services:data.player?data.player.description:data.recruiter?data.recruiter.philosophy:null;
      setInfo(inf);
      setUserData(data);
      setProfileImage(data.profileImage);
      setBackgroundImage(data.backgroundImage);
      fetchVideo();
      
      if (data.role !== 'club' && data.role !== 'agent') {
        setClubLeaderProfileImage(data.currentClubImage);
        const fetchPastClubImages = async (pastClubs) => {
          return Promise.all(
            pastClubs.map(async (pastClub) => {
              const clubResponse = await axios.post('http://localhost:5000/api/v1/club/retrieve', { id: pastClub.club }, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              return { 
                id: clubResponse.data.id,
                clubName: clubResponse.data.clubName, 
                image: clubResponse.data.contactProfileImage,
                email: clubResponse.data.email,
                year: pastClub.year // Include the year from the pastClub object
              };
            })
          );
        };

        let pastClubImages = [];
        let currentClub = null;
        if (data.player) {
          currentClub = data.player.currentClub;
          console.log(currentClub)
          pastClubImages = await fetchPastClubImages(data.player.pastClubs);
        } else if (data.recruiter) {
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

  const handleSportsChange = (event) => {
    const sport = event.target.value;
    setSelectedSports(prevSelectedSports => {
      if (prevSelectedSports.includes(sport)) {
        return prevSelectedSports.filter(s => s !== sport);
      } else {
        return [...prevSelectedSports, sport];
      }
    });
  
    // Update editedData
    setEditedData(prevData => ({
      ...prevData,
      sports: selectedSports.includes(sport) 
        ? prevData.sports.filter(s => s !== sport)
        : [...(prevData.sports || []), sport]
    }));
  };
  const handleProfileImageUploadd = async (id) => {
    if (!selectedFileP || !id) return;

    const formData = new FormData();
    formData.append("image", selectedFileP);

    try {
      const response = await axios.post(`http://localhost:5000/api/v1/user/upload-image/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200) {
        const fileExtension = getFileExtension(selectedFileP.name);
        setUploadedImageUrl(`/uploads/${scplayer}-profile.${fileExtension}`);
      }
      fetchClubPlayers();
    } catch (error) {
      console.error("Error uploading profile image:", error);
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
      let clubId;

      if (data.club){
        if (data.club._doc){
          clubId=data.club._doc._id;
        }
        else{
          clubId=data.club._id;
        }
        console.log(clubId);
        const response = await axios.post('http://localhost:5000/api/v1/club/club-players', 
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
      setPlayerss(playersResponse.data.users);
      setRecruiters(recruitersResponse.data.users);
    } catch (error) {
      console.error("Error fetching players and recruiters:", error);
    }
  };
  useEffect(() => {


 
    fetchUserData();
    fetchClubPlayers();
    fetchPlayersAndRecruiters();
  }, [id]);

  const handleEditPastClub = (club) => {
    setSelectedPastClubForEdit(club);
    setIsEditPastClubModalOpen(true);
    handleCurrentClubImageClick(); // This will fetch the list of clubs
  };


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
      toast.error("Club Already has a coach.")
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
      console.log(e.target);
      if (name === 'birthday' || name === 'dateOfBirth') {
        console.log("changing birthday....")
        setBirthday(value);
        calculateAge(birthday);
      } else {
        setEditedData(prevData => {
          if (['fullName', 'email'].includes(name)) {
            return { ...prevData, [name]: value };
          }
          
          switch (userData.role) {
            case 'player':
              return { 
                ...prevData, 
                player: { 
                  ...prevData.player, 
                  [name === 'info' ? 'description' : name]: value
                } 
              };
            case 'agent':
              return { 
                ...prevData, 
                agent: { 
                  ...prevData.agent, 
                  [name === 'info' ? 'services' : name]: value
                } 
              };
            case 'recruiter':
              return { 
                ...prevData, 
                recruiter: { 
                  ...prevData.recruiter, 
                  [name === 'info' ? 'philosophy' : name]: value 
                } 
              };
            case 'club':
              return { 
                ...prevData, 
                currentClubDetails: { 
                  ...prevData.currentClubDetails, 
                  [name]: value 
                } 
              };
            default:
              return { ...prevData, [name]: value };
          }
        });
      }
    };
    const handleSave = async () => {
      try {
        const response = await axios.put('http://localhost:5000/api/v1/club/update-player', {
          playerId: player._id,
          updatedData: editedPlayer
        });
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
        {player.editable===false && (
<span>
        <div className="w-32 h-32 mx-auto rounded-full bg-cover bg-center mb-4"
    style={{ backgroundImage: `url(${player.profileImage})` }}
  />
  </span> )}

        {player.editable && (
<span>
  <div className="w-32 h-32 mx-auto rounded-full bg-cover bg-center mb-4"
    style={{ backgroundImage: `url(${scfileurl})` }}
  />

<div className="flex justify-center items-center p-4">
      <button
        variant="outline"
        className="relative overflow-hidden"
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e)=>{
            onFileChange(e)
            setScplayer(player.imgid);
            const file = e.target.files[0];
            if (file) {
              const localUrl = URL.createObjectURL(file);
              setScfileurl(localUrl);
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="mr-2 h-4 w-4" />
        Upload Image
      </button>
    </div>
    </span> )}

            {playerInfo.map((item, index) => (
              <div key={index} className="flex items-center">
                <Icon path={item.icon} size={1} className="text-blue-400 mr-2" />
                <span className="font-semibold">{item.label}:</span>
                {renderField(item)}
              </div>
            ))}

          </div>
      </Modals>
    );
  };


  const BACKEND_URL = 'http://localhost:5000';
  const handleRemovePlayerAgent = async (playerId) => {
    try {
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
      toast.success("This Coach is no longer associated with current agent.")
    } catch (error) {
      console.error("Error removing recruiter:", error);
    }
  };

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
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

      setVideo(URL.createObjectURL(file));
    } catch (error) {
      console.error("Error uploading video:", error);
    }
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
    if (isNaN(date.getTime())) {
      // Return today's date if the input is invalid
      return new Date().toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
  };
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
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
    const clubId=userData.club._doc._id;
    console.log(userData)

    try {
      await axios.post('http://localhost:5000/api/v1/club/remove-player-from-club', { clubId, playerId });
      fetchClubPlayers()
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
      toast.error("Past Club already exists tn the list.")
      
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
    key !== "agentId" &&
    key !== "age" && // Add this line to filter out currentClub
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
    return '0';
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
      toast.error("Player is already associated with current agent.")
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
      toast.error("This coach is already associated with this agent.")
    }
  };
  const handleYearSelectEdit = async (event) => {
    const year = parseInt(event.target.value);
    setShowYearSelectorEdit(false);
  
    // Check if newClubId already exists in pastClubImages
    const clubExists = pastClubImages.some(club => club.id === newClubId);
  
    if (clubExists) {
      toast.error("Club already exists in the list.");
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.error("No authentication token found.");
        return;
      }
  
      const response = await axios.post(
        'http://localhost:5000/api/v1/club/update-past-club',
        {
          userId: id,
          oldClubId: selectedPastClubForEdit.id,
          newClubId: newClubId,
          year: year
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setIsEditPastClubModalOpen(false);
      const newClub = response.data;
      setPastClubImages(prevClubs => [
        ...prevClubs.filter(club => club.id !== selectedPastClubForEdit.id), // Remove the old club
        {
          id: newClub.id,
          clubName: newClub.clubName,
          image: newClub.contactProfileImage,
          email: newClub.contactEmail,
          year: year
        }
      ]);
  
      setShowClubList(false);
      setShowYearSelector(false);
      fetchUserData();  // This will update the userData with the new past club
      toast.success("Past club updated successfully.");
    } catch (error) {
      console.error("Error updating past club:", error);
      toast.error("Failed to update past club. Please try again.");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedData({
      fullName: userData.fullName,
      email: userData.email,
      player: userData.role === 'player' ? { 
        ...userData.player,
        description: userData.player.description 
      } : {},
      agent: userData.role === 'agent' ? { 
        ...userData.agent,
        services: userData.agent.services 
      } : {},
      recruiter: userData.role === 'recruiter' ? { 
        ...userData.recruiter,
        philosophy: userData.recruiter.philosophy 
      } : {},
      currentClubDetails: userData.role === 'club' ? { ...userData.currentClubDetails } : {},
    });
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Input changed:", name, value);

    if (name === 'birthday' || name === 'dateOfBirth'){
      setBirthday(value);
    }
    if (name === 'info'){
      setInfo(value);
    }
    setEditedData(prevData => {
      // Handle general user properties
      if (name === 'birthday' || name === 'dateOfBirth') {
        return {
          ...prevData,
          agent: {
            ...prevData.agent,
            dateOfBirth: value // Store the date string directly
          }
        };
      }
      if (name === 'birthday' || name === 'dateOfBirth') {
        return {
          ...prevData,
          player: {
            ...prevData.player,
            birthday: value // Store the date string directly
          }
        };
      }
      if (name === 'birthday' || name === 'dateOfBirth') {
        return {
          ...prevData,
          recruiter: {
            ...prevData.recruiter,
            birthday: value // Store the date string directly
          }
        };
      }
      if (['fullName', 'email'].includes(name)) {
        return { ...prevData, [name]: value };
      }
      
      // Handle role-specific properties
      switch (userData.role) {
        case 'player':
          return { 
            ...prevData, 
            player: { 
              ...prevData.player, 
              [name === 'info' ? 'description' : name]: value,
              [name === 'birthday' ? 'birthday' : name]: value 
            } 
          };
        case 'agent':
          return { 
            ...prevData, 
            agent: { 
              ...prevData.agent, 
              [name === 'info' ? 'services' : name]: value,
              [name === 'birthday' || name === 'dateOfBirth' ? 'dateOfBirth' : name]: value 
            } 
          };
        case 'recruiter':
          return { 
            ...prevData, 
            recruiter: { 
              ...prevData.recruiter, 
              [name === 'info' ? 'philosophy' : name]: value 
            } 
          };
        case 'club':
          return { 
            ...prevData, 
            currentClubDetails: { 
              ...prevData.currentClubDetails, 
              [name]: value 
            } 
          };
        default:
          return { ...prevData, [name]: value };
      }
    });
  };
  const handleSaveClick = async () => {
    try {
      let roleSpecificData = {};
      if (userData.role === 'agent') {
        roleSpecificData = {
          agentData: {
            ...editedData.agent,
            dateOfBirth: editedData.agent?.dateOfBirth || userData.agent.dateOfBirth
          }
        };
      }
      if (userData.role === 'player') {
        roleSpecificData = {
          playerData: {
            ...editedData.player,
            birthday: editedData.player?.birthday || userData.player.birthday
          }
        };
      }
      if (userData.role === 'recruiter') {
        roleSpecificData = {
          recruiterData: {
            ...editedData.recruiter,
            birthday: editedData.recruiter?.dateOfBirth || userData.recruiter.dateOfBirth
          }
        };
      }
      const formatDate = (date) => {
        if (date instanceof Date) {
          const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
          return utcDate.toISOString();
        }
        return date;
      };
  
      switch (userData.role) {
        case 'player':
          roleSpecificData = { 
            playerData: { 
              ...editedData.player, 
              description: editedData.player?.description || '',
              birthday: birthday
            } 
          };
          break;
        case 'agent':
          roleSpecificData = { 
            agentData: { 
              ...editedData.agent, 
              services: editedData.agent?.services || '',
              dateOfBirth: birthday
            } 
          };
          break;
        case 'recruiter':
          roleSpecificData = { 
            recruiterData: { 
              ...editedData.recruiter, 
              philosophy: info,
              birthday: birthday,
            } 
          };
          break;
        case 'club':
          roleSpecificData = { currentClubDetails: editedData.currentClubDetails };
          break;
        default:
          console.warn('Unknown user role:', userData.role);
          break;
      }
  
      const userId = localStorage.getItem('id');
  
      if (!userId) {
        console.error('No user ID found in localStorage');
        alert('User ID not found. Please log in again.');
        return;
      }
  
      const dataToUpdate = {
        userId: localStorage.getItem('id'),
        fullName: editedData.fullName || userData.fullName,
        info: info,
        sports: selectedSports, // Add this line
        ...roleSpecificData
      };
  
  
  
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
  
  
      if (response.data.user) {
        // Update the state with the new user data, including the id
        fetchUserData();
  
        // Update localStorage with the returned id
        localStorage.setItem('id', response.data.user.id);
  
        // Reset edited data
        setEditedData({});
  
        setIsEditing(false);
        toast.success('User information updated successfully');
        
        // Double-check localStorage after update
      } else {
        console.error('Failed to update user info');
        alert('Failed to update user information. Please try again.');
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      if (error.response) {
        console.error('Server error response:', error.response.data);
        alert(`Server error: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('No response from server. Please check your internet connection.');
      } else {
        console.error('Error setting up request:', error.message);
        alert(`Error updating user info: ${error.message}`);
      }
    }
  };

  const getProfileType = () => {
    if (userData.player) return 'Player';
    if (userData.agent) return 'Agent';
    if (userData.club) return 'Club';
    if (userData.recruiter) return 'Coach';
    return '';
  };
  const renderEditableField = (key, value) => {
    if (isEditing) {
      let editedValue;
      // Check for general user properties first
      if (key === 'fullName') {
        if (userData.role === 'club') {
          editedValue = editedData.currentClubDetails?.clubName || userData.club?.clubName;
        } else {
          editedValue = editedData[key];
        }
      } else if (key === 'email') {
        editedValue = editedData[key];
      }
        else {
        // Then check for role-specific properties
        switch (userData.role) {
          case 'player':
            editedValue = key === 'info' ? editedData.player?.description : editedData.player?.[key];
            break;
          case 'agent':
            editedValue = key === 'info' ? editedData.agent?.services : editedData.agent?.[key];
            break;
          case 'recruiter':
            editedValue = key === 'info' ? editedData.recruiter?.philosophy : editedData.recruiter?.[key];
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
      if (key === 'Sports') {
        return <span className="ml-2 text-white">{editedValue.join(', ')}</span>;
      }
      if (key === 'info') {
        return (
          <textarea
            name={key}
            value={info}
            onChange={handleInputChange}
            className="bg-gray-600 text-white px-2 py-1 rounded w-full h-32"
          />
        );
      }
      if (key === 'birthday' || key === 'dateOfBirth') {
        return (
          <input
            type="date"
            name={userData.role === 'player' ? 'birthday' : 'dateOfBirth'}
            value={birthday}
            onChange={(e)=>
              {
                console.log(e.target.value)
                handleInputChange(e)
              }}
            className="bg-gray-600 text-white px-2 py-1 rounded w-full"
          />
        );
      }
      if (key === 'gender') {
        return (
          <select
            name={key}
            onChange={handleInputChange}
            value={editedValue}
            className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 mt-1 mb-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          >
            <option value="female">female</option>
            <option value="male">male</option>
          </select>
        );
      }
      if (key === 'typeOfTrainer') {
        return (
          <select
            name={key}
            onChange={handleInputChange}
            value={editedValue}
            className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 mt-1 mb-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          >    
            <option value="Senior">Senior</option>
            <option value="Junior">Junior</option>
            <option value="Goalkeeper">Goalkeeper</option>
            <option value="Fitness">Fitness</option>
            <option value="Assistant">Assistant</option>
            <option value="Youth">Youth</option>
            <option value="Technical Director">Technical Director</option>
            <option value="Scout">Scout</option>
          </select>
        );
      }
      if (key === 'country') {
        return (
          <select
            name={key}
            onChange={handleInputChange}
            value={editedValue}
            className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 mt-1 mb-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        );
      }
      
      if (key === 'nationality') {
        return (
          <select
            name={key}
            onChange={handleInputChange}
            value={editedValue}
            className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 mt-1 mb-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          >
            <option value="">Select a nationality</option>
            {nationalities.map((nationality) => (
              <option key={nationality} value={nationality}>
                {nationality}
              </option>
            ))}
          </select>
        );
      }
      if (key === 'dominantFoot') {
        return (
          <select
            name={key}
            onChange={handleInputChange}
            value={editedValue}
            className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 mt-1 mb-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          >
            <option value="right">Right</option>
            <option value="left">Left</option>
          </select>
        );
      }
      if (key === 'position') {
        const positions = [
          'Attaquant', 'Milieu', 'Défenseur', 'Gardien', 
          'Ailier', 'Milieu défensif', 'Milieu offensif', 
          'Latéral', 'Libéro', 'Arrière central'
        ];
      
        return (
          <div className="mb-4">
            <label htmlFor={key} className="block text-sm font-medium text-gray-300 mb-1">
              Position
            </label>
            <select
              id={key}
              name={key}
              onChange={handleInputChange}
              value={editedValue}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 mt-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            >
              <option value="">Sélectionnez une position</option>
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>
        );
      }
      if (key === 'sports') {
        const sportsOptions = [
          { value: 'Football', label: 'Football' },
          { value: 'Basketball', label: 'Basketball' },
          { value: 'Volleyball', label: 'Volleyball' },
          { value: 'Badminton', label: 'Badminton' },
          { value: 'Handball', label: 'Handball' },
          { value: 'Tennis', label: 'Tennis' },
          { value: 'Ice Hockey', label: 'Ice Hockey' },
          { value: 'Table Tennis', label: 'Table Tennis' },
          { value: 'Squash', label: 'Squash' },
          { value: 'Gymnastics', label: 'Gymnastics' },
          { value: 'Indoor Athletics', label: 'Indoor Athletics' },
          { value: 'Wrestling', label: 'Wrestling' },
          { value: 'Boxing', label: 'Boxing' },
          { value: 'Martial Arts', label: 'Martial Arts' },
        ];
        return (
          <div className="relative">
            <Select
              isMulti
              name="sports"
              options={sportsOptions}
              value={sportsOptions.filter(option => editedData.agent.sports.includes(option.value))}
              onChange={(selectedOptions) => {
                const selectedSports = selectedOptions.map(option => option.value);
                handleInputChange({
                  target: { name: 'sports', value: selectedSports }
                });
              }}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select Sports"
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
            <Icon 
              path={mdiSoccer} 
              size={1} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" 
            />
          </div>
        );
      }
    
      if (key === 'Category') {
        return (
          <select
            name={key}
            onChange={handleInputChange}
            value={editedValue}
            className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 mt-1 mb-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          >
            <option value="Amateur">Amateur</option>
            <option value="Professional">Professional</option>
          </select>
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
    
    return <span className="ml-2 text-white">{value || '0'}</span>;
  };
  const handleAddPlayerS = async ({ clubId, playerData }) => {
    try {
      let result=null;  
      setLoading(true);
      const token = localStorage.getItem('token');

      const responses = await axios.post('http://localhost:5000/api/v1/user/retrieve', { id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = responses.data;
      setUserData(data);

      if (data.club){
        const clubId=data.club._doc._id;
        console.log(clubId)
      const response = await axios.post('http://localhost:5000/api/v1/club/add-player', {
        clubId:clubId,
        playerData,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
      });
  
      const result = response.data;
    }
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
const pastClubNames = pastClubImages.map(club => club.clubName);
return (
  
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
    <div><Toaster/></div>

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
            <div className="absolute -top-20 left-8 flex items-end">
              <label htmlFor="profile-image-upload" className="relative">
                <div 
                  className="w-40 h-40 rounded-full bg-cover bg-center border-4 border-gray-800 shadow-lg"
                  style={{ backgroundImage: `url(${profileImage || (userData.player ? '/assets/PLAYER.png' : userData.agent ? '/assets/AGENT.png' : userData.recruiter?'/assets/COACH.png':userData.club?'/assets/CLUB.png':null)})` }}
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
              <span className="ml-4 text-xl font-semibold bg-gray-700 px-3 py-1 rounded-full">
                {getProfileType()}
              </span>
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
          {userData.role !=='club' && (
                  <div  className="bg-gray-700 rounded-lg p-4 shadow-md flex items-center">
            
              <div className="flex items-center">
                <Icon path={mdiCandle} size={1} className="text-blue-400 mr-2" />
                <span className="font-semibold">Age:</span>
                {age}
              </div>              
            

              </div>)}

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
            style={{ backgroundImage: `url(${currentClub.image || '/assets/CLUB.png'})` }}
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
          style={{ backgroundImage: `url(${clubLeaderProfileImage || '/assets/CLUB.png'})` }}
          onClick={() => navigate("/pprofile", { state: { email: userData.player ? userData.player.currentClub.email : userData.email } })}
        ></div>
        <div>
          <h3 className="text-xl font-semibold text-white">
            {userData.currentClubDetails?.clubName || 'No Current Club.'}
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
                    {club.clubName} ({club.year || 'N/A'})
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
          {['clubName', 'Address', 'country','fullName'].map((field) => (
            <p key={field} className="text-gray-300">
              <span className="font-semibold">{formatKey(field==='fullName'?'Contact Person':field)}:</span>
              {isEditing ? (
                <input
                  type="text"
                  name={field}
                  value={editedData.currentClubDetails[field] || editedData[field]}
                  onChange={handleInputChange}
                  className="ml-2 bg-gray-600 text-white px-2 py-1 rounded"
                />
              ) : (
                <span className="ml-2">{field==='fullName'?userData[field]:userData.currentClubDetails[field]} </span>
              )}
            </p>
          ))}
 
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
              style={{ backgroundImage: `url(${player.profileImage || '/assets/PLAYER.png'})` }}
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
  onSubmit={handleAddPlayerS}
  clubId={userData.club._id}
  contentClassName="max-h-[80vh] overflow-y-auto" // Add this prop
/>
  </div>
          )}
        </div>
      </div>

    
      {(userData.role !== 'none')  && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">{userData.player?'Player Video':userData.agent?'Agent Video':userData.club?'Club Video':userData.recruiter?'Recruiter Video':null}</h2>
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
        isOpen={isEditPastClubModalOpen}
        onClose={() => setIsEditPastClubModalOpen(false)}
        title="Edit Past Club"
      >
        <ul className="space-y-2">
          {clubs.map((club) => (
            <li 
              key={club._id}
              onClick={() => {
                setNewClubId(club._id);
                setIsEditPastClubModalOpen(false);
                setShowYearSelectorEdit(true);

              }}
              className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors flex items-center"
            >
              <Icon path={mdiSoccer} size={1} className="text-blue-400 mr-3" />
              <span className="text-gray-300">{club.clubName}</span>
            </li>
          ))}
        </ul>
      </Modal>
    <Modal
  isOpen={isAddPlayerModalOpen}
  onClose={() => setIsAddPlayerModalOpen(false)}
  title="Add Player"
>
  {/* Debug: Check if players data is available */}

  {playerss.length > 0 ? (
    <>

      {playerss.length>0 ? (
        <ul className="space-y-2">
          {playerss.map((player) => (
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
        isOpen={showYearSelectorEdit}
        onClose={() => setShowYearSelectorEdit(false)}
        title="Select Year"
      >
        <div className="flex items-center">
          <select
            value={selectedYear}
            onChange={handleYearSelectEdit}
            className="bg-gray-700 text-white rounded-md p-2 w-full"
          >
            {generateYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </Modal>
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