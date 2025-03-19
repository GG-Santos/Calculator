class Calculator {
    constructor() {
        this.previousOperandElement = document.getElementById('previousOperand');
        this.currentOperandElement = document.getElementById('currentOperand');
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }a

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperandElement.textContent = 'Error';
                    this.previousOperandElement.textContent = '';
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

// Initialize calculator
const calculator = new Calculator();

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Number buttons
    document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.textContent);
        });
    });

    // Operation buttons
    document.querySelectorAll('[data-operation]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.textContent);
        });
    });

    // Equals button
    document.querySelector('[data-equals]').addEventListener('click', () => {
        calculator.compute();
    });

    // Clear button
    document.querySelector('[data-action="clear"]').addEventListener('click', () => {
        calculator.clear();
    });

    // Delete button
    document.querySelector('[data-action="delete"]').addEventListener('click', () => {
        calculator.delete();
    });

    // Keyboard support
    document.addEventListener('keydown', (event) => {
        if (event.key >= '0' && event.key <= '9' || event.key === '.') {
            calculator.appendNumber(event.key);
        }
        if (event.key === '+' || event.key === '-' || 
            event.key === '*' || event.key === '/') {
            let operation = event.key;
            if (operation === '*') operation = '×';
            if (operation === '/') operation = '÷';
            calculator.chooseOperation(operation);
        }
        if (event.key === 'Enter' || event.key === '=') {
            event.preventDefault();
            calculator.compute();
        }
        if (event.key === 'Backspace') {
            calculator.delete();
        }
        if (event.key === 'Escape') {
            calculator.clear();
        }
    });
});
