document.addEventListener('DOMContentLoaded', () => {
    gsap.set('.hero__title, .hero__btn', { opacity: 0, y: 100 });
    gsap.set('.hero__descr, .photos-wrap img, .photos__author', { opacity: 0 });
  
    window.addEventListener('load', () => {
      const timeline = gsap.timeline();
  
    // Главная страница
    timeline
    .to('.hero__title', { duration: 1.1, y: 0, opacity: 1, ease: "power3.out" })
    .to('.hero__btn', { duration: 1.1, y: 0, opacity: 1, ease: "power3.out" }, '-=1')
    .to('.hero__descr', { duration: 1.1, opacity: 1, ease: "power3.out" }, '-=1')
    .to('.photos-wrap img:nth-child(1)', { duration: 1.2, opacity: 1, ease: "power3.out" }, '-=0.8')
    .to('.photos-wrap img:nth-child(2)', { duration: 1.2, opacity: 1, ease: "power3.out" }, '-=0.8')
    .to('.photos-wrap img:nth-child(3)', { duration: 1.2, opacity: 1, ease: "power3.out" }, '-=0.8')
    .to('.photos__author', { duration: 1.2, opacity: 1, ease: "power3.out" }, '-=1');
    });
  
   // Бургер-меню
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.menu');
  const closeBtn = document.querySelector('.close');

  if (burger && menu && closeBtn) {
    const menuTimeline = gsap.timeline({
      paused: true,
      reversed: true,
      onReverseComplete: () => menu.classList.remove('menu--open')
    });

    menuTimeline
      .fromTo('.menu', { opacity: 0 }, { duration: 0.5, opacity: 1, ease: "power3.out" })
      .fromTo('.menu__top', { opacity: 0, y: -50 }, { duration: 0.5, opacity: 1, y: 0, ease: "power3.out" }, '-=0.3')
      .fromTo('.menu__container', { opacity: 0, y: 50 }, { duration: 0.5, opacity: 1, y: 0, ease: "power3.out" }, '-=0.3')
      .fromTo('.menu__nav .nav__item', { opacity: 0, y: 20 }, { duration: 0.5, opacity: 1, y: 0, stagger: 0.1, ease: "power3.out" }, '-=0.3')
      .fromTo('.social', { opacity: 0, y: 20 }, { duration: 0.5, opacity: 1, y: 0, ease: "power3.out" }, '-=0.3')
      .fromTo('.menu__right', { opacity: 0, y: 20 }, { duration: 0.5, opacity: 1, y: 0, ease: "power3.out" }, '-=0.3');

    burger.addEventListener('click', () => {
      if (menuTimeline.reversed()) {
        menu.classList.add('menu--open');
        menuTimeline.play();
      } else {
        menuTimeline.reverse();
      }
    });

    closeBtn.addEventListener('click', () => {
      menuTimeline.reverse();
    });
  }
});
  