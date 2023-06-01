// Put number keys on the screen
const allKeys = document.querySelectorAll("button");
const numberKeys = document.querySelectorAll(
	".number-keys button:not(:last-child)"
); // exclude sign
const operationKeys = document.querySelectorAll(".operator-keys button");
const signKey = document.getElementById("sign");
const clearKey = document.getElementById("clear");
const deleteKey = document.getElementById("delete");
const equalsKey = document.getElementById("equals");
const display = document.querySelector(".display span");
const style = getComputedStyle(document.documentElement);

// Computation variables initialisation
const operators = {
	"+": (a, b) => a + b,
	"-": (a, b) => a - b,
	x: (a, b) => a * b,
	"÷": (a, b) => a / b,
};
let previousOperand = null;
let currentOperand = null;
let currentOperator = null;
let justComputed = false; // Calculator behaviour when a number is inputted right after calculation or operator selection

// Active operator buttons styles
let previousOperatorButton = null;

function printScreen(event) {
	const number = event.currentTarget;
	const input = number.textContent;
	let output = display.textContent;
	// Replace starting 0 with input when input letter is right after computation
	// or is the first number inputted that is not a .
	if (justComputed || (output == "0" && input != ".")) {
		output = input;
		justComputed = false;
	} else {
		// Make sure only one "." can be added
		if (!output.includes(".") || input != ".") {
			// Add new digit to end of input
			output += input;
		}
	}
	display.textContent = output;
}

function clearScreen() {
	display.textContent = 0;
	previousOperand = null;
	currentOperand = null;
	currentOperator = null;
}

function deleteDigit() {
	let output = display.textContent;
	if (output.length > 1) {
		output = output.slice(0, -1);
	} else {
		output = "0";
	}
	display.textContent = output;
}

function changeSign() {
	// "-"
	if (display.textContent !== "-") {
		display.textContent = "0";
		// "-34...."
	} else if (display.textContent[0] === "-") {
		// Remove negative sign
		display.textContent = display.textContent.substring(1);
		// "0" or "213...." but after computation (equal key or operator pressed)
	} else if (display.textContent == "0" || justComputed) {
		display.textContent = "-";
		justComputed = false;
		// "123..."
	} else {
		// Split str into array then add negative sign then join together
		let numberArr = display.textContent.split("");
		numberArr.splice(0, 0, "-");
		display.textContent = numberArr.join("");
	}
}

function operatorSelection(event) {
	// Check for chain equations, compute previous two-number equation
	if (currentOperator !== null) {
		compute();
	}
	currentOperator = event.target.textContent;
	previousOperand = parseFloat(display.textContent);
	// This is so the new number will not just be appended to old number
	justComputed = true;
}

function highlightClickedOperator(event) {
	// If the button clicked is an operator button
	if (Array.from(operationKeys).includes(event.target)) {
		event.target.style.backgroundColor =
			style.getPropertyValue("--active-color");
		if (
			previousOperatorButton !== null &&
			previousOperatorButton !== event.target
		) {
			// Changed last clicked style back to normal
			previousOperatorButton.style.backgroundColor =
				style.getPropertyValue("--button-color");
		}
		previousOperatorButton = event.target;
	} else {
		// If an operator button is not clicked then change the last clicked button back to normal
		if (previousOperatorButton !== null) {
			previousOperatorButton.style.backgroundColor =
				style.getPropertyValue("--button-color");
		}
	}
}

function compute() {
	// If previous value and operator have been added
	if (
		currentOperator in operators &&
		previousOperand !== null &&
		justComputed == false // Do nothing if equals key pressed twice
	) {
		// Save current display to calculate equation
		currentOperand = parseFloat(display.textContent);
		equalsTo = operators[currentOperator](previousOperand, currentOperand);
		display.textContent = equalsTo;
		justComputed = true;
	}
}
numberKeys.forEach((item) => item.addEventListener("click", printScreen));
clearKey.addEventListener("click", clearScreen);
deleteKey.addEventListener("click", deleteDigit);
signKey.addEventListener("click", changeSign);
operationKeys.forEach((item) =>
	item.addEventListener("click", operatorSelection)
);
allKeys.forEach((item) =>
	item.addEventListener("click", highlightClickedOperator)
);
equalsKey.addEventListener("click", compute);
