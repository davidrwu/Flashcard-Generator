const inquirer = require("inquirer");
const data = require("./cards.json");
const BasicCard = require("./BasicCard.js")
const ClozeCard = require("./ClozeCard.js")
const fs = require("fs");

var drawnCard;
var playedCard;
var count = 0;

//First prompt users options
function start() {
  inquirer.prompt([															
      {
          type: "list",														
          message: "\nPlease choose an option from the list below?",	
          choices: ["Create", "Flashcards"],	
          name: "menuOptions"												
      }
  ]).then(function (answer) {												
    var waitMsg;

    switch (answer.menuOptions) {

        case 'Create':
            console.log("Lets make a new flashcard...");
            createCard();
            break;

        case 'Flashcards':
            console.log("Lets see all the flashcards...");
            displayQuestion();
            break;

        default:
            console.log("Sorry I don't understand");
    }

  });

}

start();

//Create a card funtion
function createCard() {
    inquirer.prompt([
        {
            type: "list",
            message: "Pick a type of card you want to make:",
            choices: ["Basic Card", "Cloze Card"],
            name: "type"
        }

    ]).then(function (result) {

        var type = result.type;  			
        console.log(type);			  			

        if (type === "Basic Card") {
            // This would be a good candidate for extracting out into its
            // own module or function to help readability & maintainability
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please give me a question",
                    name: "front"
                },

                {
                    type: "input",
                    message: "Please fill out the back of your answer",
                    name: "back"
                }

            ]).then(function (result) {

                var cardObj = {						
                    type: "BasicCard",
                    front: result.front,
                    back: result.back
                };

                data.push(cardObj);				
                
                fs.writeFile("cards.json", JSON.stringify(data, null, 2)); 

                // Same with this prompt. You generally want your functions
                // to be tightly focused. 
                inquirer.prompt([					
                    {
                        type: "list",
                        message: "Do you want to create another card?",
                        choices: ["Yes", "No"],
                        name: "moreCards"
                    }

                ]).then(function (result) {				
                    if (result.moreCards === "Yes") {	
                        createCard();						
                    } else {								
                        start();			
                    }
                });
            });

        } else {						
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please enter a full statement",
                    name: "fulltext"
                },

                {
                    type: "input",
                    message: "Type the words you want to hide",
                    name: "cloze"
                }

            ]).then(function (result) {            

                var cardObj = {						
                    type: "ClozeCard",
                    text: result.fulltext,
                    cloze: result.cloze
                };

                if (cardObj.text.indexOf(cardObj.cloze) !== -1) {   
                    
                    data.push(cardObj);							
                    
                    fs.writeFile("cards.json", JSON.stringify(data, null, 2)); 
                } else {											
                    console.log("The cloze must match some words.");

                }
                inquirer.prompt([					
                    {
                        type: "list",
                        message: "Do you want to create another card?",
                        choices: ["Yes", "No"],
                        name: "anotherCard"
                    }

                ]).then(function (result) {				
                    if (result.anotherCard === "Yes") {	
                        createCard();						
                    } else {								
                        start();		
                    }
                });
            });
        }

    });
};

// I would keep the two function below close to the `start` one
// you have above since they realte more to the flow of the 
// game like start does. The `createCard` function above serves
// a bit of a different purpose. However, it looks like your 
// code followed the order in which you constructed your program
// so I get why it's organized the way it is.

//Function to get the question
function getQuestion(result) {
    if (result.type === "BasicCard") {						
        drawnCard = new BasicCard(result.front, result.back);	
        return drawnCard.front;								
    } else if (result.type === "ClozeCard") {					
        drawnCard = new ClozeCard(result.fulltext, result.cloze)	
        return drawnCard.clozeRemoved();					
    }
};

//Function to display question
function displayQuestion() {
    if (count < data.length) {					
        playedCard = getQuestion(data[count]);	
        inquirer.prompt([							
            {
                type: "input",
                message: playedCard,
                name: "question"
            }
        ]).then(function (answer) {					

            if (answer.question === data[count].back || answer.question === data[count].cloze) {
                console.log("You are correct.");
            } else {

                if (drawnCard.front !== undefined) { 
                    console.log("Sorry, the correct answer was " + data[count].back + "."); 
                } else { 
                    console.log("Sorry, the correct answer was " + data[count].cloze + ".");
                }
            }
            count ++; 		
            // nice use of recursion here
            displayQuestion(); 
        });
    } else {
      	count = 0;			
      	start();			
    }
};