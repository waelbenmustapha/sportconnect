
import React from 'react';
import { motion } from "framer-motion";
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@mdi/react';
import { mdiEmoticon, mdiSoccer, mdiAccountGroup, mdiBriefcase, mdiAccountMultiplePlus } from '@mdi/js';
import { useAppContext } from '../../App';

const ProfileBox = ({ icon, title, description, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center mb-4">
      <Icon path={icon} size={1.5} className="text-blue-400 mr-3" />
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

function Welcomepick() {
  const location = useLocation();
  const navigate = useNavigate();
  const id=localStorage.getItem('id');
  const { fullName } = location.state || {};
  const {username,setUserName}=useAppContext();
  setUserName(fullName);
  const profiles = [
    {
      icon: mdiSoccer,
      title: "Player",
      description: "Are you a soccer player? Choose this profile.",
      path: '/playerlog'
    },
    {
      icon: mdiAccountGroup,
      title: "Club",
      description: "Are you a leader or a club coach? Choose this profile.",
      path: '/clublog'
    },
    {
      icon: mdiBriefcase,
      title: "Agent",
      description: "Are you a club agent? Choose this profile.",
      path: '/agentlog'
    },
    {
      icon: mdiAccountMultiplePlus,
      title: "Coach",
      description: "Are you a Coach? Choose this profile.",
      path: '/recruiterlog'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome, {fullName}
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-block ml-2"
          >
            <Icon path={mdiEmoticon} size={1.5} className="text-yellow-400" />
          </motion.span>
        </motion.h1>

        <motion.h2 
          className="text-xl md:text-2xl text-center mb-12 text-gray-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Begin by selecting your profile type
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.title}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            >
              <ProfileBox
                icon={profile.icon}
                title={profile.title}
                description={profile.description}
                onClick={() => navigate(profile.path, { state: { id } })}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Welcomepick;