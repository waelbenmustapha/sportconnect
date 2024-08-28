import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field,useField, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import Icon from '@mdi/react';
import { mdiArrowCollapseLeft, mdiGenderMaleFemale, mdiCalendarRange, mdiFlag, mdiDomain, mdiScaleBathroom, mdiHumanMaleHeightVariant, mdiShoeCleat, mdiPhone, mdiAccount, mdiEmail, mdiLock, mdiSoccer } from '@mdi/js';
import axios from 'axios';
import nationalities from './nationalities.json';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./PlayerS.css";
import { useAppContext } from '../../App';

const validationSchema = Yup.object().shape({
  telephone: Yup.string(),
  gender: Yup.string().oneOf(['male', 'female'], 'Invalid gender').required('Gender is required'),
  nationality: Yup.string().required('Nationality is required'),
  weight: Yup.number().positive('Weight must be positive').required('Weight is required'),
  height: Yup.number().positive('Height must be positive').required('Height is required'),
  birthday: Yup.date().required('Birthday is required').max(new Date(), "Birthday can't be in the future"),

  dominantFoot: Yup.string().oneOf(['left', 'right'], 'Invalid dominant foot').required('Dominant foot is required'),
  cat: Yup.string().oneOf(['Amateur', 'Professional'], 'Invalid category').required('Category is required'),
  currentClub: Yup.string(),
  description: Yup.string(),
  position: Yup.string().oneOf([
    'Attaquant', 'Milieu', 'Défenseur', 'Gardien', 
    'Ailier', 'Milieu défensif', 'Milieu offensif', 
    'Latéral', 'Libéro', 'Arrière central'
  ], 'Invalid position').required('Position is required'),
});
const currentYear = new Date().getFullYear();
const minDate = new Date(currentYear - 60, 0, 1);
const maxDate = new Date();
const PlayerS = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const currentYear = new Date().getFullYear();
  const minDate = new Date(currentYear - 60, 0, 1);
  const maxDate = new Date();
  const {id,setId} = useAppContext();
  const {username}=useAppContext();

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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post('https://sportconnect-khom.onrender.com/api/v1/player/addplayer', values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Player added successfully:', response.data);
      navigate('/profile', { state: { id: response.data.id } });
    } catch (error) {
      console.error('Error adding player:', error.response?.data || error.message);
      alert('Failed to add player. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-5 left-5 cursor-pointer"
        onClick={() => navigate('/welcomepick',{state:{fullName:username}})}
      >
        <Icon path={mdiArrowCollapseLeft} size={1.5} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-4xl font-bold text-center mb-8"
      >
        Player Sign Up
      </motion.h1>

      <Formik
        initialValues={{
          telephone: '',
          gender: '',
          nationality: '',
          weight: '',
          height: '',
          dominantFoot: '',
          cat: '',
          birthday:'',
          currentClub: '',
          description: '',
          position: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue, values, isValid, dirty }) => (
          <Form className="max-w-md mx-auto space-y-6 bg-gray-800 p-8 rounded-lg shadow-lg">
            <CustomField name="telephone" type="tel" placeholder="Telephone" icon={mdiPhone} />
            <CustomSelect name="gender" icon={mdiGenderMaleFemale} placeholder="Select Gender">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </CustomSelect>
            <div className="relative">
  <DatePicker
    selected={values.birthday}
    onChange={(date) => setFieldValue('birthday', date)}
    dateFormat="dd/MM/yyyy"
    placeholderText="Birthday"
    className="w-full bg-transparent border border-white rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
    minDate={minDate}
    maxDate={maxDate}
    showYearDropdown
    scrollableYearDropdown
    yearDropdownItemNumber={60}
  />
  <Icon path={mdiCalendarRange} size={1} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
  <ErrorMessage name="birthday" component="div" className="text-red-500 text-sm mt-1" />
</div>
 
            <CustomSelect name="nationality" icon={mdiFlag} placeholder="Select Nationality">
              {nationalities.map((nationality, index) => (
                <option key={index} value={nationality}>{nationality}</option>
              ))}
            </CustomSelect>

            <CustomField name="weight" type="number" placeholder="Weight (kg)" icon={mdiScaleBathroom} />
            <CustomField name="height" type="number" placeholder="Height (cm)" icon={mdiHumanMaleHeightVariant} />
            <CustomSelect name="dominantFoot" icon={mdiShoeCleat} placeholder="Select Dominant Foot">
              <option value="left">Left foot</option>
              <option value="right">Right foot</option>
            </CustomSelect>
            <CustomSelect name="cat" placeholder="Select Category">
              <option value="Amateur">Amateur</option>
              <option value="Professional">Professional</option>
            </CustomSelect>
            <CustomSelect name="currentClub" icon={mdiDomain} placeholder="Select Current Club">
  <option >No Club</option>
  {clubs.map((club, index) => (
    <option key={index} value={club.clubName}>{club.clubName}</option>
  ))}
</CustomSelect>
            <CustomSelect name="position" icon={mdiSoccer} placeholder="Select Position">
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
            </CustomSelect>
            <CustomField name="description" as="textarea" placeholder="Description (optional)" rows="3" />
            <motion.button
              type="submit"
              disabled={isSubmitting || !(isValid && dirty)}
              className={`w-full py-3 rounded-md transition duration-300 font-semibold text-lg ${
                isValid && dirty
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
              whileHover={{ scale: isValid && dirty ? 1.05 : 1 }}
              whileTap={{ scale: isValid && dirty ? 0.95 : 1 }}
            >
              {isSubmitting ? 'Submitting...' : 'Sign Up'}
            </motion.button>
          </Form>
        )}
      </Formik>
    </div>
  );
};


const CustomField = ({ icon, ...props }) => (
  <div className="relative">
    <Field className="w-full bg-transparent border border-white rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 no-spinner" {...props} />
    {icon && <Icon path={icon} size={1} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
    <ErrorMessage name={props.name} component="div" className="text-red-500 text-sm mt-1" />
  </div>
);

const CustomSelect = ({ icon, children, placeholder, ...props }) => {
  const [field, meta, helpers] = useField(props);
  
  return (
    <div className="relative">
      <select
        {...field}
        {...props}
        className="w-full bg-transparent border border-white rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-white"
        onChange={(e) => {
          if (e.target.value !== "") {
            helpers.setValue(e.target.value);
          }
        }}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {children}
      </select>
      {icon && <Icon path={icon} size={1} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />}
      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
};
export default PlayerS;