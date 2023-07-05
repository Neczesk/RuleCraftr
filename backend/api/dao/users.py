import sqlalchemy

from ..dao import Session
from api.models.models import Users


def user_to_dict(u: Users):
    return {
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "passhash": u.passhash,
        "created_date": u.created_date,
        "is_activated": u.is_activated,
        "is_admin": u.is_admin,
        "last_version_used": u.last_version_used,
        "prefer_dark_mode": u.prefer_dark_mode,
        "theme_preference": u.theme_preference
    }


def generate_new_user(userdata: dict):
    return Users(
        username=userdata["username"],
        passhash=userdata["passhash"],
        email=userdata["email"],
        version=userdata["last_version_used"]
    )


def insert_user(userdata: dict):
    u = generate_new_user(userdata)
    with Session() as session:
        session.add(u)
        try:
            session.commit()
            return user_to_dict(u)
        except:
            return None


def get_user_by_username(username: str):
    with Session() as session:
        stmt = sqlalchemy.select(Users).where(Users.username == username)
        result = session.scalars(stmt)
        found_user = result.first()
        if not found_user:
            return {"Failure": "No user found"}
        return user_to_dict(found_user)


def get_user(id: int):
    with Session() as session:
        stmt = sqlalchemy.select(Users).where(Users.id == int(id))
        result = session.scalars(stmt)
        return user_to_dict(result.first())


def change_password(id: int, new_passhash):
    with Session() as session:
        stmt = sqlalchemy.update(Users).where(
            Users.id == id).values(passhash=new_passhash)
        session.execute(stmt)
        session.commit()


def change_username(id: int, new_username):
    with Session() as session:
        stmt = sqlalchemy.update(Users).where(
            Users.id == id).values(username=new_username)
        session.execute(stmt)
        session.commit()


def delete_user(id: int):
    with Session() as session:
        stmt = sqlalchemy.delete(Users).where(Users.id == id)
        session.execute(stmt)
        session.commit()
        return True


def update_user_meta(id: int, data: dict):
    last_version_used = data["last_version_used"] if "last_version_used" in data else None
    prefer_dark_mode = data["prefer_dark_mode"] if "prefer_dark_mode" in data else None
    theme_preference = data["theme_preference"] if "theme_preference" in data else None
    update_data = {
        "last_version_used": last_version_used,
        "prefer_dark_mode": prefer_dark_mode,
        "theme_preference": theme_preference}
    # res = {k:v for k,v in kwargs.items() if v is not None}
    filtered_data = {k: v for k, v in update_data.items() if v is not None}
    with Session() as session:
        session.query(Users).filter_by(id=id).update(filtered_data)
        session.commit()
        stmt = sqlalchemy.select(Users).where(Users.id == int(id))
        result = session.scalars(stmt)
        return user_to_dict(result.first())
