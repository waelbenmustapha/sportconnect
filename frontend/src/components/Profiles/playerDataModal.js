import { useEffect,useState } from "react";
import { useTranslation } from "react-i18next";
import Modals from './Modals';
import { mdiCamera, mdiPlayCircle, mdiScale, mdiRuler, mdiAccountOutline, mdiPencil, mdiCheck, mdiVideo, mdiPlus, mdiChevronLeft, mdiSoccer, mdiAccountTie, mdiAccountMultiple, mdiTshirtCrew, mdiCalendar, mdiEarth, mdiCancel, mdiShoeSneaker, mdiClose, mdiCandle } from "@mdi/js";
import { Icon } from "@mdi/react";
import axios from "axios";
import { Upload } from 'lucide-react';

import nationalities from './nationalities.json';
const PlayerDataModal = ({ player: initialPlayer, isOpen, onClose, fetchClubPlayers,setIsPlayerModalInfoOpen }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [player, setPlayer] = useState(initialPlayer);
    const [editedPlayer, setEditedPlayer] = useState(initialPlayer);
    const { t }=useTranslation();
    const [scfileurl, setScfileurl] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [selectedFileP, setSelectedFileP] = useState(null);
    const [scplayer, setScplayer] = useState(null);

    const handleFileSelect = (event) => {
        setSelectedFileP(event.target.files[0]);
        setProfileImage(URL.createObjectURL(event.target.files[0]));
    
      };
    useEffect(() => {
      setPlayer(initialPlayer);
      setEditedPlayer(initialPlayer);
    }, [initialPlayer]);
    
    if (!player) return null;
    const onFileChange = (e) => {
        handleFileSelect(e);
      };
    const playerInfo = [
      { icon: mdiAccountOutline, label: 'Name', key: 'Name', type: 'text' },
      { icon: mdiAccountOutline, label: 'Age', key: 'age', type: 'number' },
      { icon: mdiEarth, label: 'Nationality', key: 'nationality', type: 'select' },
      { icon: mdiScale, label: 'Weight', key: 'weight', unit: 'kg', type: 'number' },
      { icon: mdiRuler, label: 'Height', key: 'height', unit: 'cm', type: 'number' },
      { icon: mdiShoeSneaker, label: 'Dominant Foot', key: 'dominantFoot', type: 'select' },
      { icon: mdiTshirtCrew, label: 'Position', key: 'position', type: 'text' },
      { icon: mdiSoccer, label: 'Category', key: 'Category', type: 'select' },
      { icon: mdiPlayCircle, label: 'Goals', key: 'goals', type: 'number' },
      { icon: mdiPlayCircle, label: 'Passes', key: 'passes', type: 'number' },
      { icon: mdiPlayCircle, label: 'Matches', key: 'matches', type: 'number' },
    ];
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedPlayer(prevPlayer => ({
        ...prevPlayer,
        [name]: value
      }));
    };
  
    const handleSave = async () => {
      try {
        const response = await axios.put('https://sportconnect-khom.onrender.com/api/v1/club/update-player', {
          playerId: player._id,
          updatedData: editedPlayer
        });
        const updatedPlayer = response.data.player;
        setPlayer(updatedPlayer);
        setEditedPlayer(updatedPlayer);
        setIsEditing(false);
        if (typeof fetchClubPlayers === 'function') {
          fetchClubPlayers();
        }
        setIsPlayerModalInfoOpen(false);
      } catch (error) {
        console.error("Error updating player data:", error);
      }
    };
  
    const renderField = (item) => {
      if (isEditing && player.editable) {
        const commonClasses = `
          bg-gray-700 
          text-white 
          px-3 
          py-2 
          rounded-md 
          border 
          border-gray-600 
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500 
          focus:border-transparent 
          transition 
          duration-200 
          ease-in-out 
          w-full
          placeholder-gray-400
        `;
  
        switch (item.type) {
          case 'number':
            return (
              <input
                type="number"
                name={item.key}
                value={editedPlayer[item.key]}
                onChange={handleInputChange}
                className={commonClasses}
                placeholder={`Enter ${item.label}`}
              />
            );
          case 'select':
            if (item.key === 'dominantFoot') {
              return (
                <select
                  name={t(item.key)}
                  value={editedPlayer[item.key]}
                  onChange={handleInputChange}
                  className={commonClasses}
                >
                  <option value="">{t('dominantFoot')}</option>
                  <option value="left">{t('left')}</option>
                  <option value="right">{t('right')}</option>
                </select>
              );
            } else if (item.key === 'Category') {
              return (
                <select
                  name={item.key}
                  value={editedPlayer[item.key]}
                  onChange={handleInputChange}
                  className={commonClasses}
                >
                  <option value="">{t('category')}</option>
                  <option value="Amateur">Amateur</option>
                  <option value="Professional">{t('Professional')}</option>
                </select>
              );
            } else if (item.key === 'nationality') {
              return (
                <select
                  name={item.key}
                  value={editedPlayer[item.key]}
                  onChange={handleInputChange}
                  className={commonClasses}
                >
                  <option value="">{t('selectNationality')}</option>
                  {nationalities.map((nationality, index) => (
                    <option key={index} value={nationality}>
                      {nationality}
                    </option>
                  ))}
                </select>
              );
            }
            break;
          default:
            return (
              <input
                type="text"
                name={item.key}
                value={editedPlayer[item.key]}
                onChange={handleInputChange}
                className={commonClasses}
                placeholder={`Enter ${item.label}`}
              />
            );
        }
      }
      return (
        <span className="ml-2 text-gray-300">
          {player[item.key]}
          {item.unit && ` ${item.unit}`}
        </span>
      );
    };
  
  
    return (
      <Modals isOpen={isOpen} onClose={() => {
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
        <div className="mt-4 space-y-4">
          {player.editable === false && (
            <div className="w-32 h-32 mx-auto rounded-full bg-cover bg-center mb-4"
              style={{ backgroundImage: `url(${player.profileImage})` }}
            />
          )}
  
          {player.editable && (
            <>
              <div className="w-32 h-32 mx-auto rounded-full bg-cover bg-center mb-4"
                style={{ backgroundImage: `url(${scfileurl || player.profileImage})` }}
              />
  
              <div className="flex justify-center items-center p-4">
                <button
                  variant="outline"
                  className="relative overflow-hidden bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
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
                  <Upload className="mr-2 h-4 w-4 inline" />
                  Upload Image
                </button>
              </div>
            </>
          )}
  
  {playerInfo.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Icon path={item.icon} size={1} className="text-blue-400 flex-shrink-0" />
            <span className="font-semibold text-gray-200 w-24">{t(item.label)}:</span>
            {renderField(item)}
          </div>
        ))}
        </div>
      </Modals>
    );
  };
export default PlayerDataModal;
