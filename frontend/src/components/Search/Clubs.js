import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get('https://sportconnect-khom.onrender.com/api/v1/club/getclubssearch');
        setClubs(response.data.clubs);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };
    fetchClubs();
  }, []);

  const filteredClubs = clubs.filter(club =>
    club.clubName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const navigate=useNavigate();
  return (
    <div>
      <input
        type="text"
        placeholder="Search Clubs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
      />
      <ul>
        {filteredClubs.map((club) => (
          <li key={club._id}>
            <p>{club.clubName}</p>
            <p>{club.nationality}, {club.location}</p>
            <p>Founded: {new Date(club.dateOfCreation).toLocaleDateString()}</p>
            {club.leader && (
              <div>
                <p>Leader: {club.leader.fullName} ({club.leader.email})</p>
                {club.leader.profileImageUrl && (
                  <img
                  onClick={()=>{navigate("/pprofile",{state:{email:club.leader.email}})}}

                    src={`https://sportconnect-khom.onrender.com${club.leader.profileImageUrl}`}
                    alt={`${club.leader.fullName} profile`}
                    style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
                  />
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clubs;
