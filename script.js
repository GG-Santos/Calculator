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

  // New method: appendParenthesis toggles between "(" and ")" based on the context.
  appendParenthesis() {
    // Count unmatched opening parentheses.
    const openCount = (this.expression.match(/\(/g) || []).length;
    const closeCount = (this.expression.match(/\)/g) || []).length;
    const unmatched = openCount - closeCount;
    const lastChar = this.expression[this.expression.length - 1];
    // If expression is empty or last character is an operator or an opening parenthesis,
    // or there are no unmatched "(", append "(".
    if (
      this.expression === "" ||
      /[+\-×÷%^(*\/]/.test(lastChar) ||
      unmatched <= 0
    ) {
      this.appendInput("(");
    } else {
      // Otherwise, if there is an unmatched "(" and last character is a digit or ")",
      // append ")".
      this.appendInput(")");
    }
  }

  toggleSign() {
    // Toggle the sign of the last number in the expression.
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
    // Replace custom symbols with JavaScript operators.
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

// Initialize calculator
const calculator = new Calculator();

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Number buttons (including "00" and ".")
  document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
      calculator.appendInput(button.textContent);
    });
  });

  // Operation buttons (for +, -, ×, ÷, %, etc.)
  document.querySelectorAll('[data-operation]').forEach(button => {
    button.addEventListener('click', () => {
      calculator.appendInput(button.textContent);
    });
  });

  // Exponent button (appends "^")
  document.querySelectorAll('[data-exponent]').forEach(button => {
    button.addEventListener('click', () => {
      calculator.appendInput('^');
    });
  });

  // Single Parenthesis button
  document.querySelector('[data-parenthesis]').addEventListener('click', () => {
    calculator.appendParenthesis();
  });

  // Clear button
  document.querySelector('[data-action="clear"]').addEventListener('click', () => {
    calculator.clear();
  });

  // Delete button
  document.querySelector('[data-action="delete"]').addEventListener('click', () => {
    calculator.delete();
  });

  // Positive/Negative toggle button
  document.querySelector('[data-action="posneg"]').addEventListener('click', () => {
    calculator.toggleSign();
  });

  // Equals button
  document.querySelector('[data-equals]').addEventListener('click', () => {
    calculator.evaluateExpression();
  });

  // Keyboard support
  document.addEventListener('keydown', (event) => {
    if ((event.key >= '0' && event.key <= '9') || event.key === '.' || event.key === '(' || event.key === ')') {
      // For parenthesis keys from keyboard, append them directly.
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
