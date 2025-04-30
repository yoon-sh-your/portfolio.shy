document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('form');
    const calculatorGroups = document.getElementsByClassName('calculator-group');
    const inputValues = document.getElementsByClassName('input_value');
    const input1Values = document.getElementsByClassName('input_1_value');
    const input2Values = document.getElementsByClassName('input_2_value');
    const input3Values = document.getElementsByClassName('input_3_value');
    const input4Values = document.getElementsByClassName('input_4_value');
    const inputResults = document.getElementsByClassName('input_result');
    const input1Result = document.getElementById('input_1_result');
    const input2Result = document.getElementById('input_2_result');
    const input3Result = document.getElementById('input_3_result');
    const input4Result = document.getElementById('input_4_result');
    const btnReset = document.getElementById('btnReset');

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
            console.log(string);
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

            // 계산기
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
                                // calculatorResultArea && calculatorResultArea.val(result);
                                calculatorCurrentInput = result;
                                calculatorFormula = result;
                                calculatorLastNumber = result;
                                calculatorIsNumber = true;
                                // valueCk(); // 확인버튼 켜기/끄기
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
                                    console.log(lastNumberPercent);
                                    console.log(`${lastNumberPercent}`[`${lastNumberPercent}`.length - 1]);
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

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (input1Values && input1Result && 0 < input1Values.length) {
                let sumValue1 = 0;
                let evrValue1 = 0;
                for (let inputValue of input1Values) {
                    const inputWrap = inputValue.closest('.input_wrap');
                    if (!inputValue.value) {
                        if (inputWrap) {
                            inputWrap.classList.add('error');
                            inputWrap.classList.add('error_empty');
                        }
                        toastCheckMsg("문제를 풀어보세요!", 2, false);
                        return;
                    }

                    if (inputValue.value.match(/[^\d]/g) || isNaN(parseInt(inputValue.value))) {
                        if (inputWrap) {
                            inputWrap.classList.add('error');
                            inputWrap.classList.add('error_number');
                        }
                        return;
                    }

                    if (inputWrap.classList.contains('error')) {
                        inputWrap.classList.remove('error');
                    }

                    if (inputWrap.classList.contains('error_empty')) {
                        inputWrap.classList.remove('error_empty');
                    }

                    if (inputWrap.classList.contains('error_number')) {
                        inputWrap.classList.remove('error_number');
                    }
                    sumValue1 += parseInt(inputValue.value);
                }

                evrValue1 = sumValue1 / 4;

                if (!input1Result.value) {
                    toastCheckMsg("문제를 풀어보세요!", 2, false);
                    return;
                }
            }

            if (input2Values && input2Result && 0 < input2Values.length) {
                let sumValue2 = 0;
                let evrValue2 = 0;
                for (let inputValue of input2Values) {
                    const inputWrap = inputValue.closest('.input_wrap');
                    if (!inputValue.value) {
                        if (inputWrap) {
                            inputWrap.classList.add('error');
                            inputWrap.classList.add('error_empty');
                        }
                        toastCheckMsg("문제를 풀어보세요!", 2, false);
                        return;
                    }

                    if (inputValue.value.match(/[^\d]/g) || isNaN(parseInt(inputValue.value))) {
                        if (inputWrap) {
                            inputWrap.classList.add('error');
                            inputWrap.classList.add('error_number');
                        }
                        return;
                    }

                    if (inputWrap.classList.contains('error')) {
                        inputWrap.classList.remove('error');
                    }

                    if (inputWrap.classList.contains('error_empty')) {
                        inputWrap.classList.remove('error_empty');
                    }

                    if (inputWrap.classList.contains('error_number')) {
                        inputWrap.classList.remove('error_number');
                    }
                    sumValue2 += parseInt(inputValue.value);
                }

                evrValue2 = sumValue2 / 4;

                if (!input2Result.value || evrValue2 != input2Result.value) {
                    toastCheckMsg("문제를 풀어보세요!", 2, false);
                    return;
                }
            }

            if (input3Values && input3Result && 0 < input3Values.length) {
                let sumValue3 = 0;
                let evrValue3 = 0;
                for (let inputValue of input3Values) {
                    const inputWrap = inputValue.closest('.input_wrap');
                    if (!inputValue.value) {
                        if (inputWrap) {
                            inputWrap.classList.add('error');
                            inputWrap.classList.add('error_empty');
                        }
                        toastCheckMsg("문제를 풀어보세요!", 2, false);
                        return;
                    }

                    if (inputValue.value.match(/[^\d]/g) || isNaN(parseInt(inputValue.value))) {
                        if (inputWrap) {
                            inputWrap.classList.add('error');
                            inputWrap.classList.add('error_number');
                        }
                        return;
                    }

                    if (inputWrap.classList.contains('error')) {
                        inputWrap.classList.remove('error');
                    }

                    if (inputWrap.classList.contains('error_empty')) {
                        inputWrap.classList.remove('error_empty');
                    }

                    if (inputWrap.classList.contains('error_number')) {
                        inputWrap.classList.remove('error_number');
                    }
                    sumValue3 += parseInt(inputValue.value);
                }

                evrValue3 = sumValue3 / 4;

                if (!input3Result.value || evrValue3 != input3Result.value) {
                    toastCheckMsg("문제를 풀어보세요!", 2, false);
                    return;
                }
            }

            if (input4Values && input4Result && 0 < input4Values.length) {
                let sumValue4 = 0;
                let evrValue4 = 0;
                for (let inputValue of input4Values) {
                    const inputWrap = inputValue.closest('.input_wrap');
                    if (!inputValue.value) {
                        if (inputWrap) {
                            inputWrap.classList.add('error');
                            inputWrap.classList.add('error_empty');
                        }
                        toastCheckMsg("문제를 풀어보세요!", 2, false);
                        return;
                    }

                    if (inputValue.value.match(/[^\d]/g) || isNaN(parseInt(inputValue.value))) {
                        if (inputWrap) {
                            inputWrap.classList.add('error');
                            inputWrap.classList.add('error_number');
                        }
                        return;
                    }

                    if (inputWrap.classList.contains('error')) {
                        inputWrap.classList.remove('error');
                    }

                    if (inputWrap.classList.contains('error_empty')) {
                        inputWrap.classList.remove('error_empty');
                    }

                    if (inputWrap.classList.contains('error_number')) {
                        inputWrap.classList.remove('error_number');
                    }
                    sumValue4 += parseInt(inputValue.value);
                }

                evrValue4 = sumValue4 / 4;

                if (!input4Result.value || evrValue4 != input4Result.value) {
                    toastCheckMsg("문제를 풀어보세요!", 2, false);
                    return;
                }
            }

            toastCheckMsg("정답이에요!", 4, false);
            //this.submit();
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', function (e) {
            const errorInputs = document.getElementsByClassName('error');
            console.log(errorInputs);
            if (errorInputs && 0 < errorInputs.length) {
                for (let i = 0; i < errorInputs.length; i++) {
                    const errorInput = errorInputs[i];
                    if (errorInput.classList.contains('error_empty')) {
                        errorInput.classList.remove('error_empty');
                    }
                    
                    if (errorInput.classList.contains('error_number')) {
                        errorInput.classList.remove('error_number');
                    }
                    
                    if (errorInput.classList.contains('error')) {
                        errorInput.classList.remove('error');
                    }
                }
            }
        });
    }
});