import api.dao.invite_codes as invite_codes

from datetime import datetime

import secrets
import string


def validate_invite_code(key_value):
    invite_code = invite_codes.get_code_by_key_value(key_value)
    if (not invite_code or invite_code["user_used"] or invite_code["used_date"]):
        return False
    invite_code["used_date"] = datetime.utcnow()
    invite_codes.update_invite_code(invite_code)
    return True


def set_invite_code_user_used(key_value, user_id):
    invite_code = invite_codes.get_code_by_key_value(key_value)
    if (invite_code["user_used"]):
        return False
    invite_code["user_used"] = user_id
    invite_codes.update_invite_code(invite_code)
    return True


def create_codes(amount):
    codes = []
    for _ in range(amount):
        alphabet = string.ascii_letters + string.digits
        secret_key = ''.join(secrets.choice(alphabet) for _ in range(25))
        codes.append(secret_key)
    generated_codes = invite_codes.bulk_insert_invite_codes(codes)
    return generated_codes


def unset_invite_code(user_id):
    return invite_codes.unset_invite_code(user_id)
