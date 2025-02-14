import React from 'react';
import Navbar from '../components/navBar';
import HeroSection from '../components/hero';
function Home(){
    return (
        <div className="bg-gray-900 min-h-screen">
        <Navbar />
        <HeroSection />
        </div>
    )
}

export default Home;