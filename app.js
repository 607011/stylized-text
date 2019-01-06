// Copyright (c) 2019 Oliver Lau <oliver@ersatzworld.net>. All rights reserved.
(function(window) {
  'use strict';

  const chr = x => String.fromCodePoint(x);
  const ord = c => c.codePointAt(0);
  const range = (lo, hi) => { return {lo: lo, hi: hi || lo}; };
  const charlist = l => {
    let result = [];
    const codes = l.split('').map(c => c.codePointAt(0));
    for (let i = 0; i < codes.length; /**/) {
      result.push(chr(l.codePointAt(i)));
      i += (0xD800 <= codes[i] &&  codes[i] <= 0xDBFF) ? 2 : 1;
    }
    return result;
  };

  const SmallLetters = range(ord('a'), ord('z'));
  const CapitalLetters = range(ord('A'), ord('Z'));
  const DigitsNonNull = range(ord('1'), ord('9'));
  const Digits = range(ord('0'), ord('9'));

  const CharMaps = {
    default: [
      {
        from: {lo: 0, hi: 0xffffffff},
        to: 0
      }
    ],
    circles: [
      {
        from: CapitalLetters,
        to: ord('Ⓐ')
      },
      {
        from: SmallLetters,
        to: ord('ⓐ')
      },
      {
        from: DigitsNonNull,
        to: 0x2460
      },
      {
        from: range(ord('0')),
        to: 0x24EA
      }
    ],
    fraktur: [
      {
        from: CapitalLetters,
        to: charlist('𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ')
      },
      {
        from: SmallLetters,
        to: charlist('𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷')
      }
    ],
    fraktur_bold: [
      {
        from: CapitalLetters,
        to: 0x1D56C
      },
      {
        from: SmallLetters,
        to: 0x1D586
      }
    ],
    squares: [
      {
        from: CapitalLetters,
        to: ord('🄰')
      },
      {
        from: SmallLetters,
        to: ord('🄰')
      }
    ],
    negative_squares: [
      {
        from: CapitalLetters,
        to: ord('🅰')
      },
      {
        from: SmallLetters,
        to: ord('🅰')
      }
    ]
  };

  let inputEl = null;
  let outputEl = null;
  let conversionTypeEl = null;

  let convert = t => {
    const mappings = CharMaps[t in CharMaps ? t : 'default'];
    let output = '';
    for (let i = 0; i < inputEl.value.length; ++i) {
      const c = inputEl.value[i];
      const code = ord(c);
      let found = false;
      for (let mapping of mappings) {
        if (mapping.from.lo <= code && code <= mapping.from.hi) {
          let idx = code - mapping.from.lo;
          if (mapping.to instanceof Array) {
            output += mapping.to[idx];
          }
          else {
            output += chr(mapping.to + idx);
          }
          found = true;
        }
        if (found)
          break;
      }
      if (!found) {
        output += c;
      }
    }
    outputEl.innerHTML = output;
  };

  const transform = () => {
    convert(conversionTypeEl.options[conversionTypeEl.selectedIndex].value);
    inputEl.focus();
  };

  const main = () => {
    conversionTypeEl = document.getElementById('conversion-type');
    conversionTypeEl.addEventListener('input', transform);
    inputEl = document.getElementById('input');
    inputEl.addEventListener('input', transform);
    inputEl.focus();
    outputEl = document.getElementById('output');
  };

  window.addEventListener('load', main);
})(window);
