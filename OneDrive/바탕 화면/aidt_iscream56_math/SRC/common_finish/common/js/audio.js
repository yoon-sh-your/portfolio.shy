// // audio.js

// const audio_o = new Audio('/common_finish/common/audio/correct.mp3');
// const audio_x = new Audio('/common_finish/common/audio/incorrect.mp3');
// const audio_click = new Audio('/common_finish/common/audio/click.mp3');
// const audio_complete = new Audio('/common_finish/common/audio/complete.mp3');
// const audio_popcorrect = new Audio('/common_finish/common/audio/popcorrect.mp3');
// const audio_star = new Audio('/common_finish/common/audio/star.mp3');

// export function playSound(type) {
//   const audioMap = {
//     o: audio_o,
//     x: audio_x,
//     click: audio_click,
//     complete: audio_complete,
//     pop_o: audio_popcorrect,
//     star: audio_star
//   };
//   const sound = audioMap[type];
//   if (sound) {
//     sound.currentTime = 0;
//     sound.play();
//   }
// }

// window.playSound = playSound;

const AUDIO_PATH = '../../common_finish/common/media/';

const audioCache = {};

export function playSound(type) {
  try {
    const audioFiles = {
      o: 'yes.mp3',
      x: 'no.mp3',
      click: 'click.mp3',
      complete: 'complete.mp3',
      pop_o: 'popcorrect.mp3',
      star: 'star.mp3',
    };

    if (!audioFiles[type]) return;

    if (!audioCache[type]) {
      audioCache[type] = new Audio(AUDIO_PATH + audioFiles[type]);
    }

    const sound = audioCache[type];

    sound.currentTime = 0;

    const playPromise = sound.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn(`오디오 재생 오류 (${type}):`, error);

        if (error.name === 'NotSupportedError') {
          console.log(`오디오 객체 재생성 시도 (${type})...`);
          audioCache[type] = new Audio(AUDIO_PATH + audioFiles[type]);
          audioCache[type].play().catch((e) => console.warn(e));
        }
      });
    }
  } catch (e) {
    console.warn(e);
  }
}

// 전역 노출
window.playSound = playSound;
