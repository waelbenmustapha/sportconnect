import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 text-white py-8"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <p className="text-gray-300">Connect with clubs directly and explore opportunities in the world of football.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Players</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Clubs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Agents</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">Email: info@example.com</p>
            <p className="text-gray-300">Phone: +1 234 567 890</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition">Github</a>
              <a href="#" className="text-gray-300 hover:text-white transition">Twitter</a>
              <a href="#" className="text-gray-300 hover:text-white transition">Linkedin</a>
              <a href="#" className="text-gray-300 hover:text-white transition">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300">&copy; 2024 Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;