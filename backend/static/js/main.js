// Main JavaScript file for Fit & Flare Studio

$(document).ready(function() {
    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();
    
    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000);
        }
    });
    
    // Add scroll effect to navigation
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('header').addClass('nav-sticky shadow-lg');
        } else {
            $('header').removeClass('nav-sticky shadow-lg');
        }
    });
    
    // Initialize animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    $('section').each(function() {
        observer.observe(this);
    });
});

// Utility functions
function showLoadingSpinner(element) {
    element.html('<div class="spinner mx-auto"></div>');
}

function hideLoadingSpinner(element, content) {
    element.html(content);
}

function showNotification(message, type = 'success') {
    const notification = $(`
        <div class="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white">
            ${message}
        </div>
    `);
    
    $('body').append(notification);
    
    setTimeout(() => {
        notification.fadeOut(function() {
            $(this).remove();
        });
    }, 3000);
}

// API helper functions
function apiCall(url, method = 'GET', data = null) {
    const settings = {
        url: url,
        method: method,
        contentType: 'application/json',
        beforeSend: function(xhr) {
            const token = localStorage.getItem('access_token');
            if (token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
        }
    };
    
    if (data) {
        settings.data = JSON.stringify(data);
    }
    
    return $.ajax(settings);
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Image lazy loading
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
$(document).ready(lazyLoadImages);
