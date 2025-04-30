
import  { Receiver } from '../receiver.js'
var mainCurrentAudio;
/**
 * 통신 규약 처리
 */
Receiver.connect().then(function (self) {
    self.send("ready", {});
    self.receive(function ({ data }) {
        if (data) {
            self.setData(data);
            switch (data.command) {
                case "init":
                    if (data.params.volume) {
                        setVolume(parseFloat(data.params.volume)); // 0~100
                    }

                    setVideo(data.params.videoNum);

                    currentLang = data.params.lang;
                    if (currentLang != "kr") {
                        totalChangeTranfer(
                            "MATH",
                            data.params.lang,
                            () => console.log("translateCompleted!"),
                            false
                        );
                    }
                    break;
                case "redraw":
                    if (data.params.inputs) {
                        pushUserData(data.params.inputs);
                    }
                    break;
                case "handwriting":
                    setHandwriting(data.params);
                    break;
                case "capture":
                    setCapture(data.params);
                    break;
                // case "zoom":
                //     resizer(data.params);
                //     break;
                case "volume":
                    if (data.params.value) {
                        setVolume(Number(data.params.value)); // 0~100
                    }
                    break;
            }
        }
    });
});

//시스템 캡쳐화면 전달
function setCapture(params, callback = null) {
    const originalBody = document.body.querySelector("#app_wrap");
    if (typeof params !== "undefined" && params?.type == "printer") {
        $("body").css({ height: document.body.scrollHeight });
    }

    $(originalBody).prepend(`
      <style id='capture'>
        input {
          padding: initial !important;
          letter-spacing: initial !important;
        }
        input:placeholder-shown {
          color: transparent !important;
        }
        .btn {
          box-shadow: initial !important;
        }
      </style>`);

    html2canvas(originalBody).then(function (canvas) {
        $("#capture").remove();

        var data = canvas.toDataURL("image/png");
        if (typeof dev !== "undefined" && dev === true) {
            // 테스트시 이미지 파일로 생성하여 내보내기
            const link = document.createElement("a");
            link.setAttribute(
                "download",
                `IMG_${
                    new Date()
                        .toISOString()
                        .replaceAll("-", "")
                        .replace("T", "_")
                        .replaceAll(":", "")
                        .split(".")[0]
                }.jpg`
            );
            link.setAttribute("href", data.replace("image/png", "image/pjpeg"));
            link.click();
        } else {
            var result = params;
            result.value = data;

            console.log(
                "%c 컨텐츠 %c data: %c" + JSON.stringify(result, null, 2),
                "color:#870070;background:#FF97FF;",
                "color:#1266FF;",
                "color:#AB125E;"
            );
            Receiver.send("image", result);
        }
    });
}

function getCaptureData(callback) {
    // body 요소를 클론하여 보이지 않는 곳에 추가
    const originalBody = document.body.querySelector("#wrap");
    $("#wrap").eq(0).prepend(`
      <style id='capture'>
        input {
          padding: initial !important;
          letter-spacing: initial !important;
        }
        input:placeholder-shown {
          color: transparent !important;
        }
        .btn {
          box-shadow: initial !important;
        }
      </style>`);

    html2canvas(originalBody).then(function (canvas) {
        $("#capture").remove();
        var data = canvas.toDataURL("image/png");
        if (typeof callback === "function") {
            callback(data);
        }

        if (typeof dev !== "undefined" && dev === true) {
            // 테스트시 이미지 파일로 생성하여 내보내기
            const link = document.createElement("a");
            link.setAttribute(
                "download",
                `IMG_${
                    new Date()
                        .toISOString()
                        .replaceAll("-", "")
                        .replace("T", "_")
                        .replaceAll(":", "")
                        .split(".")[0]
                }.jpg`
            );
            link.setAttribute("href", data.replace("image/png", "image/pjpeg"));
            link.click();
        }
    });
}

async function getScreenImage(selector) {
    const target = selector
        ? document.querySelector(selector)
        : document.getElementById("wrap");
    const canvas = await html2canvas(target, {
        allowTaint: true,
        useCORS: true,
    });
    return canvas.toDataURL("image/png");
}

/**
 * 브라우저 종료시 실행
 */
window.addEventListener("beforeunload", function (e) {
    Receiver.close();
});


// system volume 값 이벤트
let systemVolume = 1;
export function setVolume(volume) {
  // Recevier 에서 받은 볼륨 으로 설정 (0 ~ 100)
  window.volume = volume / 100;
  console.log('change vol : ', window.volume);
  // audioObjects.forEach((audio) => {
  //   setAudioVolume(audio);
  //   console.log('change vol : ', audio.volume);
  // });
  // setAudioVolume(mainCurrentAudio);

}

function setAudioVolume(audio) {
  if (!audio) {
    return;
  }

  let defaultVol = 1;
  if (audio.src) {
    const url = new URL(audio.src);
    const params = url.searchParams;
    const vol = params.get('vol');
    if (null != vol) {
      defaultVol = parseFloat(vol);
    }
  }
  audio.volume = defaultVol * systemVolume;
}

// 모든 Audio 객체를 추적할 배열
const audioObjects = [];

export function initAudioSystem() {
  // 원래 Audio 생성자를 보존
  const OriginalAudio = window.Audio;

  // Audio 생성자를 대체하는 래퍼 생성자
  function WrappedAudio(...args) {
    const audioInstance = new OriginalAudio(...args);
    // 재생 이벤트 리스너 추가
      audioInstance.addEventListener('play', () => {
      setAudioVolume(audioInstance);
      // console.log(`Audio with src ${audioInstance.src} is playing.`);
      mainCurrentAudio = audioInstance;
    });
    return audioInstance;
  }

  // window.Audio를 래퍼로 대체
  window.Audio = WrappedAudio();
}

export function initAudioObject() {
  const audioElements = document.querySelectorAll('audio');
  audioElements.forEach((audio) => {
    // console.log('HTML Audio Element:', audio);
    audioObjects.push(audio);
    audio.addEventListener('play', () => {
      setAudioVolume(audio);
      // console.log(`Audio with src ${audio.src} is playing.`);
      mainCurrentAudio = audio;
    });
  });

  for (let key in window) {
    if (window[key]?.tagName == 'AUDIO') {
      // console.log(`Found Audio object: ${key}`, window[key]);
      audioObjects.push(window[key]);
      window[key].addEventListener('play', () => {
        setAudioVolume(window[key]);
        // console.log(`Audio with src ${window[key].src} is playing.`);
        mainCurrentAudio = window[key];
      });
    }
  }
}

function isConnectedPlaform() {
  if (Object.keys(Receiver.data).length == 0) {
    return false;
  } else {
    return true;
  }
}

// 플랫폼에서 비디오 번호 셋팅
function setVideo(num) {
    if (!num || num == 0) {
    }
    else {
        $('.video_wrap .play').data('video', num);
        $('.btn-play-video .play').data('video', num);
    }
}

$('.video_wrap .play, .btn-play-video .play').off().on('click', function () {
    var result = {};
    result.caliper = {
      'EVENT_TYPE': 'NavigationEvent',
      'PROFILE_TYPE': 'MediaProfile',
      'ACTION_TYPE': 'NavigatedTo',
      'OBJ_NAME': '영상보기'
    };
    result.isVideo = true;
    result.videoNum = $(this).data('video');
    console.log("%c 컨텐츠 %c data: %c" + JSON.stringify(result, null, 2), "color:#870070;background:#FF97FF;", "color:#1266FF;", "color:#AB125E;");
    Receiver.send('button', result);
});

window.setVolume = setVolume;