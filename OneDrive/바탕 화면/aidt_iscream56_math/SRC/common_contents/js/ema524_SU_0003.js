document.addEventListener("DOMContentLoaded", () => {
    const btnCheckOk = document.getElementById('btn_check_ok');
    const btnCheckError = document.getElementById('btn_check_error');
    const switchMenus = document.getElementsByClassName('piece_switch_wrap');
    const btnReset = document.querySelector('section > .btn_area > .btnReset');
    const mathFields = document.querySelectorAll('math-field[data-answer-single="정답"]');
    const calculatorGroups = document.getElementsByClassName('calculator-group');
    let lastMovedColor = null;
    let lastMovedPiece = null;
    let lastStartPosition = null;
    
    btnReset.classList.remove('active');

    mathFields.forEach(field => {
        field.addEventListener('input', () => {
            btnReset.classList.add('active');
        });
    });

    const topResetBtn = document.querySelector('.submit_wrap .input_line .btnReset');
    const targetInput = document.getElementById('top_reset_target');
    
    if (topResetBtn && targetInput) {
        targetInput.addEventListener('input', () => {
            topResetBtn.classList.add('active');
        });

        topResetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (topResetBtn.classList.contains('active')) {
                targetInput.value = '';
                topResetBtn.classList.remove('active');
                e.stopImmediatePropagation();
            }
        });
    }

    if (btnCheckOk) {
        btnCheckOk.addEventListener('click', function () {
            if (switchMenus && 0 < switchMenus.length) {
                for (let i = 0; i < switchMenus.length; i++) {
                    const switchMenu = switchMenus[i];
                    if (switchMenu) {
                        const pieceWrap = switchMenu.closest('.go_piece_wrap');
                        const isWhitePiece = pieceWrap.classList.contains('white');
                        
                        if ((isWhitePiece && lastMovedColor === 'white') ||
                            (!isWhitePiece && lastMovedColor === 'black')) {
                            if (switchMenu.classList.contains('on')) {
                                switchMenu.classList.remove('on');
                            } else {
                                switchMenu.classList.add('on');
                            }
                        }
                    }
                }
            }
            btnReset.classList.add('active');
        });
    }

    if (btnCheckError) {
        btnCheckError.addEventListener('click', function() {
            if (lastMovedPiece && lastStartPosition) {
                const currentParent = lastMovedPiece.parentElement;
                if (currentParent) {
                    currentParent.removeChild(lastMovedPiece);
                }
                lastStartPosition.appendChild(lastMovedPiece);
                lastMovedPiece.style.transform = '';
                btnReset.classList.add('active');
            }
        });
    }

    const yellowButtons = document.querySelectorAll('.btn_switch_yellow');
    const redButtons = document.querySelectorAll('.btn_switch_red');

    yellowButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parentCol = button.closest('.map_grid_col');
            const switchMenu = button.closest('.piece_switch_wrap');
            const pieceWrap = switchMenu?.closest('.go_piece_wrap');
            
            if (parentCol) {
                parentCol.classList.remove('mark1');
                parentCol.classList.add('mark2');
            }
            if (switchMenu) {
                switchMenu.classList.remove('on');
            }
            
            if (pieceWrap && lastStartPosition) {
                const currentParent = pieceWrap.parentElement;
                if (currentParent) {
                    currentParent.removeChild(pieceWrap);
                }
                lastStartPosition.appendChild(pieceWrap);
                pieceWrap.style.transform = '';
            }
            
            btnReset.classList.add('active');
        });
    });

    redButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parentCol = button.closest('.map_grid_col');
            const switchMenu = button.closest('.piece_switch_wrap');
            const pieceWrap = switchMenu?.closest('.go_piece_wrap');
            
            if (parentCol) {
                parentCol.classList.remove('mark2');
                parentCol.classList.add('mark1');
            }
            if (switchMenu) {
                switchMenu.classList.remove('on');
            }
            
            if (pieceWrap && lastStartPosition) {
                const currentParent = pieceWrap.parentElement;
                if (currentParent) {
                    currentParent.removeChild(pieceWrap);
                }
                lastStartPosition.appendChild(pieceWrap);
                pieceWrap.style.transform = '';
            }
            
            btnReset.classList.add('active');
        });
    });

    const startPositions = document.querySelectorAll('.map_grid_col_start01, .map_grid_col_start02');
    const allGridCols = document.querySelectorAll('.map_grid_col');
    const gridColsArray = Array.from(allGridCols).filter(col => 
        !col.classList.contains('map_grid_col_start01') && 
        !col.classList.contains('map_grid_col_start02')
    );

    function createGoPiece(isWhite) {
        const wrap = document.createElement('div');
        wrap.className = `go_piece_wrap${isWhite ? ' white' : ''}`;
        
        const piece = document.createElement('div');
        piece.className = 'go_piece';
        
        const switchWrap = document.createElement('div');
        switchWrap.className = 'piece_switch_wrap';
        
        const yellowBtn = document.createElement('button');
        yellowBtn.className = 'btn btn_switch btn_switch_yellow';
        yellowBtn.addEventListener('click', () => {
            const parentCol = yellowBtn.closest('.map_grid_col');
            const pieceWrap = switchWrap.closest('.go_piece_wrap');
            
            if (parentCol) {
                parentCol.classList.remove('mark1');
                parentCol.classList.add('mark2');
            }
            switchWrap.classList.remove('on');
            
            if (pieceWrap && lastStartPosition) {
                const currentParent = pieceWrap.parentElement;
                if (currentParent) {
                    currentParent.removeChild(pieceWrap);
                }
                lastStartPosition.appendChild(pieceWrap);
                pieceWrap.style.transform = '';
            }
            
            btnReset.classList.add('active');
        });
        
        const redBtn = document.createElement('button');
        redBtn.className = 'btn btn_switch btn_switch_red';
        redBtn.addEventListener('click', () => {
            const parentCol = redBtn.closest('.map_grid_col');
            const pieceWrap = switchWrap.closest('.go_piece_wrap');
            
            if (parentCol) {
                parentCol.classList.remove('mark2');
                parentCol.classList.add('mark1');
            }
            switchWrap.classList.remove('on');
            
            // Return Go piece to starting position
            if (pieceWrap && lastStartPosition) {
                const currentParent = pieceWrap.parentElement;
                if (currentParent) {
                    currentParent.removeChild(pieceWrap);
                }
                lastStartPosition.appendChild(pieceWrap);
                pieceWrap.style.transform = '';
            }
            
            btnReset.classList.add('active');
        });
        
        switchWrap.appendChild(yellowBtn);
        switchWrap.appendChild(redBtn);
        wrap.appendChild(piece);
        wrap.appendChild(switchWrap);
        
        return wrap;
    }

    function moveToRandomPosition(startPos) {
        const isStartOne = startPos.classList.contains('map_grid_col_start01');
        const goPiece = createGoPiece(isStartOne);
        
        lastMovedColor = isStartOne ? 'white' : 'black';
        lastStartPosition = startPos;
        
        const randomIndex = Math.floor(Math.random() * gridColsArray.length);
        const targetCol = gridColsArray[randomIndex];

        if (targetCol.querySelector('.go_piece_wrap')) {
            moveToRandomPosition(startPos);
            return;
        }

        const existingPieces = document.querySelectorAll('.go_piece_wrap');
        existingPieces.forEach(piece => {
            const pieceParent = piece.closest('.map_grid_col');
            if ((isStartOne && piece.classList.contains('white')) || 
                (!isStartOne && !piece.classList.contains('white'))) {
                if (!pieceParent.classList.contains('map_grid_col_start01') && 
                    !pieceParent.classList.contains('map_grid_col_start02')) {
                    piece.parentElement.removeChild(piece);
                }
            }
        });

        const originalPiece = startPos.querySelector('.go_piece_wrap');
        if (originalPiece) {
            startPos.removeChild(originalPiece);
        }

        const startRect = startPos.getBoundingClientRect();
        const targetRect = targetCol.getBoundingClientRect();
        
        const deltaX = targetRect.left - startRect.left;
        const deltaY = targetRect.top - startRect.top;
        
        goPiece.style.transform = `translate(${-deltaX}px, ${-deltaY}px)`;
        targetCol.appendChild(goPiece);
        lastMovedPiece = goPiece;

        requestAnimationFrame(() => {
            goPiece.style.transform = '';
            btnReset.classList.add('active');
        });
    }

    startPositions.forEach(startPos => {
        startPos.addEventListener('click', () => {
            moveToRandomPosition(startPos);
        });
    });

    btnReset.addEventListener('click', () => {
        location.reload();
    });

    function returncalculatorNumber(display, val) {
        let calculatorTagType = 'input';
        if (display.tagName.toLowerCase() === 'input') {
            calculatorTagType = 'input';
        } else {
            calculatorTagType = 'span';
        }

        if (calculatorTagType === 'input') {
            display.value = val;
        } else {
            display.innerHTML = val;
        }
    }

    function replacedFormula(calculatorFormula, val) {
        let string;
        let parts;
        if (val) {
            parts = calculatorFormula.split(/(\d+|[+\-*/])/).filter(Boolean);
            for (let i = 0; i < parts.length; i++) {
                if (parts[i] == '0' || parts[i] == '00') {
                    parts[i] = '0';
                }
            }
            string = parts.join('');
            calculatorFormula = string;
            string = string.replace(/\*/g, '×').replace(/\//g, '÷');
        } else {
            string = calculatorFormula.replace(/\×/g, '*').replace(/\÷/g, '/');
        }

        return string;
    }

    function isNumber(value) {
        return !isNaN(Number(value));
    }

    if (calculatorGroups && 0 < calculatorGroups.length) {
        for (let i = 0; i < calculatorGroups.length; i++) {
            const calculatorGroup = calculatorGroups[i];
            const calculator = calculatorGroup.querySelector('.calculator');
            const calculatorDisplay = calculatorGroup.querySelector('.cal-display');
            const btnToggleCalculator = calculatorGroup.querySelector('.btn-toggle-calculator');
            const btnCloseCalculator = calculatorGroup.querySelector('.btn-close-calculator');
            const btnCalculators = calculatorGroup.querySelectorAll('.btn-calculator');

            let calculatorCurrentInput = '';
            let calculatorLastNumber = '';
            let calculatorFormula = '';
            let calculatorIsNumber = false;

            if (btnToggleCalculator) {
                btnToggleCalculator.addEventListener('click', function () {
                    if (!calculator.style.display || 'none' == calculator.style.display) {
                        calculator.style.display = 'block';
                    } else {
                        calculator.style.display = 'none';
                    }
                });
            }

            if (btnCloseCalculator) {
                btnCloseCalculator.addEventListener('click', function () {
                    calculator.style.display = 'none';
                });
            }
            
            if (btnCalculators && 0 < btnCalculators.length) {
                for (let j = 0; j < btnCalculators.length; j++) {
                    const btnCalculator = btnCalculators[j];
                    btnCalculator.addEventListener('click', function (e) {
                        e.stopPropagation();
                        audioManager.playSound("click");
                        const value = this.dataset.value;
            
                        if (value === 'AC') {
                            calculatorCurrentInput = '';
                            calculatorLastNumber = '';
                            calculatorFormula = '';
                            calculatorIsNumber = false;
                            returncalculatorNumber(calculatorDisplay, 0);
                        } else if (value === 'CE') {
                            calculatorCurrentInput = '';
                            calculatorLastNumber = '';
                            calculatorFormula = '';
                            calculatorIsNumber = false;
                            returncalculatorNumber(calculatorDisplay, 0);
                        } else if (value === '=') {
                            if (isNumber(calculatorLastNumber) || calculatorLastNumber === '%') {
                                let result = eval(replacedFormula(calculatorFormula, false)) || 0;
                                result = Math.round(result * 1000) / 1000;
                                returncalculatorNumber(calculatorDisplay, result);
                                calculatorCurrentInput = result;
                                calculatorFormula = result;
                                calculatorLastNumber = result;
                                calculatorIsNumber = true;
                            }
                        } else if (value === '*' || value === '/' || value === '+' || value === '-') {
                            if (calculatorIsNumber || calculatorLastNumber === '.' || calculatorLastNumber === '%') {
                                calculatorFormula += ' ' + value + ' ';
                                calculatorIsNumber = false;
                                calculatorLastNumber = 'false';
                            }
                            returncalculatorNumber(calculatorDisplay, replacedFormula(calculatorFormula, true));
                        } else if (value === '.') {
                            if (calculatorIsNumber) {
                                calculatorFormula += value;
                            } else if (!calculatorIsNumber) {
                                calculatorFormula += '0' + value;
                            }
                            calculatorIsNumber = true;
                            calculatorLastNumber = value;
                            returncalculatorNumber(calculatorDisplay, replacedFormula(calculatorFormula, true));
                        } else if (value === '%') {
                            if (calculatorIsNumber) {
                                const lastValues = calculatorFormula.match(/([\d\.])+$/);
                                if (lastValues && 0 < lastValues.length) {
                                    const lastNumberPercent = lastValues[0] / 100;
                                    calculatorFormula = calculatorFormula.replace(/([\d\.])+$/, '');
                                    calculatorFormula += lastNumberPercent;
                                    calculatorIsNumber = true;
                                    calculatorLastNumber = lastNumberPercent[lastNumberPercent.length - 1];
                                    returncalculatorNumber(calculatorDisplay, replacedFormula(calculatorFormula, true));
                                }
                            }
                        } else {
                            calculatorIsNumber = true;
                            calculatorFormula += String(value);
                            calculatorLastNumber = value;
                            returncalculatorNumber(calculatorDisplay, replacedFormula(calculatorFormula, true));
                        }
                    });
                }
            }
        }
    }
});