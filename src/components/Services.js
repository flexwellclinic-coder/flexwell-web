import React from 'react';
import { Link } from 'react-router-dom';

const Services = ({ t }) => {
  return (
    <div>
      {/* Services Hero Section */}
      <section className="services-hero">
        <div className="hero-content">
          <h1>
            <span data-en="OUR" data-sq="SHËRBIMET">
              {t('OUR', 'SHËRBIMET')}
            </span>
            <br />
            <span className="accent" data-en="SERVICES" data-sq="TONA">
              {t('SERVICES', 'TONA')}
            </span>
          </h1>
          <p className="tagline" data-en="COMPREHENSIVE PHYSIOTHERAPY SOLUTIONS" data-sq="ZGJIDHJE GJITHËPËRFSHIRËSE FIZIOTERAPIE">
            {t('COMPREHENSIVE PHYSIOTHERAPY SOLUTIONS', 'ZGJIDHJE GJITHËPËRFSHIRËSE FIZIOTERAPIE')}
          </p>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="services-content">
            <h2 data-en="Treatment Services" data-sq="Shërbimet e Trajtimit">
              {t('Treatment Services', 'Shërbimet e Trajtimit')}
            </h2>
            <p data-en="Our comprehensive range of physiotherapy services addresses various conditions and injuries, helping you achieve optimal recovery and performance." data-sq="Gama jonë gjithëpërfshirëse e shërbimeve të fizioterapisë trajton kushte dhe lëndime të ndryshme, duke ju ndihmuar të arrini rimëkëmbje dhe performancë optimale.">
              {t(
                'Our comprehensive range of physiotherapy services addresses various conditions and injuries, helping you achieve optimal recovery and performance.',
                'Gama jonë gjithëpërfshirëse e shërbimeve të fizioterapisë trajton kushte dhe lëndime të ndryshme, duke ju ndihmuar të arrini rimëkëmbje dhe performancë optimale.'
              )}
            </p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <h3 data-en="Manual Therapy" data-sq="Terapia Manuale">
                {t('Manual Therapy', 'Terapia Manuale')}
              </h3>
              <p data-en="Expert hands-on techniques including joint mobilization, soft tissue manipulation, and myofascial release to restore movement and reduce pain." data-sq="Teknika eksperte praktike përfshirë mobilizimin e nyjeve, manipulimin e indeve të buta dhe lirimin miofashial për të rikthyer lëvizjen dhe reduktuar dhimbjen.">
                {t(
                  'Expert hands-on techniques including joint mobilization, soft tissue manipulation, and myofascial release to restore movement and reduce pain.',
                  'Teknika eksperte praktike përfshirë mobilizimin e nyjeve, manipulimin e indeve të buta dhe lirimin miofashial për të rikthyer lëvizjen dhe reduktuar dhimbjen.'
                )}
              </p>
            </div>
            <div className="service-card">
              <h3 data-en="Exercise Therapy" data-sq="Terapia e Ushtrimeve">
                {t('Exercise Therapy', 'Terapia e Ushtrimeve')}
              </h3>
              <p data-en="Personalized exercise programs designed to improve strength, flexibility, balance, and endurance based on your specific needs and goals." data-sq="Programe ushtrimesh të personalizuara të dizajnuara për të përmirësuar forcën, fleksibilitetin, ekuilibrin dhe qëndrueshmërinë bazuar në nevojat dhe qëllimet tuaja specifike.">
                {t(
                  'Personalized exercise programs designed to improve strength, flexibility, balance, and endurance based on your specific needs and goals.',
                  'Programe ushtrimesh të personalizuara të dizajnuara për të përmirësuar forcën, fleksibilitetin, ekuilibrin dhe qëndrueshmërinë bazuar në nevojat dhe qëllimet tuaja specifike.'
                )}
              </p>
            </div>
            <div className="service-card">
              <h3 data-en="Sports Rehabilitation" data-sq="Rehabilitimi Sportiv">
                {t('Sports Rehabilitation', 'Rehabilitimi Sportiv')}
              </h3>
              <p data-en="Specialized treatment for sports injuries and performance optimization, helping athletes return to their sport safely and at peak performance." data-sq="Trajtim i specializuar për lëndimet sportive dhe optimizimin e performancës, duke ndihmuar atletët të kthehen në sportin e tyre në mënyrë të sigurt dhe në performancën maksimale.">
                {t(
                  'Specialized treatment for sports injuries and performance optimization, helping athletes return to their sport safely and at peak performance.',
                  'Trajtim i specializuar për lëndimet sportive dhe optimizimin e performancës, duke ndihmuar atletët të kthehen në sportin e tyre në mënyrë të sigurt dhe në performancën maksimale.'
                )}
              </p>
            </div>
            <div className="service-card">
              <h3 data-en="Women's Health" data-sq="Shëndeti i Gruas">
                {t('Women\'s Health', 'Shëndeti i Gruas')}
              </h3>
              <p data-en="Specialized care for women's health issues including pelvic floor dysfunction, pre/post-natal care, and women's sports medicine." data-sq="Kujdes i specializuar për çështjet e shëndetit të gruas përfshirë disfunksionin e dyshemesë së pellgut, kujdesin para/pas lindjes dhe mjekësinë sportive të grave.">
                {t(
                  'Specialized care for women\'s health issues including pelvic floor dysfunction, pre/post-natal care, and women\'s sports medicine.',
                  'Kujdes i specializuar për çështjet e shëndetit të gruas përfshirë disfunksionin e dyshemesë së pellgut, kujdesin para/pas lindjes dhe mjekësinë sportive të grave.'
                )}
              </p>
            </div>
            <div className="service-card">
              <h3 data-en="Pain Management" data-sq="Menaxhimi i Dhimbjes">
                {t('Pain Management', 'Menaxhimi i Dhimbjes')}
              </h3>
              <p data-en="Comprehensive pain management strategies using evidence-based approaches to treat both acute and chronic pain conditions." data-sq="Strategji gjithëpërfshirëse të menaxhimit të dhimbjes duke përdorur qasje të bazuara në prova për të trajtuar kushtet e dhimbjes së akut dhe kronike.">
                {t(
                  'Comprehensive pain management strategies using evidence-based approaches to treat both acute and chronic pain conditions.',
                  'Strategji gjithëpërfshirëse të menaxhimit të dhimbjes duke përdorur qasje të bazuara në prova për të trajtuar kushtet e dhimbjes së akut dhe kronike.'
                )}
              </p>
            </div>
            <div className="service-card">
              <h3 data-en="Post-Surgical Rehabilitation" data-sq="Rehabilitimi Pas-Kirurgjikal">
                {t('Post-Surgical Rehabilitation', 'Rehabilitimi Pas-Kirurgjikal')}
              </h3>
              <p data-en="Expert rehabilitation following orthopedic surgeries to ensure safe and effective recovery with optimal functional outcomes." data-sq="Rehabilitim ekspert pas kirurgjive ortopedike për të siguruar rimëkëmbje të sigurt dhe efektive me rezultate funksionale optimale.">
                {t(
                  'Expert rehabilitation following orthopedic surgeries to ensure safe and effective recovery with optimal functional outcomes.',
                  'Rehabilitim ekspert pas kirurgjive ortopedike për të siguruar rimëkëmbje të sigurt dhe efektive me rezultate funksionale optimale.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Treatment Modalities Section */}
      <section className="modalities-section">
        <div className="container">
          <div className="modalities-content">
            <h2 data-en="Treatment Modalities" data-sq="Modalitetet e Trajtimit">
              {t('Treatment Modalities', 'Modalitetet e Trajtimit')}
            </h2>
            <p data-en="We utilize the latest evidence-based treatment techniques and state-of-the-art equipment to provide the most effective care." data-sq="Ne përdorim teknikat më të fundit të trajtimit të bazuar në prova dhe pajisje të fundit për të ofruar kujdesin më efektiv.">
              {t(
                'We utilize the latest evidence-based treatment techniques and state-of-the-art equipment to provide the most effective care.',
                'Ne përdorim teknikat më të fundit të trajtimit të bazuar në prova dhe pajisje të fundit për të ofruar kujdesin më efektiv.'
              )}
            </p>
          </div>
          <div className="modalities-grid">
            <div className="modality-item">
              <h3 data-en="Dry Needling" data-sq="Gjilpërimi i Thatë">
                {t('Dry Needling', 'Gjilpërimi i Thatë')}
              </h3>
              <p data-en="Targeted treatment of trigger points and muscle tension using fine needles to reduce pain and improve muscle function." data-sq="Trajtim i synuar i pikave shkëputëse dhe tensionit të muskujve duke përdorur gjilpëra të holla për të reduktuar dhimbjen dhe përmirësuar funksionin e muskujve.">
                {t(
                  'Targeted treatment of trigger points and muscle tension using fine needles to reduce pain and improve muscle function.',
                  'Trajtim i synuar i pikave shkëputëse dhe tensionit të muskujve duke përdorur gjilpëra të holla për të reduktuar dhimbjen dhe përmirësuar funksionin e muskujve.'
                )}
              </p>
            </div>
            <div className="modality-item">
              <h3 data-en="Ultrasound Therapy" data-sq="Terapia me Ultrazë">
                {t('Ultrasound Therapy', 'Terapia me Ultrazë')}
              </h3>
              <p data-en="Deep tissue healing using sound waves to promote circulation, reduce inflammation, and accelerate tissue repair." data-sq="Shërimi i thellë i indeve duke përdorur valët e zërit për të nxitur qarkullimin, reduktuar inflamacionin dhe përshpejtuar riparimin e indeve.">
                {t(
                  'Deep tissue healing using sound waves to promote circulation, reduce inflammation, and accelerate tissue repair.',
                  'Shërimi i thellë i indeve duke përdorur valët e zërit për të nxitur qarkullimin, reduktuar inflamacionin dhe përshpejtuar riparimin e indeve.'
                )}
              </p>
            </div>
            <div className="modality-item">
              <h3 data-en="Electrical Stimulation" data-sq="Stimulimi Elektrik">
                {t('Electrical Stimulation', 'Stimulimi Elektrik')}
              </h3>
              <p data-en="Controlled electrical currents to reduce pain, strengthen muscles, and improve circulation in targeted areas." data-sq="Rryme elektrike të kontrolluara për të reduktuar dhimbjen, forcuar muskujt dhe përmirësuar qarkullimin në zonat e synuara.">
                {t(
                  'Controlled electrical currents to reduce pain, strengthen muscles, and improve circulation in targeted areas.',
                  'Rryme elektrike të kontrolluara për të reduktuar dhimbjen, forcuar muskujt dhe përmirësuar qarkullimin në zonat e synuara.'
                )}
              </p>
            </div>
            <div className="modality-item">
              <h3 data-en="Heat/Cold Therapy" data-sq="Terapia me Nxehtësi/Ftohtësi">
                {t('Heat/Cold Therapy', 'Terapia me Nxehtësi/Ftohtësi')}
              </h3>
              <p data-en="Strategic application of heat and cold treatments to manage pain, reduce swelling, and improve tissue flexibility." data-sq="Aplikim strategjik i trajtimeve me nxehtësi dhe ftohtësi për të menaxhuar dhimbjen, reduktuar ënjtjen dhe përmirësuar fleksibilitetin e indeve.">
                {t(
                  'Strategic application of heat and cold treatments to manage pain, reduce swelling, and improve tissue flexibility.',
                  'Aplikim strategjik i trajtimeve me nxehtësi dhe ftohtësi për të menaxhuar dhimbjen, reduktuar ënjtjen dhe përmirësuar fleksibilitetin e indeve.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="facilities-section">
        <div className="container">
          <div className="facilities-content">
            <h2 data-en="Our Facilities" data-sq="Mjediset Tona">
              {t('Our Facilities', 'Mjediset Tona')}
            </h2>
            <p data-en="Our modern clinic features state-of-the-art equipment and comfortable treatment spaces designed to support your recovery journey." data-sq="Klinika jonë moderne ka pajisje të fundit dhe hapësira trajtimi të rehatshme të dizajnuara për të mbështetur udhëtimin tuaj të rimëkëmbjes.">
              {t(
                'Our modern clinic features state-of-the-art equipment and comfortable treatment spaces designed to support your recovery journey.',
                'Klinika jonë moderne ka pajisje të fundit dhe hapësira trajtimi të rehatshme të dizajnuara për të mbështetur udhëtimin tuaj të rimëkëmbjes.'
              )}
            </p>
          </div>
          <div className="facilities-grid">
            <div className="facility-card">
              <h3 data-en="Treatment Rooms" data-sq="Dhomat e Trajtimit">
                {t('Treatment Rooms', 'Dhomat e Trajtimit')}
              </h3>
              <p data-en="Private, comfortable treatment rooms equipped with modern physiotherapy tables and specialized equipment for one-on-one care." data-sq="Dhoma private dhe të rehatshme trajtimi të pajisura me tavolina moderne fizioterapie dhe pajisje të specializuara për kujdes një-me-një.">
                {t(
                  'Private, comfortable treatment rooms equipped with modern physiotherapy tables and specialized equipment for one-on-one care.',
                  'Dhoma private dhe të rehatshme trajtimi të pajisura me tavolina moderne fizioterapie dhe pajisje të specializuara për kujdes një-me-një.'
                )}
              </p>
            </div>
            <div className="facility-card">
              <h3 data-en="Exercise Rehabilitation Area" data-sq="Zona e Rehabilitimit me Ushtrime">
                {t('Exercise Rehabilitation Area', 'Zona e Rehabilitimit me Ushtrime')}
              </h3>
              <p data-en="Spacious area with professional-grade exercise equipment, parallel bars, and functional training tools for comprehensive rehabilitation." data-sq="Zonë e gjerë me pajisje ushtrimesh të gradës profesionale, shtylla paralele dhe mjete trajnimi funksional për rehabilitim gjithëpërfshirës.">
                {t(
                  'Spacious area with professional-grade exercise equipment, parallel bars, and functional training tools for comprehensive rehabilitation.',
                  'Zonë e gjerë me pajisje ushtrimesh të gradës profesionale, shtylla paralele dhe mjete trajnimi funksional për rehabilitim gjithëpërfshirës.'
                )}
              </p>
            </div>
            <div className="facility-card">
              <h3 data-en="Hydrotherapy Pool" data-sq="Pishina e Hidroterapisë">
                {t('Hydrotherapy Pool', 'Pishina e Hidroterapisë')}
              </h3>
              <p data-en="Temperature-controlled pool for aquatic therapy, ideal for low-impact rehabilitation and pain management." data-sq="Pishinë me temperaturë të kontrolluar për terapinë ujore, ideale për rehabilitim me ndikim të ulët dhe menaxhimin e dhimbjes.">
                {t(
                  'Temperature-controlled pool for aquatic therapy, ideal for low-impact rehabilitation and pain management.',
                  'Pishinë me temperaturë të kontrolluar për terapinë ujore, ideale për rehabilitim me ndikim të ulët dhe menaxhimin e dhimbjes.'
                )}
              </p>
            </div>
            <div className="facility-card">
              <h3 data-en="Assessment Laboratory" data-sq="Laboratori i Vlerësimit">
                {t('Assessment Laboratory', 'Laboratori i Vlerësimit')}
              </h3>
              <p data-en="Advanced movement analysis technology for comprehensive biomechanical assessments and treatment planning." data-sq="Teknologji e avancuar e analizës së lëvizjes për vlerësime biomekanike gjithëpërfshirëse dhe planifikim të trajtimit.">
                {t(
                  'Advanced movement analysis technology for comprehensive biomechanical assessments and treatment planning.',
                  'Teknologji e avancuar e analizës së lëvizjes për vlerësime biomekanike gjithëpërfshirëse dhe planifikim të trajtimit.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 data-en="Ready to Start Your Recovery?" data-sq="Gati të Filloni Rimëkëmbjen Tuaj?">
              {t('Ready to Start Your Recovery?', 'Gati të Filloni Rimëkëmbjen Tuaj?')}
            </h2>
            <p data-en="Experience the difference that expert physiotherapy care can make. Book your consultation today and take the first step towards a pain-free, active lifestyle." data-sq="Përjetoni ndryshimin që mund të bëjë kujdesi ekspert i fizioterapisë. Rezervoni konsultimin tuaj sot dhe bëni hapin e parë drejt një jetese pa dhimbje dhe aktive.">
              {t(
                'Experience the difference that expert physiotherapy care can make. Book your consultation today and take the first step towards a pain-free, active lifestyle.',
                'Përjetoni ndryshimin që mund të bëjë kujdesi ekspert i fizioterapisë. Rezervoni konsultimin tuaj sot dhe bëni hapin e parë drejt një jetese pa dhimbje dhe aktive.'
              )}
            </p>
            <Link 
              to="/appointment" 
              className="cta-btn"
              data-en="BOOK YOUR APPOINTMENT" 
              data-sq="REZERVONI TAKIMIN TUAJ"
            >
              {t('BOOK YOUR APPOINTMENT', 'REZERVONI TAKIMIN TUAJ')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services; 