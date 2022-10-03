import colors from './colors'
import fontSizes from './fontSizes'
import letterSpacings from './letterSpacings'
import lineHeights from './lineHeights'
import space from './space'

export const theme = {
  space,
  fontSizes,
  letterSpacings,
  lineHeights,
  colors,
  // const assertionとは全ての値を読み取り専用及び変更不可にするアサーションです。
  //  記載方法はオブジェクトの末尾にas constを記述すことで、プロパティをreadonlyで指定した場合と同等の扱いにすることができます。
} as const