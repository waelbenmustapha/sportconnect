import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import Icon from '@mdi/react';
import { mdiArrowCollapseLeft, mdiGenderMaleFemale, mdiCalendarRange, mdiFlag, mdiDomain, mdiPhone, mdiClipboardText, mdiAccountTie } from '@mdi/js';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import nationalities from './nationalities.json';
import countries from './countries.json';
import { useAppContext } from '../../App';
import { useTranslation } from 'react-i18next';



function Recruiter() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const currentYear = new Date().getFullYear();
  const minDate = new Date(currentYear - 80, 0, 1);
  const maxDate = new Date(currentYear - 18, 11, 31);
  const { id, setId } = useAppContext();
  const { username } = useAppContext();
  const { t } = useTranslation();
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://sportconnect-khom.onrender.com/api/v1/club/getrecruiterclubs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClubs(response.data.clubs);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };
    fetchClubs();
  }, []);
  const validationSchema = Yup.object().shape({
    gender: Yup.string().oneOf(['male', 'female'], 'Invalid gender').required(t('gender')+" "+t("required")),
    dateOfBirth: Yup.date().required(t('birthday')+" "+t('required')),
    telephone: Yup.string(),
    nationality: Yup.string().required(t('nationality')+" "+t('required')),
    country: Yup.string().required(t('country')+" "+t('required')),
    philosophy: Yup.string().nullable(),
    clubName: Yup.string().nullable(),
    typeOfTrainer: Yup.string().oneOf(['Senior', 'Junior', 'Goalkeeper', 'Fitness', 'Assistant', 'Youth', 'Technical Director', 'Scout'], 'Invalid trainer type').required(t('trainertype')),
  
  });
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post('https://sportconnect-khom.onrender.com/api/v1/recruiter/addrecruiter', values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Recruiter added successfully:', response.data);
      navigate('/profile', { state: { id: response.data.id } });
    } catch (error) {
      console.error('Error adding recruiter:', error.response?.data || error.message);
      alert('Failed to add recruiter. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-4 sm:top-5 sm:left-5 cursor-pointer"
        onClick={() => navigate('/welcomepick', { state: { fullName: username } })}
      >
        <Icon path={mdiArrowCollapseLeft} size={1} />
      </motion.div>
  
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8"
      >
        {t('coachsign')}
      </motion.h1>
  
      <Formik
        initialValues={{
          gender: '',
          dateOfBirth: null,
          telephone: '',
          nationality: '',
          country: '',
          philosophy: '',
          clubName: '',
          typeOfTrainer: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue, values, isValid, dirty }) => (
          <Form className="max-w-sm sm:max-w-md mx-auto space-y-4 sm:space-y-6 bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
            <CustomSelect name="typeOfTrainer" icon={mdiAccountTie} placeholder="Select Trainer Type">
              <option value="Senior">{t('trainerTypes.senior')}</option>
              <option value="Junior">{t('trainerTypes.junior')}</option>
              <option value="Goalkeeper">{t('trainerTypes.goalkeeper')}</option>
              <option value="Fitness">{t('trainerTypes.fitness')}</option>
              <option value="Assistant">{t('trainerTypes.assistant')}</option>
              <option value="Youth">{t('trainerTypes.youth')}</option>
              <option value="Technical Director">{t('trainerTypes.technicalDirector')}</option>
              <option value="Scout">{t('trainerTypes.scout')}</option>
            </CustomSelect>
            <CustomSelect name="gender" icon={mdiGenderMaleFemale} placeholder="Select Gender">
              <option value="male">{t('male')}</option>
              <option value="female">{t('female')}</option>
            </CustomSelect>
            <div className="relative">
              <DatePicker
                showYearDropdown
                selected={values.dateOfBirth}
                onChange={(date) => setFieldValue('dateOfBirth', date)}
                minDate={minDate}
                maxDate={maxDate}
                placeholderText={t('birthday')}
                className="w-full bg-transparent border border-white rounded-md py-2 px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                wrapperClassName="w-full"
                popperClassName="date-picker-popper"
                customInput={
                  <input
                    type="text"
                    className="w-full bg-transparent border border-white rounded-md py-2 px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                }
              />
              <Icon
                path={mdiCalendarRange}
                size={1}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
              />
              <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <CustomField name="telephone" type="tel" placeholder={t('telephone')} icon={mdiPhone} />
            <CustomSelect name="nationality" icon={mdiFlag} placeholder={t('selectNationality')}>
              {nationalities.map((nationality, index) => (
                <option key={index} value={nationality}>{nationality}</option>
              ))}
            </CustomSelect>
            <CustomSelect name="country" icon={mdiFlag} placeholder={t('selectCountry')}>
              {countries.map((country, index) => (
                <option key={index} value={country.name}>{country.name}</option>
              ))}
            </CustomSelect>
            <CustomField name="philosophy" as="textarea" placeholder={t('recphilosophy')} rows="3" icon={mdiClipboardText} />
            <CustomSelect name="clubName" icon={mdiDomain} placeholder={t('selectclub') + " (" + t('optional') + ")"}>
              <option value="">No current club</option>
              {clubs.map((club) => (
                <option key={club._id} value={club.clubName}>{club.clubName}</option>
              ))}
            </CustomSelect>
            <motion.button
              type="submit"
              disabled={isSubmitting || !(isValid && dirty)}
              className={`w-full py-2 sm:py-3 rounded-md transition duration-300 font-semibold text-base sm:text-lg ${
                isValid && dirty
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
              whileHover={{ scale: isValid && dirty ? 1.05 : 1 }}
              whileTap={{ scale: isValid && dirty ? 0.95 : 1 }}
            >
              {isSubmitting ? t('submitting') : t('signup')}
            </motion.button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

const CustomField = ({ icon, ...props }) => (
  <div className="relative">
    <Field 
      className="w-full bg-transparent border border-white rounded-md py-2 px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 no-spinner" 
      {...props} 
    />
    {icon && (
      <Icon 
        path={icon} 
        size={0.9} 
        className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
      />
    )}
    <ErrorMessage name={props.name} component="div" className="text-red-500 text-xs sm:text-sm mt-1" />
  </div>
);

const CustomSelect = ({ icon, children, placeholder, ...props }) => (
  <div className="relative">
    <Field 
      as="select" 
      {...props} 
      className="w-full bg-transparent border border-white rounded-md py-2 px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
    >
      <option value="" disabled>{placeholder}</option>
      {children}
    </Field>
    {icon && (
      <Icon 
        path={icon} 
        size={0.9} 
        className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" 
      />
    )}
    <ErrorMessage name={props.name} component="div" className="text-red-500 text-xs sm:text-sm mt-1" />
  </div>
);

export default Recruiter;