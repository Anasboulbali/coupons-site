const Validation = {
    email: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    required: (value) => {
        return value !== null && value !== undefined && value.trim() !== '';
    },

    minLength: (value, min) => {
        return value.length >= min;
    },

    maxLength: (value, max) => {
        return value.length <= max;
    },

    numeric: (value) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    url: (value) => {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    },

    validateForm: (form, rules) => {
        const errors = {};
        
        Object.keys(rules).forEach(field => {
            const value = form[field]?.value;
            const fieldRules = rules[field];

            fieldRules.forEach(rule => {
                if (typeof rule === 'function') {
                    if (!rule(value)) {
                        errors[field] = errors[field] || [];
                        errors[field].push('Invalid value');
                    }
                } else if (typeof rule === 'object') {
                    const { type, message, ...params } = rule;
                    if (!Validation[type](value, params)) {
                        errors[field] = errors[field] || [];
                        errors[field].push(message);
                    }
                }
            });
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
};

window.Validation = Validation;
