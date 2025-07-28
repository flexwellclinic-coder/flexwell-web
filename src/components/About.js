import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const About = ({ t }) => {
  const [heroTitleRef, heroTitleVisible] = useScrollAnimation();
  const [heroTaglineRef, heroTaglineVisible] = useScrollAnimation();
  const [storyTitleRef, storyTitleVisible] = useScrollAnimation();
  const [storyP1Ref, storyP1Visible] = useScrollAnimation();
  const [storyP2Ref, storyP2Visible] = useScrollAnimation();
  const [storyP3Ref, storyP3Visible] = useScrollAnimation();
  const [teamTitleRef, teamTitleVisible] = useScrollAnimation();
  const [member1Ref, member1Visible] = useScrollAnimation();
  const [member2Ref, member2Visible] = useScrollAnimation();
  const [member3Ref, member3Visible] = useScrollAnimation();
  const [faqTitleRef, faqTitleVisible] = useScrollAnimation();
  const [faq1Ref, faq1Visible] = useScrollAnimation();
  const [faq2Ref, faq2Visible] = useScrollAnimation();
  const [faq3Ref, faq3Visible] = useScrollAnimation();
  const [faq4Ref, faq4Visible] = useScrollAnimation();
  const [contactTitleRef, contactTitleVisible] = useScrollAnimation();
  const [contactGridRef, contactGridVisible] = useScrollAnimation();

  return (
    <div>
      {/* About Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 
            ref={heroTitleRef}
            className={`scroll-animate ${heroTitleVisible ? 'animate-in' : ''}`}
          >
            <span data-en="ABOUT" data-sq="RRETH">
              {t('ABOUT', 'RRETH')}
            </span>
            <br />
            <span className="accent" data-en="FLEX    WELL" data-sq="FLEX    WELL">
              {t('FLEX    WELL', 'FLEX    WELL')}
            </span>
          </h1>
          <p 
            ref={heroTaglineRef}
            className={`tagline scroll-animate scroll-animate-stagger-2 ${heroTaglineVisible ? 'animate-in' : ''}`}
            data-en="YOUR TRUSTED PHYSIOTHERAPY PARTNER" 
            data-sq="PARTNERI JUAJ I BESUAR I FIZIOTERAPISË"
          >
            {t('YOUR TRUSTED PHYSIOTHERAPY PARTNER', 'PARTNERI JUAJ I BESUAR I FIZIOTERAPISË')}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <h2 
              ref={storyTitleRef}
              className={`scroll-animate ${storyTitleVisible ? 'animate-in' : ''}`}
              data-en="Our Story" 
              data-sq="Historia Jonë"
            >
              {t('Our Story', 'Historia Jonë')}
            </h2>
            <p 
              ref={storyP1Ref}
              className={`scroll-animate scroll-animate-stagger-1 ${storyP1Visible ? 'animate-in' : ''}`}
              data-en="Flex    Well Physiotherapy was founded with a simple yet powerful vision: to help every individual achieve their optimal physical potential. Located in the vibrant heart of Dublin, our clinic has become a trusted destination for those seeking expert physiotherapy care." 
              data-sq="Flex    Well Physiotherapy u themelua me një vizion të thjeshtë por të fuqishëm: t'i ndihmojë çdo individ të arrijë potencialin e tyre optimal fizik. I vendosur në zemrën e gjallë të Dublinit, klinika jonë është bërë një destinacion i besuar për ata që kërkojnë kujdes ekspert fizioterapie."
            >
              {t(
                'Flex    Well Physiotherapy was founded with a simple yet powerful vision: to help every individual achieve their optimal physical potential. Located in the vibrant heart of Dublin, our clinic has become a trusted destination for those seeking expert physiotherapy care.',
                'Flex    Well Physiotherapy u themelua me një vizion të thjeshtë por të fuqishëm: t\'i ndihmojë çdo individ të arrijë potencialin e tyre optimal fizik. I vendosur në zemrën e gjallë të Dublinit, klinika jonë është bërë një destinacion i besuar për ata që kërkojnë kujdes ekspert fizioterapie.'
              )}
            </p>
            <p 
              ref={storyP2Ref}
              className={`scroll-animate scroll-animate-stagger-2 ${storyP2Visible ? 'animate-in' : ''}`}
              data-en="We believe that movement is medicine, and every person deserves to live without pain or physical limitations. Our approach combines cutting-edge techniques with time-tested methods, ensuring that each patient receives personalized care tailored to their unique needs and goals." 
              data-sq="Ne besojmë se lëvizja është ilaç, dhe çdo person meriton të jetojë pa dhimbje ose kufizime fizike. Qasja jonë kombinon teknikat më të avancuara me metodat e provuara në kohë, duke siguruar që çdo pacient të marrë kujdes të personalizuar të përshtatur për nevojat dhe qëllimet e tyre unike."
            >
              {t(
                'We believe that movement is medicine, and every person deserves to live without pain or physical limitations. Our approach combines cutting-edge techniques with time-tested methods, ensuring that each patient receives personalized care tailored to their unique needs and goals.',
                'Ne besojmë se lëvizja është ilaç, dhe çdo person meriton të jetojë pa dhimbje ose kufizime fizike. Qasja jonë kombinon teknikat më të avancuara me metodat e provuara në kohë, duke siguruar që çdo pacient të marrë kujdes të personalizuar të përshtatur për nevojat dhe qëllimet e tyre unike.'
              )}
            </p>
            <p 
              ref={storyP3Ref}
              className={`scroll-animate scroll-animate-stagger-3 ${storyP3Visible ? 'animate-in' : ''}`}
              data-en="From weekend warriors to professional athletes, from office workers to active seniors, we've had the privilege of helping thousands of people reclaim their mobility and return to the activities they love." 
              data-sq="Nga luftëtarët e fundjavës tek atletët profesionistë, nga punonjësit e zyrës tek të moshuarit aktiv, ne kemi pasur privilegjin të ndihmojmë mijëra njerëz të rifitojnë lëvizshmërinë e tyre dhe të kthehen në aktivitetet që duan."
            >
              {t(
                'From weekend warriors to professional athletes, from office workers to active seniors, we\'ve had the privilege of helping thousands of people reclaim their mobility and return to the activities they love.',
                'Nga luftëtarët e fundjavës tek atletët profesionistë, nga punonjësit e zyrës tek të moshuarit aktiv, ne kemi pasur privilegjin të ndihmojmë mijëra njerëz të rifitojnë lëvizshmërinë e tyre dhe të kthehen në aktivitetet që duan.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Team Detail Section */}
      <section className="team-detail-section">
        <div className="container">
          <h2 
            ref={teamTitleRef}
            className={`section-title scroll-animate ${teamTitleVisible ? 'animate-in' : ''}`}
            data-en="Meet Our Expert Team" 
            data-sq="Njihuni me Ekipin Tonë Ekspert"
          >
            {t('Meet Our Expert Team', 'Njihuni me Ekipin Tonë Ekspert')}
          </h2>
          <div className="team-members">
            <div 
              ref={member1Ref}
              className={`team-member-detail scroll-animate-slide-left scroll-animate-stagger-1 ${member1Visible ? 'animate-in' : ''}`}
            >
              <div className="member-photo">
                <div className="placeholder-photo">Dr. Sarah O'Connor</div>
              </div>
              <div className="member-info">
                <h3>Dr. Sarah O'Connor</h3>
                <p className="position" data-en="Lead Physiotherapist & Clinic Director" data-sq="Fizioterapiste Kryesore dhe Drejtoreshë e Klinikës">
                  {t('Lead Physiotherapist & Clinic Director', 'Fizioterapiste Kryesore dhe Drejtoreshë e Klinikës')}
                </p>
                <p className="credentials">MSc Physiotherapy, MISCP</p>
                <p className="bio" data-en="With over 15 years of experience in musculoskeletal physiotherapy, Dr. O'Connor specializes in sports injuries and chronic pain management. She completed her advanced training in manual therapy at Trinity College Dublin and has worked with several professional sports teams. Her patient-centered approach and expertise in movement analysis have helped countless individuals achieve lasting recovery." data-sq="Me mbi 15 vjet përvojë në fizioterapinë muskuloskeletale, Dr. O'Connor specializohet në lëndimet sportive dhe menaxhimin e dhimbjes kronike. Ajo e përfundoi trajnimin e avancuar në terapinë manuale në Trinity College Dublin dhe ka punuar me disa ekipe sportive profesionale. Qasja e saj e fokusuar te pacienti dhe ekspertiza në analizën e lëvizjes ka ndihmuar individë të panumërt të arrijnë rimëkëmbje të qëndrueshme.">
                  {t(
                    'With over 15 years of experience in musculoskeletal physiotherapy, Dr. O\'Connor specializes in sports injuries and chronic pain management. She completed her advanced training in manual therapy at Trinity College Dublin and has worked with several professional sports teams. Her patient-centered approach and expertise in movement analysis have helped countless individuals achieve lasting recovery.',
                    'Me mbi 15 vjet përvojë në fizioterapinë muskuloskeletale, Dr. O\'Connor specializohet në lëndimet sportive dhe menaxhimin e dhimbjes kronike. Ajo e përfundoi trajnimin e avancuar në terapinë manuale në Trinity College Dublin dhe ka punuar me disa ekipe sportive profesionale. Qasja e saj e fokusuar te pacienti dhe ekspertiza në analizën e lëvizjes ka ndihmuar individë të panumërt të arrijnë rimëkëmbje të qëndrueshme.'
                  )}
                </p>
              </div>
            </div>

            <div 
              ref={member2Ref}
              className={`team-member-detail scroll-animate-slide-right scroll-animate-stagger-2 ${member2Visible ? 'animate-in' : ''}`}
            >
              <div className="member-photo">
                <div className="placeholder-photo">Michael Chen</div>
              </div>
              <div className="member-info">
                <h3>Michael Chen</h3>
                <p className="position" data-en="Senior Physiotherapist" data-sq="Fizioterapist i Lartë">
                  {t('Senior Physiotherapist', 'Fizioterapist i Lartë')}
                </p>
                <p className="credentials">BSc (Hons) Physiotherapy, Cert. Dry Needling</p>
                <p className="bio" data-en="Michael brings a wealth of knowledge in neurological rehabilitation and orthopedic conditions. Having trained in both traditional Western physiotherapy and Eastern movement practices, he offers a unique holistic approach to treatment. His specialties include post-surgical rehabilitation, balance training, and injury prevention programs for active adults." data-sq="Michael sjell një pasuri njohurish në rehabilitimin neurologjik dhe kushtet ortopedike. Duke u trajnuar si në fizioterapinë tradicionale perëndimore ashtu edhe në praktikat lindore të lëvizjes, ai ofron një qasje unike holistike ndaj trajtimit. Specialitetet e tij përfshijnë rehabilitimin pas-kirurgjikal, trajnimin e ekuilibrit dhe programet e parandalimit të lëndimeve për të rriturit aktiv.">
                  {t(
                    'Michael brings a wealth of knowledge in neurological rehabilitation and orthopedic conditions. Having trained in both traditional Western physiotherapy and Eastern movement practices, he offers a unique holistic approach to treatment. His specialties include post-surgical rehabilitation, balance training, and injury prevention programs for active adults.',
                    'Michael sjell një pasuri njohurish në rehabilitimin neurologjik dhe kushtet ortopedike. Duke u trajnuar si në fizioterapinë tradicionale perëndimore ashtu edhe në praktikat lindore të lëvizjes, ai ofron një qasje unike holistike ndaj trajtimit. Specialitetet e tij përfshijnë rehabilitimin pas-kirurgjikal, trajnimin e ekuilibrit dhe programet e parandalimit të lëndimeve për të rriturit aktiv.'
                  )}
                </p>
              </div>
            </div>

            <div 
              ref={member3Ref}
              className={`team-member-detail scroll-animate-slide-left scroll-animate-stagger-3 ${member3Visible ? 'animate-in' : ''}`}
            >
              <div className="member-photo">
                <div className="placeholder-photo">Emma Walsh</div>
              </div>
              <div className="member-info">
                <h3>Emma Walsh</h3>
                <p className="position" data-en="Women's Health Physiotherapist" data-sq="Fizioterapiste e Shëndetit të Gruas">
                  {t('Women\'s Health Physiotherapist', 'Fizioterapiste e Shëndetit të Gruas')}
                </p>
                <p className="credentials">MSc Women's Health, Cert. Pelvic Floor</p>
                <p className="bio" data-en="Emma is our specialist in women's health physiotherapy, focusing on pelvic floor rehabilitation, pre and post-natal care, and women's sports medicine. Her compassionate approach and specialized expertise have made her a trusted practitioner for women at all stages of life. She is passionate about educating women on their health options and empowering them through movement." data-sq="Emma është specialistja jonë në fizioterapinë e shëndetit të gruas, duke u fokusuar në rehabilitimin e dyshemesë së pellgut, kujdesin para dhe pas lindjes, dhe mjekësinë sportive të grave. Qasja e saj empatike dhe ekspertiza e specializuar e kanë bërë atë një praktikante të besuar për gratë në të gjitha fazat e jetës. Ajo është e pasionuar për edukimin e grave rreth opsioneve të tyre shëndetësore dhe fuqizimin e tyre përmes lëvizjes.">
                  {t(
                    'Emma is our specialist in women\'s health physiotherapy, focusing on pelvic floor rehabilitation, pre and post-natal care, and women\'s sports medicine. Her compassionate approach and specialized expertise have made her a trusted practitioner for women at all stages of life. She is passionate about educating women on their health options and empowering them through movement.',
                    'Emma është specialistja jonë në fizioterapinë e shëndetit të gruas, duke u fokusuar në rehabilitimin e dyshemesë së pellgut, kujdesin para dhe pas lindjes, dhe mjekësinë sportive të grave. Qasja e saj empatike dhe ekspertiza e specializuar e kanë bërë atë një praktikante të besuar për gratë në të gjitha fazat e jetës. Ajo është e pasionuar për edukimin e grave rreth opsioneve të tyre shëndetësore dhe fuqizimin e tyre përmes lëvizjes.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 
            ref={faqTitleRef}
            className={`section-title scroll-animate ${faqTitleVisible ? 'animate-in' : ''}`}
            data-en="Frequently Asked Questions" 
            data-sq="Pyetjet e Bëra Shpesh"
          >
            {t('Frequently Asked Questions', 'Pyetjet e Bëra Shpesh')}
          </h2>
          <div className="faq-grid">
            <div 
              ref={faq1Ref}
              className={`faq-item scroll-animate scroll-animate-stagger-1 ${faq1Visible ? 'animate-in' : ''}`}
            >
              <h3 data-en="Do I need a referral?" data-sq="A më duhet një dërgim?">
                {t('Do I need a referral?', 'A më duhet një dërgim?')}
              </h3>
              <p data-en="No referral is required. You can book directly with us for most conditions. However, some insurance providers may require a GP referral for coverage." data-sq="Nuk kërkohet dërgim. Ju mund të rezervoni drejtpërdrejt me ne për shumicën e kushteve. Megjithatë, disa ofrues sigurimesh mund të kërkojnë një dërgim nga mjeku i përgjithshëm për mbulim.">
                {t(
                  'No referral is required. You can book directly with us for most conditions. However, some insurance providers may require a GP referral for coverage.',
                  'Nuk kërkohet dërgim. Ju mund të rezervoni drejtpërdrejt me ne për shumicën e kushteve. Megjithatë, disa ofrues sigurimesh mund të kërkojnë një dërgim nga mjeku i përgjithshëm për mbulim.'
                )}
              </p>
            </div>
            <div 
              ref={faq2Ref}
              className={`faq-item scroll-animate scroll-animate-stagger-2 ${faq2Visible ? 'animate-in' : ''}`}
            >
              <h3 data-en="How long is each session?" data-sq="Sa zgjat çdo seancë?">
                {t('How long is each session?', 'Sa zgjat çdo seancë?')}
              </h3>
              <p data-en="Initial consultations last 60 minutes, while follow-up sessions are typically 45 minutes. This allows adequate time for assessment, treatment, and education." data-sq="Konsultimet fillestare zgjatin 60 minuta, ndërsa seancat e ndjekjes janë zakonisht 45 minuta. Kjo lejon kohë të mjaftueshme për vlerësim, trajtim dhe edukim.">
                {t(
                  'Initial consultations last 60 minutes, while follow-up sessions are typically 45 minutes. This allows adequate time for assessment, treatment, and education.',
                  'Konsultimet fillestare zgjatin 60 minuta, ndërsa seancat e ndjekjes janë zakonisht 45 minuta. Kjo lejon kohë të mjaftueshme për vlerësim, trajtim dhe edukim.'
                )}
              </p>
            </div>
            <div 
              ref={faq3Ref}
              className={`faq-item scroll-animate scroll-animate-stagger-3 ${faq3Visible ? 'animate-in' : ''}`}
            >
              <h3 data-en="What should I wear?" data-sq="Çfarë duhet të vesh?">
                {t('What should I wear?', 'Çfarë duhet të vesh?')}
              </h3>
              <p data-en="Comfortable, loose-fitting clothing that allows easy movement. For lower body issues, shorts are recommended. We can provide gowns if needed." data-sq="Veshje të rehatshme dhe të lira që lejojnë lëvizje të lehtë. Për problemet e pjesës së poshtme të trupit, rekomandohen shorte. Ne mund të ofrojmë toba nëse nevojitet.">
                {t(
                  'Comfortable, loose-fitting clothing that allows easy movement. For lower body issues, shorts are recommended. We can provide gowns if needed.',
                  'Veshje të rehatshme dhe të lira që lejojnë lëvizje të lehtë. Për problemet e pjesës së poshtme të trupit, rekomandohen shorte. Ne mund të ofrojmë toba nëse nevojitet.'
                )}
              </p>
            </div>
            <div 
              ref={faq4Ref}
              className={`faq-item scroll-animate scroll-animate-stagger-4 ${faq4Visible ? 'animate-in' : ''}`}
            >
              <h3 data-en="Do you accept insurance?" data-sq="A pranoni sigurimin?">
                {t('Do you accept insurance?', 'A pranoni sigurimin?')}
              </h3>
              <p data-en="Yes, we work with most major health insurance providers. We can help verify your coverage and handle claims processing. Private pay options are also available." data-sq="Po, ne punojmë me shumicën e ofruesve kryesor të sigurimeve shëndetësore. Ne mund t'ju ndihmojmë të verifikoni mbulimin tuaj dhe të trajtojmë procesin e kërkesave. Opsionet e pagesës private janë gjithashtu të disponueshme.">
                {t(
                  'Yes, we work with most major health insurance providers. We can help verify your coverage and handle claims processing. Private pay options are also available.',
                  'Po, ne punojmë me shumicën e ofruesve kryesor të sigurimeve shëndetësore. Ne mund t\'ju ndihmojmë të verifikoni mbulimin tuaj dhe të trajtojmë procesin e kërkesave. Opsionet e pagesës private janë gjithashtu të disponueshme.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="contact-info-section">
        <div className="container">
          <h2 
            ref={contactTitleRef}
            className={`section-title scroll-animate ${contactTitleVisible ? 'animate-in' : ''}`}
            data-en="Get In Touch" 
            data-sq="Kontaktoni me Ne"
          >
            {t('Get In Touch', 'Kontaktoni me Ne')}
          </h2>
          <div 
            ref={contactGridRef}
            className={`contact-grid scroll-animate-scale scroll-animate-stagger-1 ${contactGridVisible ? 'animate-in' : ''}`}
          >
            <div className="contact-item">
              <h3 data-en="Location" data-sq="Vendndodhja">
                {t('Location', 'Vendndodhja')}
              </h3>
              <p data-en="123 Grafton Street, Dublin 2, Ireland" data-sq="123 Grafton Street, Dublin 2, Irlandë">
                {t('123 Grafton Street, Dublin 2, Ireland', '123 Grafton Street, Dublin 2, Irlandë')}
              </p>
            </div>
            <div className="contact-item">
              <h3 data-en="Phone" data-sq="Telefoni">
                {t('Phone', 'Telefoni')}
              </h3>
              <p>+353 1 234 5678</p>
            </div>
            <div className="contact-item">
              <h3 data-en="Email" data-sq="Email-i">
                {t('Email', 'Email-i')}
              </h3>
              <p>info@flexwellphysio.ie</p>
            </div>
            <div className="contact-item">
              <h3 data-en="Hours" data-sq="Orari">
                {t('Hours', 'Orari')}
              </h3>
              <p data-en="Mon-Fri: 8AM-7PM | Sat: 9AM-2PM" data-sq="Hën-Pre: 8:00-19:00 | Sht: 9:00-14:00">
                {t('Mon-Fri: 8AM-7PM | Sat: 9AM-2PM', 'Hën-Pre: 8:00-19:00 | Sht: 9:00-14:00')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 