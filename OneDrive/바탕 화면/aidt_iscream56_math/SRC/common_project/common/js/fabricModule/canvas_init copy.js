/* eslint-disable */

// 전역 인스턴스 저장소 선언
window.drawingCanvasInstances = {};

// 그리기 도구 상수 정의 (전역 유지)
const DRAW_OBJECTS = {
    PEN: "pen",
    LINE: "line",
    SQUARE: "square",
    CIRCLE: "circle",
    TRIANGLE: "triangle",
    BALLOON: "balloon", // Note: Custom object/brush logic might need adjustment
    PENTAGON: "pentagon", // Note: Specific brush implementation needed
    STAR: "star",         // Note: Specific brush implementation needed
    HEART: "heart",       // Note: Specific brush implementation needed
    N_OBJECT: "n_object", // Note: Specific brush implementation needed
    TEXTBOX: "textbox"
};

// Fabric.js 객체 기본 설정 (전역 유지)
fabric.Object.prototype.borderDashArray = [5, 5];
fabric.Object.prototype.borderColor = '#03C8FF';
fabric.Object.prototype.setControlsVisibility({
    mt: false, mb: false, ml: false, mr: false,
    bl: false, tl: false, mtr: false,
    br: true, // 크기 조절 핸들
    tr: true  // 삭제 핸들 (객체 선택 시 나타나는 x 버튼 - 현재 로직에서는 사용 안 함)
});

// Helper function to make element draggable (전역 유지 또는 클래스 static 메서드로 변경 가능)
function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const dragMouseDown = (e) => {
        e = e || window.event;
        if (e.target !== handle && !handle.contains(e.target)) return; // 핸들로만 드래그
        e.preventDefault();
        pos3 = e.clientX || e.touches[0].clientX;
        pos4 = e.clientY || e.touches[0].clientY;
        document.addEventListener('mouseup', closeDragElement);
        document.addEventListener('touchend', closeDragElement);
        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('touchmove', elementDrag, { passive: false });
        handle.style.cursor = 'grabbing';
    };
    const elementDrag = (e) => {
        e = e || window.event;
        if (e.type === 'touchmove') {
             e.preventDefault(); // 터치 드래그 시 스크롤 방지
        }
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        pos1 = pos3 - clientX;
        pos2 = pos4 - clientY;
        pos3 = clientX;
        pos4 = clientY;
        // Boundary checks could be added here
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    };
    const closeDragElement = () => {
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('touchend', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('touchmove', elementDrag);
        handle.style.cursor = 'move';
    };
    handle.addEventListener('mousedown', dragMouseDown);
    handle.addEventListener('touchstart', dragMouseDown);
    handle.style.cursor = 'move';
}


class DrawingCanvas {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.canvasElement = document.getElementById(canvasId);
        if (!this.canvasElement) {
            console.error(`Canvas element with id '${canvasId}' not found.`);
            return;
        }

        // 연관된 버튼과 플레이스홀더 찾기
        this.triggerButton = document.querySelector(`.btn.drawing[data-canvas-target="${canvasId}"]`);
        this.toolPlaceholder = document.querySelector(`.drawing-tools-placeholder[data-canvas-id="${canvasId}"]`);

        if (!this.triggerButton) {
            console.warn(`Trigger button for canvas '${canvasId}' not found.`);
            // Trigger 없이 초기화할 수도 있음 (예: 페이지 로드 시 바로 표시)
        }
         if (!this.toolPlaceholder) {
            console.warn(`Tool placeholder for canvas '${canvasId}' not found. Tools will be appended to body.`);
        }

        // 인스턴스별 상태 변수
        this.fabricCanvas = null;
        this.toolWrap = null; // 도구 모음 DOM 요소 참조
        this.history = [];
        this.redoStack = [];
        this.isUndoing = false;
        this.isAddingTextbox = false;
        this.isDeletingMode = false; // 삭제 모드 상태
        this.drawingInfo = {
            type: null,
            thickness: 5,
            color: '#000000',
            opacity: 1
        };

        // 초기화 진행
        this.init();
    }

    // --- 초기화 ---
    init() {
        this.initFabricCanvas();
        this.createDrawingTools(); // 도구 UI 생성 먼저
        this.attachEventListeners(); // 그 다음 이벤트 리스너 연결

        if (this.fabricCanvas && this.toolWrap) {
            console.log(`DrawingCanvas initialized for canvas ID: ${this.canvasId}`);
        }
    }

    initFabricCanvas() {
        // 너비/높이는 canvas 태그 속성 또는 CSS에서 가져오도록 개선 가능
        const width = this.canvasElement.width || 400;
        const height = this.canvasElement.height || 400;

        this.fabricCanvas = new fabric.Canvas(this.canvasId, {
            isDrawingMode: false,
            width: width,
            height: height,
            backgroundColor: 'transparent',
            preserveObjectStacking: true
        });

        // Fabric 이벤트 리스너 (인스턴스 메서드 사용)
        this.fabricCanvas.on('object:modified', () => {
            if (!this.isUndoing) {
                this.saveState();
            }
        });

        this.fabricCanvas.on('object:added', (e) => {
             if (!this.isUndoing) {
                  // 새로 추가된 객체에 투명도 적용 (자유 그리기는 제외)
                  if (!this.fabricCanvas.isDrawingMode && e.target && this.drawingInfo.opacity < 1) {
                       e.target.set('opacity', this.drawingInfo.opacity);
                       this.fabricCanvas.renderAll();
                  }
                  this.saveState();
             }
         });

        this.fabricCanvas.on('mouse:down', (options) => {
            // 텍스트박스 추가 로직
            if (this.isAddingTextbox) {
                this.isAddingTextbox = false; // 모드 해제
                this.fabricCanvas.defaultCursor = 'default';

                const pointer = this.fabricCanvas.getPointer(options.e);
                const textbox = new fabric.Textbox('입력하세요.', {
                    left: pointer.x,
                    top: pointer.y,
                    width: 150,
                    fontSize: 20,
                    fill: this.drawingInfo.color,
                    opacity: this.drawingInfo.opacity,
                    fontFamily: 'Arial', // 기본 글꼴
                    originX: 'center',
                    originY: 'center',
                    hasControls: true,
                    borderColor: '#03C8FF',
                    cornerColor: 'blue',
                    cornerSize: 10,
                    transparentCorners: false,
                    editingBorderColor: 'rgba(102,153,255,0.5)'
                });

                // Placeholder 처리
                textbox.on("editing:entered", () => {
                    if (textbox.text === '입력하세요.') {
                        textbox.text = "";
                        textbox.dirty = true;
                        textbox.hiddenTextarea.value = "";
                        this.fabricCanvas.renderAll();
                    }
                    textbox.selectAll();
                    // focus()가 필요한 경우가 있음
                    // setTimeout(() => textbox.hiddenTextarea.focus(), 10);
                     textbox.hiddenTextarea.focus();
                });

                textbox.on("editing:exited", () => {
                    if (!textbox.text.trim()) {
                        textbox.text = '입력하세요.';
                        textbox.dirty = true;
                        this.fabricCanvas.renderAll();
                    }
                });

                this.fabricCanvas.add(textbox);
                this.fabricCanvas.setActiveObject(textbox);
                textbox.enterEditing();

                this.saveState();

                // 텍스트 버튼 활성 상태 해제
                 const txtButton = this.toolWrap?.querySelector('.ic_txt.active');
                 if (txtButton) txtButton.classList.remove('active');
                 // 선택 도구(ic_pull) 활성화 시뮬레이션
                 const pullButton = this.toolWrap?.querySelector('.ic_pull');
                 if (pullButton) this.handleActiveState(pullButton, '.tool-row.function-item button');


                return; // 다른 mouse:down 로직 (삭제 등) 방지
            }

            // 삭제 모드 로직
            if (this.isDeletingMode && options.target) {
                 // 객체의 투명한 영역이 아닌 실제 컨텐츠 클릭 시 삭제
                if (!this.fabricCanvas.isTargetTransparent(options.target, options.e.offsetX, options.e.offsetY)) {
                    this.fabricCanvas.remove(options.target);
                    this.fabricCanvas.requestRenderAll();
                    this.saveState();
                }
            }
        });

        // 삭제 모드 터치 이벤트
        this.fabricCanvas.on('mouse:move', (options) => {
             if (this.isDeletingMode && options.e.type === 'touchmove' && options.target) {
                 const pointer = this.fabricCanvas.getPointer(options.e);
                 if (options.target.containsPoint(pointer)) {
                      if (!this.fabricCanvas.isTargetTransparent(options.target, pointer.x, pointer.y)) {
                          this.fabricCanvas.remove(options.target);
                          this.fabricCanvas.requestRenderAll();
                          this.saveState();
                      }
                 }
             }
         });

        // 초기 상태 저장
        this.saveInitialState();
    }

    // --- 상태 관리 (Undo/Redo) ---
    saveInitialState() {
        if (this.fabricCanvas) {
            this.history = [JSON.stringify(this.fabricCanvas)];
        } else {
            this.history = [];
        }
        this.redoStack = [];
    }

    saveState() {
        if (!this.isUndoing && this.fabricCanvas) {
            this.redoStack = []; // 새 작업 시 redo 스택 초기화
            const currentState = JSON.stringify(this.fabricCanvas);
            if (this.history.length === 0 || this.history[this.history.length - 1] !== currentState) {
                this.history.push(currentState);
            }
            // Optional: Limit history size
            // const maxHistory = 50;
            // if (this.history.length > maxHistory) {
            //     this.history.shift();
            // }
        }
    }

    undo() {
        if (this.history.length > 1 && this.fabricCanvas) { // 초기 상태는 남김
            this.isUndoing = true;
            this.redoStack.push(this.history.pop());
            let prevState = this.history[this.history.length - 1];
            this.fabricCanvas.loadFromJSON(prevState, () => {
                this.fabricCanvas.renderAll();
                this.isUndoing = false;
                console.log("Undo complete for", this.canvasId);
            });
        } else {
            console.log("더 이상 실행 취소할 수 없습니다 for", this.canvasId);
        }
    }

    redo() {
        if (this.redoStack.length > 0 && this.fabricCanvas) {
            this.isUndoing = true;
            let nextState = this.redoStack.pop();
            this.history.push(nextState);
            this.fabricCanvas.loadFromJSON(nextState, () => {
                this.fabricCanvas.renderAll();
                this.isUndoing = false;
                console.log("Redo complete for", this.canvasId);
            });
        } else {
            console.log("더 이상 다시 실행할 수 없습니다 for", this.canvasId);
        }
    }

    // --- 그리기 관련 메소드 ---
    startDraw(type) {
        if (!this.fabricCanvas) return;
        this.fabricCanvas.isDrawingMode = true;
        this.isDeletingMode = false; // 그리기 시작 시 삭제 모드 해제
        this.drawingInfo.type = type;

        let brush = null;

        // 기본 브러시 옵션
        const brushOptions = {
            color: this.drawingInfo.color,
            width: this.drawingInfo.thickness,
            opacity: this.drawingInfo.opacity // 일부 브러시는 미지원 가능성 있음
        };

        switch (type) {
            case DRAW_OBJECTS.PEN:
                brush = new fabric.PencilBrush(this.fabricCanvas);
                brush.color = this.drawingInfo.color;
                brush.width = this.drawingInfo.thickness;
                // PencilBrush는 그리는 중 실시간 투명도 적용 어려움
                break;
            case DRAW_OBJECTS.LINE:
                 // LinePath 같은 사용자 정의 브러시 필요 또는 직선 도구로 변경
                 console.warn("Freehand LINE drawing needs custom brush (e.g., LinePath) or use fixed line tool.");
                 // 임시로 펜 사용 또는 mouse:down/up으로 직선 그리기 구현
                 brush = new fabric.PencilBrush(this.fabricCanvas); // Fallback
                 brush.color = this.drawingInfo.color;
                 brush.width = this.drawingInfo.thickness;
                // if (fabric.LinePath) {
                //     brush = new fabric.LinePath(this.fabricCanvas, { ... });
                // }
                break;
            case DRAW_OBJECTS.SQUARE:
                 console.warn("Freehand SQUARE drawing needs custom brush or use fixed shape.");
                 brush = new fabric.PencilBrush(this.fabricCanvas); // Fallback
                 brush.color = this.drawingInfo.color;
                 brush.width = this.drawingInfo.thickness;
                 // Or add fixed Rect on mouse up
                break;
            case DRAW_OBJECTS.CIRCLE:
                 // CirclePath 같은 사용자 정의 브러시 필요 또는 고정 원 도구로 변경
                 console.warn("Freehand CIRCLE drawing needs custom brush (e.g., CirclePath) or use fixed shape.");
                 brush = new fabric.PencilBrush(this.fabricCanvas); // Fallback
                 brush.color = this.drawingInfo.color;
                 brush.width = this.drawingInfo.thickness;
                // if (fabric.CirclePath) {
                //     brush = new fabric.CirclePath(this.fabricCanvas, { ... });
                // }
                break;
            case DRAW_OBJECTS.TRIANGLE:
                 console.warn("Freehand TRIANGLE drawing needs custom brush or use fixed shape.");
                 brush = new fabric.PencilBrush(this.fabricCanvas); // Fallback
                 brush.color = this.drawingInfo.color;
                 brush.width = this.drawingInfo.thickness;
                 // Or add fixed Triangle on mouse up
                break;
            case DRAW_OBJECTS.BALLOON:
                 console.warn("BALLOON drawing requires BalloonTextBox custom class/brush implementation.");
                 brush = new fabric.PencilBrush(this.fabricCanvas); // Fallback
                 brush.color = this.drawingInfo.color;
                 brush.width = this.drawingInfo.thickness;
                break;
            case DRAW_OBJECTS.PENTAGON:
            case DRAW_OBJECTS.STAR:
            case DRAW_OBJECTS.HEART:
                 console.warn(`${type} drawing brush needs specific implementation or use fixed shapes.`);
                 brush = new fabric.PencilBrush(this.fabricCanvas); // Fallback
                 brush.color = this.drawingInfo.color;
                 brush.width = this.drawingInfo.thickness;
                 break;
             case DRAW_OBJECTS.N_OBJECT:
                 let sidesInput = this.toolWrap?.querySelector(`#ipp_num_${this.canvasId}`); // 고유 ID 사용
                 let sides = sidesInput ? parseInt(sidesInput.value, 10) : 5;
                 if (sides < 3) sides = 3;
                 console.warn("N_OBJECT drawing brush needs specific implementation or use fixed shapes.");
                 brush = new fabric.PencilBrush(this.fabricCanvas); // Fallback
                 brush.color = this.drawingInfo.color;
                 brush.width = this.drawingInfo.thickness;
                 // Add N-sided polygon on mouse up based on 'sides'
                 break;
            case DRAW_OBJECTS.TEXTBOX:
                 // 실제 Textbox 그리기는 mouse:down에서 처리됨. 여기서는 모드 전환 역할.
                 this.isAddingTextbox = true;
                 this.fabricCanvas.isDrawingMode = false; // 텍스트 추가 시 그리기 모드 해제
                 this.fabricCanvas.defaultCursor = 'text';
                 console.log(`Textbox adding mode enabled for ${this.canvasId}`);
                 // 버튼 활성 상태는 클릭 핸들러에서 처리
                 return; // 브러시 설정 불필요
            default:
                console.warn(`Unknown drawing type: ${type}. Falling back to pen.`);
                brush = new fabric.PencilBrush(this.fabricCanvas);
                brush.color = this.drawingInfo.color;
                brush.width = this.drawingInfo.thickness;
                break;
        }

        if (brush) {
            this.fabricCanvas.freeDrawingBrush = brush;
            // 브러시에 투명도 설정 시도 (PencilBrush 등 일부는 미지원)
            // if (this.fabricCanvas.freeDrawingBrush.setOpacity) {
            //     this.fabricCanvas.freeDrawingBrush.setOpacity(this.drawingInfo.opacity);
            // }
        }

        this.setCursor(); // 모드에 맞는 커서 설정
    }

    setCursor() {
        if (!this.fabricCanvas) return;

        if (this.isDeletingMode) {
            this.fabricCanvas.defaultCursor = 'not-allowed'; // 또는 지우개 모양 커서
            this.fabricCanvas.hoverCursor = 'not-allowed';
            this.fabricCanvas.freeDrawingCursor = 'not-allowed';
        } else if (this.isAddingTextbox) {
             this.fabricCanvas.defaultCursor = 'text';
             this.fabricCanvas.hoverCursor = 'text';
             this.fabricCanvas.freeDrawingCursor = 'text';
        } else if (this.fabricCanvas.isDrawingMode) {
             // 도형/펜 그리기 시
             this.fabricCanvas.defaultCursor = 'crosshair';
             this.fabricCanvas.hoverCursor = 'crosshair';
             this.fabricCanvas.freeDrawingCursor = 'crosshair'; // 기본값 사용
             // TODO: 펜 모양 등 커스텀 커서 구현 가능
             // if (this.drawingInfo.type === DRAW_OBJECTS.PEN) {
             //    this.fabricCanvas.freeDrawingCursor = 'url(...)';
             // }
        } else {
             // 선택 모드 (isDrawingMode: false, isDeletingMode: false, isAddingTextbox: false)
            this.fabricCanvas.defaultCursor = 'default';
            this.fabricCanvas.hoverCursor = 'move'; // 객체 위에 올렸을 때
            this.fabricCanvas.freeDrawingCursor = 'default';
        }
        this.fabricCanvas.renderAll(); // 커서 변경사항 적용 위해 필요할 수 있음
    }

    setDeleteMode(isDeletable) {
        if (!this.fabricCanvas) return;
        this.isDeletingMode = isDeletable;
        this.fabricCanvas.isDrawingMode = false; // 삭제 모드 시 그리기 비활성화
        this.isAddingTextbox = false; // 삭제 모드 시 텍스트 추가 비활성화
        this.fabricCanvas.selection = !isDeletable; // 삭제 모드 아닐 때만 객체 선택 활성화

        this.fabricCanvas.forEachObject(obj => {
            obj.selectable = !isDeletable;
            obj.evented = !isDeletable; // 삭제 모드 시 객체 이벤트 비활성화 (캔버스 mouse:down으로 처리)
        });

        this.setCursor();
        this.fabricCanvas.discardActiveObject(); // 모드 변경 시 선택 해제
        this.fabricCanvas.requestRenderAll();
        console.log(`Delete mode for ${this.canvasId}: ${isDeletable}`);
    }

    changeColorCanvasObject(color) {
        if (!this.fabricCanvas) return;

        this.drawingInfo.color = color;
        // this.isAddingTextbox = false; // 색상 변경 시 텍스트 모드 해제 (선택적)
        // this.fabricCanvas.defaultCursor = 'default';

        // 현재 브러시 색상 업데이트
        if (this.fabricCanvas.freeDrawingBrush) {
            this.fabricCanvas.freeDrawingBrush.color = color;
        }

        // 선택된 객체 색상 업데이트
        const activeObject = this.fabricCanvas.getActiveObject();
        if (activeObject) {
            const applyColor = (obj) => {
                // 객체 타입에 따라 fill 또는 stroke 변경
                if (obj.type === 'path' || obj.type === 'line' || (obj.stroke && !obj.fill)) { // 선 객체
                    obj.set('stroke', color);
                } else if (obj.type === 'textbox' || obj.type === 'i-text') { // 텍스트 객체
                    obj.set('fill', color);
                     // 필요 시 테두리 색도 변경?
                     // if (obj.stroke) obj.set('stroke', color);
                 } else { // 일반 도형 (fill 기준)
                    obj.set('fill', color);
                    // 테두리가 있는 도형이면 테두리 색도 같이 변경 (선택적)
                     if (obj.stroke) {
                         obj.set('stroke', color);
                     }
                }
            };

            if (activeObject.type === 'activeSelection') { // 다중 선택
                activeObject.forEachObject(obj => applyColor(obj));
            } else { // 단일 선택
                applyColor(activeObject);
            }
            this.fabricCanvas.requestRenderAll();
            this.saveState();
        }
        console.log(`Color changed to ${color} for ${this.canvasId}`);
    }

    changeStrokeStyle(isDashed) {
        if (!this.fabricCanvas) return;
        const dashArray = isDashed ? [5, 5] : null;
        // this.isAddingTextbox = false; // 스타일 변경 시 텍스트 모드 해제 (선택적)
        // this.fabricCanvas.defaultCursor = 'default';

        // 향후 그릴 선 스타일에 영향 (LinePath 등 관련 브러시 필요)
        // this.drawingInfo.strokeStyle = isDashed ? 'dashed' : 'solid'; // 내부 상태 저장 (선택적)
        if (this.fabricCanvas.freeDrawingBrush && this.fabricCanvas.freeDrawingBrush.strokeDashArray !== undefined) {
             this.fabricCanvas.freeDrawingBrush.strokeDashArray = dashArray;
             console.log(`Next stroke style set to ${isDashed ? 'dashed' : 'solid'} for ${this.canvasId}`);
        } else {
             console.warn(`Current brush for ${this.canvasId} does not support strokeDashArray.`);
        }

        // 선택된 객체 스타일 변경
        const activeObject = this.fabricCanvas.getActiveObject();
        if (activeObject) {
             const applyStroke = (obj) => {
                  // stroke가 있는 객체에만 적용
                  if (obj.stroke) {
                      obj.set('strokeDashArray', dashArray);
                  }
             };

             if (activeObject.type === 'activeSelection') {
                  activeObject.forEachObject(obj => applyStroke(obj));
             } else {
                  applyStroke(activeObject);
             }
             this.fabricCanvas.requestRenderAll();
             this.saveState();
             console.log(`Selected object stroke style changed to ${isDashed ? 'dashed' : 'solid'} for ${this.canvasId}`);
        }
    }

    changeThickness(thickness) {
        if (!this.fabricCanvas) return;
        const newThickness = parseInt(thickness, 10);
        if (isNaN(newThickness) || newThickness < 1) return;

        this.drawingInfo.thickness = newThickness;

        // 현재 브러시 두께 업데이트
        if (this.fabricCanvas.freeDrawingBrush) {
            this.fabricCanvas.freeDrawingBrush.width = newThickness;
        }

        // 선택된 객체 두께 업데이트 (strokeWidth 속성이 있는 객체 대상)
        const activeObject = this.fabricCanvas.getActiveObject();
        if (activeObject) {
            const applyThickness = (obj) => {
                 if (obj.strokeWidth !== undefined) {
                     obj.set('strokeWidth', newThickness);
                 }
                 // 펜으로 그린 path 등은 strokeWidth 직접 조절 어려울 수 있음
            };
            if (activeObject.type === 'activeSelection') {
                activeObject.forEachObject(obj => applyThickness(obj));
            } else {
                applyThickness(activeObject);
            }
            this.fabricCanvas.requestRenderAll();
            this.saveState();
        }
         console.log(`Thickness changed to ${newThickness} for ${this.canvasId}`);
    }

     changeOpacity(opacity) {
         if (!this.fabricCanvas) return;
         const newOpacity = parseFloat(opacity);
         if (isNaN(newOpacity) || newOpacity < 0 || newOpacity > 1) return;

         this.drawingInfo.opacity = newOpacity; // 향후 객체 생성 시 사용

         // 현재 브러시에 투명도 적용 시도 (제한적 지원)
         // if (this.fabricCanvas.freeDrawingBrush && this.fabricCanvas.freeDrawingBrush.setOpacity) {
         //     this.fabricCanvas.freeDrawingBrush.setOpacity(newOpacity);
         // }

         // 선택된 객체 투명도 업데이트
         const activeObject = this.fabricCanvas.getActiveObject();
         if (activeObject) {
              const applyOpacity = (obj) => obj.set('opacity', newOpacity);
              if (activeObject.type === 'activeSelection') {
                   activeObject.forEachObject(obj => applyOpacity(obj));
              } else {
                   applyOpacity(activeObject);
              }
              this.fabricCanvas.requestRenderAll();
              this.saveState();
         }
         console.log(`Opacity changed to ${newOpacity} for ${this.canvasId}`);
     }

    clearCanvas(skipConfirm = false) { // skipConfirm 매개변수 추가
        if (this.fabricCanvas) {
             // skipConfirm이 true이거나, 사용자가 확인을 누르면 실행
             if (skipConfirm || confirm(`'${this.canvasId}' 캔버스의 모든 내용을 지우시겠습니까?`)) {
                 this.fabricCanvas.clear();
                 // 히스토리 초기화 (초기 빈 상태 저장)
                 this.saveInitialState();
                 // 필요시 기본 배경색 등 재설정
                 // this.fabricCanvas.backgroundColor = 'transparent';
                 this.fabricCanvas.requestRenderAll();
                 console.log(`Canvas cleared for ${this.canvasId}`);
             }
        }
    }

     // Delete 키 처리
     handleDeleteKey(event) {
          if (!this.fabricCanvas) return;
          // 현재 이 캔버스가 활성화된 상태인지 확인하는 로직 추가 필요
          // 예: document.activeElement가 이 캔버스 영역 내부에 있는지,
          // 또는 마지막으로 상호작용한 캔버스가 이것인지 등.
          // 여기서는 일단 활성 객체가 있으면 삭제 시도
          if (event.key === 'Delete' || event.key === 'Backspace') {
              const activeObject = this.fabricCanvas.getActiveObject();
              if (activeObject) {
                   // 텍스트 편집 중 Backspace는 텍스트 삭제로 동작해야 함
                  if (activeObject.isEditing && event.key === 'Backspace') {
                      return; // 텍스트 편집 중에는 객체 삭제 방지
                  }

                  if (this.fabricCanvas.getActiveObjects) { // 다중 선택 객체 삭제
                      this.fabricCanvas.getActiveObjects().forEach(obj => this.fabricCanvas.remove(obj));
                  } else { // 단일 선택 객체 삭제
                      this.fabricCanvas.remove(activeObject);
                  }
                  this.fabricCanvas.discardActiveObject(); // 선택 해제
                  this.fabricCanvas.requestRenderAll();
                  this.saveState(); // 상태 저장
                  console.log(`Object deleted by keypress on ${this.canvasId}`);
              }
          }
     }


    // --- 도구 UI 생성 및 이벤트 처리 ---
    createDrawingTools() {
        // 고유 ID 생성
        const toolWrapId = `dragWrap-${this.canvasId}`;
        const dragHandleId = `dragMe-${this.canvasId}`;
        const polygonNumId = `ipp_num_${this.canvasId}`;

        // 이미 생성되었는지 확인
        if (document.getElementById(toolWrapId)) {
            this.toolWrap = document.getElementById(toolWrapId);
            console.log(`Tool wrap already exists for ${this.canvasId}`);
            return;
        }

        try {
            const drawToolWrap = document.createElement('div');
            drawToolWrap.className = 'draw-tool-wrap'; // 공통 스타일 클래스
            drawToolWrap.id = toolWrapId; // 고유 ID
            drawToolWrap.style.position = 'absolute'; // Dragging 위해 필요
            drawToolWrap.style.display = 'none';      // 기본 숨김
            drawToolWrap.style.zIndex = '1000';     // 다른 요소 위에 표시

            // Header
            const header = document.createElement('div');
            header.className = 'draw-tool-wrap-header';
            const title = document.createElement('div');
            title.className = 'draw-tool-wrap-title';
            title.id = dragHandleId; // 드래그 핸들 ID
            title.textContent = `그리기 도구`; // (${this.canvasId}) 인스턴스 구분용 텍스트
            header.appendChild(title);
            const closeBtnDiv = document.createElement('div');
            closeBtnDiv.className = 'close_but add_cursor'; // 기존 클래스 유지
             // 이미지 경로는 프로젝트 구조에 맞게 조정 필요
            closeBtnDiv.innerHTML = `<img src="../../common_project/common/img/tool_drawing/ic_cancel.png" alt="닫기">`;
            header.appendChild(closeBtnDiv);
            drawToolWrap.appendChild(header);

            // Body (Tools)
            const body = document.createElement('div');
            body.className = 'draw-tool-wrap-body';

            // 도구 설정 (기존 구조 유지)
            const toolRowsConfig = [
                 { type: 'function', items: ['ic_pen active', 'ic_txt', 'ic_eraser'] }, // 기본 펜 활성
                 { type: 'function', items: ['ic_triangle', 'ic_square', 'ic_circle', 'ic_polygon'] },
                 { type: 'function', items: ['ic_line', 'ic_dash', 'ic_draw', 'ic_pull'] }, // ic_draw는 펜과 동일하게 처리됨
                 { type: 'palette', items: ['p_red', 'p_yellow', 'p_green', 'p_blue', 'p_purple', 'p_black active'] }, // 기본 검정 활성
                 { type: 'range', name: 'thickness', className: 'draw-scale-range', label: '두께' },
                 { type: 'range', name: 'opacity', className: 'draw-trans-range', label: '투명도' },
                 { type: 'function', items: [{ type: 'arrow', items: ['ic_undo', 'ic_redo'] }, 'ic_del'] }
             ];

            toolRowsConfig.forEach(config => {
                const row = document.createElement('div');
                row.className = `tool-row ${config.type}-item`;
                if (config.type === 'function' || config.type === 'palette') {
                    config.items.forEach(item => {
                        if (typeof item === 'object' && item.type === 'arrow') {
                            const arrowItemDiv = document.createElement('div');
                            arrowItemDiv.className = 'arrow-item'; // 기존 클래스
                            item.items.forEach(arrowIcon => {
                                const button = document.createElement('button');
                                button.type = 'button';
                                button.className = arrowIcon; // 클래스로 아이콘 식별
                                arrowItemDiv.appendChild(button);
                            });
                            row.appendChild(arrowItemDiv);
                        } else {
                            const button = document.createElement('button');
                            button.type = 'button';
                            const classes = item.split(' ');
                            button.className = classes[0]; // 첫 번째 클래스를 주 식별자로 사용
                            if (classes.includes('active')) button.classList.add('active');
                            row.appendChild(button);
                        }
                    });
                } else if (config.type === 'range') {
                     if(config.label) {
                         const label = document.createElement('label');
                         label.textContent = config.label;
                         label.style.marginRight = '5px'; // 약간의 간격
                         row.appendChild(label);
                     }
                    const input = document.createElement('input');
                    input.type = 'range';
                    input.name = config.name; // name 속성으로 구분
                    input.className = config.className; // 스타일용 클래스
                    if (config.name === 'thickness') {
                        input.min = 1;
                        input.max = 30;
                        input.value = this.drawingInfo.thickness; // 초기값 설정
                    } else if (config.name === 'opacity') {
                        input.min = 0;
                        input.max = 1;
                        input.step = 0.1;
                        input.value = this.drawingInfo.opacity; // 초기값 설정
                    }
                    row.appendChild(input);
                }
                body.appendChild(row);
            });

             // 다각형 꼭지점 설정 팝업 (고유 ID 사용)
             const polygonPop = document.createElement('div');
             polygonPop.className = 'ic_polygon_pop'; // 스타일 클래스
             polygonPop.style.display = 'none'; // 기본 숨김
             polygonPop.innerHTML = `
                 <span>꼭지점</span>
                 <button type="button" class="ipp_minus">-</button>
                 <div>
                     <input type="text" name="ipp_num" id="${polygonNumId}" value="5" readonly style="width: 2em; text-align: center;">
                     <label for="${polygonNumId}">개</label>
                 </div>
                 <button type="button" class="ipp_plus">+</button>
             `;
             body.appendChild(polygonPop);


            drawToolWrap.appendChild(body);

            // 생성된 도구 모음을 placeholder 또는 body에 추가
            const parentElement = this.toolPlaceholder || document.body;
             // Placeholder가 있으면 그 안에, 없으면 body에 직접 추가
             // (주의: body에 추가 시 다른 요소와 겹칠 수 있으므로 placeholder 권장)
            parentElement.appendChild(drawToolWrap);
            this.toolWrap = drawToolWrap; // 인스턴스 변수에 참조 저장

            // 드래그 기능 적용
            makeDraggable(this.toolWrap, title);

        } catch (error) {
            console.error(`Error creating drawing tools for ${this.canvasId}:`, error);
        }
    }

    // 도구 UI 내 버튼 활성/비활성 상태 관리 헬퍼
    handleActiveState(clickedButton, groupSelector) {
        if (!this.toolWrap || !clickedButton) return;

        // 그룹 내 다른 버튼 비활성화
         this.toolWrap.querySelectorAll(groupSelector + '.active').forEach(btn => {
             if (btn !== clickedButton) btn.classList.remove('active');
         });

         // 현재 버튼 활성화 (토글이 아님)
         clickedButton.classList.add('active');

        // 팔레트/기능 버튼 그룹 간 상호 비활성화 (선택적)
         if (groupSelector.includes('.palette-item')) {
             this.toolWrap.querySelectorAll('.tool-row.function-item button.active').forEach(btn => btn.classList.remove('active'));
         } else if (groupSelector.includes('.function-item')) {
            this.toolWrap.querySelectorAll('.tool-row.palette-item button.active').forEach(btn => btn.classList.remove('active'));
         }

          // 텍스트 추가 모드 해제 (텍스트 버튼 클릭 제외)
          if (!clickedButton.classList.contains('ic_txt')) {
               this.isAddingTextbox = false;
               // this.fabricCanvas.defaultCursor = 'default'; // setCursor에서 처리됨
          }
          // 다각형 팝업 숨기기 (다각형 버튼 클릭 제외)
          if (!clickedButton.classList.contains('ic_polygon')) {
               const polygonPopup = this.toolWrap.querySelector('.ic_polygon_pop');
               if (polygonPopup) polygonPopup.style.display = 'none';
          }
    }

    // --- 이벤트 리스너 설정 ---
    attachEventListeners() {
        if (!this.fabricCanvas || !this.toolWrap) {
             console.error(`Cannot attach listeners: Canvas or ToolWrap not initialized for ${this.canvasId}`);
             return;
        }

        // --- 도구 모음 내 이벤트 리스너 ---
        const toolBody = this.toolWrap.querySelector('.draw-tool-wrap-body');
        if (!toolBody) return;

        // 닫기 버튼
        const closeBtn = this.toolWrap.querySelector('.close_but');
        if (closeBtn) closeBtn.addEventListener('click', () => {
            this.toolWrap.style.display = 'none';
        });

        // 기능 버튼 (Pen, Text, Eraser 등)
        toolBody.querySelectorAll('.tool-row.function-item button').forEach(button => {
            button.addEventListener('click', (e) => {
                const btnClass = e.currentTarget.classList[0]; // 첫 클래스를 식별자로 사용
                 this.handleActiveState(e.currentTarget, '.tool-row.function-item button');

                switch (btnClass) {
                    case 'ic_pen':
                    case 'ic_draw': // 펜과 동일 취급
                        this.startDraw(DRAW_OBJECTS.PEN);
                        break;
                    case 'ic_txt':
                         this.startDraw(DRAW_OBJECTS.TEXTBOX); // startDraw 내부에서 isAddingTextbox=true 설정
                         // 실제 Textbox 생성은 mouse:down 에서
                        break;
                    case 'ic_eraser':
                        this.setDeleteMode(true);
                        break;
                     case 'ic_triangle':
                         this.startDraw(DRAW_OBJECTS.TRIANGLE); // 현재는 펜 Fallback
                         break;
                     case 'ic_square':
                         this.startDraw(DRAW_OBJECTS.SQUARE);   // 현재는 펜 Fallback
                         break;
                     case 'ic_circle':
                         this.startDraw(DRAW_OBJECTS.CIRCLE);   // 현재는 펜 Fallback
                         break;
                    case 'ic_polygon':
                        // 다각형 팝업 토글
                        const polygonPopup = this.toolWrap.querySelector('.ic_polygon_pop');
                        if (polygonPopup) {
                             polygonPopup.style.display = polygonPopup.style.display === 'none' ? 'flex' : 'none';
                        }
                         this.startDraw(DRAW_OBJECTS.N_OBJECT); // 현재는 펜 Fallback
                        break;
                    case 'ic_line':
                         this.changeStrokeStyle(false); // 선택 객체 & 다음 객체 실선
                         this.startDraw(DRAW_OBJECTS.LINE); // 현재는 펜 Fallback
                         // 실제 직선 그리기는 mouse:down/up으로 구현 필요
                        break;
                    case 'ic_dash':
                         this.changeStrokeStyle(true); // 선택 객체 & 다음 객체 점선
                         this.startDraw(DRAW_OBJECTS.LINE); // 현재는 펜 Fallback, 점선 브러시 필요
                        break;
                    case 'ic_pull': // 선택 모드
                         this.fabricCanvas.isDrawingMode = false;
                         this.isDeletingMode = false;
                         this.isAddingTextbox = false;
                         this.fabricCanvas.selection = true;
                         this.fabricCanvas.forEachObject(obj => { obj.selectable = true; obj.evented = true; });
                         this.setCursor();
                         this.fabricCanvas.requestRenderAll();
                        break;
                    case 'ic_undo':
                        this.undo();
                        break;
                    case 'ic_redo':
                        this.redo();
                        break;
                    case 'ic_del': // 전체 삭제
                         this.clearCanvas();
                        break;
                }
            });
        });

        // 색상 팔레트 버튼
         const paletteColors = {
             '.p_red': '#EE4F24', '.p_yellow': '#FFDE6A', '.p_green': '#07BBA9',
             '.p_blue': '#3B71FE', '.p_purple': '#6247DC', '.p_black': '#000000'
         };
         Object.entries(paletteColors).forEach(([selector, color]) => {
             const button = toolBody.querySelector(selector);
             if (button) button.addEventListener('click', (e) => {
                 this.handleActiveState(e.currentTarget, '.tool-row.palette-item button');
                 this.changeColorCanvasObject(color);
             });
         });

        // 두께/투명도 Range Input
        const thicknessRange = toolBody.querySelector('input[name="thickness"]');
        if (thicknessRange) thicknessRange.addEventListener('input', (e) => {
            this.changeThickness(e.target.value);
        });
         const opacityRange = toolBody.querySelector('input[name="opacity"]');
         if (opacityRange) opacityRange.addEventListener('input', (e) => {
             this.changeOpacity(e.target.value);
         });

        // 다각형 팝업 내 버튼 (+/-)
        const polygonPopup = toolBody.querySelector('.ic_polygon_pop');
        if (polygonPopup) {
            const numInput = polygonPopup.querySelector(`#ipp_num_${this.canvasId}`); // 고유 ID 사용
            const minusBtn = polygonPopup.querySelector('.ipp_minus');
            const plusBtn = polygonPopup.querySelector('.ipp_plus');
            if (minusBtn && numInput) minusBtn.addEventListener('click', () => {
                let currentVal = parseInt(numInput.value, 10);
                if (currentVal > 3) numInput.value = currentVal - 1;
                 // 값 변경 시 N_OBJECT 그리기에 영향 주도록 로직 추가 가능
                 // this.startDraw(DRAW_OBJECTS.N_OBJECT); // 또는 관련 정보 업데이트
            });
            if (plusBtn && numInput) plusBtn.addEventListener('click', () => {
                let currentVal = parseInt(numInput.value, 10);
                // 최대값 제한 (예: 12)
                if (currentVal < 12) numInput.value = currentVal + 1;
                 // this.startDraw(DRAW_OBJECTS.N_OBJECT);
            });
        }


        // --- 전역 수준 이벤트 리스너 (인스턴스 컨텍스트 유지 필요) ---

        // 트리거 버튼 클릭 시 도구 모음 토글
        if (this.triggerButton) {
            this.triggerButton.addEventListener('click', (event) => {
                 // 다른 도구 모음 숨기기 (선택적)
                 document.querySelectorAll('.draw-tool-wrap').forEach(wrap => {
                      if (wrap !== this.toolWrap) wrap.style.display = 'none';
                 });

                const isHidden = this.toolWrap.style.display === 'none';
                if (isHidden) {
                    this.toolWrap.style.display = 'block';
                } else {
                    this.toolWrap.style.display = 'none';
                }
            });
        }

        // Delete 키 이벤트 리스너 (문서 전체에 하나만 등록하고, 내부에서 활성 캔버스 구분 필요)
        // 주의: 이 방식은 여러 인스턴스가 동시에 키 이벤트를 처리하려 할 수 있음.
        // 더 나은 방법: 현재 활성화된 캔버스 인스턴스를 추적하는 메커니즘 필요.
        // 임시방편: 각 인스턴스가 리스너를 달되, 자신의 캔버스에 focus가 있을 때만 동작하도록 시도.
        //           (하지만 focus 관리가 복잡할 수 있음)
        // 여기서는 this.handleDeleteKey를 호출하는 리스너를 추가.
        // document.addEventListener('keyup', this.handleDeleteKey.bind(this));
        // --> 이렇게 하면 모든 인스턴스가 keyup에 반응. 아래 DOMContentLoaded에서 통합 관리.

    }
}

// --- 페이지 로드 시 DrawingCanvas 인스턴스 생성 ---
runAfterAppReady(function() {
    console.log('DOMContentLoaded event fired.'); // 로그 추가
    // const drawingCanvases = []; // 로컬 배열 대신 전역 객체 사용

    // data-canvas-target 속성을 가진 모든 .btn.drawing 버튼 찾기
    document.querySelectorAll('.btn.drawing[data-canvas-target]').forEach(button => {
        const canvasId = button.dataset.canvasTarget;
        console.log(`Found button for canvas ID: ${canvasId}`); // 로그 추가

        if (canvasId && document.getElementById(canvasId)) {
            console.log(`Canvas element #${canvasId} found.`); // 로그 추가
            // 이미 해당 ID로 인스턴스가 생성되지 않았다면 생성
             if (!window.drawingCanvasInstances[canvasId]) { // 전역 객체에서 확인
                 console.log(`Creating DrawingCanvas instance for ${canvasId}...`); // 로그 추가
                 try {
                     const instance = new DrawingCanvas(canvasId);
                     // 생성 실패 시 (요소 없음 등) instance.fabricCanvas 등이 null일 수 있음
                     if (instance && instance.fabricCanvas) {
                          console.log(`DrawingCanvas instance for ${canvasId} created successfully.`); // 로그 추가
                          window.drawingCanvasInstances[canvasId] = instance; // 전역 객체에 등록
                     } else {
                         console.error(`Failed to fully initialize DrawingCanvas for ${canvasId}. fabricCanvas is null.`); // 오류 로그 추가
                     }
                 } catch (error) {
                     console.error(`Error creating DrawingCanvas instance for ${canvasId}:`, error); // 오류 로그 추가
                 }
             } else {
                 console.log(`Instance for ${canvasId} already exists.`); // 로그 추가
             }
        } else {
            console.warn(`Button found for canvas '${canvasId}', but canvas element with ID '${canvasId}' not found.`); // 경고 로그 수정
        }
    });

     // 전역 Delete 키 리스너 (한 번만 등록)
     document.addEventListener('keyup', (event) => {
         if (event.key === 'Delete' || event.key === 'Backspace') {
             // 현재 활성화된 Fabric.js 캔버스 찾기 (Fabric.js가 내부적으로 관리하는 방식 활용 시도)
             const activeCanvas = fabric.getActiveCanvas && fabric.getActiveCanvas(); // 이 함수가 없을 수 있음
             let targetInstance = null;

             if (activeCanvas) {
                  // activeCanvas 객체에서 ID를 얻거나, 인스턴스 배열과 비교하여 찾아야 함
                  // 예: targetInstance = drawingCanvases.find(inst => inst.fabricCanvas === activeCanvas);
                  // Fabric.js v5+ 에서는 canvas.upperCanvasEl.id 등으로 ID 접근 가능할 수 있음
                  const activeCanvasId = activeCanvas.lowerCanvasEl?.id || activeCanvas.upperCanvasEl?.id;
                  if (activeCanvasId) {
                      targetInstance = window.drawingCanvasInstances[activeCanvasId];
                  }
             } else {
                 // Active Canvas를 못 찾는 경우, 마지막으로 상호작용한 인스턴스 추적 등 다른 방법 필요
                 // 또는 현재 포커스된 요소가 특정 캔버스 영역 내부에 있는지 확인
                 // 여기서는 임시로 첫 번째 인스턴스만 처리 (개선 필요)
                 // targetInstance = drawingCanvases.length > 0 ? drawingCanvases[0] : null;
                 console.warn("Could not determine active canvas for keyup event. Delete key might not work reliably for multiple canvases.");
                 // **개선 아이디어**: 사용자가 캔버스를 클릭/터치했을 때 해당 인스턴스를 '활성'으로 표시하는 전역 변수/상태 관리
             }


             if (targetInstance) {
                 targetInstance.handleDeleteKey(event);
             } else {
                  // 현재 활성 객체가 있는 '다른' 캔버스가 있는지 순회하며 확인 (덜 효율적)
                  for (const instance of Object.values(window.drawingCanvasInstances)) {
                       if (instance.fabricCanvas?.getActiveObject()) {
                           // 편집 중인 텍스트박스에서 Backspace는 무시
                           if (instance.fabricCanvas.getActiveObject().isEditing && event.key === 'Backspace') {
                               continue;
                           }
                           instance.handleDeleteKey(event);
                           break; // 첫 번째 활성 객체가 있는 캔버스에서 처리 후 중단
                       }
                  }
             }
         }
     });

    console.log(`Initialization attempt finished. Total instances created: ${Object.keys(window.drawingCanvasInstances).length}`); // 전역 객체 기반으로 수정
});

// --- 외부 호출용 리셋 함수 --- 
function resetCanvasesOnPage(pageElement) {
    const targetElement = pageElement || (window.pagenation && window.pagenation.activePage);

    if (!targetElement) {
        console.warn("resetCanvasesOnPage: Target page element not found. Provide an element or ensure pagenation.activePage exists.");
        return;
    }

    console.log("Resetting canvases within element:", targetElement);
    const canvasesOnPage = targetElement.querySelectorAll('.drawing_canvas_area[id]'); // ID가 있는 캔버스만 선택

    canvasesOnPage.forEach(canvasEl => {
        const canvasId = canvasEl.id;
        if (window.drawingCanvasInstances && window.drawingCanvasInstances[canvasId]) {
            console.log(`Resetting canvas: ${canvasId}`);
            window.drawingCanvasInstances[canvasId].clearCanvas(true); // true를 전달하여 확인 없이 리셋
        } else {
             // 캔버스는 찾았지만 인스턴스가 없는 경우 (초기화 실패 등)
             console.log(`Canvas ${canvasId} found on page, but no corresponding DrawingCanvas instance found in window.drawingCanvasInstances.`);
        }
    });
}

