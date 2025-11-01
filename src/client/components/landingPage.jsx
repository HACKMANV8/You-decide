import React from 'react';
import { useNavigate } from 'react-router-dom';

const videoUrl = '/my-video.mp4'; 

const VideoTransitionPage = () => {
  const navigate = useNavigate();

  const handleVideoEnd = () => {
    const token=localStorage.getItem("token");
    if(!token){
       navigate('/login');
    }else{
 navigate('/dashboard');
    }
    
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/cyber security stock footage - free video cyber security background.mp4"
        autoPlay
        muted
        onEnded={handleVideoEnd} // <-- Triggers navigation on end
      >
        Your browser does not support the video tag.
      </video>
      
    
    </div>
  );
};

export default VideoTransitionPage;