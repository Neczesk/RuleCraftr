import sqlalchemy

from ..dao import Session
from ..models.models import Rulesets


def ruleset_to_dict(r: Rulesets):
    return {
        "id": r.id,
        "rn_name": r.rn_name,
        "public": r.public,
        "user_id": r.user_id,
        "created_date": r.created_date,
        "description": r.description
    }


def generate__new_ruleset(ruleset: dict) -> Rulesets:
    new_ruleset = Rulesets(
        rn_name=ruleset["rn_name"],
        public=ruleset["public"],
        user_id=ruleset["user_id"],
        description=ruleset["description"]
    )
    return new_ruleset


def insert_ruleset(ruleset: dict):
    r = generate__new_ruleset(ruleset)
    with Session() as session:
        session.add(r)
        session.commit()
        return ruleset_to_dict(r)


def delete_ruleset(id):
    with Session() as session:
        stmt = sqlalchemy.delete(Rulesets).where(Rulesets.id == id)
        session.execute(stmt)
        session.commit()
        return {"status": "successful"}


def get_ruleset(ruleset_id: int):
    with Session() as session:
        stmt = sqlalchemy.select(Rulesets).where(Rulesets.id == ruleset_id)
        result = session.scalars(stmt)
        return ruleset_to_dict(result.first())


def get_rulesets():
    with Session() as session:
        stmt = sqlalchemy.select(Rulesets)
        result = session.scalars(stmt)
        return [ruleset_to_dict(ruleset) for ruleset in result]


def get_list_of_rulesets(ids):
    with Session() as session:
        stmt = sqlalchemy.select(Rulesets).where(Rulesets.id.in_(ids))
        result = session.scalars(stmt)
        return [ruleset_to_dict(ruleset) for ruleset in result]


def get_rulesets_for_user(user_id):
    id = int(user_id)
    with Session() as session:
        stmt = sqlalchemy.select(Rulesets).where(sqlalchemy.or_(
            Rulesets.user_id == id, Rulesets.public == True))
        result = session.scalars(stmt)

        return [ruleset_to_dict(ruleset) for ruleset in result]


def update_rulesets(ruleset_data: list[dict]):
    with Session() as session:
        session.bulk_update_mappings(Rulesets, ruleset_data)
        session.commit()
        return {"status": "successful"}
