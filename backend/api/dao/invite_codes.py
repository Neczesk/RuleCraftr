import sqlalchemy

from ..dao import Session
from api.models.models import InviteCodes


def invite_code_to_dict(ic: InviteCodes):
    return {
        "id": ic.id,
        "key_value": ic.key_value,
        "created_date": ic.created_date,
        "used_date": ic.used_date,
        "user_used": ic.user_used
    }


def generate_invite_code(ic: dict):
    return InviteCodes(
        id=ic['id'],
        key_value=ic['key_value'],
        created_date=ic['created_date'],
        user_used=ic['user_used'],
        used_date=ic['used_date']
    )


def get_code_by_key_value(key_value):
    with Session() as session:
        stmt = sqlalchemy.select(InviteCodes).where(
            InviteCodes.key_value == key_value)
        result = session.scalars(stmt)
        found_code = result.first()
        if not found_code:
            return None
        return invite_code_to_dict(found_code)


def update_invite_code(update_data):
    with Session() as session:
        session.bulk_update_mappings(InviteCodes, [update_data])
        session.commit()
        return {"status": "successful"}


def bulk_insert_invite_codes(key_values: list[str]):
    codes = [InviteCodes(key_value=s) for s in key_values]
    with Session() as session:
        session.add_all(codes)
        session.commit()
        return [invite_code_to_dict(c) for c in codes]


def unset_invite_code(user_id: int):
    with Session() as session:
        stmt = sqlalchemy.select(InviteCodes).where(
            InviteCodes.user_used == user_id)
        result = session.scalars(stmt)
        used_code: InviteCodes = result.first()
        if used_code:
            used_code.user_used = None
            used_code.used_date = None
        else:
            session.commit()
            return False
        session.commit()
        return True
