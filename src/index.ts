import { SmartLed, LED_WS2812, Rgb } from "smartled";
import * as radio from "simpleradio";
import * as colors from "./libs/colors.js"
import * as adc from "adc";
import * as gpio from "gpio";

const BTN_LEFT = 18;
const INPUT_PINS = [4,6,2,1];
const ledStrip = new SmartLed(40, 10, LED_WS2812);
const ledStrip2 = new SmartLed(21, 8, LED_WS2812);
ledStrip.set(0, {r:0,g:20,b:0});
ledStrip.show();
radio.begin(4);
INPUT_PINS.forEach(pin => {
    adc.configure(pin); 
});
gpio.pinMode(BTN_LEFT, gpio.PinMode.INPUT);

gpio.on("falling", BTN_LEFT, () => {
    console.log("pressed");
    radio.sendString("Hmmm");
});
/*
// řetězce
radio.on("string", (retezec, info) => {
    console.log(
      `Přijal jsem řetězec '${retezec}'.
      Od: ${info.address},
      síla signálu: ${info.rssi})
  `
    );
  });*/
  /*
// číslo
radio.on("number", (cislo, info) => {
    console.log(
      `Přijal jsem číslo ${cislo}.
      Od: ${info.address},
      síla signálu: ${info.rssi})
  `
    );
  });
// klíč - hodnota
radio.on("keyvalue", (klic, hodnota, info) => {
    console.log(
      `Přijal jsem ${klic} = ${hodnota}.
      Od: ${info.address},
      síla signálu: ${info.rssi})
  `
    );
  });*/
var t: number = 0;
function adjustADC(inut: number) : number {
  const out = 2*inut/1023 -1
  return out-out%0.1;
}
setInterval(() => { // pravidelně vyvolává událost
    ledStrip.clear();
    ledStrip.set(t%10, {r:0,g:20,b:0});
    ledStrip.show();
    t+=1;
    const value = adc.read(INPUT_PINS[0]);
    const value2 = adc.read(INPUT_PINS[1])
    const value3 = adc.read(INPUT_PINS[2]);
    const value4 = adc.read(INPUT_PINS[3])
    const mystring = "P"+value+";"+value2+";"+value3+";"+value4;
    console.log(mystring);
    radio.sendString(mystring);
}, 100);
setInterval(() => { // pravidelně vyvolává událost
    const value = adc.read(INPUT_PINS[0]);
    const value2 = adc.read(INPUT_PINS[1]);
    //console.log(value*8/1024);
    ledStrip2.clear();
    ledStrip2.set(value*8/1024, {r:0,g:20,b:0});
    ledStrip2.set(value2*8/1024, {r:20,g:0,b:0});
    ledStrip2.show();
    //radio.sendKeyValue("X", -999);
    
}, 50);
