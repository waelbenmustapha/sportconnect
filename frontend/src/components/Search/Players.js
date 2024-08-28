import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Players() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate=useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/player/getplayerssearch');
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search Users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
      />
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.email} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            {user.profileImageUrl && (
              <img
              onClick={()=>{navigate("/pprofile",{state:{email:user.email}})}}
                src={`http://localhost:5000${user.profileImageUrl}`}
                alt={`${user.fullName} profile`}
                style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
              />
            )}
            <div>
              <p >{user.fullName} ({user.role})</p>
              {user.player && (
                <div>
                  <p>Player Data:</p>
                  <ul>
                    <li>Gender: {user.player.gender}</li>
                    <li>Date of Birth: {new Date(user.player.dateOfBirth).toLocaleDateString()}</li>
                    <li>Nationality: {user.player.nationality}</li>
                    <li>Country: {user.player.country}</li>
                    <li>Weight: {user.player.weight} kg</li>
                    <li>Height: {user.player.height} cm</li>
                    <li>Dominant Foot: {user.player.dominantFoot}</li>
                    <li>Current Club: {user.player.currentClub}</li>
                    {/* Add other player fields as needed */}
                  </ul>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Players;
