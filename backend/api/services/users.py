import zxcvbn

import api.dao.users as users
import api.models.user

import api.services.rulesets as rulesets
import api.dao.rulesets as ruleset_dao

import api.dao.articles as articles_dao

import api.dao.keywords as keyword_dao

import api.services.invite_codes as invite_codes


def create_user(user_data):
    new_user = api.models.user.User()
    invite_status = invite_codes.validate_invite_code(
        user_data['inviteCode'])
    if not invite_status:
        return {"Failure": "Invalid invite code"}, 403
    password_status = validate_new_password(
        user_data["password"], user_data["confirmPassword"])
    if not password_status:
        return {"Failure": "Password is invalid"}, 400

    new_user.username = user_data["username"]
    new_user.set_password(user_data['password'])

    saved_user = save_user(new_user)
    if not saved_user:
        return {"Failure": "Error occured saving the user to the database"}, 500
    code_status = invite_codes.set_invite_code_user_used(
        user_data['inviteCode'], saved_user["id"])
    if not code_status:
        return {"Failure": "Error occured validating the invite code"}, 500

    new_user.id = saved_user['id']

    return new_user, 200


def change_user_password(user: api.models.user.User, formdata):
    original_password = formdata["originalPassword"]
    password1 = formdata["newPassword1"]
    password2 = formdata["newPassword2"]
    correct_password = user.check_password(original_password)
    if not correct_password:
        return {"Failure": "Incorrect password"}, 400

    correct_new_password = validate_new_password(password1, password2)
    if not correct_new_password:
        return {"Failure": "Invalid new password"}, 403

    user.set_password(password1)
    users.change_password(user.id, user.passhash)
    return {"Success": "Password changed"}, 200


def change_username(user: api.models.user.User, formdata):
    password = formdata["password"]
    is_password_correct = user.check_password(password)
    if not is_password_correct:
        return {"Failure": "Incorrect password"}, 400

    user.username = formdata["newUsername"]
    users.change_username(user.id, user.username)
    return {"Success": "Username changed"}, 200


def save_user(user: api.models.user.User):
    db_user = user.convertToDict()
    if not db_user:
        return None
    return users.insert_user(db_user)


def validate_new_password(password, confirm_password):
    result = zxcvbn.zxcvbn(password)
    if result["score"] <= 2:
        return False
    return password == confirm_password


def get_user_by_username(username):
    return users.get_user_by_username(username)


def load_user(id):
    userdata = users.get_user(id)
    user = api.models.user.User(jsondata=userdata)
    return user


def get_user(id):
    userdata = users.get_user(id)
    return userdata


def delete_account(user: api.models.user.User, password):
    correct_password = user.check_password(password)
    if not correct_password:
        return {"Failure": "Incorrect Password"}, 403

    # First find all the rulesets that belong to this user
    rulesets_for_user = rulesets.get_rulesets(user.id)
    lrulesets = [r["id"] for r in rulesets_for_user]
    # Find all articles belonging to any of these rulesets and delete them
    larticles = articles_dao.get_list_of_articles_in_rulesets(lrulesets)
    articles_dao.delete_articles(a["id"] for a in larticles)
    # Find all keywords belonging to any of these rulesets and delete them
    lkeywords = keyword_dao.get_list_of_keywords_in_rulesets(lrulesets)
    keyword_dao.delete_keywords(k["id"] for k in lkeywords)
    # Delete the rulesets now
    for r in rulesets_for_user:
        ruleset_dao.delete_ruleset(r["id"])
    # Unmark the user's invite code
    invite_codes.unset_invite_code(user.id)
    # Finally, delete the user
    delete_status = users.delete_user(user.id)
    if not delete_status:
        return {"Failure": "Failed to delete user from database"}, 500
    return {"Success": "User account deleted"}, 200


def update_user_meta(id, data):
    return users.update_user_meta(id, data)
