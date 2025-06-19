// Dark mode toggle functionality
(function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Function to get system preference
    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Function to update button appearance based on current theme
    function updateButtonIcon(theme, isSystemDefault = false) {
        // Set the SVG moon icon
        themeToggle.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="moon-icon">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        `;
        
        if (isSystemDefault) {
            themeToggle.title = `Auto (${theme} mode) - Click to override`;
            themeToggle.style.opacity = '0.7';
        } else {
            themeToggle.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
            themeToggle.style.opacity = '1';
        }
        
        // Set pressed/raised state based on theme
        if (theme === 'dark') {
            themeToggle.classList.add('pressed');
            themeToggle.classList.remove('raised');
        } else {
            themeToggle.classList.add('raised');
            themeToggle.classList.remove('pressed');
        }
    }
    
    // Apply theme and update UI
    function applyTheme(theme, isSystemDefault = false) {
        body.setAttribute('data-theme', theme);
        updateButtonIcon(theme, isSystemDefault);
    }
    
    // Get current theme state
    function getCurrentThemeState() {
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = getSystemTheme();
        
        if (savedTheme) {
            return { theme: savedTheme, isSystemDefault: false };
        } else {
            return { theme: systemTheme, isSystemDefault: true };
        }
    }
    
    // Initial theme application
    const { theme: initialTheme, isSystemDefault: initialIsSystemDefault } = getCurrentThemeState();
    applyTheme(initialTheme, initialIsSystemDefault);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addListener((e) => {
        const savedTheme = localStorage.getItem('theme');
        
        if (!savedTheme) {
            // Following system preference - update immediately
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme(newTheme, true);
        }
        // If there's a saved theme, don't auto-update but the button tooltip will reflect system change
    });
    
    // Enhanced toggle function with three-state logic
    function toggleTheme() {
        const savedTheme = localStorage.getItem('theme');
        const currentTheme = body.getAttribute('data-theme');
        const systemTheme = getSystemTheme();
        
        if (!savedTheme) {
            // Currently following system - first click sets opposite of system
            const newTheme = systemTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme, false);
        } else if (savedTheme === systemTheme) {
            // Manual setting matches system - return to auto mode
            localStorage.removeItem('theme');
            applyTheme(systemTheme, true);
        } else {
            // Manual setting differs from system - toggle to other manual setting
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            if (newTheme === systemTheme) {
                // If toggling back to system preference, remove override
                localStorage.removeItem('theme');
                applyTheme(newTheme, true);
            } else {
                // Stay in manual mode with new theme
                localStorage.setItem('theme', newTheme);
                applyTheme(newTheme, false);
            }
        }
    }
    
    // Add event listener
    themeToggle.addEventListener('click', toggleTheme);
})(); 