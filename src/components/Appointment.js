import React, { useState } from 'react';
import { appointmentsAPI, localStorageBackup } from '../services/api';
import useScrollAnimation from '../hooks/useScrollAnimation';

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
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
    
    // Create appointment object
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
      createdBy: 'patient'
    };
    
    try {

      // Try to save to database
      const response = await appointmentsAPI.create(appointment);
      
      if (response.success) {
        console.log('Appointment saved to database successfully');
        
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

        setSubmitMessage(t('✅ Thank you! Your appointment request has been submitted successfully. We will contact you within 24 hours to confirm.', '✅ Faleminderit! Kërkesa juaj për takim është dërguar me sukses. Ne do t\'ju kontaktojmë brenda 24 orëve për të konfirmuar.'));
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
          localStorageBackup.addAppointment(appointment);
          setSubmitMessage(t('⚠️ Your appointment has been saved locally. We will process it as soon as possible.', '⚠️ Takimi juaj është ruajtur lokalisht. Ne do ta përpunojmë sa më shpejt të jetë e mundur.'));
        } catch (localError) {
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
            className={`scroll-animate ${heroTitleVisible ? 'animate-in' : ''}`}
          >
            <span data-en="BOOK YOUR" data-sq="REZERVONI">
              {t('BOOK YOUR', 'REZERVONI')}
            </span>
            <br />
            <span className="accent" data-en="APPOINTMENT" data-sq="TAKIMIN TUAJ">
              {t('APPOINTMENT', 'TAKIMIN TUAJ')}
            </span>
          </h1>
          <p 
            ref={heroTaglineRef}
            className={`tagline scroll-animate scroll-animate-stagger-2 ${heroTaglineVisible ? 'animate-in' : ''}`}
            data-en="TAKE THE FIRST STEP TOWARD RECOVERY" 
            data-sq="BËNI HAPIN E PARË DREJT RIMËKËMBJES"
          >
            {t('TAKE THE FIRST STEP TOWARD RECOVERY', 'BËNI HAPIN E PARË DREJT RIMËKËMBJES')}
          </p>
        </div>
      </section>

      {/* Booking Section */}
      <section className="booking-section">
        <div className="container">
          <div className="form-container">
            <h1 
              ref={formTitleRef}
              className={`scroll-animate ${formTitleVisible ? 'animate-in' : ''}`}
              data-en="Schedule Your Appointment" 
              data-sq="Planifikoni Takimin Tuaj"
            >
              {t('Schedule Your Appointment', 'Planifikoni Takimin Tuaj')}
            </h1>
            <p 
              ref={formDescRef}
              className={`scroll-animate scroll-animate-stagger-1 ${formDescVisible ? 'animate-in' : ''}`}
              data-en="Fill out the form below and we'll contact you within 24 hours to confirm your appointment and discuss your specific needs." 
              data-sq="Plotësoni formularin më poshtë dhe ne do t'ju kontaktojmë brenda 24 orëve për të konfirmuar takimin tuaj dhe për të diskutuar nevojat tuaja specifike."
            >
              {t(
                'Fill out the form below and we\'ll contact you within 24 hours to confirm your appointment and discuss your specific needs.',
                'Plotësoni formularin më poshtë dhe ne do t\'ju kontaktojmë brenda 24 orëve për të konfirmuar takimin tuaj dhe për të diskutuar nevojat tuaja specifike.'
              )}
            </p>

            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes('✅') ? 'success' : submitMessage.includes('⚠️') ? 'warning' : 'error'}`}>
                {submitMessage}
              </div>
            )}

            <form 
              ref={formRef}
              onSubmit={handleSubmit} 
              className={`appointment-form scroll-animate-scale scroll-animate-stagger-2 ${formVisible ? 'animate-in' : ''}`}
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" data-en="First Name *" data-sq="Emri *">
                    {t('First Name *', 'Emri *')}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    data-placeholder-en="Enter your first name"
                    data-placeholder-sq="Shkruani emrin tuaj"
                    placeholder={t('Enter your first name', 'Shkruani emrin tuaj')}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName" data-en="Last Name *" data-sq="Mbiemri *">
                    {t('Last Name *', 'Mbiemri *')}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    data-placeholder-en="Enter your last name"
                    data-placeholder-sq="Shkruani mbiemrin tuaj"
                    placeholder={t('Enter your last name', 'Shkruani mbiemrin tuaj')}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email" data-en="Email Address *" data-sq="Adresa e Email-it *">
                    {t('Email Address *', 'Adresa e Email-it *')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={formErrors.email ? 'error' : ''}
                    data-placeholder-en="Enter your email address"
                    data-placeholder-sq="Shkruani adresën tuaj të email-it"
                    placeholder={t('Enter your email address', 'Shkruani adresën tuaj të email-it')}
                  />
                  {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="phone" data-en="Phone Number *" data-sq="Numri i Telefonit *">
                    {t('Phone Number *', 'Numri i Telefonit *')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className={formErrors.phone ? 'error' : ''}
                    data-placeholder-en="Enter your phone number"
                    data-placeholder-sq="Shkruani numrin tuaj të telefonit"
                    placeholder={t('Enter your phone number', 'Shkruani numrin tuaj të telefonit')}
                  />
                  {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="preferredDate" data-en="Preferred Date *" data-sq="Data e Preferuar *">
                    {t('Preferred Date *', 'Data e Preferuar *')}
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="preferredTime" data-en="Preferred Time *" data-sq="Ora e Preferuar *">
                    {t('Preferred Time *', 'Ora e Preferuar *')}
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" data-en="Select time" data-sq="Zgjidhni orën">
                      {t('Select time', 'Zgjidhni orën')}
                    </option>
                    <option value="9:00" data-en="9:00 AM" data-sq="9:00">
                      {t('9:00 AM', '9:00')}
                    </option>
                    <option value="10:00" data-en="10:00 AM" data-sq="10:00">
                      {t('10:00 AM', '10:00')}
                    </option>
                    <option value="11:00" data-en="11:00 AM" data-sq="11:00">
                      {t('11:00 AM', '11:00')}
                    </option>
                    <option value="14:00" data-en="2:00 PM" data-sq="14:00">
                      {t('2:00 PM', '14:00')}
                    </option>
                    <option value="15:00" data-en="3:00 PM" data-sq="15:00">
                      {t('3:00 PM', '15:00')}
                    </option>
                    <option value="16:00" data-en="4:00 PM" data-sq="16:00">
                      {t('4:00 PM', '16:00')}
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="serviceType" data-en="Service Type *" data-sq="Lloji i Shërbimit *">
                  {t('Service Type *', 'Lloji i Shërbimit *')}
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" data-en="Select service type" data-sq="Zgjidhni llojin e shërbimit">
                    {t('Select service type', 'Zgjidhni llojin e shërbimit')}
                  </option>
                  <option value="initial-consultation" data-en="Initial Consultation" data-sq="Konsultimi Fillestar">
                    {t('Initial Consultation', 'Konsultimi Fillestar')}
                  </option>
                  <option value="manual-therapy" data-en="Manual Therapy" data-sq="Terapia Manuale">
                    {t('Manual Therapy', 'Terapia Manuale')}
                  </option>
                  <option value="exercise-therapy" data-en="Exercise Therapy" data-sq="Terapia e Ushtrimeve">
                    {t('Exercise Therapy', 'Terapia e Ushtrimeve')}
                  </option>
                  <option value="sports-rehab" data-en="Sports Rehabilitation" data-sq="Rehabilitimi Sportiv">
                    {t('Sports Rehabilitation', 'Rehabilitimi Sportiv')}
                  </option>
                  <option value="womens-health" data-en="Women's Health" data-sq="Shëndeti i Gruas">
                    {t('Women\'s Health', 'Shëndeti i Gruas')}
                  </option>
                </select>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="previousInjury"
                    checked={formData.previousInjury}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  <span data-en="I have had a previous injury in this area" data-sq="Kam pasur një lëndim të mëparshëm në këtë zonë">
                    {t('I have had a previous injury in this area', 'Kam pasur një lëndim të mëparshëm në këtë zonë')}
                  </span>
                </label>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="painArea" data-en="Area of Pain/Concern" data-sq="Zona e Dhimbjes/Shqetësimit">
                    {t('Area of Pain/Concern', 'Zona e Dhimbjes/Shqetësimit')}
                  </label>
                  <input
                    type="text"
                    id="painArea"
                    name="painArea"
                    value={formData.painArea}
                    onChange={handleInputChange}
                    data-placeholder-en="e.g., Lower back, shoulder, knee"
                    data-placeholder-sq="p.sh., Pjesa e poshtme e shpinës, supi, gjuri"
                    placeholder={t('e.g., Lower back, shoulder, knee', 'p.sh., Pjesa e poshtme e shpinës, supi, gjuri')}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="urgencyLevel" data-en="Urgency Level" data-sq="Niveli i Urgjencës">
                    {t('Urgency Level', 'Niveli i Urgjencës')}
                  </label>
                  <select
                    id="urgencyLevel"
                    name="urgencyLevel"
                    value={formData.urgencyLevel}
                    onChange={handleInputChange}
                  >
                    <option value="" data-en="Select urgency" data-sq="Zgjidhni urgjencën">
                      {t('Select urgency', 'Zgjidhni urgjencën')}
                    </option>
                    <option value="routine" data-en="Routine" data-sq="Rutinë">
                      {t('Routine', 'Rutinë')}
                    </option>
                    <option value="urgent" data-en="Urgent" data-sq="Urgjent">
                      {t('Urgent', 'Urgjent')}
                    </option>
                    <option value="asap" data-en="As soon as possible" data-sq="Sa më shpejt të jetë e mundur">
                      {t('As soon as possible', 'Sa më shpejt të jetë e mundur')}
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="insuranceProvider" data-en="Insurance Provider" data-sq="Ofrues Sigurimesh">
                  {t('Insurance Provider', 'Ofrues Sigurimesh')}
                </label>
                <input
                  type="text"
                  id="insuranceProvider"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleInputChange}
                  data-placeholder-en="Enter your insurance provider (optional)"
                  data-placeholder-sq="Shkruani ofruesin tuaj të sigurimeve (opsionale)"
                  placeholder={t('Enter your insurance provider (optional)', 'Shkruani ofruesin tuaj të sigurimeve (opsionale)')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="additionalNotes" data-en="Additional Notes" data-sq="Shënime Shtesë">
                  {t('Additional Notes', 'Shënime Shtesë')}
                </label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  rows="4"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  data-placeholder-en="Please describe your symptoms, how the injury occurred, or any other relevant information..."
                  data-placeholder-sq="Ju lutemi përshkruani simptomat tuaja, si ndodhi lëndimi, ose çdo informacion tjetër relevant..."
                  placeholder={t(
                    'Please describe your symptoms, how the injury occurred, or any other relevant information...',
                    'Ju lutemi përshkruani simptomat tuaja, si ndodhi lëndimi, ose çdo informacion tjetër relevant...'
                  )}
                ></textarea>
              </div>

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
              <p data-en="We offer convenient appointment times, including evening and weekend slots." data-sq="Ne ofrojmë orare të përshtatshme takimesh, përfshirë hapësirat e mbrëmjes dhe fundjavës.">
                {t(
                  'We offer convenient appointment times, including evening and weekend slots.',
                  'Ne ofrojmë orare të përshtatshme takimesh, përfshirë hapësirat e mbrëmjes dhe fundjavës.'
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
                <p>+353 1 234 5678</p>
              </div>
              <div className="contact-item">
                <h3 data-en="Email" data-sq="Email-i">
                  {t('Email', 'Email-i')}
                </h3>
                <p>info@flexwellphysio.ie</p>
              </div>
              <div className="contact-item">
                <h3 data-en="Address" data-sq="Adresa">
                  {t('Address', 'Adresa')}
                </h3>
                <p data-en="123 Grafton Street, Dublin 2, Ireland" data-sq="123 Grafton Street, Dublin 2, Irlandë">
                  {t('123 Grafton Street, Dublin 2, Ireland', '123 Grafton Street, Dublin 2, Irlandë')}
                </p>
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