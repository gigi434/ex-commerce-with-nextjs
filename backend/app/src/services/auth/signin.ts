import { ApiContext, User } from 'types'
import { fetcher } from '../../utils'

export type SigninParams = {
    username: string,
    password: string
}

/*
認証API（サインイン）
@param contxt APIコンテキスト　静的サイト生成時のリクエストとクライアントサイドのリクエストを分ける
@param params パラメータ
@returns ログインユーザー
*/

const signin = async (
    context: ApiContext,
    params: SigninParams,
): Promise<User> => {
    return await fetcher(
        `${context.apiRootUrl.replace(/\/$/g,'')}/auth/signin`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        }
    )
}

export default signin