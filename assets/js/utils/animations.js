const Animations = {
    fadeIn: (element, duration = 300) => {
        element.style.opacity = 0;
        element.style.display = 'block';

        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            
            element.style.opacity = Math.min(progress / duration, 1);

            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    },

    fadeOut: (element, duration = 300) => {
        return new Promise(resolve => {
            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                
                element.style.opacity = Math.max(1 - (progress / duration), 0);

                if (progress < duration) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    },

    slideDown: (element, duration = 300) => {
        element.style.height = '0';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        
        const height = element.scrollHeight;
        element.style.transition = `height ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.height = height + 'px';
        });

        setTimeout(() => {
            element.style.height = '';
            element.style.overflow = '';
            element.style.transition = '';
        }, duration);
    },

    slideUp: (element, duration = 300) => {
        element.style.height = element.scrollHeight + 'px';
        element.style.overflow = 'hidden';
        element.style.transition = `height ${duration}ms ease`;

        requestAnimationFrame(() => {
            element.style.height = '0';
        });

        setTimeout(() => {
            element.style.display = 'none';
            element.style.height = '';
            element.style.overflow = '';
            element.style.transition = '';
        }, duration);
    }
};

window.Animations = Animations;
