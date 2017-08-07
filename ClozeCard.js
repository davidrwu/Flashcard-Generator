// Constructor function for the 'Cloze Card'.

// Cloze card is actually the constructor function here
// and would be invoked with the `new` keyword to 
// instantiate new instances (and not the `ClozeCardPrototype`
// method below)
function ClozeCard(text, cloze) {
    this.text = text.split(cloze);
    this.cloze = cloze;
};

// Constructor that creates a prototype of ClozeCard to return the question missing cloze

// Your `ClozedCardPrototype` function is actually a method
// of the `ClozeCard` constructor, and so it needs to sit
// its `prototype`. I noticed you first declared it, then 
// placed it on the prototype. However, convention is to
// declare it directly on the prototype as below. 
ClozeCard.prototype.clozeRemoved = function() {
        //Template literal enclosed by the back-tick ` allows embedded expressions wrapped with ${}

        // Additionally, you only needed to return the resulting string.
        return `${this.text[0]} ... ${this.text[1]}`;										
        // Wrapping it in another function like you had it is redundant.
};

module.exports = ClozeCard;