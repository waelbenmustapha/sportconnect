import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Icon } from '@mdi/react';
import { mdiClose, mdiPlus } from '@mdi/js';
import axios from 'axios';


function AddPlayerModal({ isOpen, onClose, onSubmit, clubId, contentClassName }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [playerss, setPlayerss] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  const initialValues = {
    Name: '',
    age: '',
    nationality: '',
    weight: '',
    height: '',
    dominantFoot: '',
    Category: '',
    position: '',
    matches: '',
    goals: '',
    passes: '',
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/v1/player/getplayerssearch');
      setPlayerss(response.data.users);
    } catch (error) {
      console.error('Error fetching players:', error);
      setError('Failed to fetch players. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlayerImage = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/v1/user/retrieve', { id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.profileImage;
    } catch (error) {
      console.error('Error fetching player image:', error);
      return null;
    }
  };

  const handlePlayerSelect = async (event) => {
    const playerId = event.target.value;
    if (playerId) {
      const player = playerss.find(p => p.id === playerId);
      setSelectedPlayer(player);
      setSelectedPlayerId(playerId);
      const image = await fetchPlayerImage(playerId);
      setProfileImage(image);
      setFormValues({
        Name: player.fullName,
        age: player.player.age,
        nationality: player.player.nationality,
        weight: player.player.weight,
        height: player.player.height,
        dominantFoot: player.player.dominantFoot,
        Category: player.player.Category,
        position: player.player.position,
        matches: player.player.matches,
        goals: player.player.goals,
        passes: player.player.passes,
      });
    } else {
      setSelectedPlayer(null);
      setSelectedPlayerId(null);
      setProfileImage(null);
      setFormValues(initialValues);
    }
  };
  const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    setProfileImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleProfileImageUpload = async (id) => {
    if (!selectedFile || !id) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(`http://localhost:5000/api/v1/user/upload-image/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200) {
        const fileExtension = getFileExtension(selectedFile.name);
        setUploadedImageUrl(`/uploads/${clubId}-profile.${fileExtension}`);
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const handleAddPlayer = async ({ clubId, playerData }) => {
    try {
      let result=null;  
      const token = localStorage.getItem('token');

      const responses = await axios.post('http://localhost:5000/api/v1/user/retrieve', { id:localStorage.getItem('id') }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = responses.data;

      if (data.club){
        let clubId;
        if (data.club._doc){
          clubId=data.club._doc._id;
        }
        else{
          clubId=data.club.id;
        }
                console.log(clubId)
      const dataToSend = {
        clubId:clubId,
        playerData: {
          ...playerData,
          id: selectedPlayerId // Include the selected player's ID if it exists
        }
      };

      const response = await axios.post('http://localhost:5000/api/v1/club/add-player', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      result = response.data;

    }

      // Only upload image if a new file was selected
      if (selectedFile) {
        await handleProfileImageUpload(result.id);
      }
      
      onClose();
    } catch (error) {
      console.error('Error adding player:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
      } else {
        alert(error.response?.data?.message || 'Failed to add player. Please try again.');
      }
    }
  };
  const validationSchema = Yup.object({
    Name: Yup.string().required('Required'),
    age: Yup.number().positive('Must be positive').integer('Must be an integer').required('Required'),
    nationality: Yup.string().required('Required'),
    weight: Yup.number().positive('Must be positive').required('Required'),
    height: Yup.number().positive('Must be positive').required('Required'),
    dominantFoot: Yup.string().oneOf(['left', 'right'], 'Invalid foot').required('Required'),
    Category: Yup.string().oneOf(['Amateur', 'Professional'], 'Invalid category').required('Required'),
    position: Yup.string().oneOf([
      'Attaquant', 'Milieu', 'Défenseur', 'Gardien', 
      'Ailier', 'Milieu défensif', 'Milieu offensif', 
      'Latéral', 'Libéro', 'Arrière central'
    ], 'Invalid position').required('Required'),
    matches: Yup.number().integer('Must be an integer').min(0, 'Cannot be negative').required('Required'),
    goals: Yup.number().integer('Must be an integer').min(0, 'Cannot be negative').required('Required'),
    passes: Yup.number().integer('Must be an integer').min(0, 'Cannot be negative').required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setFormValues(values);
    setShowConfirmation(true);
    setSubmitting(false);
  };

  const handleConfirmSubmit = async () => {
    try {
      await handleAddPlayer({ clubId, playerData: formValues });
      setShowConfirmation(false);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full max-h-[90vh] flex flex-col">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Player</h2>
          <button onClick={()=>{
            setFormValues(initialValues);
            setProfileImage(null);
            onClose();
          }} className="text-gray-400 hover:text-white">
            <Icon path={mdiClose} size={1} />
          </button>
        </div>
        <div className="overflow-y-auto flex-grow">

        {isLoading ? (
          <p className="text-white">Loading players...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="mb-4">
<select
  onChange={handlePlayerSelect}
  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
  style={{
    maxHeight: '200px', // Adjust this value as needed
    overflow: 'auto'
  }}
>
  <option value="">Select an existing player or add new</option>
  {Array.isArray(playerss) && playerss.map(player => (
    <option key={player.id} value={player.id}>{player.fullName}</option>
  ))}
</select>
          </div>
        )}
        <Formik
          initialValues={formValues || initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  {profileImage ? (
                    <img src={profileImage} alt="Player" className="w-32 h-32 rounded-full object-cover" />
                  ) : (
                    <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center">
                      <Icon path={mdiPlus} size={2} className="text-white" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <Field
                  type="text"
                  name="Name"
                  placeholder="Player Name"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                />
                <ErrorMessage name="Name" component="div" className="text-red-500 text-sm mt-1" />
              </div>
  
              <div>
                <Field
                  type="number"
                  name="age"
                  placeholder="Age"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                />
                <ErrorMessage name="age" component="div" className="text-red-500 text-sm mt-1" />
              </div>
  
              <div>
                <Field
                  type="text"
                  name="nationality"
                  placeholder="Nationality"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                />
                <ErrorMessage name="nationality" component="div" className="text-red-500 text-sm mt-1" />
              </div>
  
              <div>
                <Field
                  type="number"
                  name="weight"
                  placeholder="Weight (kg)"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                />
                <ErrorMessage name="weight" component="div" className="text-red-500 text-sm mt-1" />
              </div>
  
              <div>
                <Field
                  type="number"
                  name="height"
                  placeholder="Height (cm)"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                />
                <ErrorMessage name="height" component="div" className="text-red-500 text-sm mt-1" />
              </div>
  
              <div>
                <Field
                  as="select"
                  name="dominantFoot"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                >
                  <option value="">Select Dominant Foot</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </Field>
                <ErrorMessage name="dominantFoot" component="div" className="text-red-500 text-sm mt-1" />
              </div>
  
              <div>
                <Field
                  as="select"
                  name="Category"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                >
                  <option value="">Select Category</option>
                  <option value="Amateur">Amateur</option>
                  <option value="Professional">Professional</option>
                </Field>
                <ErrorMessage name="Category" component="div" className="text-red-500 text-sm mt-1" />
              </div>
  
              <div>
                <Field
                  as="select"
                  name="position"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                >
                  <option value="">Select Position</option>
                  <option value="Attaquant">Attaquant</option>
                  <option value="Milieu">Milieu</option>
                  <option value="Défenseur">Défenseur</option>
                  <option value="Gardien">Gardien</option>
                  <option value="Ailier">Ailier</option>
                  <option value="Milieu défensif">Milieu défensif</option>
                  <option value="Milieu offensif">Milieu offensif</option>
                  <option value="Latéral">Latéral</option>
                  <option value="Libéro">Libéro</option>
                  <option value="Arrière central">Arrière central</option>
                </Field>
                <ErrorMessage name="position" component="div" className="text-red-500 text-sm mt-1" />
              </div>
  
              <div>
                <Field
                  type="number"
                  name="matches"
                  placeholder="Matches Played"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                />
                <ErrorMessage name="matches" component="div" className="text-red-500 text-sm mt-1" />
              </div>
  
              <div>
                <Field
                  type="number"
                  name="goals"
                  placeholder="Number of goals"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                />
                <ErrorMessage name="goals" component="div" className="text-red-500 text-sm mt-1" />
              </div>
  
              <div>
                <Field
                  type="number"
                  name="passes"
                  placeholder="Number of Passes"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                />
                <ErrorMessage name="passes" component="div" className="text-red-500 text-sm mt-1" />
              </div>
  
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Player'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Confirm Add Player</h2>
            <p className="text-white mb-6">Are you sure you want to add this player?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelSubmit}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );};

export default AddPlayerModal;