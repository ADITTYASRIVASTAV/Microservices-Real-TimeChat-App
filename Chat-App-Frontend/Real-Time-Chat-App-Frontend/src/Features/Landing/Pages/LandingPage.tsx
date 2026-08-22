import LandingNavbar from '../Components/LandingNavbar'
import HeroSection from '../Components/HeroSection'
import Highlights from '../Components/Highlights'
import FeaturesSection from '../Components/FeaturesSection'
import RealtimeSection from '../Components/RealtimeSection'
import SecuritySection from '../Components/SecuritySection'
import ArchitectureSection from '../Components/ArchitectureSection'
import TechnologySection from '../Components/TechnologySection'
import CTASection from '../Components/CTASection'
import Footer from '../Components/Footer'

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300">
      <LandingNavbar />
      <main>
        <HeroSection />
        <Highlights />
        <FeaturesSection />
        <RealtimeSection />
        <SecuritySection />
        <ArchitectureSection />
        <TechnologySection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
