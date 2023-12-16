// Script for navigation bar

const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if(bar){
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if(close){
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

// ScrollReveal

ScrollReveal({
    // reset: true,
    distance: '80px',
    duration: 2500,
    delay: 400
});

// ScrollReveal().reveal('#header', { delay: 100, origin: 'top'});
ScrollReveal().reveal('#navbar', { delay: 500, origin: 'right'});
ScrollReveal().reveal('.logo', { delay: 500, origin: 'left'});
ScrollReveal().reveal('#hero h4', { delay: 100, origin: 'right'});
ScrollReveal().reveal('#hero h2', { delay: 400, origin: 'right'});
ScrollReveal().reveal('#hero h1', { delay: 400, origin: 'right'});
ScrollReveal().reveal('.sn', { delay: 700, origin: 'right'});

ScrollReveal().reveal('.fe-box:nth-child(1)', { delay: 0, origin: 'right'});
ScrollReveal().reveal('.fe-box:nth-child(2)', { delay: 500, origin: 'right'});
ScrollReveal().reveal('.fe-box:nth-child(3)', { delay: 1000, origin: 'right'});
ScrollReveal().reveal('.fe-box:nth-child(4)', { delay: 1500, origin: 'right'});
ScrollReveal().reveal('.fe-box:nth-child(5)', { delay: 2000, origin: 'right'});
ScrollReveal().reveal('.fe-box:nth-child(6)', { delay: 2500, origin: 'right'});

ScrollReveal().reveal('.pro', { delay: 750, origin: 'right'});

