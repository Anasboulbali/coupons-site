const Storage = {
    set: (key, value, expiry = null) => {
        const item = {
            value,
            timestamp: new Date().getTime()
        };

        if (expiry) {
            item.expiry = expiry;
        }

        localStorage.setItem(key, JSON.stringify(item));
    },

    get: (key) => {
        const item = localStorage.getItem(key);
        
        if (!item) return null;

        const { value, timestamp, expiry } = JSON.parse(item);

        if (expiry && new Date().getTime() - timestamp > expiry) {
            localStorage.removeItem(key);
            return null;
        }

        return value;
    },

    remove: (key) => {
        localStorage.removeItem(key);
    },

    clear: () => {
        localStorage.clear();
    }
};

window.Storage = Storage;
