const calculator = document.querySelector('.calculator');
const display = document.getElementById('display');
const keys = document.querySelector('.calculator__keys');

const calculate = (n1, operator, n2) => {
    const num1 = parseFloat(n1);
    const num2 = parseFloat(n2);
    if (operator === 'add') return num1 + num2;
    if (operator === 'subtract') return num1 - num2;
    if (operator === 'multiply') return num1 * num2;
    if (operator === 'divide') return num1 / num2;
};

const getKeyType = (key) => {
    const action = key.dataset.action;
    if (!action) return 'number';
    if (['add','subtract','multiply','divide'].includes(action)) return 'operator';
    return action;
};

const createResultString = (key, displayedNum, state) => {
    const keyType = getKeyType(key);
    const firstValue = state.firstValue;
    const operator = state.operator;
    const modValue = state.modValue;
    const previousKeyType = state.previousKeyType;

    if (keyType === 'number') {
        return (displayedNum === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate')
            ? key.textContent
            : displayedNum + key.textContent;
    }
    if (keyType === 'decimal') {
        if (!displayedNum.includes('.')) return displayedNum + '.';
        if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.';
        return displayedNum;
    }
    if (keyType === 'operator') {
        return (firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate')
            ? calculate(firstValue, operator, displayedNum)
            : displayedNum;
    }
    if (keyType === 'clear') return '0';
    if (keyType === 'calculate') {
        if (!firstValue) return displayedNum;
        const secondValue = (previousKeyType === 'calculate') ? modValue : displayedNum;
        return calculate(firstValue, operator, secondValue);
    }
    return displayedNum;
};

const updateCalculatorState = (key, calculator, resultString, displayedNum) => {
    const keyType = getKeyType(key);
    calculator.dataset.previousKeyType = keyType;

    if (keyType === 'operator') {
        const firstValue = calculator.dataset.firstValue;
        const operator = calculator.dataset.operator;
        calculator.dataset.firstValue = (firstValue && operator && calculator.dataset.previousKeyType !== 'operator' && calculator.dataset.previousKeyType !== 'calculate')
            ? resultString
            : displayedNum;
        calculator.dataset.operator = key.dataset.action;
    }
    if (keyType === 'calculate') {
        calculator.dataset.modValue = displayedNum;
    }
    if (keyType === 'clear' && key.textContent === 'AC') {
        calculator.dataset.firstValue = '';
        calculator.dataset.modValue = '';
        calculator.dataset.operator = '';
        calculator.dataset.previousKeyType = '';
    }
};

const updateVisualState = (key, calculator) => {
    Array.from(keys.children).forEach(k => k.classList.remove('is-depressed'));
    if (getKeyType(key) === 'operator') key.classList.add('is-depressed');

    const clearBtn = calculator.querySelector('[data-action="clear"]');
    if (getKeyType(key) !== 'clear') clearBtn.textContent = 'CE';
    else if (key.textContent === 'CE') clearBtn.textContent = 'AC';
};

keys.addEventListener('click', e => {
    if (!e.target.matches('button')) return;
    const key = e.target;
    const displayedNum = display.textContent;
    const resultString = createResultString(key, displayedNum, calculator.dataset);

    display.textContent = resultString;
    updateCalculatorState(key, calculator, resultString, displayedNum);
    updateVisualState(key, calculator);
});