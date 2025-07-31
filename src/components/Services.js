import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Services = ({ t }) => {
  const [heroRef, heroVisible] = useScrollAnimation();
  const [service1Ref, service1Visible] = useScrollAnimation();
  const [service2Ref, service2Visible] = useScrollAnimation();
  const [service3Ref, service3Visible] = useScrollAnimation();
  const [service4Ref, service4Visible] = useScrollAnimation();
  const [service5Ref, service5Visible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();

  return (
    <div className="services">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="container">
          <div 
            ref={heroRef}
            className={`hero-content ${heroVisible ? 'scroll-animate-fade visible' : 'scroll-animate-fade'}`}
          >
            <h1 data-en="Our Services" data-sq="Shërbimet Tona">
              {t('Our Services', 'Shërbimet Tona')}
            </h1>
            <p data-en="Comprehensive physiotherapy treatments tailored to your specific needs and goals." data-sq="Trajtime gjithëpërfshirëse fizioterapie të përshtatura për nevojat dhe qëllimet tuaja specifike.">
              {t('Comprehensive physiotherapy treatments tailored to your specific needs and goals.', 'Trajtime gjithëpërfshirëse fizioterapie të përshtatura për nevojat dhe qëllimet tuaja specifike.')}
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="services-list">
        <div className="container">
          
          {/* Initial Consultation */}
          <div 
            ref={service1Ref}
            className={`service-detail ${service1Visible ? 'scroll-animate-slide-left visible' : 'scroll-animate-slide-left'}`}
          >
            <div className="service-content">
              <div className="service-icon">🏥</div>
              <div className="service-info">
                <h2 data-en="Initial Consultation" data-sq="Konsultimi Fillestar">
                  {t('Initial Consultation', 'Konsultimi Fillestar')}
                </h2>
                <p data-en="A comprehensive 60-minute assessment to understand your condition, medical history, and treatment goals. We'll perform detailed movement analysis and create a personalized treatment plan just for you." data-sq="Një vlerësim 60-minutësh gjithëpërfshirës për të kuptuar gjendjen tuaj, historinë mjekësore dhe qëllimet e trajtimit. Ne do të kryejmë analizë të detajuar të lëvizjes dhe do të krijojmë një plan trajtimi të personalizuar vetëm për ju.">
                  {t('A comprehensive 60-minute assessment to understand your condition, medical history, and treatment goals. We\'ll perform detailed movement analysis and create a personalized treatment plan just for you.', 'Një vlerësim 60-minutësh gjithëpërfshirës për të kuptuar gjendjen tuaj, historinë mjekësore dhe qëllimet e trajtimit. Ne do të kryejmë analizë të detajuar të lëvizjes dhe do të krijojmë një plan trajtimi të personalizuar vetëm për ju.')}
                </p>
                <ul>
                  <li data-en="Detailed medical history review" data-sq="Rishikim i detajuar i historisë mjekësore">
                    {t('Detailed medical history review', 'Rishikim i detajuar i historisë mjekësore')}
                  </li>
                  <li data-en="Physical examination and movement analysis" data-sq="Ekzaminim fizik dhe analizë e lëvizjes">
                    {t('Physical examination and movement analysis', 'Ekzaminim fizik dhe analizë e lëvizjes')}
                  </li>
                  <li data-en="Personalized treatment plan development" data-sq="Zhvillim i planit të trajtimit të personalizuar">
                    {t('Personalized treatment plan development', 'Zhvillim i planit të trajtimit të personalizuar')}
                  </li>
                  <li data-en="Goal setting and timeline discussion" data-sq="Vendosje qëllimesh dhe diskutim i afateve">
                    {t('Goal setting and timeline discussion', 'Vendosje qëllimesh dhe diskutim i afateve')}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Manual Therapy */}
          <div 
            ref={service2Ref}
            className={`service-detail reverse ${service2Visible ? 'scroll-animate-slide-right visible' : 'scroll-animate-slide-right'}`}
          >
            <div className="service-content">
              <div className="service-icon">👐</div>
              <div className="service-info">
                <h2 data-en="Manual Therapy" data-sq="Terapia Manuale">
                  {t('Manual Therapy', 'Terapia Manuale')}
                </h2>
                <p data-en="Hands-on techniques to improve joint mobility, reduce muscle tension, and alleviate pain. Our skilled therapists use evidence-based manual therapy approaches to restore optimal function." data-sq="Teknika me dorë për të përmirësuar lëvizshmërinë e nyjeve, për të reduktuar tensionin e muskujve dhe për të lehtësuar dhimbjen. Terapistët tanë të aftë përdorin qasje të terapisë manuale të bazuara në evidenca për të rivendosur funksionin optimal.">
                  {t('Hands-on techniques to improve joint mobility, reduce muscle tension, and alleviate pain. Our skilled therapists use evidence-based manual therapy approaches to restore optimal function.', 'Teknika me dorë për të përmirësuar lëvizshmërinë e nyjeve, për të reduktuar tensionin e muskujve dhe për të lehtësuar dhimbjen. Terapistët tanë të aftë përdorin qasje të terapisë manuale të bazuara në evidenca për të rivendosur funksionin optimal.')}
                </p>
                <ul>
                  <li data-en="Joint mobilization and manipulation" data-sq="Mobilizim dhe manipulim i nyjeve">
                    {t('Joint mobilization and manipulation', 'Mobilizim dhe manipulim i nyjeve')}
                  </li>
                  <li data-en="Soft tissue massage and myofascial release" data-sq="Masazh i indeve të buta dhe çlirim miofashial">
                    {t('Soft tissue massage and myofascial release', 'Masazh i indeve të buta dhe çlirim miofashial')}
                  </li>
                  <li data-en="Trigger point therapy" data-sq="Terapi e pikave të shkëputjes">
                    {t('Trigger point therapy', 'Terapi e pikave të shkëputjes')}
                  </li>
                  <li data-en="Postural correction techniques" data-sq="Teknika korrigjuese të qëndrimit">
                    {t('Postural correction techniques', 'Teknika korrigjuese të qëndrimit')}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Exercise Therapy */}
          <div 
            ref={service3Ref}
            className={`service-detail ${service3Visible ? 'scroll-animate-slide-left visible' : 'scroll-animate-slide-left'}`}
          >
            <div className="service-content">
              <div className="service-icon">🏃</div>
              <div className="service-info">
                <h2 data-en="Exercise Therapy" data-sq="Terapia me Ushtrime">
                  {t('Exercise Therapy', 'Terapia me Ushtrime')}
                </h2>
                <p data-en="Customized exercise programs designed to improve strength, flexibility, and functional movement. We'll guide you through progressive exercises that support your recovery and prevent future injuries." data-sq="Programe ushtrimesh të personalizuara të dizajnuara për të përmirësuar forcën, fleksibilitetin dhe lëvizjen funksionale. Ne do t'ju udhëheqim përmes ushtrimeve progresive që mbështesin rikuperimin tuaj dhe parandalojnë lëndimet e ardhshme.">
                  {t('Customized exercise programs designed to improve strength, flexibility, and functional movement. We\'ll guide you through progressive exercises that support your recovery and prevent future injuries.', 'Programe ushtrimesh të personalizuara të dizajnuara për të përmirësuar forcën, fleksibilitetin dhe lëvizjen funksionale. Ne do t\'ju udhëheqim përmes ushtrimeve progresive që mbështesin rikuperimin tuaj dhe parandalojnë lëndimet e ardhshme.')}
                </p>
                <ul>
                  <li data-en="Strength and conditioning programs" data-sq="Programe force dhe kondicionimi">
                    {t('Strength and conditioning programs', 'Programe force dhe kondicionimi')}
                  </li>
                  <li data-en="Flexibility and mobility exercises" data-sq="Ushtrime fleksibiliteti dhe lëvizshmërie">
                    {t('Flexibility and mobility exercises', 'Ushtrime fleksibiliteti dhe lëvizshmërie')}
                  </li>
                  <li data-en="Functional movement training" data-sq="Trajnim i lëvizjes funksionale">
                    {t('Functional movement training', 'Trajnim i lëvizjes funksionale')}
                  </li>
                  <li data-en="Home exercise program development" data-sq="Zhvillim i programit të ushtrimeve në shtëpi">
                    {t('Home exercise program development', 'Zhvillim i programit të ushtrimeve në shtëpi')}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sports Rehabilitation */}
          <div 
            ref={service4Ref}
            className={`service-detail reverse ${service4Visible ? 'scroll-animate-slide-right visible' : 'scroll-animate-slide-right'}`}
          >
            <div className="service-content">
              <div className="service-icon">⚽</div>
              <div className="service-info">
                <h2 data-en="Sports Rehabilitation" data-sq="Rihabilitimi Sportiv">
                  {t('Sports Rehabilitation', 'Rihabilitimi Sportiv')}
                </h2>
                <p data-en="Specialized care for athletes and active individuals. From acute injury management to performance optimization, we help you get back to your sport stronger and more resilient than before." data-sq="Kujdes i specializuar për atletët dhe individët aktiv. Nga menaxhimi i lëndimeve akute te optimizimi i performancës, ne ju ndihmojmë të ktheheni në sportin tuaj më të fortë dhe më rezistent se më parë.">
                  {t('Specialized care for athletes and active individuals. From acute injury management to performance optimization, we help you get back to your sport stronger and more resilient than before.', 'Kujdes i specializuar për atletët dhe individët aktiv. Nga menaxhimi i lëndimeve akute te optimizimi i performancës, ne ju ndihmojmë të ktheheni në sportin tuaj më të fortë dhe më rezistent se më parë.')}
                </p>
                <ul>
                  <li data-en="Sports injury assessment and treatment" data-sq="Vlerësim dhe trajtim i lëndimeve sportive">
                    {t('Sports injury assessment and treatment', 'Vlerësim dhe trajtim i lëndimeve sportive')}
                  </li>
                  <li data-en="Return-to-play protocols" data-sq="Protokolle kthimi në lojë">
                    {t('Return-to-play protocols', 'Protokolle kthimi në lojë')}
                  </li>
                  <li data-en="Performance enhancement programs" data-sq="Programe përmirësimi të performancës">
                    {t('Performance enhancement programs', 'Programe përmirësimi të performancës')}
                  </li>
                  <li data-en="Injury prevention strategies" data-sq="Strategji parandalimi të lëndimeve">
                    {t('Injury prevention strategies', 'Strategji parandalimi të lëndimeve')}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Women's Health */}
          <div 
            ref={service5Ref}
            className={`service-detail ${service5Visible ? 'scroll-animate-slide-left visible' : 'scroll-animate-slide-left'}`}
          >
            <div className="service-content">
              <div className="service-icon">🤱</div>
              <div className="service-info">
                <h2 data-en="Women's Health Physiotherapy" data-sq="Fizioterapia e Shëndetit të Grave">
                  {t('Women\'s Health Physiotherapy', 'Fizioterapia e Shëndetit të Grave')}
                </h2>
                <p data-en="Specialized care for women's unique health needs throughout all life stages. Our compassionate approach addresses pelvic floor dysfunction, pregnancy-related issues, and postpartum recovery." data-sq="Kujdes i specializuar për nevojat unike të shëndetit të grave gjatë të gjitha fazave të jetës. Qasja jonë me dhembshuri adreson disfunksionin e dyshemesë pelvike, çështjet e lidhura me shtatzëninë dhe rikuperimin pas lindjes.">
                  {t('Specialized care for women\'s unique health needs throughout all life stages. Our compassionate approach addresses pelvic floor dysfunction, pregnancy-related issues, and postpartum recovery.', 'Kujdes i specializuar për nevojat unike të shëndetit të grave gjatë të gjitha fazave të jetës. Qasja jonë me dhembshuri adreson disfunksionin e dyshemesë pelvike, çështjet e lidhura me shtatzëninë dhe rikuperimin pas lindjes.')}
                </p>
                <ul>
                  <li data-en="Pelvic floor assessment and treatment" data-sq="Vlerësim dhe trajtim i dyshemesë pelvike">
                    {t('Pelvic floor assessment and treatment', 'Vlerësim dhe trajtim i dyshemesë pelvike')}
                  </li>
                  <li data-en="Pregnancy and postpartum care" data-sq="Kujdes gjatë shtatzënisë dhe pas lindjes">
                    {t('Pregnancy and postpartum care', 'Kujdes gjatë shtatzënisë dhe pas lindjes')}
                  </li>
                  <li data-en="Incontinence management" data-sq="Menaxhim i inkontinencës">
                    {t('Incontinence management', 'Menaxhim i inkontinencës')}
                  </li>
                  <li data-en="Core strengthening and rehabilitation" data-sq="Forcim dhe rihabilitim i bërthamës">
                    {t('Core strengthening and rehabilitation', 'Forcim dhe rihabilitim i bërthamës')}
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Call to Action */}
      <section className="services-cta">
        <div className="container">
          <div 
            ref={ctaRef}
            className={`cta-content ${ctaVisible ? 'scroll-animate-scale visible' : 'scroll-animate-scale'}`}
          >
            <h2 data-en="Ready to Begin Your Treatment?" data-sq="Gati të Filloni Trajtimin Tuaj?">
              {t('Ready to Begin Your Treatment?', 'Gati të Filloni Trajtimin Tuaj?')}
            </h2>
            <p data-en="Choose the service that best fits your needs and book your appointment today." data-sq="Zgjidhni shërbimin që i përshtatet më mirë nevojave tuaja dhe rezervoni takimin tuaj sot.">
              {t('Choose the service that best fits your needs and book your appointment today.', 'Zgjidhni shërbimin që i përshtatet më mirë nevojave tuaja dhe rezervoni takimin tuaj sot.')}
            </p>
            <a href="/appointment" className="cta-btn">
              <span data-en="Book Your Session" data-sq="Rezervo Seancën Tuaj">
                {t('Book Your Session', 'Rezervo Seancën Tuaj')}
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services; 