import React, { useState, useContext, createContext } from 'react'

const GlobalSpinnerContext = createContext<boolean>(false)
// eslint-disable-next-line @typescript-eslint/no-empty-function
const GlobalSpinnerActionsContext = createContext<React.Dispatch<React.SetStateAction<boolean>>>(() => { })

// グローバルスピナーの表示・非表示
export const useGlobalSpinnerContext = (): boolean => useContext<boolean>(GlobalSpinnerContext)

// グローバルスピナーの表示・非表示のアクション
// useStateの更新関数はReact.Dispatch<React.SetStateAction<変化させる状態>>で示す
/**
 * グローバルスピナーの表示・非表示を通知するdispatch関数のコンテキストを作成するアロー関数
 */
export const useGlobalSpinnerActionsContext = (): React.Dispatch<React.SetStateAction<boolean>> => {
    return useContext<React.Dispatch<React.SetStateAction<boolean>>>(GlobalSpinnerActionsContext)
}

interface GlobalSpinnerContextProvierProps {
    /**
     * スピナーを表示したい関数コンポーネント
     */
    children?: React.ReactNode
}

/**
 * グローバルスピナーコンテキストプロバイダー
 * @params children スピナーを表示したい関数コンポーネント
 * @returns 
 */
const GlobalSpinnerContextProvider = ({ children, }: GlobalSpinnerContextProvierProps) => {
    // スピナーの表示・非表示を判定するフラグ
    const [isGlobalSpinnerOn, setGlobalSpinner] = useState(false)

    return (
        <GlobalSpinnerContext.Provider value={isGlobalSpinnerOn}>
            <GlobalSpinnerActionsContext.Provider value={setGlobalSpinner}>
                {children}
            </GlobalSpinnerActionsContext.Provider>
        </GlobalSpinnerContext.Provider>
    )
}

export default GlobalSpinnerContextProvider