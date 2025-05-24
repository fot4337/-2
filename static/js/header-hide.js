// Скрипт для скрытия хедера при прокрутке на мобильных устройствах
(function() {
  let lastScrollTop = 0;
  const header = document.querySelector('.header');
  const threshold = 50;

  window.addEventListener('scroll', function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop && currentScroll > threshold) {
      // Прокрутка вниз — скрыть хедер
      header.style.transform = 'translateY(-100%)';
    } else {
      // Прокрутка вверх — показать хедер
      header.style.transform = 'translateY(0)';
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }, false);

  // Сбросить позицию хедера при смене ориентации
  window.addEventListener('orientationchange', function() {
    header.style.transform = 'translateY(0)';
    lastScrollTop = 0;
  });

  // Добавить meta viewport, если его нет
  if (!document.querySelector('meta[name="viewport"]')) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(meta);
  }
})();