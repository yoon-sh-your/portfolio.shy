var mainCurrentAudio;
var userValues = {
    isHandwritingClick: false,
    handwriting: undefined,
};

/**
 * 통신 규약 처리
 */

var currentLang = "kr";

var userValues = {
    isHandwritingClick: false,
    handwriting: undefined,
    returnType: undefined,
    solveCount: 1,
    inputs: [],
    canvasData: {},
    isCorrect: false,
    isEmpty: true,
    message: "",
};

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

    const clone = originalBody.cloneNode(true);
    clone.classList.add("capture");
    clone.style.position = "absolute";
    clone.style.top = "-99999px";
    clone.style.left = "-99999px";
    clone.style.transform = "scale(1)";
    clone.style.height = `${$("#app_wrap").height()}px`;

    document.body.appendChild(clone);

    html2canvas(clone, {
        allowTaint: true,
        useCORS: true,
        logging: true,
        profile: true,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
    }).then(function (canvas) {
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

async function getScreenImage(selector) {
    const target = selector
        ? document.querySelector(selector)
        : document.getElementById("app_wrap");

    const clone = target.cloneNode(true);
    clone.classList.add("capture");
    clone.style.position = "absolute";
    clone.style.top = "-99999px";
    clone.style.left = "-99999px";
    clone.style.transform = "scale(1)";
    clone.style.height = `${$("#app_wrap").height()}px`;

    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, {
        allowTaint: true,
        useCORS: true,
        logging: true,
        profile: true,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
    });

    $("#capture").remove();
    const data = canvas.toDataURL("image/png");
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
    return data;
}

//필기값 처리
function setHandwriting(data) {
    userValues.isHandwritingClick = false;
    if (userValues.handwriting) {
        var $handwriting = $(userValues.handwriting);
        console.log("data:", data, " / data.isLatex:", data.isLatex);

        if (data && data.isLatex) {
            if (
                $handwriting
                    .find("math-field, input, textarea")
                    .addBack()
                    .is("math-field, input, textarea")
            ) {
                var latex = data.string.replace(/[$]/gim, "");

                if (userValues.handwriting.tagName == "MATH-FIELD") {
                    let txt = userValues.handwriting.getValue() + data.string;
                    userValues.handwriting.setValue(txt).trigger("input");
                }

                // else {
                //     $handwriting.attr("data-userlatex", data.string);
                //     $handwriting.text(`$$${latex}$$`);
                // }
            } else {
                // 사용 예시
                const plainText = getPlainTextFromLatex(data.string);
                console.log("변환 결과:", plainText);
                $handwriting.attr("data-userlatex", data.string);
                $handwriting.text(plainText);
            }
        } else {
            // 숫자만 입력하는 타입인 경우 키보드에서와 동일하게 처리
            let checkDataNumbr = $handwriting
                .parent()
                .addBack()
                .find("[data-number]"); //$handwriting.find('[data-number]').addBack();
            if (checkDataNumbr.length > 0) {
                data.string = data.string
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*)\./g, "$1");
            }

            var txt = $handwriting.val();
            if ($handwriting.tagName == "MATH-FIELD") {
                txt = $handwriting.getValue("plain-text") + data.string;
                $handwriting.setValue(txt).trigger("input");
            } else {
                txt += data.string;
                $handwriting.val(txt).trigger("input");
                $handwriting.attr("value", txt);
            }
        }
    }
}

//필기 기능 실행
function sendHandwriting(dom) {
    userValues.handwriting = dom;
    var result = {};
    result.caliper = {
        EVENT_TYPE: "NavigationEvent",
        PROFILE_TYPE: "AssessmentProfile",
        ACTION_TYPE: "NavigatedTo",
        OBJ_NAME: "필기인식",
    };
    result.isHandwriting = true;
    console.log(
        "%c 컨텐츠 %c data: %c" + JSON.stringify(result, null, 2),
        "color:#870070;background:#FF97FF;",
        "color:#1266FF;",
        "color:#AB125E;"
    );
    Receiver.send("button", result);
}

function getPlainTextFromLatex(latexStr) {
    // 보이지 않는 컨테이너 생성
    const container = document.createElement("div");
    container.style.cssText =
        "position:absolute;left:-9999px;width:0;height:0;overflow:hidden;";
    document.body.appendChild(container);

    // mathfield 생성 및 설정
    const mfe = new MathfieldElement();
    container.appendChild(mfe);
    mfe.value = latexStr;

    // 값 가져오기
    const result = mfe.getValue("plain-text");

    // 정리
    container.remove();

    return result;
}

//필기값 처리
function setHandwriting(data) {
    $("input, textarea").removeAttr("readonly");

    userValues.isHandwritingClick = false;
    if (userValues.handwriting) {
        var $handwriting = $(userValues.handwriting);
        console.log("data:", data, " / data.isLatex:", data.isLatex);

        if (data && data.isLatex) {
            var latex = data.string.replace(/[$]/gim, "");
            // $handwriting.attr('data-userlatex', data.string);
            // $handwriting.text(`$$${latex}$$`);
            let value = $handwriting.getValue();
            $handwriting.setValue(value + `$$${latex}$$`);
        } else {
            if (userValues.handwriting.tagName == "MATH-FIELD") {
                let value = userValues.handwriting.getValue();
                userValues.handwriting.setValue(value + data.string);
            } else {
                var txt = $handwriting.val() + data.string;
                $handwriting.val(txt);
                $handwriting.attr("value", txt);
            }
        }
    }
}

//필기 기능 실행
function sendHandwriting(dom) {
    $("input, textarea").attr("readonly", true);

    userValues.handwriting = dom;
    var result = {};
    result.caliper = {
        EVENT_TYPE: "NavigationEvent",
        PROFILE_TYPE: "AssessmentProfile",
        ACTION_TYPE: "NavigatedTo",
        OBJ_NAME: "필기인식",
    };
    result.isHandwriting = true;
    console.log(
        "%c 컨텐츠 %c data: %c" + JSON.stringify(result, null, 2),
        "color:#870070;background:#FF97FF;",
        "color:#1266FF;",
        "color:#AB125E;"
    );
    Receiver.send("button", result);
}

/**
 * 브라우저 종료시 실행
 */
window.addEventListener("beforeunload", function (e) {
    Receiver.close();
});

// system volume 값 이벤트
let systemVolume = 1;
function setVolume(volume) {
    // Recevier 에서 받은 볼륨 으로 설정 (0 ~ 100)
    systemVolume = volume / 100;
    audioObjects.forEach((audio) => {
        setAudioVolume(audio);
        console.log("change vol : ", audio.volume);
    });
    setAudioVolume(mainCurrentAudio);
}

function setAudioVolume(audio) {
    if (!audio) {
        return;
    }

    let defaultVol = 1;
    if (audio.src) {
        const url = new URL(audio.src);
        const params = url.searchParams;
        const vol = params.get("vol");
        if (null != vol) {
            defaultVol = parseFloat(vol);
        }
    }
    audio.volume = defaultVol * systemVolume;
}

// 모든 Audio 객체를 추적할 배열
const audioObjects = [];

function initAudioSystem() {
    // 원래 Audio 생성자를 보존
    const OriginalAudio = window.Audio;

    // Audio 생성자를 대체하는 래퍼 생성자
    function WrappedAudio(...args) {
        const audioInstance = new OriginalAudio(...args);
        // 재생 이벤트 리스너 추가
        audioInstance.addEventListener("play", () => {
            setAudioVolume(audioInstance);
            // console.log(`Audio with src ${audioInstance.src} is playing.`);
            mainCurrentAudio = audioInstance;
        });
        return audioInstance;
    }

    // window.Audio를 래퍼로 대체
    window.Audio = WrappedAudio();
}

function initAudioObject() {
    const audioElements = document.querySelectorAll("audio");
    audioElements.forEach((audio) => {
        // console.log('HTML Audio Element:', audio);
        audioObjects.push(audio);
        audio.addEventListener("play", () => {
            setAudioVolume(audio);
            // console.log(`Audio with src ${audio.src} is playing.`);
            mainCurrentAudio = audio;
        });
    });

    for (let key in window) {
        if (window[key]?.tagName == "AUDIO") {
            // console.log(`Found Audio object: ${key}`, window[key]);
            audioObjects.push(window[key]);
            window[key].addEventListener("play", () => {
                setAudioVolume(window[key]);
                // console.log(`Audio with src ${window[key].src} is playing.`);
                mainCurrentAudio = window[key];
            });
        }
    }
}

function isConnectedPlaform() {
    if (typeof dev !== "undefined" && dev === true) {
        return true;
    }
    if (Object.keys(Receiver.data).length == 0) {
        return false;
    } else {
        return true;
    }
}

// 플랫폼에서 비디오 번호 셋팅
function setVideo(num) {
    if (!num || num == 0) {
    } else {
        $(".video_wrap .play").data("video", num);
        $(".btn-play-video .play").data("video", num);
    }
}

function initUDL() {
    // tabindex 없어야할 곳: 예시 부분이 opacity: 0으로 되어 있어서 포커스가 안가게 처리
    $(".example_box").attr("tabindex", "-1");

    // 정오답확인 버튼 영역 active class 없는 경우, 생기는 경우 체크하여 disable 처리
    // Observe changes to the class attribute for specific buttons
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            if (
                mutation.type === "attributes" &&
                mutation.attributeName === "class"
            ) {
                const target = mutation.target;
                if (
                    $(target).hasClass("btnReset") ||
                    $(target).hasClass("btnSubmit") ||
                    $(target).hasClass("btnCheck") ||
                    $(target).hasClass("btnSample")
                ) {
                    if ($(target).hasClass("active")) {
                        $(target).prop("disabled", false);
                    } else {
                        $(target).prop("disabled", true);
                    }
                }
            }
        });
    });

    // Select buttons to observe
    const buttons = document.querySelectorAll(
        ".btnReset, .btnSubmit, .btnCheck, .btnSample"
    );
    buttons.forEach((button) => {
        // Initial check for active class
        if (!button.classList.contains("active")) {
            button.disabled = true;
        }
        // Start observing for class changes
        observer.observe(button, { attributes: true });
    });
}

function initSendResultEvent() {
    $(".video_wrap .play, .btn-play-video .play")
        .off()
        .on("click", function () {
            var result = {};
            result.caliper = {
                "EVENT_TYPE": "NavigationEvent",
                "PROFILE_TYPE": "MediaProfile",
                "ACTION_TYPE": "NavigatedTo",
                "OBJ_NAME": "영상보기",
            };
            result.isVideo = true;
            result.videoNum = $(this).data("video");
            console.log(
                "%c 컨텐츠 %c data: %c" + JSON.stringify(result, null, 2),
                "color:#870070;background:#FF97FF;",
                "color:#1266FF;",
                "color:#AB125E;"
            );
            Receiver.send("button", result);
        });

    $(".btn_area .btnReset").on("click", function () {
        var result = {};
        result.caliper = {
            "EVENT_TYPE": "NavigationEvent",
            "PROFILE_TYPE": "AssessmentProfile",
            "ACTION_TYPE": "NavigatedTo",
            "OBJ_NAME": "다시하기",
        };
        result.isReset = true;
        console.log(
            "%c 컨텐츠 %c data: %c" + JSON.stringify(result, null, 2),
            "color:#870070;background:#FF97FF;",
            "color:#1266FF;",
            "color:#AB125E;"
        );
        Receiver.send("button", result);
    });

    $(".btn_area .btnSubmit, .btnCheck").on("click", async function () {
        var type = $(this).attr("class").split(" ")[0];
        // 체크일 경우 카운트가 1일때만 전송
        if(type === 'btnCheck' && globalFaultCount === 0) {
            return;
        }

        var result = {};
        result.caliper = {
            "EVENT_TYPE": "NavigationEvent",
            "PROFILE_TYPE": "AssessmentProfile",
            "ACTION_TYPE": "NavigatedTo",
            "OBJ_NAME": type === "btnSubmit" ? "제출하기" : "확인하기",
        };
        result.isSubmit = true;
        var $page_result = [];

        if ($(".contents ").hasClass("paging_layout")) {
            // 슬라이드 페이지로 구성되어있을 경우 페이지별 input값들을 조회
            $(".page").each(function (pageIndex, page) {
                $page_result[pageIndex] = inputDataSet(page);
                $.extend(result || {}, {
                    inputs: JSON.stringify($page_result),
                });
            });
        } else {
            $.extend(result || {}, {
                inputs: JSON.stringify(inputDataSet()),
            });
        }

        if (type === "btnSubmit") {
            result.capture = await getScreenImage();
            console.log(
                "%c 컨텐츠 %c data: %c" + JSON.stringify(result, null, 2),
                "color:#870070;background:#FF97FF;",
                "color:#1266FF;",
                "color:#AB125E;"
            );
            Receiver.send("button", result);
            return;
        }
        console.log(
            "%c 컨텐츠 %c data: %c" + JSON.stringify(result, null, 2),
            "color:#870070;background:#FF97FF;",
            "color:#1266FF;",
            "color:#AB125E;"
        );
        Receiver.send("button", result);
    });
}

function inputDataSet(page) {
    var $input_result = [];
    $input_result[0] = [];
    $input_result[1] = [];
    $input_result[2] = [];
    $input_result[3] = [];
    $input_result[4] = [];

    // 생존가방 drop
    const $dropped = $(".droppable_bag .draggable_bag.already-dropped");

    // 수 카드 drag and drop
    const $cardDraggables = $(".card.draggable");
    const $cardDroppables = $(".card.droppable");

    // 도형 이어 붙이기
    const $dropArea = $(".drop_area");

    // 슬라이드 페이지
    if (page !== undefined) {
        $(page)
            .find("input")
            .each(function (index, item) {
                $input_result[0][index] = $(item).val();
            });

        $(page)
            .find("textarea")
            .each(function (index, item) {
                $input_result[1][index] = $(item).val();
            });

        $(page)
            .find("math-field")
            .each(function (index, item) {
                $input_result[2][index] = item.getValue("plain-text");
            });

        // 생존 가방 드래그앤드롭
        if ($dropped.length !== 0) {
            $input_result[4] = setDraggableBag(page, $dropped);
        }

        // 도형별 드래그앤드롭 / 꽃병 담기
        if ($(".draggable_wrap").length !== 0) {
            $input_result[4] = setDiagramDraggables(page);
        }

        // 도형 이어 붙이기
        if ($dropArea.length !== 0) {
            $input_result[4] = setDiagramPiece(page);
        }

        if ($(".dragndrop_fraction_wrap").length !== 0) {
            $input_result[4] = setFractionWrap(page);
        }
    } else {
        // 단일 페이지
        $("input").each(function (index, item) {
            $input_result[0][index] = $(item).val();
        });

        $(".contents .input_wrap")
            .find("textarea")
            .each(function (index, item) {
                $input_result[1][index] = $(item).val();
            });

        $(".contents .input_wrap")
            .find("math-field")
            .each(function (index, item) {
                $input_result[2][index] = item.getValue("plain-text");
            });

        // 수 카드 드래그앤드랍
        if ($cardDraggables.length !== 0) {
            $input_result[4] = setDraggableCard(
                $cardDraggables,
                $cardDroppables
            );
        }

        if ($(".dragndrop_fraction_wrap").length !== 0) {
            $input_result[4] = setFractionWrap(null);
        }
    }

    $input_result[3][0] = getSaveCanvasInstanceJson();

    var inputTxt = {
        inputText: $input_result[0],
        inputArea: $input_result[1],
        inputMathArea: $input_result[2],
        inputDraw: $input_result[3],
        dragAndDrop: $input_result[4],
    };
    console.log(inputTxt);
    return inputTxt;
}

function setFractionWrap(page) {
    // drag_drop 공통
    const $fractionWrap = $(".dragndrop_fraction_wrap");
    var draggable_result = [];
    if (page === null) {
        var dragItems = [];
        var dropItems = [];

        // 드래그 목록
        $($fractionWrap)
            .find(".drag_group .drag_item")
            .each(function (index, item) {
                const value = $(item).data("value");
                dragItems.push(value);
            });

        // 드랍 목록
        $($fractionWrap)
            .find(".drop_item")
            .each(function (index, item) {
                const value = $(item).data("value");
                dropItems.push(value);
            });
        draggable_result[0] = {
            drag: dragItems,
            drop: dropItems,
        };
        return draggable_result;
    } else {
        const dragItems = [];
        const dropItems = [];
        $(page)
            .find(".dragndrop_fraction_wrap")
            .each(function (index, item) {
                // 드래그 아이템
                const $dragItem = $(this).find(".drag_group .drag_item");
                $dragItem.each(function () {
                    dragItems.push($(this).data("value"));
                });

                const $dropItem = $(this).find(".drop_group .drop_item");
                $dropItem.each(function () {
                    dropItems.push($(this).data("value"));
                });

                draggable_result[index] = {
                    drag: dragItems,
                    drop: dropItems,
                };
            });

        return draggable_result;
    }
}

// 도형 이어붙이기 dnd 데이터
function setDiagramPiece(page) {
    var draggable_result = [];

    const dragItems = [];
    const dropItems = [];

    $(page)
        .find(".drop_area")
        .each(function (index, item) {
            $(page)
                .find(".peace_img1.cutting")
                .each(function (index, item) {
                    const img1 = $(item).find("img");
                    const alt1 = img1.attr("alt");
                    dragItems.push(alt1 + 1);
                });

            $(page)
                .find(".peace_img2.cutting")
                .each(function (index, item) {
                    const img2 = $(item).find("img");
                    const alt2 = img2.attr("alt");
                    dragItems.push(alt2 + 2);
                });
            $(page)
                .find(".drop_area .peace_img")
                .each(function (index, item) {
                    const $piece = $(item);
                    const itemData =
                        $piece.data("id") + " : " + $piece.attr("style");
                    dropItems.push(itemData);
                });

            draggable_result[index] = {
                drag: dragItems,
                drop: dropItems,
            };
        });
    return draggable_result;
}
function setDiagramDraggables(page) {
    var draggable_result = [];
    $(page)
        .find(".drag_share, .drag_checkout")
        .each(function (index, item) {
            const $DiagramDraggables = $(item).find(".draggable_wrap");
            const $DiagramDroppables = $(item).find(".drag_group");

            const dragItems = [];
            $DiagramDraggables.each(function () {
                $(this)
                    .find(".draggable")
                    .each(function () {
                        const classList = this.className.split(" ");
                        dragItems.push(classList[1]);
                    });
            });

            const dropItems = [];
            $DiagramDroppables.each(function (index) {
                //EMA512_02_SU_0003의 꽃병 나누어 담기의 경우 예시로 주어진 g0은 응답에서 제외
                if (this.className.includes("g0")) {
                    return true;
                }

                if ($(this).find(".droppable1").length === 0) {
                    var tempList = [];
                    $(this)
                        .children("div")
                        .each(function () {
                            var dataValue = $(this).data("value");
                            if (dataValue !== undefined) {
                                tempList.push(dataValue);
                            } else {
                                // var classNameList = $(this).attr("class").split(" ");
                                // tempList.push(classNameList[1]);
                                tempList.push(null);
                            }
                        });
                    dropItems[index] = tempList;
                } else {
                    // EMA516_04_SU_0004의 경우 드랍 그룹이 2개로 구분되어있음
                    const drop1Items = [];
                    const drop2Items = [];
                    $(this)
                        .find(".droppable.droppable1.ui-droppable")
                        .children("div")
                        .each(function () {
                            var classNameList = $(this)
                                .attr("class")
                                .split(" ");
                            drop1Items.push(classNameList[1]);
                        });
                    $(this)
                        .find(".droppable.droppable2.ui-droppable")
                        .children("div")
                        .each(function () {
                            var classNameList = $(this)
                                .attr("class")
                                .split(" ");
                            drop2Items.push(classNameList[1]);
                        });
                    dropItems.push(drop1Items);
                    dropItems.push(drop2Items);
                }
            });

            draggable_result[index] = {
                drag: dragItems,
                drop: dropItems,
            };
        });

    return draggable_result;
}
function setDraggableCard($cardDraggables, $cardDroppables) {
    var dragItems = [];
    var dropItems = [];
    var draggable_result = [];

    $cardDraggables.each(function (index) {
        dragItems.push(`obj${index}`);
    });
    $cardDroppables.each(function () {
        const src = $(this).find("img").attr("src");
        const fileName = src.split("/").pop();
        const match = fileName.match(/_(.*?)\.png$/);
        dropItems.push(match[1]);
    });
    draggable_result[0] = {
        drop: dropItems,
        drag: dragItems,
    };
    return draggable_result;
}
function setDraggableBag(page, $dropped) {
    var draggable_result = [];
    var dropCount = setItemCountTable($dropped);

    if (page !== null) {
        $(page)
            .find(".drag_wrap")
            .each(function (index, item) {
                const $draggable = $(item).find("div.text_box");
                const dragItems = [];
                $draggable.each(function (j, span) {
                    const lines = $(span)
                        .text()
                        .trim()
                        .split("\n")
                        .map((line) => line.trim());
                    for (let i = 0; i < lines.length; i += 2) {
                        const itemName = lines[i]; // 예: "담요 2개"
                        const weight = lines[i + 1]; // 예: "3000 g"
                        if (itemName && weight) {
                            const merged = `${itemName} ${weight.replace(
                                " ",
                                ""
                            )}`; // "3000g"
                            dragItems.push(merged);
                        }
                    }
                });
                draggable_result[index] = {
                    drop: dropCount,
                    drag: dragItems,
                };
            });
    } else {
        $(".drag_wrap").each(function (index, item) {
            const $draggable = $(item).find("div.text_box");
            const dragItems = [];
            $draggable.each(function (j, span) {
                const lines = $(span)
                    .text()
                    .trim()
                    .split("\n")
                    .map((line) => line.trim());
                for (let i = 0; i < lines.length; i += 2) {
                    const itemName = lines[i];
                    const weight = lines[i + 1];

                    if (itemName && weight) {
                        const merged = `${itemName} ${weight.replace(" ", "")}`; // "3000g"
                        dragItems.push(merged);
                    }
                }
            });
            draggable_result[index] = {
                drop: dropCount,
                drag: dragItems,
            };
        });
    }

    return draggable_result;
}

// 생존가방 drop목록 조회
function setItemCountTable(dropped) {
    // 항목별 카운트 저장
    const itemCounts = {};

    dropped.each(function () {
        const $item = $(this);
        const styleValue = $("li.draggable_bag").attr("style");
        const $nameSpan = $item.find(".text_box span[lang='y']");
        const fullText = $nameSpan.text().trim(); // 예: 라디오 1개
        const name = fullText.split(" ")[0]; // 첫 번째 단어만 사용 (예: "라디오")
        // 해당 이름이 없으면 배열 초기화
        if (!itemCounts[name]) {
            itemCounts[name] = [];
        }

        // style 값 추가
        itemCounts[name].push(styleValue);
    });
    return itemCounts;
}

$(document).ready(function () {
    initUDL();
    initSendResultEvent();
});
