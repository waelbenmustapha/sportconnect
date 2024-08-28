import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Agents() {
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/agent/getAgentsSearch');
        setAgents(response.data.users);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };
    fetchAgents();
  }, []);

  const filteredAgents = agents.filter(agent =>
    agent.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const navigate=useNavigate();
  return (
    <div>
      <input
        type="text"
        placeholder="Search Agents..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
      />
      <ul>
        {filteredAgents.map((agent) => (
          <li key={agent._id}>
            <p>{agent.fullName}</p>
            <p>{agent.email}</p>
            {agent.agent && (
              <div>
                <p>Agent Data:</p>
                <ul>
                  <li>Gender: {agent.agent.gender}</li>
                  <li>Date of Birth: {new Date(agent.agent.dateOfBirth).toLocaleDateString()}</li>
                  <li>Nationality: {agent.agent.nationality}</li>
                  <li>Country: {agent.agent.country}</li>
                  <li>Current Club: {agent.agent.currentClub}</li>
                  {/* Add other agent fields as needed */}
                </ul>
              </div>
            )}
            {agent.profileImageUrl && (
              <img
              onClick={()=>{navigate("/pprofile",{state:{email:agent.email}})}}

                src={`http://localhost:5000${agent.profileImageUrl}`}
                alt={`${agent.fullName} profile`}
                style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Agents;
