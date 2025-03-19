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
  
    toggleSign() {
      // Toggle the sign of the last number in the expression.
      // This regex finds the last number (which may include a decimal point).
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
      // Create a copy of the expression and replace custom symbols with JavaScript operators.
      let expr = this.expression;
      expr = expr.replace(/×/g, '*')
                 .replace(/÷/g, '/')
                 .replace(/\^/g, '**');
      try {
        // Use a Function constructor to evaluate the arithmetic expression.
        let result = Function('"use strict"; return (' + expr + ')')();
        // Show the evaluated expression in the previousOperand display.
        this.previousOperandElement.textContent = this.expression;
        // Set the expression to the result so that further input continues from here.
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
  
    // Operation buttons (for +, -, ×, ÷, and %)
    document.querySelectorAll('[data-operation]').forEach(button => {
      button.addEventListener('click', () => {
        calculator.appendInput(button.textContent);
      });
    });
  
    // Parenthesis buttons
    document.querySelectorAll('[data-parenthesis]').forEach(button => {
      button.addEventListener('click', () => {
        calculator.appendInput(button.getAttribute('data-parenthesis'));
      });
    });
  
    // Exponent button (appends "^")
    document.querySelectorAll('[data-exponent]').forEach(button => {
      button.addEventListener('click', () => {
        calculator.appendInput('^');
      });
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
      // Allow digits, decimal point, and parentheses from keyboard.
      if ((event.key >= '0' && event.key <= '9') || event.key === '.' || event.key === '(' || event.key === ')') {
        calculator.appendInput(event.key);
      }
      // Allow basic operators.
      if (['+', '-', '*', '/', '%'].includes(event.key)) {
        calculator.appendInput(event.key);
      }
      // For exponent (you can use '^')
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
  
