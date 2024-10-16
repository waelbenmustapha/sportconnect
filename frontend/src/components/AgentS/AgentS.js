import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import Icon from '@mdi/react';
import { mdiArrowCollapseLeft, mdiGenderMaleFemale, mdiCalendarRange, mdiFlag, mdiDomain, mdiPhone, mdiAccount, mdiLicense, mdiClipboardText, mdiSoccer } from '@mdi/js';import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import nationalities from './nationalities.json';
import countries from './countries.json';
import { useAppContext } from '../../App';
import { useTranslation } from 'react-i18next';



const AgentS = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const currentYear = new Date().getFullYear();
  const minDate = new Date(currentYear - 80, 0, 1);
  const maxDate = new Date(currentYear - 18, 11, 31);
  const {id,setId} = useAppContext();
  const {username}=useAppContext();
  const { t }= useTranslation();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://sportconnect-khom.onrender.com/api/v1/club/getagentclubs', {
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
    dateOfBirth: Yup.date().required(t('birthday'+" "+t("required"))),
    nationality: Yup.string().required(t('nationality')+" "+t("required")),
    country: Yup.string().required(t('country')+" "+t("required")),
    license: Yup.number().positive('License number must be positive').required('License'+" "+t("required")),
    experience: Yup.number().positive('Experience must be positive').required(t('experience')+" "+t("required")),
    telephone: Yup.string().required(t('telephone')+" "+t("required")),
    services: Yup.string(),
    sports: Yup.array().of(Yup.string()).min(1, 'Select at least one sport').required('Sports'+" "+t("required")),
  });
  const sportsOptions = [
    { value: 'Football', label: t('sports.Football') },
    { value: 'Basketball', label: t('sports.Basketball') },
    { value: 'Volleyball', label: t('sports.Volleyball') },
    { value: 'Badminton', label: t('sports.Badminton') },
    { value: 'Handball', label: t('sports.Handball') },
    { value: 'Tennis', label: t('sports.Tennis') },
    { value: 'IceHockey', label: t('sports.IceHockey') },
    { value: 'TableTennis', label: t('sports.TableTennis') },
    { value: 'Squash', label: t('sports.Squash') },
    { value: 'Gymnastics', label: t('sports.Gymnastics') },
    { value: 'IndoorAthletics', label: t('sports.IndoorAthletics') },
    { value: 'Wrestling', label: t('sports.Wrestling') },
    { value: 'Boxing', label: t('sports.Boxing') },
    { value: 'MartialArts', label: t('sports.MartialArts') },
  ];

  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post('https://sportconnect-khom.onrender.com/api/v1/agent/addagent', values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Agent added successfully:', response.data);
      navigate('/profile', { state: { id: response.data.id } });
    } catch (error) {
      console.error('Error adding agent:', error.response?.data || error.message);
      alert('Failed to add agent. Please try again.');
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
        {t('agentsign')}
      </motion.h1>
  
      <Formik
        initialValues={{
          gender: '',
          dateOfBirth: null,
          nationality: '',
          country: '',
          license: '',
          experience: '',
          telephone: '',
          services: '',
          sports: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue, values, isValid, dirty }) => (
          <Form className="max-w-sm sm:max-w-md mx-auto space-y-4 sm:space-y-6 bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
            <CustomSelect name="gender" icon={mdiGenderMaleFemale} placeholder={t('selectgender')}>
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
                size={0.9} 
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" 
              />
              <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-xs sm:text-sm mt-1" />
            </div>
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
            <CustomField name="license" type="number" placeholder="Licence" icon={mdiLicense} />
            <CustomField name="experience" type="number" placeholder={t('yofexp')} icon={mdiAccount} />
            <CustomField name="telephone" type="tel" placeholder={t('telephone')} icon={mdiPhone} />
            <CustomField name="services" as="textarea" placeholder={"Services " + t('optional')} rows="3" icon={mdiClipboardText} />
            <div className="relative">
              <Select
                isMulti
                name="sports"
                options={sportsOptions}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder={t('selectsports')}
                onChange={(selectedOptions) => {
                  setFieldValue('sports', selectedOptions.map(option => option.value));
                }}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    backgroundColor: 'transparent',
                    borderColor: 'white',
                    color: 'white',
                    boxShadow: state.isFocused ? '0 0 0 2px #3b82f6' : 'none',
                    '&:hover': {
                      borderColor: 'white',
                    },
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: '#1f2937',
                    color: 'white',
                    zIndex: 9999,
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#374151' : 'transparent',
                    color: 'white',
                    '&:active': {
                      backgroundColor: '#3b82f6',
                    },
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    backgroundColor: '#4b5563',
                  }),
                  multiValueLabel: (provided) => ({
                    ...provided,
                    color: 'white',
                  }),
                  multiValueRemove: (provided) => ({
                    ...provided,
                    color: 'white',
                    ':hover': {
                      backgroundColor: '#ef4444',
                      color: 'white',
                    },
                  }),
                  input: (provided) => ({
                    ...provided,
                    color: 'white',
                  }),
                }}
              />
              <Icon 
                path={mdiSoccer} 
                size={0.9} 
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" 
              />
              <ErrorMessage name="sports" component="div" className="text-red-500 text-xs sm:text-sm mt-1" />
            </div>
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
export default AgentS;