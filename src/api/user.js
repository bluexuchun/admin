import ajax from '@/libs/api.request'
export const login = ({
    username,
    password
}) => {
    const data = {
        username: username,
        password: password
    }
    return ajax.post('api.php?entry=sys&c=account&a=login', data)
}
export const getUserInfo = (token) => {
    const data = {
        token: token
    }
    return ajax.post('api.php?entry=sys&c=user&a=profile', data)
}