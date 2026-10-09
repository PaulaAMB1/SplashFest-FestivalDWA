(function () {
    'use strict';

    var STORAGE_KEY = 'splashfest-tema';
    var root = document.documentElement; 

    function getSavedTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            
        }
    }

    function getInitialTheme() {
        var saved = getSavedTheme();
        if (saved === 'light' || saved === 'dark') {
            return saved;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'dark'; 
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);

        var button = document.querySelector('.theme-toggle');
        if (button) {
            var isDark = theme === 'dark';
            button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            button.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
        }
    }

    
    applyTheme(getInitialTheme());

    
    document.addEventListener('DOMContentLoaded', function () {
        var button = document.querySelector('.theme-toggle');
        if (!button) {
            return;
        }

        applyTheme(root.getAttribute('data-theme'));

        button.addEventListener('click', function () {
            var current = root.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            saveTheme(next);
        });
    });
})();