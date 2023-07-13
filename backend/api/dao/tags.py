import sqlalchemy
from sqlalchemy.dialects.postgresql import insert

from ..dao import Session
from ..models.models import Tags, Rulesets, t_tags_rulesets


def search_tags(search_term: str):
    with Session() as session:
        stmt = sqlalchemy.text("""
            SELECT * FROM tags
            WHERE tag ILIKE '%' || :search_term || '%'
            ORDER BY is_core DESC, POSITION(LOWER(:search_term) in LOWER(tag)), tag
            LIMIT 10
        """)
        tags = session.execute(stmt, {"search_term": search_term}).fetchall()
        return [tag_ruleset_to_string(t) for t in tags]


def tag_ruleset_to_string(t: Tags):
    return t.tag


def get_tags_for_ruleset(rid: int):
    with Session() as session:
        ruleset = session.query(Rulesets).filter(Rulesets.id == rid).one()
        tags = ruleset.tag
        return [tag_ruleset_to_string(t) for t in tags]


def update_ruleset_tags(tag_names: list[str], ruleset_id: int):
    with Session() as session:
        ruleset: Rulesets = session.query(Rulesets).filter(
            Rulesets.id == ruleset_id).first()
        if ruleset:
            # Delete all tag associations belonging to the ruleset
            deletestmt = sqlalchemy.delete(t_tags_rulesets).where(
                t_tags_rulesets.c.ruleset_id == ruleset_id)
            session.execute(deletestmt)
            # Insert new tags for all the tag names with ON CONFLICT do nothing
            insertdata = []
            for tag in tag_names:
                tagdata = {"tag": tag}
                insertdata.append(tagdata)
            if len(insertdata) > 0:
                insertstmt = insert(Tags).values(
                    insertdata).on_conflict_do_nothing()
                session.execute(insertstmt)
            # Insert new tag associations for the ruleset for all the tags
            if len(tag_names) > 0:
                tags = session.query(Tags).filter(
                    Tags.tag.in_(tag_names)).all()
                for tag in tags:
                    ruleset.tag.append(tag)
            session.commit()

            return {"Success": "The rulesets tags were successfully updated"}
