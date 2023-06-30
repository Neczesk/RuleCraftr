import zxcvbn from 'zxcvbn'

export function validate_password_strength(password, user){
    const result = zxcvbn(password, user)
    return result.score
}

export function get_password_suggestion(password, user){
    const result = zxcvbn(password, user)
    return result.feedback
}