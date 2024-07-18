import { SmartLed, LED_WS2812, Rgb } from "smartled";
import * as radio from "simpleradio";
import * as adc from "adc";
import * as gpio from "gpio";

const BTN_LEFT = 18;
const INPUT_PINS = [4,6,2,1];
INPUT_PINS.forEach(pin => {
    adc.configure(pin); 
});

var values: Array<number> = [0,0,0,0];

const ledStrip = new SmartLed(48, 1, LED_WS2812);

radio.begin(4);
gpio.pinMode(BTN_LEFT, gpio.PinMode.INPUT);

gpio.on("falling", BTN_LEFT, () => {
    radio.sendString("Connect");
    console.log("Connect");
});

var t: number = 0;

setInterval(() => { // pravidelně vysílá příkazy
    // Blikání LEDky
    ledStrip.clear();
    if (t%2 == 0) ledStrip.set(0, {r:0,g:20,b:0});
    ledStrip.show();
    t+=1;
    // Vysílání datr z potenciometrů
    for (let i = 0; i < INPUT_PINS.length; i++) {
      values[i] = adc.read(INPUT_PINS[i]);
    }
    values.toString();
    const mystring = "P"+values.toString();;
    radio.sendString(mystring);
    console.log(mystring);
}, 100);