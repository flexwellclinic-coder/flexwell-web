// Language Switching Functionality
class LanguageSwitcher {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMobileMenu();
        this.updateLanguage(this.currentLanguage);
        this.closeDropdownOnClickOutside();
    }

    setupEventListeners() {
        // Desktop language switcher
        const languageToggle = document.getElementById('languageToggle');
        const languageDropdown = document.getElementById('languageDropdown');
        const langOptions = document.querySelectorAll('#languageDropdown .lang-option');

        if (languageToggle) {
            languageToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown('languageDropdown');
            });
        }

        // Mobile language switcher
        const mobileLangToggle = document.getElementById('mobileLangToggle');
        const mobileLangDropdown = document.getElementById('mobileLangDropdown');
        const mobileLangOptions = document.querySelectorAll('#mobileLangDropdown .lang-option');

        if (mobileLangToggle) {
            mobileLangToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown('mobileLangDropdown');
            });
        }

        // Language selection for both desktop and mobile
        const allLangOptions = document.querySelectorAll('.lang-option');
        allLangOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const selectedLang = e.currentTarget.getAttribute('data-lang');
                this.updateLanguage(selectedLang);
                this.closeAllDropdowns();
            });
        });
    }

    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

        if (mobileMenuToggle && mobileMenu) {
            // Toggle mobile menu
            mobileMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });

            // Close mobile menu when clicking on navigation links
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Close mobile menu when window is resized to desktop
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (mobileMenu && mobileMenuToggle) {
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (mobileMenu && mobileMenuToggle) {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    }

    toggleDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        const buttonId = dropdownId === 'languageDropdown' ? 'languageToggle' : 'mobileLangToggle';
        const button = document.getElementById(buttonId);
        
        if (dropdown && button) {
            // Close other dropdown first
            this.closeAllDropdowns();
            
            dropdown.classList.toggle('show');
            button.classList.toggle('active');
        }
    }

    closeAllDropdowns() {
        // Close desktop dropdown
        const dropdown = document.getElementById('languageDropdown');
        const button = document.getElementById('languageToggle');
        
        if (dropdown && button) {
            dropdown.classList.remove('show');
            button.classList.remove('active');
        }

        // Close mobile dropdown
        const mobileDropdown = document.getElementById('mobileLangDropdown');
        const mobileButton = document.getElementById('mobileLangToggle');
        
        if (mobileDropdown && mobileButton) {
            mobileDropdown.classList.remove('show');
            mobileButton.classList.remove('active');
        }
    }

    closeDropdownOnClickOutside() {
        document.addEventListener('click', (e) => {
            const desktopLanguageSwitcher = document.querySelector('.desktop-language .language-switcher');
            const mobileLanguageSwitcher = document.querySelector('.mobile-language .language-switcher');
            
            let clickedInside = false;
            
            if (desktopLanguageSwitcher && desktopLanguageSwitcher.contains(e.target)) {
                clickedInside = true;
            }
            
            if (mobileLanguageSwitcher && mobileLanguageSwitcher.contains(e.target)) {
                clickedInside = true;
            }
            
            if (!clickedInside) {
                this.closeAllDropdowns();
            }
        });
    }

    updateLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);

        // Update button appearance
        this.updateButton(lang);

        // Update all translatable content
        this.updateContent(lang);

        // Update form placeholders
        this.updatePlaceholders(lang);

        // Update page title
        this.updateTitle(lang);

        // Update HTML lang attribute
        document.documentElement.lang = lang === 'sq' ? 'sq' : 'en';
    }

    updateButton(lang) {
        // Update desktop language button
        const flagElement = document.querySelector('#languageToggle .flag');
        const textElement = document.querySelector('#languageToggle .lang-text');

        if (flagElement && textElement) {
            if (lang === 'sq') {
                flagElement.textContent = '🇦🇱';
                textElement.textContent = 'AL';
            } else {
                flagElement.textContent = '🇺🇸';
                textElement.textContent = 'EN';
            }
        }

        // Update mobile language button
        const mobileFlagElement = document.querySelector('#mobileLangToggle .flag');
        const mobileTextElement = document.querySelector('#mobileLangToggle .lang-text');

        if (mobileFlagElement && mobileTextElement) {
            if (lang === 'sq') {
                mobileFlagElement.textContent = '🇦🇱';
                mobileTextElement.textContent = 'AL';
            } else {
                mobileFlagElement.textContent = '🇺🇸';
                mobileTextElement.textContent = 'EN';
            }
        }
    }

    updateContent(lang) {
        const elementsToTranslate = document.querySelectorAll(`[data-${lang}]`);
        
        elementsToTranslate.forEach(element => {
            const translation = element.getAttribute(`data-${lang}`);
            if (translation) {
                // Handle different types of elements
                if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = translation;
                } else if (element.tagName === 'OPTION') {
                    element.textContent = translation;
                } else if (element.tagName === 'TITLE') {
                    element.textContent = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    updatePlaceholders(lang) {
        const placeholderElements = document.querySelectorAll(`[data-placeholder-${lang}]`);
        
        placeholderElements.forEach(element => {
            const placeholder = element.getAttribute(`data-placeholder-${lang}`);
            if (placeholder) {
                element.placeholder = placeholder;
            }
        });
    }

    updateTitle(lang) {
        const titleElement = document.querySelector('title');
        if (titleElement) {
            const translation = titleElement.getAttribute(`data-${lang}`);
            if (translation) {
                titleElement.textContent = translation;
            }
        }
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageSwitcher();
});

// Form submission handler
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentLang = localStorage.getItem('language') || 'en';
            const messages = {
                en: 'Thank you for your request! We will contact you within 24 hours to confirm your appointment.',
                sq: 'Faleminderit për kërkesën tuaj! Ne do t\'ju kontaktojmë brenda 24 orëve për të konfirmuar takimin tuaj.'
            };
            
            alert(messages[currentLang]);
        });
    });
});

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add animation classes when elements come into view
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.team-member, .service-card, .faq-item, .benefit-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}); 