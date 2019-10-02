const commands = require('./commands');

async function play() {
    //generating random word and dispalying defintio and synonym
    var res = await commands.commandCalls(undefined, undefined, false);
    // console.log(`play word ${JSON.stringify(res)}`)
    var def = await commands.commandCalls('def', res.word, false);
    var relatedWords = await commands.commandCalls('syn', res.word, false);
    var ant = [], syn = [], allsyn = [];
    relatedWords.forEach(obj => {
        if (obj.relationshipType == 'synonym') {
            allsyn = obj.words;
            syn = obj.words.slice(1);
        }
        if (obj.relationshipType == 'antonym') {
            ant = obj.words;
        }
    });
    
    var stdin = process.openStdin();
    // console.log(`synonyms  ${JSON.stringify(syn)} `)
    process.stdout.write(`\t definton: ${JSON.stringify(def[0].text)} \n\t synonym: ${JSON.stringify(allsyn[0])} \n\t`);
    var choiceCount = 0;
    stdin.addListener("data",  async (d) => {
        var isCorrect = false;
        const input = d.toString().trim();
        // console.log(`you entered:  ${input}  \n`);
        

        if (input == 'try again' || input == '1') {
            process.stdout.write("\t please enter \n\t");
            choiceCount++;
            return;
        }
        if (input == 'hint' || input == '2') {
            console.log(`\t hint: ${jumbleWord(res.word)} \t\t`);
            choiceCount++;
            return;
        }

        if (input == 'quit' || input == '3') {
            await commands.commandCalls('dict', res.word, true);
            process.exit(0);
        }
        
        
        if (input == res.word) {
            process.stdout.write("\t word is correct\n");
            process.exit(0);
        } else {
            syn.forEach(w => {
                if (w == input) {
                    process.stdout.write("\t word is correct\n");
                    process.exit(0);
                }
            })
        } 
        if(choiceCount > 0){
            process.exit(0);
        }
            process.stdout.write("\t 1. try again \n\t 2. hint \n\t 3. quit \n\t");
        
        
    });
    function jumbleWord(word){
        return word.split('').sort(function(){return 0.5-Math.random()}).join('');
    }
}

module.exports = {
    play: play
}