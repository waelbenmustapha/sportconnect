import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Recruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const response = await axios.get('https://sportconnect-khom.onrender.com/api/v1/recruiter/getRecruitersSearch');
        setRecruiters(response.data.users);
      } catch (error) {
        console.error('Error fetching recruiters:', error);
      }
    };
    fetchRecruiters();
  }, []);

  const filteredRecruiters = recruiters.filter(recruiter =>
    recruiter.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const navigate=useNavigate();
  return (
    <div>
      <input
        type="text"
        placeholder="Search Recruiters..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
      />
      <ul>
        {filteredRecruiters.map((recruiter) => (
          <li key={recruiter._id}>
            <p>{recruiter.fullName}</p>
            <p>{recruiter.email}</p>
            {recruiter.recruiter && (
              <div>
                <p>Recruiter Data:</p>
                <ul>
                  <li>Gender: {recruiter.recruiter.gender}</li>
                  <li>Date of Birth: {new Date(recruiter.recruiter.dateOfBirth).toLocaleDateString()}</li>
                  <li>Nationality: {recruiter.recruiter.nationality}</li>
                  <li>Country: {recruiter.recruiter.country}</li>
                  <li>Current Club: {recruiter.recruiter.currentClub}</li>
                  {/* Add other recruiter fields as needed */}
                </ul>
              </div>
            )}
            {recruiter.profileImageUrl && (
              <img
              onClick={()=>{navigate("/pprofile",{state:{email:recruiter.email}})}}

                src={`https://sportconnect-khom.onrender.com${recruiter.profileImageUrl}`}
                alt={`${recruiter.fullName} profile`}
                style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recruiters;
