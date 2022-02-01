"use strict";
const express = require("express");
const router = express.Router();
const randomWords = require("random-words");
const randomMoviesWords = require("random-movie-names");
const httpStatusCode = require("../resources/util");

let randomWord = "";
const timeToDie = 7;
let count = 0;
let returnString = "";
let selectedChar = "";
const remainingChar = new Map();
const getRandomWords = async (req, res) => {
  try {
    randomWord = randomMoviesWords();
    randomWord = randomWord.toLowerCase();
    returnString = "";
    let remainingCharArray = "[ ";
    for (let index = 0; index < 26; index++) {
      let char = String.fromCharCode(97 + index);
      remainingChar.set(char, char);
      remainingCharArray = remainingCharArray + char + ",";
    }
    remainingCharArray = remainingCharArray + " ]";
    //console.log("random words : ", randomWord, "  ", remainingCharArray);
    for (let index = 0; index < randomWord.length; index++) {
      returnString += "*";
    }
    //console.log(remainingCharArray)
    res.status(200).json({
      "message ":
        "A random movie is generated successfully Pls try  your luck...",
      "Available chars": remainingCharArray,
      "Message Rule":
        "You have 26 chars and you have 7 chances to guess a word",
    });
  } catch (error) {
    res.status(400).json({ "error ": error });
  }
};

router.get("/getRandomWords", getRandomWords);

const hangmanGame = async (req, res) => {
  try {
    let remainingCharToSelect = "";
    if (count === 0 && randomWord == "") {
      res
        .status(httpStatusCode.OK)
        .json(
          "pls select a word from : localhost:9000/random-words/getRandomWords "
        );
    } else {
      if (count < timeToDie) {
        let charToSearch = req.body.char[0].toLowerCase();
        if (selectedChar.includes(charToSearch)) {
          res.status(httpStatusCode.OK).json({
            "Error Msg ":
              "This char is already entered by you.... " + charToSearch,
            "Selected words ": selectedChar,
            "Remaining Word for selection ": remainingCharToSelect,
            "Remaining Chance ": timeToDie - count,
          });
        } else {
          //console.log(charToSearch,randomWord);
          if (!randomWord.includes(charToSearch)) {
            count++;
            remainingChar.delete(charToSearch);
            if (selectedChar === "") {
              selectedChar = charToSearch;
            } else {
              selectedChar = selectedChar + " , " + charToSearch;
            }
          }
          for (let index = 0; index < returnString.length; index++) {
            if (charToSearch === randomWord[index]) {
              remainingChar.delete(charToSearch);
              if (selectedChar === "") {
                selectedChar = charToSearch;
              } else {
                selectedChar = selectedChar + " , " + charToSearch;
              }
              returnString = await swap(returnString, index, charToSearch);
              //console.log("return String ",remainingChar);
            }
          }

          remainingChar.forEach((values, keys) => {
            if (remainingCharToSelect === "")
              remainingCharToSelect = "[ " + values;
            else remainingCharToSelect = remainingCharToSelect + " , " + values;
          });
          remainingCharToSelect = remainingCharToSelect + " ]";
          res.status(httpStatusCode.OK).json({
            "Word ": returnString,
            "Selected words ": selectedChar,
            "Remaining Word for selection ": remainingCharToSelect,
            "Remaining Chance ": timeToDie - count,
          });
        }
      } else {
        count = 0;
        returnString = "";
        console.log(
          "count : ",
          count,
          " return string : ",
          returnString,
          randomWord
        );
        res
          .status(httpStatusCode.LOCKED)
          .json({ "message ": "You are dead pls try again baby" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(httpStatusCode.BAD_REQUEST).json(error);
  }
};
const swap = async (string, position, newChar) => {
  let charArray = string.split("");
  charArray[position] = newChar;
  return charArray.join("");
};

router.post("/guessRandomWords", hangmanGame);
module.exports = router;
