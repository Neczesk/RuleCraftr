import sqlalchemy

from ..dao import Session
from ..models.models import Rulesets, Tags, Users


def ruleset_to_dict(r: Rulesets):
    return {
        "id": r.id,
        "rn_name": r.rn_name,
        "public": r.public,
        "user_id": r.user_id,
        "created_date": r.created_date,
        "description": r.description,
        "last_modified": r.last_modified,
        "tags": [t.tag for t in r.tag]
    }


def get_rulesets_with_tags(tag_list: list[str]):
    with Session() as session:
        rulesets = session.query(Rulesets)\
            .filter(Rulesets.tags.any(Tags.tag.in_(tag_list))).all()
        return [ruleset_to_dict(r) for r in rulesets]


def generate__new_ruleset(ruleset: dict) -> Rulesets:
    new_ruleset = Rulesets(
        rn_name=ruleset["rn_name"],
        public=ruleset["public"],
        user_id=ruleset["user_id"],
        description=ruleset["description"],
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


def get_rulesets(admin, userlist, tagslist, nameslist, page=1, per_page=2):
    with Session() as session:
        stmt = sqlalchemy.select(Rulesets)

        if userlist:
            users = session.query(Users).filter(
                Users.username.in_(userlist)).all()
            userids = [u.id for u in users]
            stmt = stmt.where(Rulesets.user_id.in_(userids))

        if tagslist:
            tags = session.query(Tags).filter(Tags.tag.in_(tagslist)).all()
            tag_ids = [tag.id for tag in tags]
            stmt = stmt.where(Rulesets.tag.any(Tags.id.in_(tag_ids)))

        if nameslist:
            name_conditions = [Rulesets.rn_name.ilike(
                f"%{name}%") for name in nameslist]
            stmt = stmt.where(sqlalchemy.or_(*name_conditions))

        if not admin:
            stmt = stmt.where(Rulesets.public == True)

        stmt = stmt.order_by(sqlalchemy.desc(Rulesets.last_modified), Rulesets.id).offset(
            (page-1)*per_page).limit(per_page)
        result = session.scalars(stmt)

        return [ruleset_to_dict(ruleset) for ruleset in result]


def get_public_rulesets_count(admin, userlist, tagslist, nameslist):
    with Session() as session:
        query = session.query(Rulesets)

        if userlist:
            users = session.query(Users).filter(
                Users.username.in_(userlist)).all()
            userids = [u.id for u in users]
            query = query.where(Rulesets.user_id.in_(userids))

        if tagslist:
            tags = session.query(Tags).filter(Tags.tag.in_(tagslist)).all()
            tag_ids = [tag.id for tag in tags]
            query = query.where(Rulesets.tag.any(Tags.id.in_(tag_ids)))

        if nameslist:
            name_conditions = [Rulesets.rn_name.ilike(
                f"%{name}%") for name in nameslist]
            query = query.where(sqlalchemy.or_(*name_conditions))

        if not admin:
            query = query.filter(Rulesets.public == True)

        count = query.count()
        return count


def get_list_of_rulesets(ids):
    with Session() as session:
        stmt = sqlalchemy.select(Rulesets).where(Rulesets.id.in_(ids))
        result = session.scalars(stmt)
        return [ruleset_to_dict(ruleset) for ruleset in result]


def get_rulesets_for_user(user_id):
    id = int(user_id)
    with Session() as session:
        stmt = sqlalchemy.select(Rulesets).where(Rulesets.user_id == user_id)
        result = session.scalars(stmt)

        return [ruleset_to_dict(ruleset) for ruleset in result]


def update_rulesets(ruleset_data: list[dict]):
    with Session() as session:
        session.bulk_update_mappings(Rulesets, ruleset_data)
        session.commit()
        return {"status": "successful"}
