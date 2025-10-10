import React, { useState } from 'react';
// Import hai component con
import UpdateProfile from './Profile/index'; 
import BookingInfo from './BookingPage/index'; 

const TAB_PROFILE = 'PROFILE';
const TAB_BOOKING_HISTORY = 'BOOKING_HISTORY';

export default function UserDashboard() {
  // State để quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState(TAB_PROFILE);

  const renderContent = () => {
    switch (activeTab) {
      case TAB_PROFILE:
        return <UpdateProfile />;
      case TAB_BOOKING_HISTORY:
        return <BookingInfo />;
      default:
        return <UpdateProfile />;
    }
  };

  const TabButton = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-lg font-medium border-b-2 transition-colors duration-200 ${
        activeTab === tabName
          ? 'border-blue-600 text-blue-600' // Tab đang chọn
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' // Tab không chọn
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto my-10 p-4">
      {/* Thanh Tab / Slider */}
      <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-lg shadow-md">
        <TabButton 
          tabName={TAB_PROFILE} 
          label="THÔNG TIN CÁ NHÂN" 
        />
        <TabButton 
          tabName={TAB_BOOKING_HISTORY} 
          label="LỊCH SỬ ĐẶT VÉ" 
        />
      </div>

      {/* Nội dung Tab (Component con) */}
      <div className="bg-white rounded-b-lg shadow-md p-0">
        {renderContent()}
      </div>
    </div>
  );
}