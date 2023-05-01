const menuButton = document.querySelector('.main-nav__toggle');
const navigationList = document.querySelector('.main-nav__list');

const onMenuButtonClick = () => {
  menuButton.classList.toggle('main-nav__toggle--open');
  navigationList.classList.toggle('main-nav__list--open');
}

const loadJavaScript = () => {
  const nojs = document.querySelector('.nojs');
  const nojsHeader = document.querySelector('.nojs__header');
  const nojsNavigationButton = document.querySelector('.nojs__toggle');
  const nojsNavigationList = document.querySelector('.nojs__main-nav');

  nojs.classList.remove('nojs');
  nojsHeader.classList.remove('nojs__header');
  nojsNavigationButton.classList.remove('nojs__toggle');
  nojsNavigationList.classList.remove('nojs__main-nav');
};

loadJavaScript();
menuButton.addEventListener('click', onMenuButtonClick);
