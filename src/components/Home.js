import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ t }) => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span data-en="FLEX    WELL" data-sq="FLEX    WELL">
              {t('FLEX    WELL', 'FLEX    WELL')}
            </span>
            <br />
            <span className="accent" data-en="PHYSIOTHERAPY" data-sq="FIZIOTERAPI">
              {t('PHYSIOTHERAPY', 'FIZIOTERAPI')}
            </span>
          </h1>
          <p className="hero-subtitle" data-en="RESTORE YOUR MOVEMENT" data-sq="RIKTHENI LËVIZJEN TUAJ">
            {t('RESTORE YOUR MOVEMENT', 'RIKTHENI LËVIZJEN TUAJ')}
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
          <div className="video-content">
            <h2 data-en="WELCOME" data-sq="MIRËSEVINI">
              {t('WELCOME', 'MIRËSEVINI')}
            </h2>
            <p data-en="Your Journey to Optimal Health Starts Here" data-sq="Udhëtimi Juaj për Shëndet Optimal Fillon Këtu">
              {t('Your Journey to Optimal Health Starts Here', 'Udhëtimi Juaj për Shëndet Optimal Fillon Këtu')}
            </p>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="services-preview">
        <div className="container">
          <h2 data-en="OUR SERVICES" data-sq="SHËRBIMET TONA">
            {t('OUR SERVICES', 'SHËRBIMET TONA')}
          </h2>
          <div className="services-grid">
            <div className="service-card">
              <h3 data-en="Manual Therapy" data-sq="Terapia Manuale">
                {t('Manual Therapy', 'Terapia Manuale')}
              </h3>
              <p data-en="Hands-on techniques to restore movement and reduce pain through specialized manipulation and mobilization." data-sq="Teknika praktike për të rikthyer lëvizjen dhe për të reduktuar dhimbjen përmes manipulimit dhe mobilizimit të specializuar.">
                {t(
                  'Hands-on techniques to restore movement and reduce pain through specialized manipulation and mobilization.',
                  'Teknika praktike për të rikthyer lëvizjen dhe për të reduktuar dhimbjen përmes manipulimit dhe mobilizimit të specializuar.'
                )}
              </p>
            </div>
            <div className="service-card">
              <h3 data-en="Exercise Therapy" data-sq="Terapia e Ushtrimeve">
                {t('Exercise Therapy', 'Terapia e Ushtrimeve')}
              </h3>
              <p data-en="Customized exercise programs designed to strengthen, stabilize, and improve your functional capacity." data-sq="Programe ushtrimesh të personalizuara të dizajnuara për të forcuar, stabilizuar dhe përmirësuar kapacitetin tuaj funksional.">
                {t(
                  'Customized exercise programs designed to strengthen, stabilize, and improve your functional capacity.',
                  'Programe ushtrimesh të personalizuara të dizajnuara për të forcuar, stabilizuar dhe përmirësuar kapacitetin tuaj funksional.'
                )}
              </p>
            </div>
            <div className="service-card">
              <h3 data-en="Pain Management" data-sq="Menaxhimi i Dhimbjes">
                {t('Pain Management', 'Menaxhimi i Dhimbjes')}
              </h3>
              <p data-en="Comprehensive approach to chronic and acute pain using evidence-based treatment methods." data-sq="Qasje gjithëpërfshirëse ndaj dhimbjes kronike dhe akute duke përdorur metoda trajtimi të bazuara në prova.">
                {t(
                  'Comprehensive approach to chronic and acute pain using evidence-based treatment methods.',
                  'Qasje gjithëpërfshirëse ndaj dhimbjes kronike dhe akute duke përdorur metoda trajtimi të bazuara në prova.'
                )}
              </p>
            </div>
            <div className="service-card">
              <h3 data-en="Sports Rehabilitation" data-sq="Rehabilitimi Sportiv">
                {t('Sports Rehabilitation', 'Rehabilitimi Sportiv')}
              </h3>
              <p data-en="Specialized recovery programs for athletes to return to peak performance safely and efficiently." data-sq="Programe rimëkëmbjeje të specializuara për atletët për t'u kthyer në performancën maksimale në mënyrë të sigurt dhe efikase.">
                {t(
                  'Specialized recovery programs for athletes to return to peak performance safely and efficiently.',
                  'Programe rimëkëmbjeje të specializuara për atletët për t\'u kthyer në performancën maksimale në mënyrë të sigurt dhe efikase.'
                )}
              </p>
            </div>
          </div>
          <div className="services-cta">
            <Link 
              to="/services" 
              className="cta-btn"
              data-en="VIEW ALL SERVICES" 
              data-sq="SHIKO TË GJITHA SHËRBIMET"
            >
              {t('VIEW ALL SERVICES', 'SHIKO TË GJITHA SHËRBIMET')}
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <video 
          className="cta-background-video" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="/assets/Elegant Physiotherapy Room.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="cta-video-overlay"></div>
        <div className="container">
          <div className="cta-content">
            <h2 data-en="Ready to Begin Your Recovery?" data-sq="Gati të Filloni Rimëkëmbjen Tuaj?">
              {t('Ready to Begin Your Recovery?', 'Gati të Filloni Rimëkëmbjen Tuaj?')}
            </h2>
            <p data-en="Book your consultation today and take the first step towards optimal movement and pain-free living." data-sq="Rezervoni konsultimin tuaj sot dhe bëni hapin e parë drejt lëvizjes optimale dhe jetesës pa dhimbje.">
              {t(
                'Book your consultation today and take the first step towards optimal movement and pain-free living.',
                'Rezervoni konsultimin tuaj sot dhe bëni hapin e parë drejt lëvizjes optimale dhe jetesës pa dhimbje.'
              )}
            </p>
            <Link 
              to="/appointment" 
              className="cta-btn"
              data-en="BOOK APPOINTMENT" 
              data-sq="REZERVO TAKIM"
            >
              {t('BOOK APPOINTMENT', 'REZERVO TAKIM')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 