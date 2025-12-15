import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const About = ({ t }) => {
  const [heroRef, heroVisible] = useScrollAnimation();
  const [storyRef, storyVisible] = useScrollAnimation();
  const [valuesRef, valuesVisible] = useScrollAnimation();
  const [teamRef, teamVisible] = useScrollAnimation();
  const [faqRef, faqVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();

  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div 
            ref={heroRef}
            className={`hero-content ${heroVisible ? 'scroll-animate-fade visible' : 'scroll-animate-fade'}`}
          >
            <h1 data-en="About Flex Well" data-sq="Rreth Flex Well">
              {t('About Flex Well', 'Rreth Flex Well')}
            </h1>
            <p data-en="Dedicated to helping you achieve optimal health and mobility through expert physiotherapy care." data-sq="Të përkushtuar për t'ju ndihmuar të arrini shëndet dhe lëvizshmëri optimale përmes kujdesit ekspert fizioterapik.">
              {t('Dedicated to helping you achieve optimal health and mobility through expert physiotherapy care.', 'Të përkushtuar për t\'ju ndihmuar të arrini shëndet dhe lëvizshmëri optimale përmes kujdesit ekspert fizioterapik.')}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="our-story">
        <div className="container">
          <div 
            ref={storyRef}
            className={`story-content ${storyVisible ? 'scroll-animate-slide-up visible' : 'scroll-animate-slide-up'}`}
          >
            <div className="story-text">
              <h2 data-en="Our Story" data-sq="Historia Jonë">
                {t('Our Story', 'Historia Jonë')}
              </h2>
              <p data-en="Founded with a passion for helping people overcome physical challenges and achieve their wellness goals, Flex Well has been serving the Dublin community with excellence in physiotherapy care." data-sq="E themeluar me një pasion për të ndihmuar njerëzit të kapërcejnë sfidat fizike dhe të arrijnë qëllimet e tyre të mirëqenies, Flex Well ka shërbyer komunitetin e Dublinit me përsosmëri në kujdesin fizioterapik.">
                {t('Founded with a passion for helping people overcome physical challenges and achieve their wellness goals, Flex Well has been serving the Dublin community with excellence in physiotherapy care.', 'E themeluar me një pasion për të ndihmuar njerëzit të kapërcejnë sfidat fizike dhe të arrijnë qëllimet e tyre të mirëqenies, Flex Well ka shërbyer komunitetin e Dublinit me përsosmëri në kujdesin fizioterapik.')}
              </p>
              <p data-en="Our approach combines evidence-based treatments with personalized care, ensuring that every patient receives the attention and expertise they deserve." data-sq="Qasja jonë kombinon trajtimet e bazuara në evidenca me kujdesin e personalizuar, duke siguruar që çdo pacient të marrë vëmendjen dhe ekspertizën që meriton.">
                {t('Our approach combines evidence-based treatments with personalized care, ensuring that every patient receives the attention and expertise they deserve.', 'Qasja jonë kombinon trajtimet e bazuara në evidenca me kujdesin e personalizuar, duke siguruar që çdo pacient të marrë vëmendjen dhe ekspertizën që meriton.')}
              </p>
            </div>
            <div className="story-image">
              <div className="image-placeholder">
                <span>🏥</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listen to Your Body Section */}
      <section className="listen-body-section">
        <div className="container">
          <div className="listen-body-content">
            <div className="body-image">
              <img src="/assets/about.jpeg" alt="Exercise Therapy" />
            </div>
            <div className="body-message">
              <div className="message-content">
                <p className="lead-text" data-en="Are you listening to your body?" data-sq="A e dëgjoni trupin tuaj?">
                  {t('Are you listening to your body?', 'A e dëgjoni trupin tuaj?')}
                </p>
                <p data-en="Is it telling you that it needs attention, movement, or relief?" data-sq="A po ju thotë se ka nevojë për vëmendje, lëvizje ose lehtësim?">
                  {t('Is it telling you that it needs attention, movement, or relief?', 'A po ju thotë se ka nevojë për vëmendje, lëvizje ose lehtësim?')}
                </p>
                <p data-en="We do our best to ensure that your body moves freely and without pain." data-sq="Ne bëjmë më të mirën për të siguruar që trupi juaj të lëvizë lirshëm dhe pa dhimbje.">
                  {t('We do our best to ensure that your body moves freely and without pain.', 'Ne bëjmë më të mirën për të siguruar që trupi juaj të lëvizë lirshëm dhe pa dhimbje.')}
                </p>
                <p className="highlight-text" data-en="Let's work together! Give yourself the care you deserve!" data-sq="Le të punojmë së bashku! Jepi vetes kujdesin që meriton!">
                  {t('Let\'s work together! Give yourself the care you deserve!', 'Le të punojmë së bashku! Jepi vetes kujdesin që meriton!')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flex Well Mission Section */}
      <section className="flexwell-mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-logo">
              <img src="/assets/secili_shkon.jpeg" alt="Flex Well Mission" />
            </div>
            <div className="mission-text">
              <p className="mission-intro" data-en="Flex Well was created to be your destination for long-term healing and wellness. 😌" data-sq="Flex Well është krijuar për të qenë destinacioni juaj për një shërim dhe mirëqenie afatgjatë. 😌">
                {t('Flex Well was created to be your destination for long-term healing and wellness. 😌', 'Flex Well është krijuar për të qenë destinacioni juaj për një shërim dhe mirëqenie afatgjatë. 😌')}
              </p>
              <p className="mission-motto" data-en="THE BODY SPEAKS 🗣, WE LISTEN 👂🏻 - is not just a slogan - it is the core foundation which day by day is creating an environment to be more dignified and closer to you. 🧩" data-sq="TRUPI FLET 🗣, NE E DËGJOJMË 👂🏻 - nuk është vetëm një slogan - është gurthemeli kryesor i cili ditë-ditës po krijon një ambient për të qenë më dinjitoz dhe më afër jush. 🧩">
                {t('THE BODY SPEAKS 🗣, WE LISTEN 👂🏻 - is not just a slogan - it is the core foundation which day by day is creating an environment to be more dignified and closer to you. 🧩', 'TRUPI FLET 🗣, NE E DËGJOJMË 👂🏻 - nuk është vetëm një slogan - është gurthemeli kryesor i cili ditë-ditës po krijon një ambient për të qenë më dinjitoz dhe më afër jush. 🧩')}
              </p>
              <p data-en="We do not offer quick fixes ⚡️, but personalized treatments that go beyond the symptoms, addressing the real cause. ✅" data-sq="Ne nuk ofrojmë zgjidhje të shpejta ⚡️, por trajtime të personalizuara që shkojnë përtej simptomave, duke adresuar shkakun e vërtetë. ✅">
                {t('We do not offer quick fixes ⚡️, but personalized treatments that go beyond the symptoms, addressing the real cause. ✅', 'Ne nuk ofrojmë zgjidhje të shpejta ⚡️, por trajtime të personalizuara që shkojnë përtej simptomave, duke adresuar shkakun e vërtetë. ✅')}
              </p>
              <p className="mission-closing" data-en="Move with confidence 💪🏻. Move well. 🤸🏻‍♂️" data-sq="Lëvizni me besim 💪🏻. Lëvizni mirë. 🤸🏻‍♂️">
                {t('Move with confidence 💪🏻. Move well. 🤸🏻‍♂️', 'Lëvizni me besim 💪🏻. Lëvizni mirë. 🤸🏻‍♂️')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="our-values">
        <div className="container">
          <h2 
            ref={valuesRef}
            className={`section-title ${valuesVisible ? 'scroll-animate-fade visible' : 'scroll-animate-fade'}`}
            data-en="Our Values" 
            data-sq="Vlerat Tona"
          >
            {t('Our Values', 'Vlerat Tona')}
          </h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h3 data-en="Excellence" data-sq="Përsosmëria">
                {t('Excellence', 'Përsosmëria')}
              </h3>
              <p data-en="We strive for the highest standards in everything we do" data-sq="Ne përpiqemi për standardet më të larta në gjithçka që bëjmë">
                {t('We strive for the highest standards in everything we do', 'Ne përpiqemi për standardet më të larta në gjithçka që bëjmë')}
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3 data-en="Compassion" data-sq="Dhembshuria">
                {t('Compassion', 'Dhembshuria')}
              </h3>
              <p data-en="Every patient is treated with understanding and empathy" data-sq="Çdo pacient trajtohet me kuptim dhe empati">
                {t('Every patient is treated with understanding and empathy', 'Çdo pacient trajtohet me kuptim dhe empati')}
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔬</div>
              <h3 data-en="Innovation" data-sq="Inovacioni">
                {t('Innovation', 'Inovacioni')}
              </h3>
              <p data-en="We embrace the latest techniques and technologies" data-sq="Ne përqafojmë teknikat dhe teknologjitë më të fundit">
                {t('We embrace the latest techniques and technologies', 'Ne përqafojmë teknikat dhe teknologjitë më të fundit')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="our-team">
        <div className="container">
          <h2 
            ref={teamRef}
            className={`section-title ${teamVisible ? 'scroll-animate-fade visible' : 'scroll-animate-fade'}`}
            data-en="Meet Our Team" 
            data-sq="Takoni Ekipin Tonë"
          >
            {t('Meet Our Team', 'Takoni Ekipin Tonë')}
          </h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <span>👨‍⚕️</span>
              </div>
              <h3 data-en="Dr. Michael Johnson" data-sq="Dr. Michael Johnson">
                {t('Dr. Michael Johnson', 'Dr. Michael Johnson')}
              </h3>
              <p className="member-title" data-en="Lead Physiotherapist" data-sq="Fizioterapeut Kryesor">
                {t('Lead Physiotherapist', 'Fizioterapeut Kryesor')}
              </p>
              <p data-en="15+ years of experience in sports rehabilitation and manual therapy" data-sq="15+ vjet përvojë në rihabilitimin sportiv dhe terapinë manuale">
                {t('15+ years of experience in sports rehabilitation and manual therapy', '15+ vjet përvojë në rihabilitimin sportiv dhe terapinë manuale')}
              </p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <span>👩‍⚕️</span>
              </div>
              <h3 data-en="Dr. Sarah Williams" data-sq="Dr. Sarah Williams">
                {t('Dr. Sarah Williams', 'Dr. Sarah Williams')}
              </h3>
              <p className="member-title" data-en="Musculoskeletal Specialist" data-sq="Specialiste e Sistemit Muskuloskeletal">
                {t('Musculoskeletal Specialist', 'Specialiste e Sistemit Muskuloskeletal')}
              </p>
              <p data-en="Expert in treating chronic pain and movement disorders" data-sq="Eksperte në trajtimin e dhimbjes kronike dhe çrregullimeve të lëvizjes">
                {t('Expert in treating chronic pain and movement disorders', 'Eksperte në trajtimin e dhimbjes kronike dhe çrregullimeve të lëvizjes')}
              </p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <span>👨‍⚕️</span>
              </div>
              <h3 data-en="Dr. James Chen" data-sq="Dr. James Chen">
                {t('Dr. James Chen', 'Dr. James Chen')}
              </h3>
              <p className="member-title" data-en="Exercise Therapist" data-sq="Terapeut i Ushtrimeve">
                {t('Exercise Therapist', 'Terapeut i Ushtrimeve')}
              </p>
              <p data-en="Specializes in functional movement and injury prevention programs" data-sq="Specializohet në lëvizjen funksionale dhe programet e parandalimit të lëndimeve">
                {t('Specializes in functional movement and injury prevention programs', 'Specializohet në lëvizjen funksionale dhe programet e parandalimit të lëndimeve')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 
            ref={faqRef}
            className={`section-title ${faqVisible ? 'scroll-animate-fade visible' : 'scroll-animate-fade'}`}
            data-en="Frequently Asked Questions" 
            data-sq="Pyetjet e Bëra Shpesh"
          >
            {t('Frequently Asked Questions', 'Pyetjet e Bëra Shpesh')}
          </h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3 data-en="What should I expect during my first visit?" data-sq="Çfarë duhet të pres gjatë vizitës së parë?">
                {t('What should I expect during my first visit?', 'Çfarë duhet të pres gjatë vizitës së parë?')}
              </h3>
              <p data-en="Your first visit includes a comprehensive assessment of your condition, medical history review, and development of a personalized treatment plan." data-sq="Vizita juaj e parë përfshin një vlerësim gjithëpërfshirës të gjendjes suaj, rishikim të historisë mjekësore dhe zhvillim të një plani trajtimi të personalizuar.">
                {t('Your first visit includes a comprehensive assessment of your condition, medical history review, and development of a personalized treatment plan.', 'Vizita juaj e parë përfshin një vlerësim gjithëpërfshirës të gjendjes suaj, rishikim të historisë mjekësore dhe zhvillim të një plani trajtimi të personalizuar.')}
              </p>
            </div>
            <div className="faq-item">
              <h3 data-en="How many sessions will I need?" data-sq="Sa seanca do të më duhen?">
                {t('How many sessions will I need?', 'Sa seanca do të më duhen?')}
              </h3>
              <p data-en="The number of sessions varies depending on your condition and goals. We'll discuss this during your assessment and adjust as needed." data-sq="Numri i seancave ndryshon në varësi të gjendjes dhe qëllimeve tuaja. Ne do ta diskutojmë këtë gjatë vlerësimit tuaj dhe do ta rregullojmë sipas nevojës.">
                {t('The number of sessions varies depending on your condition and goals. We\'ll discuss this during your assessment and adjust as needed.', 'Numri i seancave ndryshon në varësi të gjendjes dhe qëllimeve tuaja. Ne do ta diskutojmë këtë gjatë vlerësimit tuaj dhe do ta rregullojmë sipas nevojës.')}
              </p>
            </div>
            <div className="faq-item">
              <h3 data-en="Do you accept insurance?" data-sq="A pranoni sigurime?">
                {t('Do you accept insurance?', 'A pranoni sigurime?')}
              </h3>
              <p data-en="Yes, we work with most major insurance providers. Please contact us to verify your coverage." data-sq="Po, ne punojmë me shumicën e ofruesve kryesorë të sigurimit. Ju lutem na kontaktoni për të verifikuar mbulimin tuaj.">
                {t('Yes, we work with most major insurance providers. Please contact us to verify your coverage.', 'Po, ne punojmë me shumicën e ofruesve kryesorë të sigurimit. Ju lutem na kontaktoni për të verifikuar mbulimin tuaj.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <div className="container">
          <div 
            ref={ctaRef}
            className={`cta-content ${ctaVisible ? 'scroll-animate-scale visible' : 'scroll-animate-scale'}`}
          >
            <h2 data-en="Ready to Start Your Journey?" data-sq="Gati të Filloni Udhëtimin Tuaj?">
              {t('Ready to Start Your Journey?', 'Gati të Filloni Udhëtimin Tuaj?')}
            </h2>
            <p data-en="Take the first step towards better health and book your consultation today." data-sq="Bëni hapin e parë drejt shëndetit më të mirë dhe rezervoni konsultimin tuaj sot.">
              {t('Take the first step towards better health and book your consultation today.', 'Bëni hapin e parë drejt shëndetit më të mirë dhe rezervoni konsultimin tuaj sot.')}
            </p>
            <a href="/appointment" className="cta-btn">
              <span data-en="Book Consultation" data-sq="Rezervo Konsultim">
                {t('Book Consultation', 'Rezervo Konsultim')}
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 