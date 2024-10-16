import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import Icon from '@mdi/react';
import { mdiArrowCollapseLeft, mdiFlag, mdiDomain, mdiCalendarRange, mdiSoccer, mdiDivision, mdiHome, mdiWeb, mdiAccountGroup } from '@mdi/js';
import axios from 'axios';
import countries from './countries.json';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./ClubS.css";
import divisions from './divisions.json';
import { useAppContext } from '../../App';
import { useTranslation } from 'react-i18next';



const ClubS = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const {id,setId} = useAppContext();
  const {username,setUserName}=useAppContext();
  const {t}=useTranslation();
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://sportconnect-khom.onrender.com/api/v1/club/addclub', values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Club added successfully:', response.data);
      navigate('/profile', { state: { id: response.data.id } });
    } catch (error) {
      console.error('Error adding club:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to add club. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  const validationSchema = Yup.object().shape({
    clubName: Yup.string().required(t('clubreq')),
    Address: Yup.string().required('Address '+t('required')),
    country: Yup.string().required('Country '+t('country')),
    teams: Yup.number().required(t('teamnumber')+" "+t('required')).positive().integer(),
    web: Yup.string(),
    division: Yup.string().required('Division '+t('required')).oneOf(['Premier League', 'EFL Championship','EFL League One','EFL League Two','La Liga','La Liga 2','Segunda División B','Tercera División',
      'Bundesliga','Liga','Regionalliga','Serie A','Serie B','Serie C','Serie D','Ligue 1','Ligue 2','Championnat National','National 2'
    ]),
    dateOfCreation: Yup.date().required(t('creationDate')+" "+t('required')),
  });
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
        {t('clubsign')}
      </motion.h1>
  
      {error && <div className="text-red-500 text-center mb-4 text-sm sm:text-base">{error}</div>}
  
      <Formik
        initialValues={{
          clubName: '',
          Address: '',
          country: '',
          teams: '',
          web: '',
          division: '',
          dateOfCreation: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue, values, isValid, dirty }) => (
          <Form className="max-w-sm sm:max-w-md mx-auto space-y-4 sm:space-y-6 bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
            <CustomField name="clubName" type="text" placeholder={t('clubname')} icon={mdiSoccer} />
            <CustomField name="Address" type="text" placeholder="Address" icon={mdiHome} />
            <CustomSelect name="country" icon={mdiFlag} placeholder={t('selectCountry')}>
              {countries.map((country, index) => (
                <option key={index} value={country.name}>{country.name}</option>
              ))}
            </CustomSelect>
            <CustomField name="teams" type="number" placeholder={t('teamnumber')} icon={mdiAccountGroup} />
            <CustomField name="web" type="url" placeholder={t('web')} icon={mdiWeb} />
            <CustomSelect name="division" icon={mdiDivision} placeholder={t('divisionsel')}>
              {divisions.footballDivisions.map((division, index) => (
                <option key={index} value={division}>{division}</option>
              ))}
            </CustomSelect>
            <div className="relative">
              <DatePicker
                showYearDropdown
                selected={values.dateOfCreation}
                onChange={(date) => setFieldValue('dateOfCreation', date)}
                placeholderText={t('creationDate')}
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
              <ErrorMessage name="dateOfCreation" component="div" className="text-red-500 text-xs sm:text-sm mt-1" />
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
        className="w-full bg-transparent border border-white rounded-md py-2 px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" 
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
  
  const CustomSelect = ({ icon, children, placeholder, ...props }) => {
    const [field, meta, helpers] = useField(props);
    
    return (
      <div className="relative">
        <select
          {...field}
          {...props}
          className="w-full bg-transparent border border-white rounded-md py-2 px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-white"
          onChange={(e) => {
            if (e.target.value !== "") {
              helpers.setValue(e.target.value);
            }
          }}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {children}
        </select>
        {icon && (
          <Icon 
            path={icon} 
            size={0.9} 
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" 
          />
        )}
        {meta.touched && meta.error && (
          <div className="text-red-500 text-xs sm:text-sm mt-1">{meta.error}</div>
        )}
      </div>
    );
  };

export default ClubS;