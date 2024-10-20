var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
var head = document.getElementsByTagName('HEAD')[0];
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = (isMobile ? 'm.index.css' : 'index.css') + '?v=' + new Date().getTime();
head.appendChild(link);
