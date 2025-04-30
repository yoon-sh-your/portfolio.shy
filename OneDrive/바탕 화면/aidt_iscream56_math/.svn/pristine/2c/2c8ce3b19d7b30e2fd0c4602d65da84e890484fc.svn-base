runAfterAppReady(() => {
  const container = document.getElementById('app_wrap');
  if (!container) return;

  const scaleAttr = container.dataset.rulerScale;
  const targetScale = parseFloat(scaleAttr || '1');

  if (!scaleAttr || isNaN(targetScale)) return;

  let lastChangeTime = Date.now();

  const interval = setInterval(() => {
    const ruler = document.querySelector('.obj_ruler');
    if (!ruler) return;

    const transform = ruler.style.transform;

    const hasRotate = /rotate\([^)]+\)/.test(transform);
    const hasScale = /scale\([^)]+\)/.test(transform);

    if (hasRotate && !hasScale) {
      ruler.style.transform = `${transform} scale(${targetScale})`;
      lastChangeTime = Date.now();
      console.log('[RULER-FIX] Re-applied scale →', ruler.style.transform);
    }

    if (!hasRotate && !hasScale) {
      ruler.style.transform = `scale(${targetScale})`;
      lastChangeTime = Date.now();
      console.log('[RULER-FIX] Initial scale applied');
    }

    // // 사용자가 10초 동안 회전을 안 하면 감시 종료
    // if (Date.now() - lastChangeTime > 10000) {
    //   clearInterval(interval);
    //   console.log('[RULER-FIX] Monitoring stopped due to inactivity');
    // }
  }, 30);
});
