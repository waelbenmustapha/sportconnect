import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '../ui/Alert';
import { useAppContext } from '../../App';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {id,setId} = useAppContext();
  const {username,setUserName}=useAppContext();
  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/v1/user/login', values);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('id',response.data.id);
      setId(response.data.id)
      if (response.data.role === 'none') {
        navigate('/welcomepick', { state: { fullName: response.data.fullName} });
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="bg-white bg-opacity-10 p-8 rounded-lg shadow-2xl backdrop-blur-sm">
              <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
              
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                  placeholder="Enter your email"
                />
                {errors.email && touched.email && <div className="text-red-500 mt-1">{errors.email}</div>}
              </div>

              <div className="mb-6 relative">
                <label htmlFor="password" className="block mb-2">Password</label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition duration-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && touched.password && <div className="text-red-500 mt-1">{errors.password}</div>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 flex justify-center items-center"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : null}
                {isLoading ? 'Logging in...' : 'Login'}
              </button>

              <div className="mt-4 text-center">
                <p>Don't have an account?</p>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="font-bold underline hover:text-blue-400 transition duration-200"
                >
                  Create one here
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default Login;