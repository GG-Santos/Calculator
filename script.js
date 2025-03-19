class Calculator {
  constructor() {
    this.expression = '';
    this.previousOperandElement = document.getElementById('previousOperand');
    this.currentOperandElement = document.getElementById('currentOperand');
    this.updateDisplay();
  }

  clear() {
    this.expression = '';
    this.previousOperandElement.textContent = '';
    this.updateDisplay();
  }

  delete() {
    this.expression = this.expression.slice(0, -1);
    this.updateDisplay();
  }

  appendInput(input) {
    // Replace a lone "0" if a new number (except decimal) is entered.
    if (this.expression === '0' && input !== '.') {
      this.expression = input;
    } else {
      this.expression += input;
    }
    this.updateDisplay();
  }

  // Appends a parenthesis based on the current expression context.
  appendParenthesis() {
    const openCount = (this.expression.match(/\(/g) || []).length;
    const closeCount = (this.expression.match(/\)/g) || []).length;
    const unmatched = openCount - closeCount;
    const lastChar = this.expression[this.expression.length - 1];
    if (this.expression === "" || /[+\-×÷%^(*\/]/.test(lastChar) || unmatched <= 0) {
      this.appendInput("(");
    } else {
      this.appendInput(")");
    }
  }

  toggleSign() {
    let regex = /(-?\d*\.?\d+)$/;
    let match = this.expression.match(regex);
    if (match) {
      let number = match[0];
      let toggled = number.startsWith('-') ? number.slice(1) : '-' + number;
      this.expression = this.expression.slice(0, match.index) + toggled;
      this.updateDisplay();
    }
  }

  evaluateExpression() {
    if (this.expression === '') return;
    let expr = this.expression;
    expr = expr.replace(/×/g, '*')
               .replace(/÷/g, '/')
               .replace(/\^/g, '**');
    try {
      let result = Function('"use strict"; return (' + expr + ')')();
      this.previousOperandElement.textContent = this.expression;
      this.expression = result.toString();
      this.updateDisplay();
    } catch (e) {
      this.currentOperandElement.textContent = 'Error';
    }
  }

  updateDisplay() {
    this.currentOperandElement.textContent = this.expression || '0';
  }
}

const calculator = new Calculator();

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
      calculator.appendInput(button.textContent);
    });
  });

  document.querySelectorAll('[data-operation]').forEach(button => {
    button.addEventListener('click', () => {
      calculator.appendInput(button.textContent);
    });
  });

  document.querySelectorAll('[data-exponent]').forEach(button => {
    button.addEventListener('click', () => {
      calculator.appendInput('^');
    });
  });

  document.querySelector('[data-parenthesis]').addEventListener('click', () => {
    calculator.appendParenthesis();
  });

  document.querySelector('[data-action="clear"]').addEventListener('click', () => {
    calculator.clear();
  });

  document.querySelector('[data-action="delete"]').addEventListener('click', () => {
    calculator.delete();
  });

  document.querySelector('[data-action="posneg"]').addEventListener('click', () => {
    calculator.toggleSign();
  });

  document.querySelector('[data-equals]').addEventListener('click', () => {
    calculator.evaluateExpression();
  });

  document.addEventListener('keydown', (event) => {
    if ((event.key >= '0' && event.key <= '9') || event.key === '.' || event.key === '(' || event.key === ')') {
      calculator.appendInput(event.key);
    }
    if (['+', '-', '*', '/', '%'].includes(event.key)) {
      let op = event.key;
      if (op === '*') op = '×';
      if (op === '/') op = '÷';
      calculator.appendInput(op);
    }
    if (event.key === '^') {
      calculator.appendInput('^');
    }
    if (event.key === 'Enter' || event.key === '=') {
      event.preventDefault();
      calculator.evaluateExpression();
    }
    if (event.key === 'Backspace') {
      calculator.delete();
    }
    if (event.key === 'Escape') {
      calculator.clear();
    }
  });
});
