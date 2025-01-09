// Add this at the end of your main.js file

document.addEventListener('DOMContentLoaded', () => {
    // Add transition effect when leaving the page
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create transition overlay
            const transition = document.createElement('div');
            transition.className = 'page-transition';
            document.body.appendChild(transition);
            
            // Navigate after transition starts
            setTimeout(() => {
                window.location.href = this.href;
            }, 500);
        });
    });

    // Add entrance animation
    window.addEventListener('load', () => {
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        document.body.appendChild(transition);
        
        // Remove transition div after animation
        setTimeout(() => {
            transition.remove();
        }, 1000);
    });
});