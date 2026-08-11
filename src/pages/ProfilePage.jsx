import React, { useState } from 'react';
import useAuthStore from '../data/authStore';
import ProfileDataCard from '../components/ProfileDataCard';
import { FiUser, FiLock, FiLogOut, FiDatabase, FiCheckCircle, FiAlertCircle, FiMail } from 'react-icons/fi';
import { Button, Input, Form, notification } from 'antd';

function ProfilePage() {
  const { token, user, login, register, logout, fetchWithAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [testData, setTestData] = useState(null);
  const [profileCards, setProfileCards] = useState([]);

  const onFinish = async (values) => {
    setLoading(true);
    let result;
    
    if (isLogin) {
      result = await login(values.email, values.password);
    } else {
      result = await register(values.name, values.email, values.password);
    }
    
    setLoading(false);
    
    if (result.success) {
      notification.success({
        message: isLogin ? 'Login Successful' : 'Registration Successful',
        description: isLogin ? 'Welcome back to Focus Planner!' : 'Your account has been created successfully.',
      });
      if (!isLogin && !token) {
        setIsLogin(true); // switch to login if backend didn't auto-login
      }
    } else {
      notification.error({
        message: isLogin ? 'Login Failed' : 'Registration Failed',
        description: result.error || 'Please check your details and ensure the backend is running.',
      });
    }
  };

  const normalizeFetchedData = (data) => {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== 'object') return [];

    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;
    if (data.data && typeof data.data === 'object') return [data.data];
    if (data.items && typeof data.items === 'object') return [data.items];

    return [data];
  };

  const testBackendConnection = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth('/api/tasks');
      const data = await response.json();
      const normalizedData = normalizeFetchedData(data);

      setTestData(data);
      setProfileCards(normalizedData);
      notification.success({ message: 'Data fetched successfully!' });
    } catch (error) {
      setProfileCards([]);
      notification.error({ message: 'Fetch failed', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full h-full flex justify-center items-center p-6">
        <div className="bg-white/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-4xl p-10 w-full max-w-md border border-white/60">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-white/60 rounded-full flex items-center justify-center shadow-inner mb-4">
              <FiUser className="text-3xl text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-slate-500 mt-2 text-center text-sm">
              {isLogin ? 'Sign in to sync your tasks' : 'Register a new account'} with the FocusPlanner backend.
            </p>
          </div>

          <Form name="authForm" onFinish={onFinish} layout="vertical">
            {!isLogin && (
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please input your full name!' }]}
              >
                <Input 
                  prefix={<FiUser className="text-slate-400 mr-2" />} 
                  placeholder="Full Name" 
                  size="large"
                  className="rounded-xl bg-white/50 border-white/60 shadow-sm backdrop-blur-md hover:bg-white/70 focus:bg-white/80"
                />
              </Form.Item>
            )}

            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Enter a valid email!' }]}
            >
              <Input 
                prefix={<FiMail className="text-slate-400 mr-2" />} 
                placeholder="Email Address" 
                size="large"
                className="rounded-xl bg-white/50 border-white/60 shadow-sm backdrop-blur-md hover:bg-white/70 focus:bg-white/80"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password 
                prefix={<FiLock className="text-slate-400 mr-2" />}
                placeholder="Password" 
                size="large"
                className="rounded-xl bg-white/50 border-white/60 shadow-sm backdrop-blur-md hover:bg-white/70 focus:bg-white/80"
              />
            </Form.Item>

            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              className="w-full mt-4 rounded-xl bg-slate-700 hover:bg-slate-800 shadow-lg border-none h-12 text-md font-medium"
              loading={loading}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            
            <div className="mt-6 text-center text-slate-500 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-indigo-500 font-semibold hover:underline"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </div>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6 md:p-10 overflow-y-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Profile & Sync</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* User Details Card */}
        <div className="bg-white/50 backdrop-blur-2xl shadow-xl rounded-4xl border border-white/60 p-8 flex flex-col items-center">
          <div className="w-24 h-24 bg-white/80 rounded-full shadow-inner flex items-center justify-center mb-4">
            <FiUser className="text-4xl text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{user?.name || user?.email || 'Authenticated User'}</h2>
          
          <div className="flex items-center gap-2 mt-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
            <FiCheckCircle /> Connected to localhost:8080
          </div>

          <Button 
            onClick={logout} 
            className="mt-8 rounded-xl bg-white/60 border border-white/80 text-red-500 shadow-sm hover:text-red-600 hover:bg-white/80 flex items-center gap-2"
            size="large"
          >
            <FiLogOut /> Sign Out
          </Button>
        </div>

        {/* Backend Controller Action Card */}
        <div className="bg-white/50 backdrop-blur-2xl shadow-xl rounded-4xl border border-white/60 p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <FiDatabase className="text-indigo-500" /> Backend Testing
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Use this section to test data fetching from your Spring Boot controllers. Ensure your backend has the proper CORS configuration and endpoints set up.
            </p>

            <Button 
              onClick={testBackendConnection} 
              loading={loading}
              className="rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-md border-none flex items-center gap-2"
              size="large"
            >
              Fetch Data from /api/tasks
            </Button>
          </div>

        </div>

      </div>

      <div className="mt-8 rounded-4xl border border-white/60 bg-white/50 p-6 shadow-xl backdrop-blur-2xl md:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Fetched Profile Cards</h3>
            <p className="mt-1 text-sm text-slate-500">
              Each fetched record is rendered as a reusable profile card with its key details.
            </p>
          </div>
          <div className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
            {profileCards.length > 0 ? `${profileCards.length} records` : 'No records'}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {profileCards.length > 0 ? (
            profileCards.map((card, index) => (
              <ProfileDataCard key={`${card?.id || 'record'}-${index}`} item={card} />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-white/70 bg-white/40 p-5 text-sm text-slate-500">
              <div className="flex items-center gap-3">
                <FiAlertCircle className="text-lg text-slate-400" />
                No fetched data to display yet. Click the backend test button to load records.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
