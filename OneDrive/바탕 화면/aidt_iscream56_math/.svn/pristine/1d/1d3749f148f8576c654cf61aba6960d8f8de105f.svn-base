runAfterAppReady(() => {
  console.log("custom_answer_check.js 실행");

  const faces = document.querySelectorAll('.scene2 .face');

  faces.forEach(face => {
    face.addEventListener('click', () => {
      const baseItem = document.querySelector('.scene2 .face.base-item');
      let basePairId ;
      const selectedPairId = face.dataset.pairId;

      if(baseItem) { basePairId = baseItem.dataset.pairId;}
        faces.forEach(f => {
          const currentPairId = f.dataset.pairId;
          if( basePairId === selectedPairId ) {
            f.classList.remove('disabled');
            baseItem.classList.remove('base-item');
          } else {
            if (f === face) {
              f.classList.add('base-item');
            } else if (currentPairId !== selectedPairId) {
              f.classList.add('disabled');
            } 
          }
        });
      
    });
  });
  
});
