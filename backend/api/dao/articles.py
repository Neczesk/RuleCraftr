from sqlalchemy import update
import sqlalchemy

from ..dao import Session
from api.models.models import Articles


def article_to_dict(a: Articles):
    return {
        "id": a.id,
        "title": a.title,
        "ruleset": a.ruleset,
        "content": a.content,
        "parent": a.parent,
        "created_date": a.created_date,
        "sort": a.sort
    }


def generate_new_article(articledata: dict):
    return Articles(
        id=articledata["id"],
        title=articledata["title"],
        ruleset=articledata["ruleset"],
        content=articledata["content"],
        parent=articledata["parent"],
        sort=articledata["sort"]
    )


def get_articles():
    pass


def get_article(id):
    pass


def get_list_of_articles_in_rulesets(list_ruleset_ids: list[int]):
    with Session() as session:
        stmt = sqlalchemy.select(Articles).where(
            Articles.ruleset.in_(list_ruleset_ids))
        result = session.scalars(stmt)
        return [article_to_dict(a) for a in result]


def get_list_of_articles(listIds: list[int]):
    with Session() as session:
        stmt = sqlalchemy.select(Articles).where(Articles.id.in_(listIds))
        result = session.scalars(stmt)
        return [article_to_dict(a) for a in result]


def get_articles_for_ruleset(id):
    with Session() as session:
        stmt = sqlalchemy.select(Articles).where(Articles.ruleset == id)
        result = session.scalars(stmt)
        return [article_to_dict(a) for a in result]


def insert_article(article_data):
    a = generate_new_article(article_data)
    with Session() as session:
        session.add(a)
        session.commit()
        return article_to_dict(a)


def bulk_insert_articles(article_data: list[dict]):
    articles = [generate_new_article(a) for a in article_data]
    with Session() as session:
        session.add_all(articles)
        session.commit()
        return [article_to_dict(a) for a in articles]


def update_articles(article_data: list[dict]):
    with Session() as session:
        session.bulk_update_mappings(Articles, article_data)
        session.commit()
        return {"status": "successful"}


def delete_articles(article_data: list[int]):
    with Session() as session:
        statement = sqlalchemy.delete(Articles).where(
            Articles.id.in_(article_data))
        session.execute(statement)
        session.commit()
        return {"status": "successful"}
