from sqlalchemy import update
import sqlalchemy

from ..dao import Session
from api.models.models import Keywords


def keyword_to_dict(keyword: Keywords):
    return {
        "keyword": keyword.keyword,
        "id": keyword.id,
        "longDefinition": keyword.long_definition,
        "shortDefinition": keyword.short_definition,
        "created_date": keyword.created_date,
        "ruleset": keyword.ruleset,
    }


def generate_new_keyword(keywordData: dict):
    return Keywords(
        keyword=keywordData["keyword"],
        short_definition=keywordData["short_definition"],
        long_definition=keywordData["long_definition"],
        ruleset=keywordData["ruleset"]
    )


def get_list_of_keywords_in_rulesets(list_ruleset_ids: list[int]):
    with Session() as session:
        stmt = sqlalchemy.select(Keywords).where(
            Keywords.ruleset.in_(list_ruleset_ids))
        result = session.scalars(stmt)
        return [keyword_to_dict(k) for k in result]


def get_list_of_keywords(listIds: list[int]):
    with Session() as session:
        stmt = sqlalchemy.select(Keywords).where(Keywords.id.in_(listIds))
        result = session.scalars(stmt)
        return [keyword_to_dict(k) for k in result]


def get_keywords_for_ruleset(id):
    with Session() as session:
        stmt = sqlalchemy.select(Keywords).where(Keywords.ruleset == id)
        result = session.scalars(stmt)
        return [keyword_to_dict(k) for k in result]


def insert_keyword(keyword_data):
    k = generate_new_keyword(keyword_data)
    with Session() as session:
        session.add(k)
        session.commit()
        return keyword_to_dict(k)


def bulk_insert_keywords(keyword_data: list[dict]):
    keywords = [generate_new_keyword(k) for k in keyword_data]
    with Session() as session:
        session.add_all(keywords)
        session.commit()
        return [keyword_to_dict(k) for k in keywords]


def delete_keywords(keyword_data: list[int]):
    with Session() as session:
        statement = sqlalchemy.delete(Keywords).where(
            Keywords.id.in_(keyword_data
                            ))
        session.execute(statement)
        session.commit()
        return {"status": "successful"}


def update_keywords(keyword_data: list[dict]):
    with Session() as session:
        session.bulk_update_mappings(Keywords, keyword_data
                                     )
        session.commit()
        return {"status": "successful"}
