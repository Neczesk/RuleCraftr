import api.dao.articles as articles
import api.services.rulesets as rulesets


def create_article(article_data):
    if isinstance(article_data, list):
        return articles.bulk_insert_articles(article_data)
    elif isinstance(article_data, dict):
        return articles.insert_article(article_data)


def get_articles_for_ruleset(id):
    return articles.get_articles_for_ruleset(id)


def update_articles(article_data):
    return articles.update_articles(article_data)


def delete_articles(article_data):
    return articles.delete_articles(article_data)


def validate_get_articles(article_data, user_id):
    status = False
    are_all_rulesets_same = True
    area_all_rulesets_from_user = True
    current_ruleset = article_data[0]["ruleset"]
    ruleset_user = rulesets.get_ruleset(current_ruleset)["user_id"]
    for article in article_data:
        if article["ruleset"] != current_ruleset:
            are_all_rulesets_same = False
            break
        if user_id != ruleset_user:
            area_all_rulesets_from_user = False
    status = area_all_rulesets_from_user and are_all_rulesets_same
    return status


def validate_new_articles(article_list, user_id):
    status = False
    are_all_rulesets_same = True
    are_all_rulesets_from_user = True
    current_ruleset = article_list[0]["ruleset"]
    ruleset_user = rulesets.get_ruleset(current_ruleset)["user_id"]
    for article in article_list:
        if article["ruleset"] != current_ruleset:
            are_all_rulesets_same = False
            break
        if user_id != ruleset_user:
            are_all_rulesets_from_user = False
    status = are_all_rulesets_from_user and are_all_rulesets_same
    return status


def validate_edit_articles(article_list, user_id):
    status = False
    are_all_rulesets_same = True
    are_all_rulesets_from_user = True
    articles_from_db = articles.get_list_of_articles(
        [a["id"] for a in article_list])
    current_ruleset = articles_from_db[0]["ruleset"]
    ruleset_user = rulesets.get_ruleset(current_ruleset)["user_id"]
    if user_id != ruleset_user:
        are_all_rulesets_from_user = False
        return False
    for article in articles_from_db:
        if article["ruleset"] != current_ruleset:
            are_all_rulesets_same = False
            break
    status = are_all_rulesets_from_user and are_all_rulesets_same
    return status


def validate_delete_keywords(articles_id_list, user_id):
    status = False
    are_all_rulesets_same = True
    are_all_rulesets_from_same_user = True
    articles_from_db = articles.get_list_of_articles(articles_id_list)
    current_ruleset = articles_from_db[0]["ruleset"]
    ruleset_user = rulesets.get_ruleset(current_ruleset)["user_id"]
    if user_id != ruleset_user:
        are_all_rulesets_from_same_user = False
        return False
    for article in articles_from_db:
        if article["ruleset"] != current_ruleset:
            are_all_rulesets_same = False
            break
    status = are_all_rulesets_same and are_all_rulesets_from_same_user
    return status
