// ESlintのルールを無効化
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { theme } from 'themes'
import type { ResponsiveProp, Responsive } from 'types'

// Themeの型
export type AppTheme = typeof theme

// keyof: オブジェクト型のプロパティ名(key名)を取得し、「型」に対して使用します。
// typeof: 実際の値を型に変換し、「変数」に対して使用します。
// 二つを組み合わせると型があるオブジェクトに対して使用するとプロパティの文字列型になる
// 例）SpaceThemeKeys = '0px' | '8px' | ...
type SpaceThemeKeys = keyof typeof theme.space
type ColorThemeKeys = keyof typeof theme.colors
type FontSizeThemeKeys = keyof typeof theme.fontSizes
type LetterSpacingThemeKeys = keyof typeof theme.letterSpacings
type LineHeightThemeKeys = keyof typeof theme.lineHeights

// 各Themeのキーの型
export type Space = SpaceThemeKeys | (string & {})
export type Color = ColorThemeKeys | (string & {})
export type FontSize = FontSizeThemeKeys | (string & {})
export type LetterSpacing = LetterSpacingThemeKeys | (string & {})
export type LineHeight = LineHeightThemeKeys | (string & {})

// ブレイクポイント
const BREAKPOINTS: { [key: string]: string } = {
    sm: '640px', // 640px以上
    md: '768px', // 768px以上
    lg: '1024px', // 1024px以上
    xl: '1280px', // 1280px以上
}

/**
 * Responsive型をCSSプロパティとその値に変換
 * @param propKey CSSプロパティ
 * @param prop Responsive型
 * @param theme AppTheme
 * @returns CSSプロパティとその値 (ex. background-color: white;)
 */
export function toPropValue<T>(
    propKey: string,
    prop?: Responsive<T>,
    theme?: AppTheme,
) {
    if (prop === undefined) return undefined

    if (isResponsivePropType(prop)) {
        const result = []
        for (const responsiveKey in prop) {
            if (responsiveKey === 'base') {
                // デフォルトのスタイル
                result.push(
                    `${propKey}: ${toThemeValueIfNeeded(
                        propKey,
                        prop[responsiveKey],
                        theme,
                    )};`,
                )
            } else if (
                responsiveKey === 'sm' ||
                responsiveKey === 'md' ||
                responsiveKey === 'lg' ||
                responsiveKey === 'xl'
            ) {
                // メディアクエリでのスタイル
                const breakpoint = BREAKPOINTS[responsiveKey]
                const style = `${propKey}: ${toThemeValueIfNeeded(
                    propKey,
                    prop[responsiveKey],
                    theme,
                )};`
                result.push(`@media screen and (min-width: ${breakpoint}) {${style}}`)
            }
        }
        return result.join('\n')
    }

    return `${propKey}: ${toThemeValueIfNeeded(propKey, prop, theme)};`
}

// キーがない値だけのコレクションであるオブジェクトのこと
// Arrayと違い、重複した要素は格納できない
const SPACE_KEYS = new Set([
    'margin',
    'margin-top',
    'margin-left',
    'margin-bottom',
    'margin-right',
    'padding',
    'padding-top',
    'padding-left',
    'padding-bottom',
    'padding-right',
])
const COLOR_KEYS = new Set(['color', 'background-color'])
const FONT_SIZE_KEYS = new Set(['font-size'])
const LINE_SPACING_KEYS = new Set(['letter-spacing'])
const LINE_HEIGHT_KEYS = new Set(['line-height'])

/**
 * Themeに指定されたCSSプロパティの値に変換
 * @param propKey CSSプロパティ
 * @param value CSSプロパティの値
 * @param theme AppTheme
 * @returns CSSプロパティの値
 */
function toThemeValueIfNeeded<T>(propKey: string, value: T, theme?: AppTheme) {
    if (
        theme &&
        theme.space &&
        SPACE_KEYS.has(propKey) &&
        isSpaceThemeKeys(value, theme)
    ) {
        return theme.space[value]
    } else if (
        theme &&
        theme.colors &&
        COLOR_KEYS.has(propKey) &&
        isColorThemeKeys(value, theme)
    ) {
        return theme.colors[value]
    } else if (
        theme &&
        theme.fontSizes &&
        FONT_SIZE_KEYS.has(propKey) &&
        isFontSizeThemeKeys(value, theme)
    ) {
        return theme.fontSizes[value]
    } else if (
        theme &&
        theme.letterSpacings &&
        LINE_SPACING_KEYS.has(propKey) &&
        isLetterSpacingThemeKeys(value, theme)
    ) {
        return theme.letterSpacings[value]
    } else if (
        theme &&
        theme.lineHeights &&
        LINE_HEIGHT_KEYS.has(propKey) &&
        isLineHeightThemeKeys(value, theme)
    ) {
        return theme.lineHeights[value]
    }

    return value
}

/**
* 横の解像度が設定されているか判別する関数オブジェクト
* @params prop 横の解像度がプロパティとして設定されたオブジェクト
* @returns プロパティが設定されていればtrue, されていなければfalseを返す
*/
function isResponsivePropType<T>(prop: any): prop is ResponsiveProp<T> {
    return (
        // propがtruthyであり、かつ5つのパラメーターのうち一つでもプロパティ値が設定されていればtrueを返す
        prop &&
        (prop.base !== undefined ||
            prop.sm !== undefined ||
            prop.md !== undefined ||
            prop.lg !== undefined ||
            prop.xl !== undefined)
    )
}

// isは型ガードの中でもユーザー定義型ガードと呼ばれ、あるスコープでの型を保証するために実行時にチェックを行う式のことである。
// ここでは、propがany型であるが、SpaceThemeKeys型であると関数スコープ内で扱われる
/**
* marginを設定する値が設定されている値が判定する関数
* @param prop プロパティの値
* @param theme CSSプロパティとその値を含んだ一連のオブジェクト
* @returns propとthme.spaceのどれかの要素が一致していればtrue ex.) prop: '8px' true ,'23px' false
*/
function isSpaceThemeKeys(prop: any, theme: AppTheme): prop is SpaceThemeKeys {
    // プロパティを取得し、thme.spaceに格納されている要素がprop引数として渡された値と同じであれば、trueを返す
    return Object.keys(theme.space).filter((key) => key == prop).length > 0
}

function isColorThemeKeys(prop: any, theme: AppTheme): prop is ColorThemeKeys {
    return Object.keys(theme.colors).filter((key) => key == prop).length > 0
}

function isFontSizeThemeKeys(
    prop: any,
    theme: AppTheme,
): prop is FontSizeThemeKeys {
    return Object.keys(theme.fontSizes).filter((key) => key == prop).length > 0
}

function isLetterSpacingThemeKeys(
    prop: any,
    theme: AppTheme,
): prop is LetterSpacingThemeKeys {
    return (
        Object.keys(theme.letterSpacings).filter((key) => key == prop).length > 0
    )
}

function isLineHeightThemeKeys(
    prop: any,
    theme: AppTheme,
): prop is LineHeightThemeKeys {
    return Object.keys(theme.lineHeights).filter((key) => key == prop).length > 0
}