export default function colorNameToHex(colorName: string): string {
  const nameToHex = {
    red: '#FF0000',
    orange: '#FFA500',
    yellow: '#FFFF00',
    green: '#00FF00',
    blue: '#0000FF',
    indigo: '#4B0082',
    violet: '#800080',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#808080',
    silver: '#C0C0C0',
    gold: '#FFD700',
    maroon: '#800000',
    purple: '#800080',
    teal: '#008080',
    navy: '#000080',
    olive: '#808000',
    lime: '#00FF00',
    aqua: '#00FFFF',
    cyan: '#008080',
    navyblue: '#000080',
    midnightblue: '#191970',
    darkblue: '#00008B',
    mediumblue: '#0000CD',
    royalblue: '#4169E1',
    blueviolet: '#8A2BE2',

    darkviolet: '#9400D3',
    mediumpurple: '#9370DB',
    darkorchid: '#9932CC',
    plum: '#DDA0DD',

    magenta: '#FF00FF',
    orchid: '#DA70D6',
    mediumvioletred: '#C71585',
    palevioletred: '#DB7093',
    crimson: '#DC143C',
    lightpink: '#FFB6C1',
    hotpink: '#FF69B4',
    deeppink: '#FF1493',
    pink: '#FFC0CB',
    lightred: '#FF0000',
    orangered: '#FF4500',
    salmon: '#FA8072',
    darksalmon: '#E9967A',
    lightcoral: '#F08080',
    indianred: '#CD5C5C',

    firebrick: '#B22222',
    darkred: '#8B0000',

    mistyrose: '#FFE4E1',
    antiquewhite: '#FAEBD7',
    beige: '#F5F5DC',
    bisque: '#FFE4C4',
    blanchedalmond: '#FFEBCD',
    cornsilk: '#FFF8DC',
    darkgray: '#A9A9A9',

    lightgray: '#D3D3D3',
    lightslategray: '#778899',
    slategray: '#708090',
    darkgrey: '#A9A9A9',
    grey: '#808080',
    lightgrey: '#D3D3D3',
    lightslategrey: '#778899',
    slategrey: '#708090',
    dimgray: '#696969',
    dimgrey: '#696969',
    lightsalmon: '#FFA07A',
    lightyellow: '#FFFFE0'
  }

  if (Object.prototype.hasOwnProperty.call(nameToHex, colorName)) {
    return nameToHex[colorName]
  } else {
    // console.error(`请更新: ${colorName}的16进制颜色`)
    // throw new Error(`Invalid color name: ${colorName}`);
    return colorName
  }
}
