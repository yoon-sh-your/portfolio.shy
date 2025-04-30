function resizer(data) {
  var width = window.innerWidth;
  var height = window.innerHeight;
  const ratio = width / 1715;
  const defaultHeight = 764;
  $('#scaleWrapper').css({
    height: `${height / ratio}px`,
    transform: `scale(${ratio})`,
    'transform-origin': '0 0',
  });
}
window.addEventListener('resize', resizer);
resizer(100);
