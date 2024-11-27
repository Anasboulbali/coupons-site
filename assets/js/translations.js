// assets/js/translations.js

const translations = {
    en: {
        verified: "Verified",
        copy: "Copy Code",
        copied: "Copied!",
        copyError: "Failed to copy code",
        search: {
            placeholder: "Search for stores or deals..."
        }
    },
    fr: {
        verified: "Vérifié",
        copy: "Copier le code",
        copied: "Copié !",
        copyError: "Échec de la copie",
        search: {
            placeholder: "Rechercher des magasins ou des offres..."
        }
    }
};

let currentLanguage = 'en';

function changeLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    
    // Update active state of language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${lang}-btn`).classList.add('active');
    
    // Reload coupons to update text
    loadCoupons();
}

function initializeLanguage() {
    changeLanguage('en');
}
