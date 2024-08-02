// Add event listener to play game button
var startGame = document.getElementById("startButton");
startGame.addEventListener("click", HowManySymbols);

// function to create a new game
function MatchGame(numSymbols) {
	this.numSymbols = numSymbols;
	this.matchFound = 0;
	this.characters = ["⛄", "☘", "⛺", "☮", "☹", "♫", "♲", "⛹"];
	this.squares = [1, 4, 9, 16];
	this.clicks = 0;
	this.clickedLast = null;
}

// Function to get the symbols to use in the game
function SymboltoUse(game) {
	var symbol = [];
	for (var i = 0; i < game.numSymbols; i++) {
		symbol.push(game.characters[i]);
		symbol.push(game.characters[i]);
	}
	// Shuffle the symbols
	for (var j = 0; j < symbol.length; j++) {
		var random = Math.floor(Math.random() * symbol.length);
		var temp = symbol[j];
		symbol[j] = symbol[random];
		symbol[random] = temp;
	}
	return symbol;
}

// Function to decide how many symbols to use
function HowManySymbols(event) {
	var numSymbols = parseInt(document.getElementById("numSymbols").value);
	if (numSymbols > 8) {
		numSymbols = 8;
	} else if (numSymbols <= 0) {
		numSymbols = 1;
	}

	// Remove the form and start the game
	var game = new MatchGame(numSymbols);
	document
		.getElementById("game")
		.removeChild(document.getElementById("startForm"));
	ShowBoardGame(game);
}


// Function to display the game board
function ShowBoardGame(game) {
	// Function to show the symbol when a card is clicked
	var showSymbol = function showSymbol(event) {
		this.childNodes[0].style.visibility = "visible";
		game.clicks++;

		// If a card has already been picked
		if (game.clickedLast) {
			// If the two cards match
			if (
				game.clickedLast.childNodes[0].textContent ===
				this.childNodes[0].textContent
			) {
				game.matchFound++;
				game.clickedLast.removeEventListener("click", showSymbol);
				this.removeEventListener("click", showSymbol);
				game.clickedLast = null;
			} else {
				// If the two cards do not match
				var currentNode = this.childNodes[0];
				setTimeout(function () {
					game.clickedLast.childNodes[0].style.visibility = "hidden";
					game.clickedLast.addEventListener("click", showSymbol);
					currentNode.style.visibility = "hidden";
					game.clickedLast = null;
				}, 300);
			}

			// If all matches have been found
			if (game.matchFound === game.numSymbols) {
				setTimeout(function () {
					document
						.getElementById("board")
						.removeChild(document.getElementById("table"));
					// Display message to user
					var p = document.createElement("p");
					p.appendChild(
						document.createTextNode("You found all the matches, well done!")
					);
					document.getElementById("game").appendChild(p);
					document.getElementById("attempts").childNodes[0].textContent =
						"Number of Attempts: " + game.clicks;
				}, 400);
				return;
			}
		} else {
			// If no card has been picked yet
			game.clickedLast = this;
			game.clickedLast.removeEventListener("click", showSymbol);
			game.clicks--; // Decrement the count of number of guesses
		}

		// Update the number of guesses
		document.getElementById("attempts").childNodes[0].textContent =
			"Number of Attempts: " + game.clicks;
	};

	// Create the table
	createTable(game, showSymbol);
	MakeColumnsandRows(game, showSymbol);

	    // Insert the Number of guesses paragraph before the table
		var guessesElem = document.getElementById("attempts");
		var tableElem = document.getElementById("table");
		tableElem.parentNode.insertBefore(guessesElem, tableElem);
}

// Create the table to display the symbols
function createTable(game, showSymbol) {	
	var newDivElement = document.createElement("div");
	newDivElement.id = "board";
	document.getElementById("game").appendChild(newDivElement);

	// Create the Number of guesses paragraph element
	var newPElem = document.createElement("p");
	newPElem.id = "attempts";
	newPElem.textContent = "Number of Attempts: 0";
	document.getElementById("game").appendChild(newPElem);

	// Create the table
	var newTableElement = document.createElement("table");
	newTableElement.id = "table";
	document.getElementById("board").appendChild(newTableElement);

}

// Create the rows and columns in the table
function MakeColumnsandRows(game, showSymbol) {
	var symbols = SymboltoUse(game);
	var newTableElement = document.getElementById("table");
	var row, column;

	// Decide how many rows and columns to create
	if (game.squares.indexOf(game.numSymbols * 2) != -1) {
		row = Math.sqrt(game.numSymbols * 2);
		column = row;
	} else {
		row = 2;
		column = game.numSymbols;
	}

	// Create the rows and columns
	for (var i = 0; i < row; i++) {
		var tr = document.createElement("tr");
		for (var j = 0; j < column; j++) {
			// Create the table data
			var textNode = document.createTextNode(symbols.pop());
			var td = document.createElement("td");
			var span = document.createElement("span");

			// hide symbol momentarily
			td.addEventListener("click", showSymbol);
			td.appendChild(span);
			td.classList.add("box");
			tr.appendChild(td);
			span.classList.add("symbol");
			span.style.visibility = "hidden";
			span.appendChild(textNode);
		}
		newTableElement.appendChild(tr);
	}
}
