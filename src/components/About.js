// import useScrollAnimation from '../hooks/useScrollAnimation';
import React from 'react';

const About = ({ t }) => {
  // Temporarily disabled scroll animations for build fix
  // const [heroTitleRef, heroTitleVisible] = useScrollAnimation();
  // const [heroTaglineRef, heroTaglineVisible] = useScrollAnimation();
  // const [storyTitleRef, storyTitleVisible] = useScrollAnimation();
  // const [storyP1Ref, storyP1Visible] = useScrollAnimation();
  // const [storyP2Ref, storyP2Visible] = useScrollAnimation();
  // const [storyP3Ref, storyP3Visible] = useScrollAnimation();
  // const [teamTitleRef, teamTitleVisible] = useScrollAnimation();
  // const [member1Ref, member1Visible] = useScrollAnimation();
  // const [member2Ref, member2Visible] = useScrollAnimation();
  // const [member3Ref, member3Visible] = useScrollAnimation();
  // const [faqTitleRef, faqTitleVisible] = useScrollAnimation();
  // const [faq1Ref, faq1Visible] = useScrollAnimation();
  // const [faq2Ref, faq2Visible] = useScrollAnimation();
  // const [faq3Ref, faq3Visible] = useScrollAnimation();
  // const [faq4Ref, faq4Visible] = useScrollAnimation();
  // const [contactTitleRef, contactTitleVisible] = useScrollAnimation();
  // const [contactGridRef, contactGridVisible] = useScrollAnimation();

  return (
    <div className="about">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 
            // ref={heroTitleRef}
            className="scroll-animate"
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
            // ref={heroTaglineRef}
            className="tagline scroll-animate scroll-animate-stagger-2"
            data-en="YOUR TRUSTED PHYSIOTHERAPY PARTNER" 
            data-sq="PARTNERI JUAJ I BESUAR I FIZIOTERAPISË"
          >
            {t('YOUR TRUSTED PHYSIOTHERAPY PARTNER', 'PARTNERI JUAJ I BESUAR I FIZIOTERAPISË')}
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="our-story">
        <div className="container">
          <div className="story-content">
            <h2 
              // ref={storyTitleRef}
              className="scroll-animate"
              data-en="Our Story" 
              data-sq="Historia Jonë"
            >
              {t('Our Story', 'Historia Jonë')}
            </h2>
            <p 
              // ref={storyP1Ref}
              className="scroll-animate scroll-animate-stagger-1"
              data-en="Flex    Well Physiotherapy was founded with a simple yet powerful vision: to help every individual achieve their optimal physical potential. Located in the vibrant heart of Dublin, our clinic has become a trusted destination for those seeking expert physiotherapy care." 
              data-sq="Flex    Well Physiotherapy u themelua me një vizion të thjeshtë por të fuqishëm: t'i ndihmojë çdo individ të arrijë potencialin e tyre optimal fizik. I vendosur në zemrën e gjallë të Dublinit, klinika jonë është bërë një destinacion i besuar për ata që kërkojnë kujdes ekspert fizioterapie."
            >
              {t(
                'Flex    Well Physiotherapy was founded with a simple yet powerful vision: to help every individual achieve their optimal physical potential. Located in the vibrant heart of Dublin, our clinic has become a trusted destination for those seeking expert physiotherapy care.',
                'Flex    Well Physiotherapy u themelua me një vizion të thjeshtë por të fuqishëm: t\'i ndihmojë çdo individ të arrijë potencialin e tyre optimal fizik. I vendosur në zemrën e gjallë të Dublinit, klinika jonë është bërë një destinacion i besuar për ata që kërkojnë kujdes ekspert fizioterapie.'
              )}
            </p>
            <p 
              // ref={storyP2Ref}
              className="scroll-animate scroll-animate-stagger-2"
              data-en="We believe that movement is medicine, and every person deserves to live without pain or physical limitations. Our approach combines cutting-edge techniques with time-tested methods, ensuring that each patient receives personalized care tailored to their unique needs and goals." 
              data-sq="Ne besojmë se lëvizja është ilaç, dhe çdo person meriton të jetojë pa dhimbje ose kufizime fizike. Qasja jonë kombinon teknikat më të avancuara me metodat e provuara në kohë, duke siguruar që çdo pacient të marrë kujdes të personalizuar të përshtatur për nevojat dhe qëllimet e tyre unike."
            >
              {t(
                'We believe that movement is medicine, and every person deserves to live without pain or physical limitations. Our approach combines cutting-edge techniques with time-tested methods, ensuring that each patient receives personalized care tailored to their unique needs and goals.',
                'Ne besojmë se lëvizja është ilaç, dhe çdo person meriton të jetojë pa dhimbje ose kufizime fizike. Qasja jonë kombinon teknikat më të avancuara me metodat e provuara në kohë, duke siguruar që çdo pacient të marrë kujdes të personalizuar të përshtatur për nevojat dhe qëllimet e tyre unike.'
              )}
            </p>
            <p 
              // ref={storyP3Ref}
              className="scroll-animate scroll-animate-stagger-3"
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

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 
            // ref={teamTitleRef}
            className="section-title scroll-animate"
            data-en="Meet Our Expert Team" 
            data-sq="Njihuni me Ekipin Tonë Ekspert"
          >
            {t('Meet Our Expert Team', 'Njihuni me Ekipin Tonë Ekspert')}
          </h2>
          <div className="team-members">
            <div 
              // ref={member1Ref}
              className="team-member-detail scroll-animate-slide-left scroll-animate-stagger-1"
            >
              <div className="member-photo">
                <div className="photo-placeholder">👨‍⚕️</div>
              </div>
              <div className="member-info">
                <h3 data-en="Dr. Sarah Mitchell" data-sq="Dr. Sarah Mitchell">
                  {t('Dr. Sarah Mitchell', 'Dr. Sarah Mitchell')}
                </h3>
                <p className="member-title" data-en="Senior Physiotherapist & Clinic Director" data-sq="Fizioterapiste Senior & Drejtoreshë e Klinikës">
                  {t('Senior Physiotherapist & Clinic Director', 'Fizioterapiste Senior & Drejtoreshë e Klinikës')}
                </p>
                <p className="member-description" data-en="With over 15 years of experience, Dr. Mitchell specializes in sports injuries and chronic pain management. She completed her advanced training in manual therapy at Trinity College Dublin and has worked with several professional sports teams. Her patient-centered approach and expertise in movement analysis have helped countless athletes return to peak performance." data-sq="Me mbi 15 vjet përvojë, Dr. Mitchell specializohet në lëndimet sportive dhe menaxhimin e dhimbjes kronike. Ajo përfundoi trajnimin e saj të avancuar në terapi manuale në Trinity College Dublin dhe ka punuar me disa ekipe sportive profesioniste. Qasja e saj e orientuar nga pacienti dhe ekspertiza në analizën e lëvizjes ka ndihmuar atletë të panumërt të kthehen në performancën maksimale.">
                  {t(
                    'With over 15 years of experience, Dr. Mitchell specializes in sports injuries and chronic pain management. She completed her advanced training in manual therapy at Trinity College Dublin and has worked with several professional sports teams. Her patient-centered approach and expertise in movement analysis have helped countless athletes return to peak performance.',
                    'Me mbi 15 vjet përvojë, Dr. Mitchell specializohet në lëndimet sportive dhe menaxhimin e dhimbjes kronike. Ajo përfundoi trajnimin e saj të avancuar në terapi manuale në Trinity College Dublin dhe ka punuar me disa ekipe sportive profesioniste. Qasja e saj e orientuar nga pacienti dhe ekspertiza në analizën e lëvizjes ka ndihmuar atletë të panumërt të kthehen në performancën maksimale.'
                  )}
                </p>
              </div>
            </div>

            <div 
              // ref={member2Ref}
              className="team-member-detail scroll-animate-slide-right scroll-animate-stagger-2"
            >
              <div className="member-photo">
                <div className="photo-placeholder">👩‍⚕️</div>
              </div>
              <div className="member-info">
                <h3 data-en="James O'Connor" data-sq="James O'Connor">
                  {t('James O\'Connor', 'James O\'Connor')}
                </h3>
                <p className="member-title" data-en="Musculoskeletal Physiotherapist" data-sq="Fizioterapist Muskulo-Skeletor">
                  {t('Musculoskeletal Physiotherapist', 'Fizioterapist Muskulo-Skeletor')}
                </p>
                <p className="member-description" data-en="James brings a unique blend of traditional physiotherapy and modern movement science to his practice. A former professional rugby player, he understands the demands of both competitive sports and everyday activities. His innovative exercise prescription and hands-on manual therapy techniques have made him a sought-after practitioner for both acute injuries and long-term rehabilitation." data-sq="James sjell një përzierje unike të fizioterapisë tradicionale dhe shkencës moderne të lëvizjes në praktikën e tij. Një ish-lojtar profesionist ragbi, ai kupton kërkesat e të dy sporteve konkurruese dhe aktiviteteve të përditshme. Përshkrimi i tij novator i ushtrimeve dhe teknikat praktike të terapisë manuale e kanë bërë atë një praktikant të kërkuar për të dy lëndimet akute dhe rehabilitimin afatgjatë.">
                  {t(
                    'James brings a unique blend of traditional physiotherapy and modern movement science to his practice. A former professional rugby player, he understands the demands of both competitive sports and everyday activities. His innovative exercise prescription and hands-on manual therapy techniques have made him a sought-after practitioner for both acute injuries and long-term rehabilitation.',
                    'James sjell një përzierje unike të fizioterapisë tradicionale dhe shkencës moderne të lëvizjes në praktikën e tij. Një ish-lojtar profesionist ragbi, ai kupton kërkesat e të dy sporteve konkurruese dhe aktiviteteve të përditshme. Përshkrimi i tij novator i ushtrimeve dhe teknikat praktike të terapisë manuale e kanë bërë atë një praktikant të kërkuar për të dy lëndimet akute dhe rehabilitimin afatgjatë.'
                  )}
                </p>
              </div>
            </div>

            <div 
              // ref={member3Ref}
              className="team-member-detail scroll-animate-slide-left scroll-animate-stagger-3"
            >
              <div className="member-photo">
                <div className="photo-placeholder">👩‍⚕️</div>
              </div>
              <div className="member-info">
                <h3 data-en="Dr. Emma Walsh" data-sq="Dr. Emma Walsh">
                  {t('Dr. Emma Walsh', 'Dr. Emma Walsh')}
                </h3>
                <p className="member-title" data-en="Women's Health & Pelvic Floor Specialist" data-sq="Specialiste e Shëndetit të Grave & Dyshemesë Pelvike">
                  {t('Women\'s Health & Pelvic Floor Specialist', 'Specialiste e Shëndetit të Grave & Dyshemesë Pelvike')}
                </p>
                <p className="member-description" data-en="Dr. Walsh is our dedicated women's health specialist, providing expert care for pregnancy-related musculoskeletal issues, postpartum recovery, and pelvic floor dysfunction. Her gentle, empathetic approach combined with evidence-based treatment methods has helped hundreds of women regain confidence in their bodies and return to active, pain-free lives." data-sq="Dr. Walsh është specialistja jonë e dedikuar e shëndetit të grave, duke ofruar kujdes ekspert për çështjet muskulo-skeletore të lidhura me shtatzëninë, rikuperimin pas lindjes dhe disfunksionin e dyshemesë pelvike. Qasja e saj e butë, empatike e kombinuar me metodat e trajtimit të bazuara në prova ka ndihmuar qindra gra të rifitojnë besimin në trupin e tyre dhe të kthehen në jetë aktive, pa dhimbje.">
                  {t(
                    'Dr. Walsh is our dedicated women\'s health specialist, providing expert care for pregnancy-related musculoskeletal issues, postpartum recovery, and pelvic floor dysfunction. Her gentle, empathetic approach combined with evidence-based treatment methods has helped hundreds of women regain confidence in their bodies and return to active, pain-free lives.',
                    'Dr. Walsh është specialistja jonë e dedikuar e shëndetit të grave, duke ofruar kujdes ekspert për çështjet muskulo-skeletore të lidhura me shtatzëninë, rikuperimin pas lindjes dhe disfunksionin e dyshemesë pelvike. Qasja e saj e butë, empatike e kombinuar me metodat e trajtimit të bazuara në prova ka ndihmuar qindra gra të rifitojnë besimin në trupin e tyre dhe të kthehen në jetë aktive, pa dhimbje.'
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
            // ref={faqTitleRef}
            className="section-title scroll-animate"
            data-en="Frequently Asked Questions" 
            data-sq="Pyetjet e Bëra Shpesh"
          >
            {t('Frequently Asked Questions', 'Pyetjet e Bëra Shpesh')}
          </h2>
          <div className="faq-grid">
            <div 
              // ref={faq1Ref}
              className="faq-item scroll-animate scroll-animate-stagger-1"
            >
              <h3 data-en="Do I need a referral?" data-sq="A më duhet një dërgim?">
                {t('Do I need a referral?', 'A më duhet një dërgim?')}
              </h3>
              <p data-en="No, you can book directly with us. However, having a referral from your GP may help with insurance coverage." data-sq="Jo, mund të rezervoni drejtpërdrejt me ne. Megjithatë, të kesh një dërgim nga mjeku juaj mund të ndihmojë me mbulimin e sigurimit.">
                {t(
                  'No, you can book directly with us. However, having a referral from your GP may help with insurance coverage.',
                  'Jo, mund të rezervoni drejtpërdrejt me ne. Megjithatë, të kesh një dërgim nga mjeku juaj mund të ndihmojë me mbulimin e sigurimit.'
                )}
              </p>
            </div>
            <div 
              // ref={faq2Ref}
              className="faq-item scroll-animate scroll-animate-stagger-2"
            >
              <h3 data-en="How long is each session?" data-sq="Sa zgjat çdo seancë?">
                {t('How long is each session?', 'Sa zgjat çdo seancë?')}
              </h3>
              <p data-en="Initial consultations are 60 minutes, while follow-up sessions are typically 45 minutes." data-sq="Konsultimet fillestare janë 60 minuta, ndërsa seancët e ndjekjes janë zakonisht 45 minuta.">
                {t(
                  'Initial consultations are 60 minutes, while follow-up sessions are typically 45 minutes.',
                  'Konsultimet fillestare janë 60 minuta, ndërsa seancët e ndjekjes janë zakonisht 45 minuta.'
                )}
              </p>
            </div>
            <div 
              // ref={faq3Ref}
              className="faq-item scroll-animate scroll-animate-stagger-3"
            >
              <h3 data-en="What should I wear?" data-sq="Çfarë duhet të vesh?">
                {t('What should I wear?', 'Çfarë duhet të vesh?')}
              </h3>
              <p data-en="Comfortable, loose-fitting clothing that allows easy movement. We may need to access the area being treated." data-sq="Rroba të rehatshme, të lështa që lejojnë lëvizje të lehtë. Mund të na duhet të qasemi në zonën që po trajtohet.">
                {t(
                  'Comfortable, loose-fitting clothing that allows easy movement. We may need to access the area being treated.',
                  'Rroba të rehatshme, të lështa që lejojnë lëvizje të lehtë. Mund të na duhet të qasemi në zonën që po trajtohet.'
                )}
              </p>
            </div>
            <div 
              // ref={faq4Ref}
              className="faq-item scroll-animate scroll-animate-stagger-4"
            >
              <h3 data-en="Do you accept insurance?" data-sq="A pranoni sigurimin?">
                {t('Do you accept insurance?', 'A pranoni sigurimin?')}
              </h3>
              <p data-en="Yes, we work with most major insurance providers. Please contact us to verify your coverage." data-sq="Po, ne punojmë me shumicën e ofruesve kryesorë të sigurimit. Ju lutemi na kontaktoni për të verifikuar mbulimin tuaj.">
                {t(
                  'Yes, we work with most major insurance providers. Please contact us to verify your coverage.',
                  'Po, ne punojmë me shumicën e ofruesve kryesorë të sigurimit. Ju lutemi na kontaktoni për të verifikuar mbulimin tuaj.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <h2 
            // ref={contactTitleRef}
            className="section-title scroll-animate"
            data-en="Get In Touch" 
            data-sq="Kontaktoni me Ne"
          >
            {t('Get In Touch', 'Kontaktoni me Ne')}
          </h2>
          <div 
            // ref={contactGridRef}
            className="contact-grid scroll-animate-scale scroll-animate-stagger-1"
          >
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <h3 data-en="Visit Us" data-sq="Na Vizitoni">
                {t('Visit Us', 'Na Vizitoni')}
              </h3>
              <p data-en="123 Wellness Street, Dublin 2, Ireland" data-sq="123 Wellness Street, Dublin 2, Irlandë">
                {t('123 Wellness Street, Dublin 2, Ireland', '123 Wellness Street, Dublin 2, Irlandë')}
              </p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <h3 data-en="Call Us" data-sq="Na Telefononi">
                {t('Call Us', 'Na Telefononi')}
              </h3>
              <p data-en="+353 1 234 5678" data-sq="+353 1 234 5678">
                {t('+353 1 234 5678', '+353 1 234 5678')}
              </p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <h3 data-en="Email Us" data-sq="Na Shkruani">
                {t('Email Us', 'Na Shkruani')}
              </h3>
              <p data-en="info@flexwell.ie" data-sq="info@flexwell.ie">
                {t('info@flexwell.ie', 'info@flexwell.ie')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 