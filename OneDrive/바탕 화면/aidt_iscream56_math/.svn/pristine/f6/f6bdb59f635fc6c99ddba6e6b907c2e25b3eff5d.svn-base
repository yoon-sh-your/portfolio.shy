var ui = [];
var canvasInstances = [];

const box_width = 240;
const box_height = 240;

const bubble_box_width = 200;
const bubble_box_height = 170;

const close_button_width = 24;
const close_button_height = 24;

const DEFAULT_TEXT = "입력하세요."

const minScaleLimit = 1.0;

const OBJECT_DELETE_MODE = false; // default 오브젝트 지우기시 true, 픽셀단위로 지우기시 false

var deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

var cloneIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 55.699 55.699' width='100px' height='100px' xml:space='preserve'%3E%3Cpath style='fill:%23010002;' d='M51.51,18.001c-0.006-0.085-0.022-0.167-0.05-0.248c-0.012-0.034-0.02-0.067-0.035-0.1 c-0.049-0.106-0.109-0.206-0.194-0.291v-0.001l0,0c0,0-0.001-0.001-0.001-0.002L34.161,0.293c-0.086-0.087-0.188-0.148-0.295-0.197 c-0.027-0.013-0.057-0.02-0.086-0.03c-0.086-0.029-0.174-0.048-0.265-0.053C33.494,0.011,33.475,0,33.453,0H22.177 c-3.678,0-6.669,2.992-6.669,6.67v1.674h-4.663c-3.678,0-6.67,2.992-6.67,6.67V49.03c0,3.678,2.992,6.669,6.67,6.669h22.677 c3.677,0,6.669-2.991,6.669-6.669v-1.675h4.664c3.678,0,6.669-2.991,6.669-6.669V18.069C51.524,18.045,51.512,18.025,51.51,18.001z M34.454,3.414l13.655,13.655h-8.985c-2.575,0-4.67-2.095-4.67-4.67V3.414z M38.191,49.029c0,2.574-2.095,4.669-4.669,4.669H10.845 c-2.575,0-4.67-2.095-4.67-4.669V15.014c0-2.575,2.095-4.67,4.67-4.67h5.663h4.614v10.399c0,3.678,2.991,6.669,6.668,6.669h10.4 v18.942L38.191,49.029L38.191,49.029z M36.777,25.412h-8.986c-2.574,0-4.668-2.094-4.668-4.669v-8.985L36.777,25.412z M44.855,45.355h-4.664V26.412c0-0.023-0.012-0.044-0.014-0.067c-0.006-0.085-0.021-0.167-0.049-0.249 c-0.012-0.033-0.021-0.066-0.036-0.1c-0.048-0.105-0.109-0.205-0.194-0.29l0,0l0,0c0-0.001-0.001-0.002-0.001-0.002L22.829,8.637 c-0.087-0.086-0.188-0.147-0.295-0.196c-0.029-0.013-0.058-0.021-0.088-0.031c-0.086-0.03-0.172-0.048-0.263-0.053 c-0.021-0.002-0.04-0.013-0.062-0.013h-4.614V6.67c0-2.575,2.095-4.67,4.669-4.67h10.277v10.4c0,3.678,2.992,6.67,6.67,6.67h10.399 v21.616C49.524,43.26,47.429,45.355,44.855,45.355z'/%3E%3C/svg%3E%0A"

var deleteImg = document.createElement('img');
deleteImg.src = deleteIcon;

var cloneImg = document.createElement('img');
cloneImg.src = cloneIcon;

var saveJson = null;


fabric.Object.prototype.borderDashArray = [5, 5];
fabric.Object.prototype.borderColor = '#808080';
fabric.Object.prototype.borderScaleFactor = 2;

fabric.Object.prototype.setControlsVisibility({
    mt: false,
    mb: false,
    ml: false,
    mr: false,
    bl: false,
    br: true,
    tl: false,
    tr: true,
    mtr: false,
});

const DRAW_OBJECTS = {
    PEN: "pen",
    LINE: "line",
    SQUARE: "square",
    CIRCLE: "circle",
    TRIANGLE: "triangle",
    BALLOON: "balloon",
    PENTAGON: "pentagon",
    STAR: "star",
    HEART: "heart",
    N_OBJECT: "n_object",
    TEXTBOX: "textbox"
}

let drawingInfo = {
    type : null,
    thickness : 10,
    color : '#000000',
    opacity : 1,
    isDash : false,
    strokeDashArray : [5, 5],
    isFill : false,
}

document.addEventListener("keyup", function (e) {
    if (this.isDeletingMode == true) {
        if (e.key == 'Delete' | e.key == 'Backspace') {
            deleteObjectOne(canvas);
        }
    }
});

runAfterAppReady(function() {
    ui.paletteItem = $('.tool-row.palette-item');
    ui.penModeButton = $('.tool-row.function-item .ic_pen');

    ui.deleteAllButton = $('.tool-row.function-item .ic_del');

    ui.toolButtons = $('.tool-row.function-item').first().find('button');
    
    ui.shapeButtons = $('.tool-row.function-item').eq(1).find('button');

    // 세 번째 function-item 그룹의 버튼들 선택
    ui.lineStyleButtons = $('.tool-row.function-item:eq(2) .ic_line, .tool-row.function-item:eq(2) .ic_dash');
    ui.strokeFillButtons = $('.tool-row.function-item:eq(2) .ic_draw, .tool-row.function-item:eq(2) .ic_pull');
     
    ui.thicknessNode = $('.tool-row.range-item input[name="thickness"]');
    ui.opacityNode = $('.tool-row.range-item input[name="opacity"]');

    ui.undoButton = $('.tool-row.function-item .ic_undo');
    ui.redoButton = $('.tool-row.function-item .ic_redo');
    
    initCanvas();
});

function initCanvas() {
    initThickness();
    initOpacity();
    
    canvasInstances = [];

    const canvases = $("#contents canvas");

    canvases.each(function (index, value) {
        console.log(index, value);

        var fabricCanvasObj = window._canvas = new fabric.Canvas(value, {
            preserveObjectStacking: true,
            // hoverCursor: 'url(../images/icon/icon_cursor.svg), auto',  // 마우스 커서
        });
        fabricCanvasObj.selection = false;
        canvasInstances.push(fabricCanvasObj);

        // 초기 init시 캔버스 비활성화
        $('.canvas-container').css('pointer-events', 'none');
    })
    
    console.log(canvasInstances);

    // 그리기 버튼 클릭 이벤트
    $('.btn_draw').on('click', function() {
        console.log('그리기 버튼 클릭됨');
        $('.draw-tool-wrap').addClass('show');
        $('.canvas-container').css('pointer-events', '');
        init_drawPopup();
    });

    canvasInstances.forEach(canvas => {
        canvas.isDrawingMode = true;

        // undo, redo status
        let history = [];
        let redoStack = [];
        let isUndoing = false;

        function saveInitialState() {
            history.push(JSON.stringify(canvas));
        }
        saveInitialState();

        function saveState() {
            if (!isUndoing) {
                redoStack = [];
                history.push(JSON.stringify(canvas));
            }
        }

        // Undo stack
        function undo() {
            if (history.length > 1) {
                redoStack.push(history.pop());
                let prevState = history[history.length - 1];

                isUndoing = true; // 🔹 이벤트 차단 시작
                canvas.loadFromJSON(prevState, () => {
                    canvas.renderAll();
                    isUndoing = false;
                });
            } else {
                console.log("더 이상 실행 취소할 수 없습니다.");
            }
        }

        // Redo stack
        function redo() {
            if (redoStack.length > 0) {
                let nextState = redoStack.pop();
                history.push(nextState);

                isUndoing = true;
                canvas.loadFromJSON(nextState, () => {
                    canvas.renderAll();
                    isUndoing = false;
                });
            }
        }

        canvas.on('object:modified', function () {
            if (!isUndoing) {
                saveState();
            }
        });

        canvas.on('object:added', function (e) {
            console.log("object:added", e);

            if (drawingInfo.type === DRAW_OBJECTS.PEN) {
                // path:created
                return;
            }

            if (!isUndoing) {
                saveState();
            }
        });

        canvas.on('path:created', function (e) {
            console.log("path:created", e);

            if (!isUndoing) {
                saveState();
            }
        });
        // undo, redo status

        canvas.on('mouse:down', function (options) {
            if (canvas.isDeletingMode === true) {
                // deleteObject(canvas, options);
                if (OBJECT_DELETE_MODE) {
                    containDeleteObject(canvas, options);
                }                
            }

            // if (chkAns_1 == "Y") {
            //     setTimeout(function () {
            //         pageComplete();
            //     }, 300);
            // }

            var groupItems;
            if (options.target) {
                var thisTarget = options.target;
                var mousePos = canvas.getPointer(options.e);
                var editTextbox = false;
                var editObject;

                if (thisTarget.isType('group')) {
                    var groupPos = {
                        x: thisTarget.left,
                        y: thisTarget.top
                    }

                    thisTarget.forEachObject(function (object, i) {
                        if (object.type == "textbox") {
                            var matrix = thisTarget.calcTransformMatrix();
                            var newPoint = fabric.util.transformPoint({y: object.top, x: object.left}, matrix);
                            var objectPos = {
                                xStart: newPoint.x - (object.width * object.scaleX) / 2,//When OriginX and OriginY are centered, otherwise xStart: newpoint.x - object.width * object.scaleX etc...
                                xEnd: newPoint.x + (object.width * object.scaleX) / 2,
                                yStart: newPoint.y - (object.height * object.scaleY) / 2,
                                yEnd: newPoint.y + (object.height * object.scaleY) / 2
                            }

                            if ((mousePos.x >= objectPos.xStart && mousePos.x <= objectPos.xEnd) && (mousePos.y >= objectPos.yStart && mousePos.y <= objectPos.yEnd)) {
                                function ungroup(group) {
                                    groupItems = group._objects;
                                    group._restoreObjectsState();
                                    canvas.remove(group);
                                    for (var i = 0; i < groupItems.length; i++) {
                                        if (groupItems[i] != "textbox") {
                                            groupItems[i].selectable = false;
                                        }
                                        canvas.add(groupItems[i]);
                                    }
                                    canvas.renderAll();
                                }

                                ungroup(thisTarget);
                                canvas.setActiveObject(object);

                                object.enterEditing();
                                object.selectAll();

                                editObject = object;
                                var exitEditing = true;

                                editObject.on('editing:exited', function (options) {
                                    if (exitEditing) {
                                        var items = [];
                                        groupItems.forEach(function (obj) {
                                            console.log(obj);

                                            items.push(obj);
                                            canvas.remove(obj);
                                        });

                                        var grp
                                        grp = new fabric.Group(items, {});
                                        canvas.add(grp);
                                        grp.setControlsVisibility({
                                            mt: false,
                                            mb: false,
                                            ml: false,
                                            mr: false,
                                            bl: false,
                                            br: true,
                                            tl: false,
                                            tr: true,
                                            mtr: false,
                                        });

                                        grp.minScaleLimit = minScaleLimit;


                                        exitEditing = false;
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });


        // 그리기 팝업 닫기
        $('.close_but').click(function () {
            $('.pop_box').css('display', 'none');
            $('.draw-tool-wrap').removeClass('show');

            canvas.selected = false;
            canvas.discardActiveObject();
            canvas.renderAll();

            $('.canvas-container').css('pointer-events', 'none');
        });


        // 그리기 팝업
        $('.btn_draw').click(function () {
            console.log('그리기 팝업');
            $('.draw-tool-wrap').addClass('show');
            
            $('.canvas-container').css('pointer-events', '');

            // setDrawStyle();
            init_drawPopup();
            // setDrawingMode(drawingInfo.type);
        });

        window.addEventListener('resize', () => {
            setCursor();
        });

        function setSelectedFigureAriaLabel(selectBtn, allReset = false) {
            const $figure = $(selectBtn).parents().find(".figure");
            const buttons = $figure.find(`button`);
  
            if (allReset) {
                Array.from(buttons).forEach(btn => {
                    btn.setAttribute('aria-label', $(btn).children().text()); // ir에 있는 값으로 재설정
                });
            }
            else {
                Array.from(buttons).forEach(btn => {
                    if (btn !== selectBtn) {
                        btn.setAttribute('aria-label', $(btn).children().text()); // ir에 있는 값으로 재설정
                    }
                });
                $(selectBtn).attr('aria-label', `${$(selectBtn).children().text()} 선택됨`);
            }
        }

        function setSelectedInputRadioAriaLabel(selectedRadio) {
            const groupName = $(selectedRadio).attr("name");
            const $drawTool = $(selectedRadio).parents().find(".drawTool");
            const radios = $drawTool.find(`input[type="radio"][name="${groupName}"]`);
  
            Array.from(radios).forEach(radio => {              
              if (radio !== selectedRadio) {
                radio.setAttribute('aria-label', $(radio).next().text()); // ir에 있는 값으로 재설정
              }
            });
            
            $(selectedRadio).attr('aria-label', `${$(selectedRadio).next().text()} 선택됨`);
        }

        function setDrawingInfo() {
            const color = getColor();
            console.log('색상:', color);

            const thickness = getThickness();
            console.log('두께:', thickness);

            const opacity = getOpacity();
            console.log('투명도:', opacity);     

            drawingInfo.thickness = thickness;
            drawingInfo.color = color;
            drawingInfo.opacity = opacity;
        }

        ui.toolButtons.on('click', function() {
            // 다른 모든 버튼의 active 클래스 제거
            ui.toolButtons.removeClass('active');
            
            // 클릭된 버튼에만 active 클래스 추가
            $(this).addClass('active');
            
            // 클릭된 버튼의 타입 확인 (pen, txt, eraser)
            const buttonType = $(this).attr('class').split('_')[1].split(' ')[0];
            console.log('Selected tool:', buttonType);
            
            // 여기서 필요한 drawing 모드 변경 로직 추가
            switch(buttonType) {
                case 'pen':
                    setDeleteMode(false);
                    canvas.isDrawingMode = true;
                
                    setDrawStyle(DRAW_OBJECTS.PEN);
                    // setDrawingMode(DRAW_OBJECTS.PEN);

                    ui.toolButtons.removeClass('inactive');
                    ui.toolButtons.prop('disabled', false);

                    ui.shapeButtons.removeClass('inactive');
                    ui.shapeButtons.prop('disabled', false);

                    ui.lineStyleButtons.removeClass('inactive');
                    ui.lineStyleButtons.prop('disabled', false);

                    ui.strokeFillButtons.removeClass('inactive');
                    ui.strokeFillButtons.prop('disabled', false);

                    ui.paletteItem.children().each(function (index, palette) {
                        $(palette).removeClass('inactive');
                        $(palette).prop('disabled', false);
                    });

                    ui.thicknessNode.removeClass('inactive');
                    ui.thicknessNode.prop('disabled', false);

                    ui.opacityNode.removeClass('inactive');
                    ui.opacityNode.prop('disabled', false);
                    break;
                case 'txt':
                    setDeleteMode(false);
                    canvas.isDrawingMode = true;

                    setDrawStyle(DRAW_OBJECTS.TEXTBOX);
                    // setDrawingMode(DRAW_OBJECTS.TEXTBOX);

                    ui.shapeButtons.removeClass('active');
                    ui.shapeButtons.addClass('inactive');
                    ui.shapeButtons.prop('disabled', true);

                    ui.lineStyleButtons.removeClass('active');
                    ui.lineStyleButtons.addClass('inactive');
                    ui.lineStyleButtons.prop('disabled', true);

                    ui.strokeFillButtons.removeClass('active');
                    ui.strokeFillButtons.addClass('inactive');
                    ui.strokeFillButtons.prop('disabled', true);

                    ui.thicknessNode.removeClass('inactive');
                    ui.thicknessNode.prop('disabled', false);

                    ui.opacityNode.removeClass('inactive');
                    ui.opacityNode.prop('disabled', false);

                    break;
                case 'eraser':
                    // 지우개 모드 활성화
                    setDeleteMode(true);

                    if (OBJECT_DELETE_MODE) {
                        canvas.isDrawingMode = false;
                    } else {
                        canvas.isDrawingMode = true;
                    }

                    ui.shapeButtons.removeClass('active');
                    ui.shapeButtons.addClass('inactive');
                    ui.shapeButtons.prop('disabled', true);

                    ui.lineStyleButtons.removeClass('active');
                    ui.lineStyleButtons.addClass('inactive');
                    ui.lineStyleButtons.prop('disabled', true);

                    ui.strokeFillButtons.removeClass('active');
                    ui.strokeFillButtons.addClass('inactive');
                    ui.strokeFillButtons.prop('disabled', true);

                    ui.paletteItem.children().each(function (index, palette) {
                        $(palette).addClass('inactive');
                        $(palette).prop('disabled', true);
                    });

                    ui.thicknessNode.removeClass('active');
                    ui.thicknessNode.addClass('inactive');
                    ui.thicknessNode.prop('disabled', true);
                    
                    ui.opacityNode.removeClass('active');
                    ui.opacityNode.addClass('inactive');
                    ui.opacityNode.prop('disabled', true);
                    break;
            }
        });

        ui.shapeButtons.on('click', function() {
            const $clicked = $(this);
            const shapeType = $clicked.attr('class').split('_')[1].split(' ')[0];
            
            // 같은 버튼을 다시 클릭한 경우
            if ($clicked.hasClass('active')) {
                $clicked.removeClass('active');

                // startDraw(DRAW_OBJECTS.PEN);
                setDrawStyle(DRAW_OBJECTS.PEN);
            } else {
                // 다른 도형 버튼들의 active 상태 제거
                ui.shapeButtons.removeClass('active');
                // 현재 버튼 active 설정
                $clicked.addClass('active');
                
                // 도형 타입에 따른 드로잉 모드 설정
                switch(shapeType) {
                    case 'triangle':
                        // startDraw(DRAW_OBJECTS.TRIANGLE);
                        setDrawStyle(DRAW_OBJECTS.TRIANGLE);
                        break;
                    case 'square':
                        // startDraw(DRAW_OBJECTS.SQUARE);
                        setDrawStyle(DRAW_OBJECTS.SQUARE);
                        break;
                    case 'circle':
                        // startDraw(DRAW_OBJECTS.CIRCLE);
                        setDrawStyle(DRAW_OBJECTS.CIRCLE);
                        break;
                    case 'polygon':
                        // startDraw(DRAW_OBJECTS.N_OBJECT);
                        setDrawStyle(DRAW_OBJECTS.N_OBJECT);
                        break;
                }
            }
        });

        // 선 스타일 버튼 토글 (line/dash)
        ui.lineStyleButtons.on('click', function () {
            const $clicked = $(this);
            // 같은 그룹 내 다른 버튼의 active 제거
            ui.lineStyleButtons.removeClass('active');
            // 클릭된 버튼에 active 추가
            $clicked.addClass('active');

            setDrawStyle(drawingInfo.type, false);

            // 선 스타일 설정
            const isLine = $clicked.hasClass('ic_line');
            const isDash = $clicked.hasClass('ic_dash');

            const isDraw = $clicked.hasClass('ic_draw');
            const isPull = $clicked.hasClass('ic_pull');

            if (isLine) {
                // 실선 스타일 적용
                changeStrokeStyle(false);

                if (isDraw) {
                    // 그리기 모드 활성화
                    changeColorCanvasObject(drawingInfo.color);
                } else if (isPull) {
                    // 끌기 모드 활성화
                    changeFillColorCanvasObject(drawingInfo.color);
                }
            } else if (isDash) {
                // 점선 스타일 적용
                changeStrokeStyle(true);

                if (isDraw) {
                    // 그리기 모드 활성화
                    changeColorCanvasObject(drawingInfo.color);
                } else if (isPull) {
                    // 끌기 모드 활성화
                    changeFillColorCanvasObject(drawingInfo.color);
                }
            }
        });

        // 그리기 모드 버튼 토글 (draw/pull)
        ui.strokeFillButtons.on('click', function () {
            const $clicked = $(this);
            // 같은 그룹 내 다른 버튼의 active 제거
            ui.strokeFillButtons.removeClass('active');
            // 클릭된 버튼에 active 추가
            $clicked.addClass('active');

            setDrawStyle(drawingInfo.type, false);

            // 그리기 모드 설정
            const isDraw = $clicked.hasClass('ic_draw');
            const isPull = $clicked.hasClass('ic_pull');

            if (isDraw) {
                // 그리기 모드 활성화
                changeColorCanvasObject(drawingInfo.color);
            } else if (isPull) {
                // 끌기 모드 활성화
                changeFillColorCanvasObject(drawingInfo.color);
            }
        });

        function setDrawingMode(drawObjetType) {
            canvas.isDrawingMode = true;
            canvas.isDeletingMode = false;
            setDrawingInfo();

            startDraw(drawObjetType);
            setSelectedFigureAriaLabel(this);
        }

        ui.deleteAllButton.on("click", function () {
            canvas.isDrawingMode = true;
            canvas.isDeletingMode = false;

            canvas.clear();
        });

        canvas.on('object:added', function () {
            const canvasParent = $(canvas.lowerCanvasEl).closest(".drawing");
            $(canvasParent).removeClass('placeholder');
            $(canvasParent).find(".btn_return").show();
            $(canvasParent).find(".btn_answer").addClass("on"); // 7/26 정답버튼 on

            const multiCanvas  = $('.multiDraw .drawing');
            if(multiCanvas.length > 0) {
                $('.btnArea').find(".btn_return").show();
                $('.btnArea').find(".btn_answer").addClass("on");  // 7/26 정답버튼 off
            }

            canvasInstances.forEach(innerCanvas => {
                if(innerCanvas !== canvas) {
                    innerCanvas.discardActiveObject();
                    innerCanvas.renderAll();
                }
            })
        });

        canvas.on('object:removed', function () {
            var objectCount = getCanvasObjectLength(canvas);
            if (objectCount < 1) {
                // $(element).find('.guide_txt').show();

                const canvasParent = $(canvas.lowerCanvasEl).closest(".drawing");
                $(canvasParent).addClass('placeholder');
                $(canvasParent).find(".btn_return").hide();
                $(canvasParent).find(".btn_answer").removeClass("on");  // 7/26 정답버튼 off

                const multiCanvas  = $('.multiDraw .drawing');
                if(multiCanvas.length > 0) {
                    if($('.multiDraw .drawing.placeholder').length == multiCanvas.length){
                        $('.btnArea').find(".btn_return").hide();
                        $('.btnArea').find(".btn_answer").removeClass("on");  // 7/26 정답버튼 off
                    }
                }
            }
        });

        canvas.on('selection:created', function(e) {            
            canvasInstances.forEach(innerCanvas => {
                if(innerCanvas !== canvas) {
                    innerCanvas.discardActiveObject();
                    innerCanvas.renderAll();
                }
            })
        });

        function getCanvasObjectLength(fabricCanvas) {
            var countObjects = 0;
            countObjects = countObjects + fabricCanvas.getObjects().length;

            return countObjects;
        }

        $('.tool-row.function-item .ic_eraser').on("click", function () {
            setDeleteMode(true);

            if (OBJECT_DELETE_MODE) {
                canvas.isDrawingMode = false;
            } else {
                canvas.isDrawingMode = true;
            }
            
            $('.drawArea .figure button').removeClass("on");
            setSelectedFigureAriaLabel($(this).prev().find("button")[0], true);
        });

        $('.thickness input').on('click', function () {
            canvas.isDrawingMode = true;
            canvas.isDeletingMode = false;
            const thickness = parseInt(this.value);
            console.log('두께:', thickness);
            const color = $('.color  input[name=color]:checked').val();
            console.log('색상:', color);

            canvas.isDrawingMode = true;

            console.log('thickness input', canvas);

            drawingInfo.thickness = thickness;
            drawingInfo.color = color;

            startDraw(DRAW_OBJECTS.PEN);

            setSelectedInputRadioAriaLabel(this);
        });

        $('.color input').on('click', function () {
            const color = this.value;
            console.log('색상:', color);
            const thickness = parseInt($('.thickness input[name=thick]:checked').val());
            console.log('두께:', thickness);

            console.log('color input', canvas);

            if (canvas.freeDrawingBrush instanceof fabric.PencilBrush) {
                canvas.isDrawingMode = true;
                canvas.isDeletingMode = false;

                drawingInfo.thickness = thickness;
                drawingInfo.color = color;

                startDraw(DRAW_OBJECTS.PEN);

            } else {
                if (isDeleteMode()) {
                    canvas.isDrawingMode = true;
                    canvas.isDeletingMode = false;

                    drawingInfo.thickness = thickness;
                    drawingInfo.color = color;

                    startDraw(DRAW_OBJECTS.PEN);
                } else {
                    const selected = canvas.getActiveObjects();
                    if (selected.length) {
                        selected[0].set({fill: color});
                        selected[0].set({stroke: color});
                        canvas.renderAll();
                        console.log('selected', selected);
                    }

                    canvas.isDrawingMode = false;
                }
            }

            setSelectedInputRadioAriaLabel(this);
        });

        // 7/7 수정추가: .btn_return위치가 다를 경우,예외처리
        $('.btn_return').on("click", function () {
            const canvasParent = $(canvas.lowerCanvasEl).closest(".drawing");
            let returnButton = $(canvasParent).find(".btn_return");

            if(canvasParent.parent().hasClass('multiDraw')){
                returnButton = $('.drawArea').siblings('.btnArea').find('.btn_return');
            }
            if(canvasParent.closest('.pop-up').length > 0){
                returnButton = canvasParent.closest('.pop-up').find('.btn_return.btn');
            }

            if (returnButton) {
                if (returnButton[0] === this) {
                    canvas.isDeletingMode = false;
                    canvas.isDrawingMode = true;
                    canvas.clear();
                }
            }
        });
        //////////////////////////////////////////////////


        // 그리기 객체 모듈
        
        function startDraw(type, src = null) {
            const self = this;
            canvas.isDrawingMode = true;
            drawingInfo.type = type;

            const colorAndOpacity = getColorWithOpacity(drawingInfo.color, drawingInfo.opacity);

            switch (type) {
                case DRAW_OBJECTS.PEN:
                    const pencilBrush = new fabric.PencilBrush(canvas);
                    pencilBrush.color = colorAndOpacity;
                    pencilBrush.width = drawingInfo.thickness;
                    if(drawingInfo.isDash) {
                        pencilBrush.strokeDashArray = [drawingInfo.thickness / 2, drawingInfo.thickness * 2];
                    } else {        
                        pencilBrush.strokeDashArray = null;
                    }
                    canvas.freeDrawingBrush = pencilBrush;
                    
                    break;
                case DRAW_OBJECTS.LINE:
                    canvas.freeDrawingBrush = new fabric.LinePath(canvas, {
                        strokeWidth: drawingInfo.thickness,     // 선 굵기, 미설정시 기본값 2
                        color: colorAndOpacity,    // 선 색상, 미설정시 기본값 #000000
                        strokeDashArray: drawingInfo.isDash ? drawingInfo.strokeDashArray : null, // 점선 스타일, 미설정시 기본값 없음
                    });
                    break;
                case DRAW_OBJECTS.SQUARE:
                    canvas.freeDrawingBrush = new fabric.RoundedRect(canvas, {
                        width: 100,             // 너비, 미설정시 기본값 100
                        height: 100,            // 높이, 미설정시  기본값 100
                        strokeWidth: drawingInfo.thickness,         // 선 굵기, 미설정시 기본값 2
                        color: colorAndOpacity,       // 선 색상, 미설정시 기본값 #000000
                        radius: 0,              // 사각형 끝 둥근 정도, 미설정시 기본값 10
                        strokeDashArray: drawingInfo.isDash ? drawingInfo.strokeDashArray : null, // 점선 스타일, 미설정시 기본값 없음
                    });
                    break;
                case DRAW_OBJECTS.CIRCLE:
                    canvas.freeDrawingBrush = new fabric.CirclePath(canvas, {
                        width: 50,                 // 원 반지름, 미설정시 기본값 50
                        strokeWidth: drawingInfo.thickness,             // 선 굵기, 미설정시 기본값 2
                        strokeColor: colorAndOpacity,     // 선 색상, 미설정시 기본값 #000000
                        strokeDashArray: drawingInfo.isDash ? drawingInfo.strokeDashArray : null, // 점선 스타일, 미설정시 기본값 없음
                    });
                    break;
                case DRAW_OBJECTS.TRIANGLE:
                    canvas.freeDrawingBrush = new fabric.TrianglePath(canvas, {
                        width: 100,                 // 정삼각형 너비, 미설정시 기본값 100
                        strokeWidth: drawingInfo.thickness,             // 선 굵기, 미설정시 기본값 2
                        strokeColor: colorAndOpacity,     // 선 색상, 미설정시 기본값 #000000
                        strokeDashArray: drawingInfo.isDash ? drawingInfo.strokeDashArray : null, // 점선 스타일, 미설정시 기본값 없음
                    });
                    break;
                case DRAW_OBJECTS.BALLOON:
                    canvas.freeDrawingBrush = new fabric.BalloonTextBox(canvas, {
                        strokeWidth: 1,
                        imageUrl: '../../common_project/common/img/tool_drawing/bubble_11.svg',
                        isDirectCenter: false,
                    });
                    break;
                case DRAW_OBJECTS.PENTAGON:
                    canvas.freeDrawingBrush = new fabric.PentagonPath(canvas, {
                        width: 50,              // 원하는 너비의 절반(반지름), 미설정시 기본값 50
                        strokeWidth: drawingInfo.thickness,         // 선 굵기, 미설정시 기본값 2
                        strokeColor: colorAndOpacity, // 선 색상, 미설정시 기본값 #000000
                        strokeDashArray: drawingInfo.isDash ? drawingInfo.strokeDashArray : null, // 점선 스타일, 미설정시 기본값 없음
                    });
                    break;
                case DRAW_OBJECTS.STAR:
                    canvas.freeDrawingBrush = new fabric.StarPath(canvas, {
                        width: 50,              // 원하는 너비의 절반(반지름), 미설정시 기본값 50
                        strokeWidth: drawingInfo.thickness,         // 선 굵기, 미설정시 기본값 2
                        strokeColor: colorAndOpacity, // 선 색상, 미설정시 기본값 #000000
                        strokeDashArray: drawingInfo.isDash ? drawingInfo.strokeDashArray : null, // 점선 스타일, 미설정시 기본값 없음
                    });
                    break;
                case DRAW_OBJECTS.HEART:
                    canvas.freeDrawingBrush = new fabric.HeartPath(canvas, {
                        width: 100,                 // 원하는 너비, 미설정시 기본값 100
                        strokeWidth: drawingInfo.thickness,             // 선 굵기, 미설정시 기본값 2
                        strokeColor: colorAndOpacity,     // 선 색상, 미설정시 기본값 #000000
                        strokeDashArray: drawingInfo.isDash ? drawingInfo.strokeDashArray : null, // 점선 스타일, 미설정시 기본값 없음
                    });
                    break;
                case DRAW_OBJECTS.N_OBJECT:
                    canvas.freeDrawingBrush = new fabric.NdegreePolygonPath(canvas, {
                        sides: polygonNum,
                        width: 50, // 원하는 너비의 절반(반지름)
                        strokeWidth: drawingInfo.thickness,
                        strokeColor: colorAndOpacity,
                        strokeDashArray: drawingInfo.isDash ? drawingInfo.strokeDashArray : null, // 점선 스타일, 미설정시 기본값 없음
                    });
                    break;

                case DRAW_OBJECTS.TEXTBOX:
                    canvas.freeDrawingBrush = new fabric.CreateTextBox(canvas);
                    break;
                default:
                    const defaultBrush = new fabric.PencilBrush(canvas);
                    defaultBrush.color = colorAndOpacity;
                    defaultBrush.width = drawingInfo.thickness;
                    if(drawingInfo.isDash) {
                        pencilBrush.strokeDashArray = drawingInfo.strokeDashArray;
                    } else {        
                        pencilBrush.strokeDashArray = null;
                    }
                    canvas.freeDrawingBrush = defaultBrush;
                    drawingInfo.type = DRAW_OBJECTS.PEN;
                    break;
            }

            setCursor();
        }


        
        $(ui.thicknessNode).on("input", function () {
            changeStrokeThicknessStyle(parseInt($(this).val()));
        });

        $(ui.opacityNode).on("input", function () {
            changeOpacityStyle( 1 - $(this).val());
        });


        $(ui.undoButton).on("click", function () {
            undo();
        });
        
        $(ui.redoButton).on("click", function () {
            redo();
        });

        ui.paletteItem.children().each(function (index, palette) {
            $(palette).off("click").on("click", function () {
                ui.paletteItem.children().removeClass("active");
                $(this).addClass("active");
    
                const color = getColor();
                console.log('색상:', color);
    
                const opacity = getOpacity();
                console.log('투명도:', opacity);

                drawingInfo.color = color;
                drawingInfo.opacity = opacity;

                const isLine = ui.lineStyleButtons.filter('.ic_line').hasClass('active');
                const isDash = ui.lineStyleButtons.filter('.ic_dash').hasClass('active');

                const isDraw = ui.strokeFillButtons.filter('.ic_draw').hasClass('active');
                const isPull = ui.strokeFillButtons.filter('.ic_pull').hasClass('active');

                //setDrawingMode(drawingInfo.type);
                setDrawStyle(drawingInfo.type, false);
                const colorAndOpacity = getColorWithOpacity(color, opacity);

                if (isLine) {
                    // 실선 스타일 적용
                    changeStrokeStyle(false);

                    if (isDraw) {
                        // 그리기 모드 활성화
                        changeColorCanvasObject(drawingInfo.color);
                    } else if (isPull) {
                        // 끌기 모드 활성화
                        changeFillColorCanvasObject(drawingInfo.color);
                    }
                } else if (isDash) {
                    // 점선 스타일 적용
                    changeStrokeStyle(true);

                    if (isDraw) {
                        // 그리기 모드 활성화
                        changeColorCanvasObject(drawingInfo.color);
                    } else if (isPull) {
                        // 끌기 모드 활성화
                        changeFillColorCanvasObject(drawingInfo.color);
                    }
                }
            });
        });

        // 팝업 꺼지고 다시 켜졌을때 버튼 초기화
        function init_drawPopup() {
            // 펜 모드 활성화
            setDrawStyle(DRAW_OBJECTS.PEN);
            // setDrawingMode(DRAW_OBJECTS.PEN);

            ui.toolButtons.removeClass('active');
            ui.penModeButton.addClass('active');
            ui.toolButtons.removeClass('inactive');
            ui.toolButtons.prop('disabled', false);

            ui.shapeButtons.removeClass('active');
            ui.shapeButtons.removeClass('inactive');
            ui.shapeButtons.prop('disabled', false);

            ui.lineStyleButtons.removeClass('active');
            ui.lineStyleButtons.removeClass('inactive');
            ui.lineStyleButtons.prop('disabled', false);

            ui.strokeFillButtons.removeClass('active');
            ui.strokeFillButtons.removeClass('inactive');
            ui.strokeFillButtons.prop('disabled', false);

            ui.paletteItem.children().each(function (index, palette) {
                $(palette).removeClass('inactive');
                $(palette).prop('disabled', false);
            });

            ui.thicknessNode.removeClass('inactive');
            ui.thicknessNode.prop('disabled', false);

            ui.opacityNode.removeClass('inactive');
            ui.opacityNode.prop('disabled', false);
        }

        function setDrawStyle(drawingType, isSetTool = true) {

            drawingInfo.type = drawingType || DRAW_OBJECTS.PEN;

            const thickness = getThickness();
            console.log('두께:', thickness);

            drawingInfo.thickness = thickness;
          
            const color = getColor();
            console.log('색상:', color);

            const opacity = getOpacity();
            console.log('투명도:', opacity);

            const colorAndOpacity = getColorWithOpacity(color, opacity);

            drawingInfo.color = color;
            drawingInfo.opacity = opacity;

            const isLine = ui.lineStyleButtons.filter('.ic_line').hasClass('active');
            const isDash = ui.lineStyleButtons.filter('.ic_dash').hasClass('active');

            const isDraw = ui.strokeFillButtons.filter('.ic_draw').hasClass('active');
            const isPull = ui.strokeFillButtons.filter('.ic_pull').hasClass('active');

            drawingInfo.isDash = false;
            if (isLine) {
                // 실선 스타일 적용
                drawingInfo.isDash = false;

                if(drawingInfo.type === DRAW_OBJECTS.PEN) {
                    strokeDashArray = [5, 5];
                } else {
                    strokeDashArray = [5, 5];
                }
            } else if (isDash) {
                // 점선 스타일 적용
                drawingInfo.isDash = true;
            }

            drawingInfo.isFill = false
            if (isDraw) {
                // 그리기 모드 활성화
                drawingInfo.isFill = false;
            } else if (isPull) {
                // 끌기 모드 활성화
                drawingInfo.isFill = true;
            }

            if (isSetTool) {
                startDraw(drawingInfo.type);
            }

            if(isLine || isDash && isDraw || isPull) { // isSetTool false 여도 선 스타일 또는 채우기 선색 이 들어오면 스타일 변경 필요
                startDraw(drawingInfo.type);
            }
        }

        function changeFillColorCanvasObject(changeColor) {
            const selected = canvas.getActiveObjects();
            if (!selected.length) return;
        
            // 그룹 객체 재귀적 처리 함수
            function handleGroupObjects(object) {
                // 그룹인 경우
                if (object.type === 'group' && object._objects) {
                    object.set({ 
                        fill: changeColor,
                    });
                    object._objects.forEach(obj => handleGroupObjects(obj));
                } 
                // 일반 객체인 경우
                else {
                    object.set({ 
                        fill: changeColor,
                    });
                }
            }
        
            // 선택된 객체들에 대해 처리
            selected.forEach(obj => {
                handleGroupObjects(obj);
            });
        
            canvas.renderAll();
            canvas.fire('object:modified');
        }

        function changeColorCanvasObject(changeColor) {
            const selected = canvas.getActiveObjects();
            if (!selected.length) return;
        
            // 그룹 객체 재귀적 처리 함수
            function handleGroupObjects(object) {
                // 그룹인 경우
                if (object.type === 'group' && object._objects) {
                    object.set({ 
                        stroke: changeColor 
                    });
                    object._objects.forEach(obj => handleGroupObjects(obj));
                } 
                // 일반 객체인 경우
                else {
                    object.set({ 
                        stroke: changeColor 
                    });
                }
            }
        
            // 선택된 객체들에 대해 처리
            selected.forEach(obj => {
                handleGroupObjects(obj);
            });
        
            canvas.renderAll();
            canvas.fire('object:modified');
        }

        function changeStrokeStyle(isDashStroke) {
            const selected = canvas.getActiveObjects();
            if (!selected.length) {
                return;
            }
        
            // 그룹 객체 재귀적 처리 함수
            function handleGroupObjects(object) {
                // 그룹인 경우
                if (object.type === 'group' && object._objects) {
                    setStrokeLine(object, isDashStroke);
                    object._objects.forEach(obj => handleGroupObjects(obj));
                } 
                // 일반 객체인 경우
                else {
                    setStrokeLine(object, isDashStroke);
                }
            }
        
            // 선택된 객체들에 대해 처리
            selected.forEach(obj => {
                handleGroupObjects(obj);
            });
        
            canvas.renderAll();
            canvas.fire('object:modified');
        }

        function setStrokeLine(object, isDashStroke) {
            if (isDashStroke) {
                if (object.strokeDashArray) {
                    object.set({ strokeDashArray: [5, 5] }); // 일반 선
                } else {
                    object.set({ strokeDashArray: [5, 5] }); // 점선 적용
                }
            } else {
                if (object.strokeDashArray) {
                    object.set({ strokeDashArray: null }); // 일반 선
                } else {
                    object.set({ strokeDashArray: null }); // 일반 선
                }
            }
        }

        function changeOpacityStyle(opacityValue) {
            const isLine = ui.lineStyleButtons.filter('.ic_line').hasClass('active');
            const isDash = ui.lineStyleButtons.filter('.ic_dash').hasClass('active');

            const isDraw = ui.strokeFillButtons.filter('.ic_draw').hasClass('active');
            const isPull = ui.strokeFillButtons.filter('.ic_pull').hasClass('active');

            const selected = canvas.getActiveObjects();
            if (!selected.length) {
                if(isLine || isDash && isDraw && drawingInfo.type !== DRAW_OBJECTS.PEN) {
                    setDrawStyle(drawingInfo.type);
                }
                return;
            }

            drawingInfo.opacity = opacityValue;
            const colorAndOpacity = getColorWithOpacity(drawingInfo.color, drawingInfo.opacity);

            console.log(isLine, isDash, isDraw, isPull);
            console.log(colorAndOpacity);

            // 그룹 객체 재귀적 처리 함수
            function handleGroupObjects(object) {
                // 그룹인 경우
                if (object.type === 'group' && object._objects) {
                    if (isDraw) {
                        object.set({ stroke: colorAndOpacity });
                    }
                    if (isPull) {
                        object.set({ fill: colorAndOpacity });
                    }
                    object._objects.forEach(obj => handleGroupObjects(obj));
                }
                // 일반 객체인 경우
                else {
                    if (isDraw) {
                        object.set({ stroke: colorAndOpacity });
                    }
                    if (isPull) {
                        object.set({ fill: colorAndOpacity });
                    }
                }
            }
        
            // 선택된 객체들에 대해 처리
            selected.forEach(obj => {
                handleGroupObjects(obj);
            });
        
            canvas.renderAll();
            canvas.fire('object:modified');
        }

        function changeStrokeThicknessStyle(strokeThicknessValue) {
            const selected = canvas.getActiveObjects();
            if (!selected.length) {
                isLine = ui.lineStyleButtons.filter('.ic_line').hasClass('active');
                isDash = ui.lineStyleButtons.filter('.ic_dash').hasClass('active');
                isDraw = ui.strokeFillButtons.filter('.ic_draw').hasClass('active');
                isPull = ui.strokeFillButtons.filter('.ic_pull').hasClass('active');

                if(isLine || isDash && isDraw || isPull) {
                    setDrawStyle(drawingInfo.type);
                }
                return;
            }
        
            // 그룹 객체 재귀적 처리 함수
            function handleGroupObjects(object) {
                // 그룹인 경우
                if (object.type === 'group' && object._objects) {
                    object.set({ strokeWidth: strokeThicknessValue });
                    object._objects.forEach(obj => handleGroupObjects(obj));
                } 
                // 일반 객체인 경우
                else {
                    object.set({ strokeWidth: strokeThicknessValue });
                }
            }
        
            // 선택된 객체들에 대해 처리
            selected.forEach(obj => {
                handleGroupObjects(obj);
            });
        
            canvas.renderAll();
            canvas.fire('object:modified');
        }

        // 꼭지점 개수
        let polygonNum = 5;

        // 꼭지점 팝업
        $(".ic_polygon").on("click", function () {
            let isClass = $(".ic_polygon_pop").hasClass("active")
            if (isClass) {
                $(".ic_polygon_pop").removeClass("active");
            } else {
                $(".ic_polygon_pop").addClass("active");
            }
        });

        $(".draw-tool-wrap-body button:not('.ic_polygon, .ic_polygon_pop>button')").on("click", function () {
            $(".ic_polygon_pop").removeClass("active");
        });

        $(".ic_polygon_pop .ipp_minus").on("click", function () {
            polygonCnt(1);
        });

        $(".ic_polygon_pop .ipp_plus").on("click", function () {
            polygonCnt(2);
        });

        function polygonCnt(state) {
            if (state === 1) {
                if (polygonNum !== 5) polygonNum--;
            } else if (state === 2) {
                if (polygonNum < 9) polygonNum++;
            }

            $("#ipp_num").val(polygonNum);

            setDrawStyle(drawingInfo.type);
        }

        function isDrawingMode() {
            return canvas.isDrawingMode;
        }

        function isDeleteMode() {
            return canvas.isDeletingMode == true && OBJECT_DELETE_MODE == true;
        }

        function isPixelDeleteMode() {
            return canvas.isDeletingMode == true && OBJECT_DELETE_MODE == false;
        }

        function setDeleteMode(isDeletable) {
            const self = this;
            if (OBJECT_DELETE_MODE) {
                canvas.isDeletingMode = isDeletable;
            }
            else {
                canvas.isDeletingMode = isDeletable; // false

                // pixel delete start
                canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
                canvas.freeDrawingBrush.width = 10;//parseInt($('.thickness input[name=thick]:checked').val());
                // pixel delete end
            }

            setCursor();
        }

        function setCursor() {

            canvas.getObjects().forEach(obj => {
                if (isDeleteMode() || isPixelDeleteMode()) {
                    obj.hoverCursor = getEraseCursor(26);
                } else {
                    if (obj.selectable === false) {
                        obj.hoverCursor = "default";
                    } else {
                        obj.hoverCursor = "move";
                    }
                }
            });

            if (isDeleteMode() || isPixelDeleteMode()) {
                canvas.defaultCursor = getEraseCursor(26);
                if (isPixelDeleteMode()) {
                    canvas.freeDrawingCursor = getEraseCursor(26);
                }
                canvas.renderAll();
            } else {
                canvas.defaultCursor = 'default';
                if (isDrawingMode()) {
                    if (drawingInfo.type === "pen") {
                        canvas.freeDrawingCursor = getPencilCursor(drawingInfo.thickness, drawingInfo.color);
                    } else {
                        canvas.freeDrawingCursor = 'crosshair';
                    }
                } else {
                    canvas.freeDrawingCursor = 'crosshair';
                }
            }
        }

        function pencilCursorSVG(brushSize, brushColor) {
            const circle = `
                <svg
                    height="${ brushSize }"
                    fill="${ brushColor }"
                    viewBox="0 0 ${ brushSize * 2 } ${ brushSize * 2 }"
                    width="${ brushSize }"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="50%"
                        cy="50%"
                        r="${ brushSize }" 
                    />
                </svg>
            `;

            return `data:image/svg+xml;base64,${ window.btoa(circle) }`;
        }

        function eraseCursorSVG(brushSize, brushColor) {
            const eraser = `
                <svg
                height="${brushSize}"
                fill="${brushColor}"
                viewBox="0 0 26 27"
                width="${brushSize}"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path d="M23.9 7.5c-2.5-2.7-5.7-5.3-5.7-5.3s-2.8-2.4-5.6.8C9.8 6.1 2.3 14.8 2.3 14.8s-3.2 3-.2 5.9c3 2.9 4.6 4.5 4.6 4.5s.2.7 2 .5h3.7s.9.3 1.7-.7c.8-1 10.1-12.2 10.1-12.2s2.3-2.6-.3-5.3zM12.4 23.2H8.2l-2.8-2.7-1.7-1.7s-.6-.5-.4-1c.2-.5.8-1.4.8-1.4l2.4-2.8 8.1 6.9c-1.2 1.6-2.2 2.7-2.2 2.7zm10-12.1c-.4.5-3.5 4.3-6.1 7.4l-8.1-6.8 6.6-7.6s.9-1 2.2.2 5.3 5 5.3 5 .9.9.1 1.8z"/>
                </svg>
            `;

            return `data:image/svg+xml;base64,${window.btoa(eraser)}`;
        }

        function getPencilCursor(brushSize, brushColor) {
            let scaled;
            if (typeof getScaleValue === 'function') {
                scaled = getScaleValue($("main")[0]) || 1;
            } else {
                scaled = 1;
            }

            const computeSize = brushSize * scaled;
            return getCursor(pencilCursorSVG(computeSize, brushColor), computeSize/2, computeSize/2);
        }

        function getEraseCursor(brushSize) {
            let scaled;
            if (typeof getScaleValue === 'function') {
                scaled = getScaleValue($("main")[0]) || 1;
            } else {
                scaled = 1;
            }

            const computeSize = brushSize * scaled;
            return getCursor(eraseCursorSVG(computeSize, '#000000'), computeSize/2, computeSize);
        }

        function getCursor(url, x = '', y = '') {
            return `url(" ${url} ") ${x} ${y}, auto`;
        }


    });

    function getColor() {
        let colorValue = "#000000";

        const colorActiveNode = $(".tool-row.palette-item button.active");
        console.log(colorActiveNode);
        if(colorActiveNode.length > 0) {
            const colorClass = colorActiveNode[0].classList[0];
            switch (colorClass) {
                case "p_red":
                    colorValue = "#ff0000";
                    break;
                case "p_yellow":
                    colorValue = "#ffff00";
                    break;
                case "p_green":
                    colorValue = "#00ff00";
                    break;
                case "p_blue":
                    colorValue = "#0000ff";
                    break;  
                case "p_purple":
                    colorValue = "#800080";
                    break;
                case "color_purple":
                    colorValue = "#800080";
                    break;
                case "p_black":
                    colorValue = "#000000";
                    break;
            }
        }

        return colorValue;
    }

    function initThickness() {
        if(ui.thicknessNode.length > 0) {
            ui.thicknessNode[0].min = 5;
            ui.thicknessNode[0].max = 15;
            ui.thicknessNode[0].step = 1;
            ui.thicknessNode[0].value = 7;
        }
    }

    function getThickness() {
        let thicknessValue = 7;

        if(ui.thicknessNode.length > 0) {
            thicknessValue = ui.thicknessNode[0].value;
            thicknessValue = parseInt(thicknessValue);
        }

        return thicknessValue; 
    }

    function initOpacity() {
        if(ui.opacityNode.length > 0) {
            ui.opacityNode[0].min = 0;
            ui.opacityNode[0].max = 1;
            ui.opacityNode[0].step = 0.1;
            ui.opacityNode[0].value = 0.0;
        }
    }

    function getOpacity() {
        let opacityValue = 0.0;

        if(ui.opacityNode.length > 0) {
            opacityValue = ui.opacityNode[0].value;
            opacityValue = parseFloat(1 - opacityValue);
        }

        return opacityValue; 
    }

    function getColorWithOpacity(color, opacity) {
        // HEX to RGB 변환
        const r = parseInt(color.slice(1,3), 16);
        const g = parseInt(color.slice(3,5), 16); 
        const b = parseInt(color.slice(5,7), 16);
        
        // RGBA 형식으로 반환
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // // 투명도 조절
    // opacityActiveNode.addEventListener("input", function () {
    //     changeOpacityStyle(this.value);
    // });

    // // 굵기 조절
    // thicknessActiveNode.addEventListener("input", function () {
    //     changeStrokeThicknessStyle(parseInt(this.value));
    // });
}

$('.group').on("click", function () {
    console.log("in group function")
    if (!canvas.getActiveObject()) {
        return;
    }
    if (canvas.getActiveObject().type !== 'activeSelection') {
        return;
    }
    canvas.getActiveObject().toGroup();
    canvas.requestRenderAll();
    console.log(canvas.getActiveObject())
});

$('.drawing_button').on("click", function () {
    window._canvas.isDeletingMode = false;
    window._canvas.isDrawingMode = true;

    const pencilBrush = new fabric.PencilBrush(canvas);
    pencilBrush.color = "#000000";
    pencilBrush.width = 1;
    canvas.freeDrawingBrush = pencilBrush;
});

$('.select_button').on("click", function () {
    window._canvas.isDrawingMode = false;
});

$('#save_json').on("click", function () {
    saveJson = canvas.toJSON(['_controlsVisibility', 'objectCaching', 'padding',
        'editingBorderColor', 'borderColor', 'borderDashArray', 'minScaleLimit', 'tag',
        'strokeUniform', 'patternColor', 'selectable']);

    console.log(saveJson);
});

$('#load_json').on("click", function () {
    loadJson(saveJson, canvas);

    window._canvas.isDrawingMode = false;
});

fabric.Image.fromURL('../../common_project/common/img/tool_drawing/tools_close.svg', function (oImg) {
    oImg.scaleToWidth(close_button_width);
    oImg.scaleToHeight(close_button_height);

    var deleteIconImg = oImg;

    fabric.Object.prototype.controls.tr = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: 0,
        offsetX: 0,
        cursorStyle: 'pointer',
        mouseUpHandler: deleteObject,
        render: renderIcon(deleteIconImg._element),
        cornerSize: 24
    });

    fabric.Textbox.prototype.controls.tr = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: 0,
        offsetX: 0,
        cursorStyle: 'pointer',
        mouseUpHandler: deleteObject,
        render: renderIcon(deleteIconImg._element),
        cornerSize: 24
    });
});

fabric.Image.fromURL('../../common_project/common/img/tool_drawing/tools_resize.svg', function (oImg) {
    oImg.scaleToWidth(close_button_width);
    oImg.scaleToHeight(close_button_height);

    var resizeIconImg = oImg;

    fabric.Object.prototype.controls.br = new fabric.Control({
        x: 0.5,
        y: 0.5,
        offsetY: 0,
        offsetX: 0,
        cursorStyle: 'pointer',
        actionHandler: fabric.controlsUtils.rotationWithSnappingScaling, // 드래그시 크기 변경
        render: renderIcon(resizeIconImg._element),
        cornerSize: 24,
    });

    fabric.Textbox.prototype.controls.br = new fabric.Control({
        x: 0.5,
        y: 0.5,
        offsetY: 0,
        offsetX: 0,
        cursorStyle: 'pointer',
        actionHandler: fabric.controlsUtils.scalingEqually, // 드래그시 크기 변경
        render: renderIcon(resizeIconImg._element),
        cornerSize: 24
    });
});

function loadJson(json, canvas) {
    alert('loadJson');
    console.log('loadJson', json);

    canvas.loadFromJSON(JSON.stringify(json), function () {
        canvas.renderAll();
    });
}

function setHintAndClear(textBox) {
    textBox.on("editing:entered", function (e) {
        var obj = canvas.getActiveObject();
        console.log("entered editing");

        obj.enterEditing();

        if (obj.text === DEFAULT_TEXT) {
            obj.text = "";
            obj.hiddenTextarea.value = "";
            obj.dirty = true;

            obj.setCoords();

            canvas.renderAll();
        }
        obj.hiddenTextarea.focus();
        obj.hiddenTextarea.setAttribute('maxlength', obj.maxlength);

        canvas.requestRenderAll();
    });

    textBox.on("editing:exited", function (e) {
        var obj = canvas.getActiveObject();
        console.log("exited editing");

        console.log(e);

        if (obj.text === "") {
            obj.text = DEFAULT_TEXT;
        }

        canvas.renderAll();
    });
}

function renderIcon(icon) {
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        var size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(icon, -size / 2, -size / 2, size, size);
        ctx.restore();
    }
}

function containDeleteObject(deleteCanvas, options) {
    var objs = deleteCanvas.getObjects();
    let topmost = {};
    const mousePos = deleteCanvas.getPointer(options.e);

    jQuery.each(objs, function (index, val) {
        if (val.containsPoint(mousePos) && !(deleteCanvas.isTargetTransparent(val, mousePos.x, mousePos.y))) {
            topmost = val;
        }
    });

    if (topmost.tag !== undefined && topmost.tag.includes("ThreePointCurve")) {
        const curveNumber = topmost.tag.split('ThreePointCurve')[1];
        $(deleteCanvas._objects).each(function (index, innerObject) {
            if (innerObject.tag === "threeCurvePoint" + curveNumber) {
                deleteCanvas.remove(innerObject);
            }
        });
    }

    deleteCanvas.remove(topmost);

    if (topmost.width == undefined) {
        deleteCanvas._onMouseUp(options.e);
        deleteCanvas.selected = false;
        deleteCanvas.discardActiveObject();
    }
}

function deleteObjectOne(passingCanvas) {
    var selected = passingCanvas.getActiveObjects(),
        selGroup = new fabric.ActiveSelection(selected, {
            canvas: passingCanvas
        });

    console.log(selGroup._objects);

    if (selGroup._objects.length) {
        selGroup.forEachObject(function (obj) {
            passingCanvas.remove(obj);
        });
    } else {
        return;
    }
    passingCanvas.discardActiveObject().renderAll();
}

function deleteObject(eventData, transform) {

    // console.log('transform.target', transform.target);

    var target = transform.target;
    if (target == null) {
        return;
    }
    var canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();

    var targetObjects = transform.target._objects;
    if (targetObjects) {
        console.log('transform.target', transform.target);
        console.log('targetObjects', targetObjects);
        targetObjects.forEach(function (object) {

            console.log('object', object);

            var canvas = object.canvas;
            canvas.discardActiveObject();
            canvas.remove(object);
            canvas.requestRenderAll();
        });
    }
}

function cloneObject(eventData, transform) {
    var target = transform.target;
    var canvas = target.canvas;
    target.clone(function (cloned) {
        cloned.left += 10;
        cloned.top += 10;
        canvas.add(cloned);
    });
}


$(document).ready(function () {
    
});

function getSaveCanvasInstanceJson() {
    let saveJsons = [];
    canvasInstances.forEach(canvas => {
        let saveJson = canvas.toJSON(['_controlsVisibility', 'objectCaching', 'padding',
            'editingBorderColor', 'borderColor', 'borderDashArray', 'minScaleLimit', 'tag',
            'strokeUniform', 'patternColor', 'selectable']);
        saveJsons.push(saveJson);
    });

    return saveJsons;
}

function redrawEventCanvas(data) {
    // json string 어떻게 넘어오는지에 따라 추가 수정 필요
    data.forEach((elm, index) => {
        canvasInstances[index].loadFromJSON(JSON.stringify(elm), function () {
            canvasInstances[index].renderAll();
        });
    });
}
