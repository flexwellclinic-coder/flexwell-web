import React, { useState, useCallback } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { appointmentsAPI, localStorageBackup, notificationAPI } from '../services/api';

const ALL_TIME_SLOTS = [
  { value: '9:00', labelEn: '9:00 AM', labelSq: '9:00 AM' },
  { value: '10:00', labelEn: '10:00 AM', labelSq: '10:00 AM' },
  { value: '11:00', labelEn: '11:00 AM', labelSq: '11:00 AM' },
  { value: '12:00', labelEn: '12:00 PM', labelSq: '12:00 PM' },
  { value: '13:00', labelEn: '1:00 PM', labelSq: '1:00 PM' },
  { value: '14:00', labelEn: '2:00 PM', labelSq: '2:00 PM' },
  { value: '15:00', labelEn: '3:00 PM', labelSq: '3:00 PM' },
  { value: '16:00', labelEn: '4:00 PM', labelSq: '4:00 PM' },
  { value: '17:00', labelEn: '5:00 PM', labelSq: '5:00 PM' },
  { value: '18:00', labelEn: '6:00 PM', labelSq: '6:00 PM' },
];

const Appointment = ({ t }) => {
  const [heroTitleRef, heroTitleVisible] = useScrollAnimation();
  const [heroTaglineRef, heroTaglineVisible] = useScrollAnimation();
  const [formTitleRef, formTitleVisible] = useScrollAnimation();
  const [formDescRef, formDescVisible] = useScrollAnimation();
  const [formRef, formVisible] = useScrollAnimation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    serviceType: '',
    previousInjury: false,
    painArea: '',
    urgencyLevel: '',
    insuranceProvider: '',
    additionalNotes: ''
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsLoaded, setSlotsLoaded] = useState(false);

  const fetchAvailableSlots = useCallback(async (date) => {
    if (!date) {
      setAvailableSlots([]);
      setSlotsLoaded(false);
      return;
    }

    setLoadingSlots(true);
    setSlotsLoaded(false);

    try {
      const response = await appointmentsAPI.getAvailableSlots(date);
      if (response.success && response.data) {
        setAvailableSlots(response.data.availableSlots || []);
      } else {
        // Fallback: show all slots if API fails
        setAvailableSlots(ALL_TIME_SLOTS.map(s => s.value));
      }
    } catch (error) {
      console.warn('Failed to fetch available slots, showing all:', error);
      // Fallback: show all slots
      setAvailableSlots(ALL_TIME_SLOTS.map(s => s.value));
    } finally {
      setLoadingSlots(false);
      setSlotsLoaded(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // When date changes, fetch available slots and reset time
    if (name === 'preferredDate') {
      setFormData(prev => ({
        ...prev,
        preferredDate: value,
        preferredTime: '' // reset time when date changes
      }));
      fetchAvailableSlots(value);
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});
    setSubmitMessage('');
    
    // Create appointment object with all required fields for admin system
    const appointment = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      date: formData.preferredDate,
      time: formData.preferredTime,
      service: formData.serviceType,
      notes: `${formData.painArea ? 'Pain/Concern: ' + formData.painArea + '. ' : ''}${formData.urgencyLevel ? 'Urgency: ' + formData.urgencyLevel + '. ' : ''}${formData.insuranceProvider ? 'Insurance: ' + formData.insuranceProvider + '. ' : ''}${formData.additionalNotes || ''}`,
      previousInjury: formData.previousInjury,
      status: 'pending',
      createdBy: 'patient',
      createdAt: new Date().toISOString()
    };
    
    try {
      // Try to save to database
      const response = await appointmentsAPI.create(appointment);
      
      if (response.success) {
        console.log('✅ Appointment saved to database successfully');
        
        // Send email notification to clinic (non-blocking)
        notificationAPI.sendAppointmentNotification(appointment)
          .then(res => {
            if (res.success) console.log('📧 Email notification sent');
            else console.warn('📧 Email notification skipped or failed');
          })
          .catch(err => console.warn('📧 Email notification error:', err));
        
        // Reset form on success
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          preferredDate: '',
          preferredTime: '',
          serviceType: '',
          previousInjury: false,
          painArea: '',
          urgencyLevel: '',
          insuranceProvider: '',
          additionalNotes: ''
        });

        setSubmitMessage(t(
          '✅ Thank you for your appointment! We will contact you as soon as possible.', 
          '✅ Faleminderit për takimin tuaj! Ne do t\'ju kontaktojmë sa më shpejt të jetë e mundur.'
        ));
      }

    } catch (error) {
      console.error('Error submitting appointment:', error);
      
      // Handle validation errors
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = {};
        error.response.data.errors.forEach(err => {
          errors[err.field] = err.message;
        });
        setFormErrors(errors);
        setSubmitMessage(t('❌ Please fix the errors below and try again.', '❌ Ju lutem rregulloni gabimet më poshtë dhe provoni përsëri.'));
      } else {
        // Fallback to localStorage if API is completely unavailable
        try {
          const savedAppointment = localStorageBackup.addAppointment(appointment);
          if (savedAppointment) {
            console.log('✅ Appointment saved locally as backup');
            
            // Reset form on local save success too
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              preferredDate: '',
              preferredTime: '',
              serviceType: '',
              previousInjury: false,
              painArea: '',
              urgencyLevel: '',
              insuranceProvider: '',
              additionalNotes: ''
            });
            
            setSubmitMessage(t(
              '✅ Thank you for your appointment! We will contact you as soon as possible.', 
              '✅ Faleminderit për takimin tuaj! Ne do t\'ju kontaktojmë sa më shpejt të jetë e mundur.'
            ));
          } else {
            throw new Error('Failed to save locally');
          }
        } catch (localError) {
          console.error('Local storage failed:', localError);
          setSubmitMessage(t('❌ There was an error submitting your appointment. Please try again.', '❌ Ka ndodhur një gabim gjatë dërgimit të takimit tuaj. Ju lutem provoni përsëri.'));
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Appointment Hero Section */}
      <section className="appointment-hero">
        <div className="hero-content">
          <h1 
            ref={heroTitleRef}
            className={`scroll-animate ${heroTitleVisible ? 'visible' : ''}`}
          >
            <span data-en="BOOK YOUR" data-sq="REZERVONI">
              {t('BOOK YOUR', 'REZERVONI')}
            </span>
            <br />
            <span className="accent" data-en="APPOINTMENT" data-sq="TAKIMIN">
              {t('APPOINTMENT', 'TAKIMIN')}
            </span>
          </h1>
          <p 
            ref={heroTaglineRef}
            className={`tagline scroll-animate scroll-animate-stagger-2 ${heroTaglineVisible ? 'visible' : ''}`}
            data-en="TAKE THE FIRST STEP TOWARDS RECOVERY" 
            data-sq="BËNI HAPIN E PARË DREJT RIKUPERIMIT"
          >
            {t('TAKE THE FIRST STEP TOWARDS RECOVERY', 'BËNI HAPIN E PARË DREJT RIKUPERIMIT')}
          </p>
        </div>
      </section>

      {/* Appointment Form Section */}
      <section className="appointment-form-section">
        <div className="container">
          <div 
            ref={formTitleRef}
            className={`form-header scroll-animate ${formTitleVisible ? 'visible' : ''}`}
          >
            <h2 data-en="Schedule Your Consultation" data-sq="Planifikoni Konsultimin Tuaj">
              {t('Schedule Your Consultation', 'Planifikoni Konsultimin Tuaj')}
            </h2>
            <p 
              ref={formDescRef}
              className={`scroll-animate scroll-animate-stagger-1 ${formDescVisible ? 'visible' : ''}`}
              data-en="Fill out the form below and we'll contact you within 24 hours to confirm your appointment and answer any questions you may have." 
              data-sq="Plotësoni formularin më poshtë dhe ne do t'ju kontaktojmë brenda 24 orëve për të konfirmuar takimin tuaj dhe për t'u përgjigjur çdo pyetjeje që mund të keni."
            >
              {t(
                'Fill out the form below and we\'ll contact you within 24 hours to confirm your appointment and answer any questions you may have.',
                'Plotësoni formularin më poshtë dhe ne do t\'ju kontaktojmë brenda 24 orëve për të konfirmuar takimin tuaj dhe për t\'u përgjigjur çdo pyetjeje që mund të keni.'
              )}
            </p>
          </div>

          <div className="form-container">
            <form 
              ref={formRef}
              className={`appointment-form scroll-animate scroll-animate-stagger-2 ${formVisible ? 'visible' : ''}`}
              onSubmit={handleSubmit}
            >
              {/* Personal Information */}
              <div className="form-section">
                <h3 data-en="Personal Information" data-sq="Informacioni Personal">
                  {t('Personal Information', 'Informacioni Personal')}
                </h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label data-en="First Name *" data-sq="Emri *">
                      {t('First Name *', 'Emri *')}
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      data-placeholder-en="Enter your first name"
                      data-placeholder-sq="Shkruani emrin tuaj"
                      placeholder={t('Enter your first name', 'Shkruani emrin tuaj')}
                    />
                    {formErrors.firstName && <span className="error">{formErrors.firstName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label data-en="Last Name *" data-sq="Mbiemri *">
                      {t('Last Name *', 'Mbiemri *')}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      data-placeholder-en="Enter your last name"
                      data-placeholder-sq="Shkruani mbiemrin tuaj"
                      placeholder={t('Enter your last name', 'Shkruani mbiemrin tuaj')}
                    />
                    {formErrors.lastName && <span className="error">{formErrors.lastName}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label data-en="Email Address *" data-sq="Adresa e Email-it *">
                      {t('Email Address *', 'Adresa e Email-it *')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      data-placeholder-en="your.email@example.com"
                      data-placeholder-sq="email.juaj@shembull.com"
                      placeholder={t('your.email@example.com', 'email.juaj@shembull.com')}
                    />
                    {formErrors.email && <span className="error">{formErrors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label data-en="Phone Number *" data-sq="Numri i Telefonit *">
                      {t('Phone Number *', 'Numri i Telefonit *')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      data-placeholder-en="+353 1 234 5678"
                      data-placeholder-sq="+353 1 234 5678"
                      placeholder={t('+353 1 234 5678', '+353 1 234 5678')}
                    />
                    {formErrors.phone && <span className="error">{formErrors.phone}</span>}
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="form-section">
                <h3 data-en="Appointment Details" data-sq="Detajet e Takimit">
                  {t('Appointment Details', 'Detajet e Takimit')}
                </h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label data-en="Preferred Date *" data-sq="Data e Preferuar *">
                      {t('Preferred Date *', 'Data e Preferuar *')}
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {formErrors.preferredDate && <span className="error">{formErrors.preferredDate}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label data-en="Preferred Time *" data-sq="Ora e Preferuar *">
                      {t('Preferred Time *', 'Ora e Preferuar *')}
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.preferredDate || loadingSlots}
                    >
                      {!formData.preferredDate ? (
                        <option value="">
                          {t('Select a date first', 'Zgjidhni një datë fillimisht')}
                        </option>
                      ) : loadingSlots ? (
                        <option value="">
                          {t('Loading available times...', 'Duke ngarkuar oraret e lira...')}
                        </option>
                      ) : slotsLoaded && availableSlots.length === 0 ? (
                        <option value="">
                          {t('No available times for this date', 'Nuk ka orare të lira për këtë datë')}
                        </option>
                      ) : (
                        <>
                          <option value="">
                            {t('Select a time', 'Zgjidhni një orë')}
                          </option>
                          {ALL_TIME_SLOTS.map(slot => {
                            const isAvailable = availableSlots.includes(slot.value);
                            return isAvailable ? (
                              <option key={slot.value} value={slot.value}>
                                {t(slot.labelEn, slot.labelSq)}
                              </option>
                            ) : (
                              <option key={slot.value} value={slot.value} disabled>
                                {t(slot.labelEn + ' — Booked', slot.labelSq + ' — E zënë')}
                              </option>
                            );
                          })}
                        </>
                      )}
                    </select>
                    {slotsLoaded && availableSlots.length === 0 && formData.preferredDate && !loadingSlots && (
                      <span className="slots-warning">
                        {t('All time slots are booked for this date. Please select another date.', 'Të gjitha oraret janë të zëna për këtë datë. Ju lutem zgjidhni një datë tjetër.')}
                      </span>
                    )}
                    {formErrors.preferredTime && <span className="error">{formErrors.preferredTime}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label data-en="Service Type *" data-sq="Lloji i Shërbimit *">
                    {t('Service Type *', 'Lloji i Shërbimit *')}
                  </label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" data-en="Select a service" data-sq="Zgjidhni një shërbim">
                      {t('Select a service', 'Zgjidhni një shërbim')}
                    </option>
                    <option value="initial-consultation" data-en="Initial Consultation" data-sq="Konsultimi Fillestar">
                      {t('Initial Consultation', 'Konsultimi Fillestar')}
                    </option>
                    <option value="manual-therapy" data-en="Manual Therapy" data-sq="Terapia Manuale">
                      {t('Manual Therapy', 'Terapia Manuale')}
                    </option>
                    <option value="exercise-therapy" data-en="Exercise Therapy" data-sq="Terapia me Ushtrime">
                      {t('Exercise Therapy', 'Terapia me Ushtrime')}
                    </option>
                    <option value="sports-rehab" data-en="Sports Rehabilitation" data-sq="Rihabilitimi Sportiv">
                      {t('Sports Rehabilitation', 'Rihabilitimi Sportiv')}
                    </option>
                    <option value="womens-health" data-en="Women's Health" data-sq="Shëndeti i Grave">
                      {t('Women\'s Health', 'Shëndeti i Grave')}
                    </option>
                  </select>
                  {formErrors.serviceType && <span className="error">{formErrors.serviceType}</span>}
                </div>
              </div>

              {/* Health Information */}
              <div className="form-section">
                <h3 data-en="Health Information" data-sq="Informacioni Shëndetësor">
                  {t('Health Information', 'Informacioni Shëndetësor')}
                </h3>
                
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="previousInjury"
                      checked={formData.previousInjury}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    <span data-en="I have had previous injuries or surgeries" data-sq="Kam pasur lëndime ose operacione të mëparshme">
                      {t('I have had previous injuries or surgeries', 'Kam pasur lëndime ose operacione të mëparshme')}
                    </span>
                  </label>
                </div>

                <div className="form-group">
                  <label data-en="Primary Pain/Concern Area" data-sq="Zona Kryesore e Dhimbjes/Shqetësimit">
                    {t('Primary Pain/Concern Area', 'Zona Kryesore e Dhimbjes/Shqetësimit')}
                  </label>
                  <input
                    type="text"
                    name="painArea"
                    value={formData.painArea}
                    onChange={handleInputChange}
                    data-placeholder-en="e.g., Lower back, Knee, Shoulder..."
                    data-placeholder-sq="p.sh., Pjesa e poshtme e shpinës, Gjuri, Suphi..."
                    placeholder={t('e.g., Lower back, Knee, Shoulder...', 'p.sh., Pjesa e poshtme e shpinës, Gjuri, Suphi...')}
                  />
                </div>

                <div className="form-group">
                  <label data-en="Urgency Level" data-sq="Niveli i Urgjencës">
                    {t('Urgency Level', 'Niveli i Urgjencës')}
                  </label>
                  <select
                    name="urgencyLevel"
                    value={formData.urgencyLevel}
                    onChange={handleInputChange}
                  >
                    <option value="" data-en="Select urgency level" data-sq="Zgjidhni nivelin e urgjencës">
                      {t('Select urgency level', 'Zgjidhni nivelin e urgjencës')}
                    </option>
                    <option value="low" data-en="Low - General wellness/prevention" data-sq="E ulët - Mirëqenie e përgjithshme/parandalim">
                      {t('Low - General wellness/prevention', 'E ulët - Mirëqenie e përgjithshme/parandalim')}
                    </option>
                    <option value="medium" data-en="Medium - Ongoing discomfort" data-sq="E mesme - Pakënaqësi në vazhdim">
                      {t('Medium - Ongoing discomfort', 'E mesme - Pakënaqësi në vazhdim')}
                    </option>
                    <option value="high" data-en="High - Significant pain/limitation" data-sq="E lartë - Dhimbje/kufizim i rëndësishëm">
                      {t('High - Significant pain/limitation', 'E lartë - Dhimbje/kufizim i rëndësishëm')}
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label data-en="Insurance Provider" data-sq="Ofrues Sigurimi">
                    {t('Insurance Provider', 'Ofrues Sigurimi')}
                  </label>
                  <input
                    type="text"
                    name="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={handleInputChange}
                    data-placeholder-en="VHI, Laya Healthcare, Irish Life Health..."
                    data-placeholder-sq="VHI, Laya Healthcare, Irish Life Health..."
                    placeholder={t('VHI, Laya Healthcare, Irish Life Health...', 'VHI, Laya Healthcare, Irish Life Health...')}
                  />
                </div>

                <div className="form-group">
                  <label data-en="Additional Notes" data-sq="Shënime Shtesë">
                    {t('Additional Notes', 'Shënime Shtesë')}
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows="4"
                    data-placeholder-en="Please share any additional information about your condition, symptoms, or specific concerns..."
                    data-placeholder-sq="Ju lutem ndani çdo informacion shtesë rreth gjendjes suaj, simptomave ose shqetësimeve specifike..."
                    placeholder={t(
                      'Please share any additional information about your condition, symptoms, or specific concerns...',
                      'Ju lutem ndani çdo informacion shtesë rreth gjendjes suaj, simptomave ose shqetësimeve specifike...'
                    )}
                  ></textarea>
                </div>
              </div>

              {/* Submit Message */}
              {submitMessage && (
                <div className={`submit-message ${submitMessage.includes('✅') ? 'success' : submitMessage.includes('⚠️') ? 'warning' : 'error'}`}>
                  {submitMessage}
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={isSubmitting} data-en={isSubmitting ? "BOOKING..." : "BOOK APPOINTMENT"} data-sq={isSubmitting ? "DUKE REZERVUAR..." : "REZERVO TAKIM"}>
                {t(isSubmitting ? 'BOOKING...' : 'BOOK APPOINTMENT', isSubmitting ? 'DUKE REZERVUAR...' : 'REZERVO TAKIM')}
              </button>
            </form>
          </div>

          {/* Booking Benefits */}
          <div className="booking-benefits">
            <div className="benefit-item">
              <h3 data-en="Quick Response" data-sq="Përgjigje e Shpejtë">
                {t('Quick Response', 'Përgjigje e Shpejtë')}
              </h3>
              <p data-en="We'll contact you within 24 hours to confirm your appointment and answer any questions." data-sq="Ne do t'ju kontaktojmë brenda 24 orëve për të konfirmuar takimin tuaj dhe për t'u përgjigjur çdo pyetjeje.">
                {t(
                  'We\'ll contact you within 24 hours to confirm your appointment and answer any questions.',
                  'Ne do t\'ju kontaktojmë brenda 24 orëve për të konfirmuar takimin tuaj dhe për t\'u përgjigjur çdo pyetjeje.'
                )}
              </p>
            </div>
            <div className="benefit-item">
              <h3 data-en="Expert Assessment" data-sq="Vlerësim Ekspert">
                {t('Expert Assessment', 'Vlerësim Ekspert')}
              </h3>
              <p data-en="Your initial consultation includes a comprehensive assessment and personalized treatment plan." data-sq="Konsultimi juaj fillestar përfshin një vlerësim gjithëpërfshirës dhe plan trajtimi të personalizuar.">
                {t(
                  'Your initial consultation includes a comprehensive assessment and personalized treatment plan.',
                  'Konsultimi juaj fillestar përfshin një vlerësim gjithëpërfshirës dhe plan trajtimi të personalizuar.'
                )}
              </p>
            </div>
            <div className="benefit-item">
              <h3 data-en="Flexible Scheduling" data-sq="Planifikim Fleksibël">
                {t('Flexible Scheduling', 'Planifikim Fleksibël')}
              </h3>
              <p data-en="We offer convenient appointment times to fit your busy schedule, including evening slots." data-sq="Ne ofrojmë orare të përshtatshme takimesh për t'u përshtatur me orarin tuaj të ngarkuar, duke përfshirë edhe orët e mbrëmjes.">
                {t(
                  'We offer convenient appointment times to fit your busy schedule, including evening slots.',
                  'Ne ofrojmë orare të përshtatshme takimesh për t\'u përshtatur me orarin tuaj të ngarkuar, duke përfshirë edhe orët e mbrëmjes.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-info">
            <h2 data-en="Contact Information" data-sq="Informacioni i Kontaktit">
              {t('Contact Information', 'Informacioni i Kontaktit')}
            </h2>
            <div className="contact-details">
              <div className="contact-item">
                <h3 data-en="Phone" data-sq="Telefoni">
                  {t('Phone', 'Telefoni')}
                </h3>
                <a href="tel:+35312345678" className="contact-link">
                  <p>+353 1 234 5678</p>
                </a>
              </div>
              <div className="contact-item">
                <h3 data-en="Email" data-sq="Email-i">
                  {t('Email', 'Email-i')}
                </h3>
                <a href="mailto:flexwellclinic@gmail.com" className="contact-link">
                  <p>flexwellclinic@gmail.com</p>
                </a>
              </div>
              <div className="contact-item">
                <h3 data-en="Address" data-sq="Adresa">
                  {t('Address', 'Adresa')}
                </h3>
                <a 
                  href="https://maps.app.goo.gl/ntPjqr3s97foefo57" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <p data-en="123 Grafton Street, Dublin 2, Ireland" data-sq="123 Grafton Street, Dublin 2, Irlandë">
                    {t('123 Grafton Street, Dublin 2, Ireland', '123 Grafton Street, Dublin 2, Irlandë')}
                  </p>
                </a>
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
            <div className="emergency-info">
              <h3 data-en="Emergency Notice" data-sq="Njoftim Urgjence">
                {t('Emergency Notice', 'Njoftim Urgjence')}
              </h3>
              <p data-en="For urgent medical emergencies, please call 999 or visit your nearest emergency department. This booking system is for non-emergency appointments only." data-sq="Për emergjenca mjekësore urgjente, ju lutemi telefononi 999 ose vizitoni departamentin tuaj më të afërt të emergjencave. Ky sistem rezervimi është vetëm për takime jo-emergjente.">
                {t(
                  'For urgent medical emergencies, please call 999 or visit your nearest emergency department. This booking system is for non-emergency appointments only.',
                  'Për emergjenca mjekësore urgjente, ju lutemi telefononi 999 ose vizitoni departamentin tuaj më të afërt të emergjencave. Ky sistem rezervimi është vetëm për takime jo-emergjente.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Appointment; 