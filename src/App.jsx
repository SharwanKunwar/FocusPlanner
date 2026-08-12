import React, { useState } from 'react';
import { FiHome, FiEdit, FiArchive, FiCheckSquare, FiClock, FiList, FiUser, FiChevronLeft, FiChevronRight, FiGrid, FiActivity, FiTarget } from 'react-icons/fi';
import { Link, Outlet } from 'react-router-dom';

const navItems = [
  { icon: <FiGrid />, label: 'Dashboard', path: "dashboard" },
  { icon: <FiEdit />, label: 'Compose Task', path: "composeTask" },
  { icon: <FiTarget />, label: 'challange', path: "challangePage" },
  { icon: <FiArchive />, label: 'Assets', path: "assets" },
  { icon: <FiClock />, label: 'Lifetime', path: "lifeTime" },
  { icon: <FiList />, label: 'Bucket List', path: "bucketList" },
  { icon: <FiUser />, label: 'Profile', path: "profile" },
];

function App() {
  const [active, setActive] = useState('');
  const [isOpen, setIsOpen] = useState(true); // Sidebar open/close

  return (
    <div className='bg-linear-to-br from-cyan-900/60 via-gray-600 to-black w-screen h-screen flex justify-center items-center p-4 sm:p-8'>
      <div className='bg-white/40 backdrop-blur-3xl w-full h-full rounded-2xl shadow-[0_20px_50px_rgba(0,_0,_0,_0.2)] border border-white/60 flex overflow-hidden'>

        {/* Left Sidebar */}
        <div
          className={`h-full flex flex-col justify-start gap-5 relative bg-white/40
            transition-all duration-300 ease-in-out border-r border-white/40
            ${isOpen ? 'w-[20%]' : 'w-20'}
          `}
        >

          <Link to="/">
            {/* Top: Logo */}
            <div className={`flex items-center gap-2 px-4 p-4 transition-all duration-300`}>

              <div className={`bg-[#1c2331] text-white flex justify-center items-center rounded-xl shadow-md transition-all duration-300 shrink-0
                ${isOpen ? 'w-12 h-12' : 'w-12 h-12'}
              `}>
                <FiHome size={20} />
              </div>

              <div
                className={`overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out whitespace-nowrap
                ${isOpen ? 'max-w-75 opacity-100' : 'max-w-0 opacity-0'}
              `}
              >
                <h1 className='font-bold text-slate-800 text-xl ml-2'>Planner</h1>
              </div>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className='flex flex-col gap-2 px-3 '>
            {navItems.map((item, index) => (
              <Link to={item.path} key={index}>
                <div
                  key={index}
                  onClick={() => setActive(item.label)}
                  className={`flex items-center justify-start gap-3 cursor-pointer rounded-xl transition-all duration-200 text-sm font-medium w-full h-12 px-3 
                  ${active === item.label ? "bg-[#e4ebf5] text-slate-800 shadow-[inset_2px_2px_5px_#c9d1d9,inset_-2px_-2px_5px_#ffffff]" : "hover:bg-white/60 text-slate-500"}
                  
                `}
                >
                  {/* Icon fixed */}

                  <div className='flex justify-center items-center shrink-0'>
                    <span className='text-lg px-2'>{item.icon}</span>
                  </div>

                  {/* Label smooth animation */}

                  <div
                    className={`overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out whitespace-nowrap
                    ${isOpen ? 'max-w-75 opacity-100' : 'max-w-0 opacity-0'}
                  `}
                  >
                    <span className='ml-1'>{item.label}</span>
                  </div>

                </div>
              </Link>
            ))}
          </div>

          {/* Bottom: Toggle Button */}
          <div className='flex justify-center mb-6 absolute bottom-0 left-0 w-full'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="
              bg-[#e4ebf5]
              w-[90%] h-12
              mx-3
              p-3
              rounded-xl
              text-slate-500
              hover:text-slate-800
              shadow-[2px_2px_5px_#c9d1d9,-2px_-2px_1px_#ffffff]
              active:shadow-[inset_1px_1px_3px_#c9d1d9,inset_-1px_-1px_3px_#ffffff]
              transition
              flex justify-center items-center
            "
            >
              {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
            </button>
          </div>
        </div>



        {/* Right Content / main content*/}
        <div className='flex-1 h-full w-full text-slate-800 transition-all duration-300 relative overflow-y-auto hide-scrollbar'>
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default App;
