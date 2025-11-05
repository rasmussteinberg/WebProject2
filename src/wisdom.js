// wisdom.js
// Loeb vanasõnad failist ja väljastab juhusliku ühe

const fs = require("fs");

// vanasõnade faili asukoht
const textRef = "./txt/vanasonad.txt";

// Funktsioon, mis valib ühe juhusliku vanasõna
function pickOne(rawText) {
  // Tee failisisu massiiviks
  let oldWisdomList = rawText.split(";");

  // Vali suvaline element
  let MOTD = oldWisdomList[Math.round(Math.random() * (oldWisdomList.length - 1))];

  console.log("Tänane vanasõna:");
  console.log(MOTD.trim()); // eemaldab liigsed tühikud
  return MOTD;
}

// Funktsioon, mis loeb faili ja käivitab pickOne
function readTextFile() {
  fs.readFile(textRef, "utf8", (err, data) => {
    if (err) {
      console.log("Viga faili lugemisel:", err);
    } else {
      pickOne(data);
    }
  });
}

// Käivita kohe
readTextFile();
