const axios = require('axios');
const host = 'https://fourtytwowords.herokuapp.com';
const api_key = 'f44bf14a46259a84dd94c7f335bfdcb3bc65e44e481cf67901b0839c81833645a208ebce72ece8b7721258dba900afcee53484aad25a6e18b6a3b79e11498eff033fb51cec55fdf1d7044606b58340fe';

async function commandCalls(command, word, doPrint) {
    if (command === undefined && word === undefined) {
        // console.log(`from random ${command} `);
        command = 'random';
    } else
        if ((command == 'dict' && word != undefined) || (command != 'def' && command != 'syn' && command != 'ant' && command != 'ex' && word == undefined)) {
            if ((command != 'def' && command != 'syn' && command != 'ant' && command != 'ex' && word == undefined))
                word = command;
            // console.log("in......")
            await commandCalls('def', word, true);
            await commandCalls('syn', word, true);
            await commandCalls('ant', word, true);
            await commandCalls('ex', word, true);
        }

    let url = "";
    switch (command) {
        case 'def':
            url = `${host}/word/${word}/definitions?api_key=${api_key}`;
            break;
        case 'syn':
            url = `${host}/word/${word}/relatedWords?api_key=${api_key}`;
            break;
        case 'ant':
            url = `${host}/word/${word}/relatedWords?api_key=${api_key}`;
            break;
        case 'ex':
            url = `${host}/word/${word}/examples?api_key=${api_key}`;
            break;
        case 'random':
            url = `${host}/words/randomWord?api_key=${api_key}`;
            break;
    }
    // console.log(`url ${command} ${url}`);
    if (url) {
        try {
            const response = await axios.get(url);
            if(doPrint) {
                render(response.data, command);
            }
             else return response.data;
        } catch (e) {
            console.log(`def not found`);
        }
    }
}

function render(response, command) {
    if (command == 'def') {
        response.forEach(obj =>
            format(`\t - definition : ${obj.text}`))
    }
    if (command == 'syn') {
        response.forEach(obj => {
            if (obj.relationshipType == 'synonym') {
                obj.words.forEach(word =>
                    format(`\t - synonym : ${word}`))
            }
        }
        )

    }
    if (command == 'ant') {
        response.forEach(obj => {
            if (obj.relationshipType == 'antonym') {
                obj.words.forEach(word =>
                    format(`\t - antonym : ${word}`))
            }
        }
        )

    }
    if (command == 'ex') {
        response.examples.forEach(obj => {
            format(`\t - example : ${obj.text}`)
        }
        )
    }

    if (command == 'random') {
        format(`\t - word of the day : ${response.word}`);
        commandCalls(response.word, undefined, true);
    }


}

function format(word) {
    console.log(word);
}



module.exports = {
    commandCalls: commandCalls
}