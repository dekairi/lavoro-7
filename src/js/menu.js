document.addEventListener("DOMContentLoaded", () => {
  const icon = document.querySelector('.menu-icon');
  const menu = document.querySelector('.menu');
  const mobileWidth = 767;

  if (icon !== null && menu !== null) {
    menu.classList.toggle('menu--closed', window.innerWidth < mobileWidth);
    window.addEventListener('resize', windowResize);
    icon.addEventListener('click', toggle);

    function toggle() {
      menu.classList.toggle('menu--closed');
      icon.classList.toggle('menu-icon--opened');
    }

    function windowResize() {
      menu.classList.toggle('menu--closed', window.innerWidth < mobileWidth);
    }
  }
});
