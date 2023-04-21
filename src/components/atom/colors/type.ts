import Matercolor from 'matercolors';

export const prefixV2 = 'husc';
export const levelsV2 = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type LevelV2 = typeof levelsV2[number];
export const verticalAlignsV2 = ['middle', 'top', 'bottom'] as const;
export type VerticalAlignV2 = typeof verticalAlignsV2[number];
export const horizonAlignsV2 = ['center', 'right', 'left'] as const;
export type HorizonAlignV2 = typeof horizonAlignsV2[number];
export const sizesV2 = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
export type SizeV2 = typeof sizesV2[number];
export const systemColorsV2 = [
  'white',
  'heybit',
  'harvest',
  'defi',
  'brown',
  'yellow',
  'black',
  'success',
  'error',
  'link'
] as const;
export type SystemColorV2 = typeof systemColorsV2[number];
export const serviceColorsV2 = ['heybit', 'harvest', 'defi'] as const;
export type ServiceColorV2 = typeof serviceColorsV2[number];
export type ColorV2 = SystemColorV2 | ServiceColorV2;
export type AllColorV2 = Record<ColorV2, Matercolor>;

export const colorsV2: Record<ColorV2, string> = {
  white: '#ffffff',
  heybit: '#c04707',
  harvest: '#114d24',
  defi: '#504aca',
  brown: '#241c15',
  yellow: '#fb7d28',
  black: '#16171a',
  success: '#00561e',
  error: '#bd1b0f',
  link: '#1f41b6'
};
export const colorPaletteV2 = Object.entries(colorsV2).reduce(
  (a, [name, color]) => ({
    ...a,
    [name]: new Matercolor(color)
  }),
  {}
) as AllColorV2;
console.log(colorPaletteV2);
export const basicVariablesV2 = {
  //기본 변수. 그냥도 사용하지만 컴포넌트로 확장됨
  font: {
    family: `Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto,
  "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR",
  "Malgun Gothic", sans-serif`,
    color: {
      void: colorPaletteV2.white[50],
      solid: colorPaletteV2.black[900]
    },
    size: 16
  },
  size: {
    xlarge: 40,
    large: 32,
    medium: 24,
    small: 18,
    xsmall: 16
  },
  layout: {
    gutter: 20,
    media: 1020,
    'content-width': {
      '--mobile': 460,
      '--desktop': 1024
    }
  },
  border: {
    width: 1,
    color: colorPaletteV2.black[200],
    radius: 4
  },
  background: {
    color: colorPaletteV2.white[50]
  },
  transition: {
    duration: {
      '--ms': '300ms'
    },
    type: 'ease',
    'delay-start': {
      '--ms': '0ms'
    },
    'delay-end': {
      '--ms': '0ms'
    }
  }
};
export const componentVariablesV2 = {
  //컴포넌트 변수
  dim: {
    background: {
      color: colorPaletteV2.black[900]
    }
  },
  list: {
    height: 50,
    padding: {
      right: 18,
      left: 18
    },
    font: {
      size: basicVariablesV2.font.size
    },
    border: {
      width: basicVariablesV2.border.width,
      color: basicVariablesV2.border.color
    }
  },
  icon: {
    color: colorPaletteV2.black[900],
    size: basicVariablesV2.size
  },
  // input: {
  //   height: 56,
  //   border: {
  //     width: basicVariablesV2.border.width,
  //     'width--error': basicVariablesV2.border.width * 2,
  //     'width--focus': basicVariablesV2.border.width * 2,
  //     color: basicVariablesV2.border.color,
  //     'color--error': colorPaletteV2.heybit[300],
  //     'color--readonly': colorPaletteV2.black[400],
  //     'color--focus': colorPaletteV2.black[800],
  //   },
  //   padding: {
  //     top: 0,
  //     bottom: 0,
  //     right: 18,
  //     left: 18,
  //   },
  //   font: {
  //     size: basicVariablesV2.font.size,
  //   },
  // },
  input: {
    minHeight: 50,
    maxHeight: 71,
    border: {
      width: basicVariablesV2.border.width,
      'width--error': basicVariablesV2.border.width * 2,
      'width--focus': basicVariablesV2.border.width * 2,
      color: basicVariablesV2.border.color,
      'color--error': '#FF5252',
      'color--disabled': colorPaletteV2.black[100],
      'color--focus': colorPaletteV2.black[800]
    },
    padding: {
      top: 13.5,
      bottom: 13.5,
      right: 18,
      left: 18
    },
    font: {
      size: basicVariablesV2.font.size,
      color: {
        '--placeholder': colorPaletteV2.black[400]
      }
    }
  },
  button: {
    padding: {
      right: 10,
      left: 10
    },
    font: {
      size: basicVariablesV2.font.size
    }
  },
  modal: {
    width: 400,
    margin: 20,
    background: colorPaletteV2.white[50],
    dialog: {
      'padding-top': 52,
      'padding-right': 20,
      'padding-bottom': 24,
      'padding-left': 20
    },
    'sheet-dialog': {
      'padding-top': 52,
      'padding-right': 20,
      'padding-bottom': 30,
      'padding-left': 20
    }
  },
  spinner: {
    color: colorPaletteV2.black[900],
    size: basicVariablesV2.size
  },
  select: {
    font: {
      size: basicVariablesV2.font.size
    }
  },
  toast: {
    'max-width': 340,
    'min-height': 52,
    margin: {
      left: 20,
      right: 20,
      top: 10,
      bottom: 10
    },
    padding: {
      top: 16,
      bottom: 16,
      right: 18,
      left: 19
    },
    positive: {
      icon: 'system/filled/info',
      color: colorPaletteV2.success[400]
    },
    negative: {
      icon: 'system/filled/danger',
      color: colorPaletteV2.heybit[600]
    }
  },
  header: {
    height: {
      '--mobile': 60,
      '--desktop': 72
    },
    logo: {
      width: {
        '--mobile': 77,
        '--desktop': 80
      }
    }
  }
};
