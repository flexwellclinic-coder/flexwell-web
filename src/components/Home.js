import React from 'react';
// import useScrollAnimation from '../hooks/useScrollAnimation';

const Home = ({ t }) => {
  // Temporarily disabled scroll animations for build fix
  // const [titleRef, titleVisible] = useScrollAnimation();
  // const [subtitleRef, subtitleVisible] = useScrollAnimation();
  // const [videoContentRef, videoContentVisible] = useScrollAnimation();
  // const [servicesHeaderRef, servicesHeaderVisible] = useScrollAnimation();
  // const [service1Ref, service1Visible] = useScrollAnimation();
  // const [service2Ref, service2Visible] = useScrollAnimation();
  // const [service3Ref, service3Visible] = useScrollAnimation();
  // const [service4Ref, service4Visible] = useScrollAnimation();
  // const [ctaRef, ctaVisible] = useScrollAnimation();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 
            // ref={titleRef}
            className={`hero-title scroll-animate-fade`}
            data-en="Welcome to Flex Well"
            data-sq="Mirësevini në Flex Well"
          >
            {t('Welcome to Flex Well', 'Mirësevini në Flex Well')}
          </h1>
          <p 
            // ref={subtitleRef}
            className={`hero-subtitle scroll-animate-slide-left`}
            data-en="Your Trusted Physiotherapy and Wellness Partner"
            data-sq="Partneri Juaj i Besuar për Fizioterapi dhe Mirëqenie"
          >
            {t('Your Trusted Physiotherapy and Wellness Partner', 'Partneri Juaj i Besuar për Fizioterapi dhe Mirëqenie')}
          </p>
        </div>
      </section>

      {/* Video Welcome Section */}
      <section className="video-welcome-section">
        <div className="video-container">
          <video
            className="background-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/assets/20250725_0110_Luxurious Clinic Reception_simple_compose_01k0zb752we978jb9esamq3pzq.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay"></div>
          <div 
            // ref={videoContentRef}
            className={`video-content scroll-animate-scale`}
          >
            <h2 data-en="WELCOME" data-sq="MIRËSEVINI">
              {t('WELCOME', 'MIRËSEVINI')}
            </h2>
            <p data-en="Your Journey to Optimal Health Starts Here" data-sq="Udhëtimi Juaj për Shëndet Optimal Fillon Këtu">
              {t('Your Journey to Optimal Health Starts Here', 'Udhëtimi Juaj për Shëndet Optimal Fillon Këtu')}
            </p>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="services-preview">
        <div className="container">
          <h2 
            // ref={servicesHeaderRef}
            className={`scroll-animate-fade`}
            data-en="Our Specialized Services"
            data-sq="Shërbimet Tona të Specializuara"
          >
            {t('Our Specialized Services', 'Shërbimet Tona të Specializuara')}
          </h2>
          
          <div className="services-grid">
            <div 
              // ref={service1Ref}
              className={`service-card service-card-animate`}
            >
              <div className="service-icon">🩺</div>
              <h3 data-en="Initial Consultation" data-sq="Konsultimi Fillestar">
                {t('Initial Consultation', 'Konsultimi Fillestar')}
              </h3>
              <p data-en="Comprehensive assessment and personalized treatment plan" data-sq="Vlerësim gjithëpërfshirës dhe plan trajtimi të personalizuar">
                {t('Comprehensive assessment and personalized treatment plan', 'Vlerësim gjithëpërfshirës dhe plan trajtimi të personalizuar')}
              </p>
            </div>
            
            <div 
              // ref={service2Ref}
              className={`service-card service-card-animate`}
            >
              <div className="service-icon">🤲</div>
              <h3 data-en="Manual Therapy" data-sq="Terapia Manuale">
                {t('Manual Therapy', 'Terapia Manuale')}
              </h3>
              <p data-en="Hands-on techniques for pain relief and mobility improvement" data-sq="Teknika me dorë për lehtësimin e dhimbjes dhe përmirësimin e lëvizshmërisë">
                {t('Hands-on techniques for pain relief and mobility improvement', 'Teknika me dorë për lehtësimin e dhimbjes dhe përmirësimin e lëvizshmërisë')}
              </p>
            </div>
            
            <div 
              // ref={service3Ref}
              className={`service-card service-card-animate`}
            >
              <div className="service-icon">🏃‍♂️</div>
              <h3 data-en="Exercise Therapy" data-sq="Terapia me Ushtrime">
                {t('Exercise Therapy', 'Terapia me Ushtrime')}
              </h3>
              <p data-en="Customized exercise programs for strength and recovery" data-sq="Programe ushtrimesh të personalizuara për forcë dhe rikuperim">
                {t('Customized exercise programs for strength and recovery', 'Programe ushtrimesh të personalizuara për forcë dhe rikuperim')}
              </p>
            </div>
            
            <div 
              // ref={service4Ref}
              className={`service-card service-card-animate`}
            >
              <div className="service-icon">⚽</div>
              <h3 data-en="Sports Rehabilitation" data-sq="Rihabilitimi Sportiv">
                {t('Sports Rehabilitation', 'Rihabilitimi Sportiv')}
              </h3>
              <p data-en="Specialized care for athletic injuries and performance" data-sq="Kujdes i specializuar për lëndimet atletike dhe performancën">
                {t('Specialized care for athletic injuries and performance', 'Kujdes i specializuar për lëndimet atletike dhe performancën')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <video
          className="cta-background-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/assets/reception.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="cta-video-overlay"></div>
        <div className="container">
          <div 
            // ref={ctaRef}
            className={`cta-content scroll-animate-scale`}
          >
            <h2 data-en="Ready to Begin Your Recovery?" data-sq="Gati të Filloni Rikuperimin Tuaj?">
              {t('Ready to Begin Your Recovery?', 'Gati të Filloni Rikuperimin Tuaj?')}
            </h2>
            <p data-en="Book your appointment today and take the first step towards better health" data-sq="Rezervoni takimin tuaj sot dhe bëni hapin e parë drejt shëndetit më të mirë">
              {t('Book your appointment today and take the first step towards better health', 'Rezervoni takimin tuaj sot dhe bëni hapin e parë drejt shëndetit më të mirë')}
            </p>
            <a href="/appointment" className="cta-btn">
              <span data-en="Book Appointment" data-sq="Rezervo Takim">
                {t('Book Appointment', 'Rezervo Takim')}
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 