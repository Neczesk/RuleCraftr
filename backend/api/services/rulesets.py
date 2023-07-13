from ..dao import rulesets as rulesets
from ..dao import articles as articles_dao
from ..dao import keywords as keyword_dao


def create_ruleset(ruleset_data):
    return rulesets.insert_ruleset(ruleset_data)


def delete_ruleset(id):
    # Need to delete articles and keywords first until soft delete is implemented
    # Find all articles belonging to any of these rulesets and delete them
    larticles = articles_dao.get_list_of_articles_in_rulesets([id])
    articles_dao.delete_articles(a["id"] for a in larticles)
    # Find all keywords belonging to any of these rulesets and delete them
    lkeywords = keyword_dao.get_list_of_keywords_in_rulesets([id])
    keyword_dao.delete_keywords(k["id"] for k in lkeywords)
    return rulesets.delete_ruleset(id)


def get_ruleset(ruleset_id):
    return rulesets.get_ruleset(int(ruleset_id))


def get_rulesets(user_id=None, admin=False, users: str = '', tags: str = '', names: str = '', page=1, per_page=2):
    userlist = []
    tagslist = []
    nameslist = []

    pageoffset = int(page) if page else 1
    perpage = int(per_page) if per_page else 2
    if users:
        userlist = list(filter(None, users.split(',')))
    if tags:
        tagslist = list(filter(None, tags.split(',')))
    if names:
        nameslist = list(filter(None, names.split(',')))
    if user_id:
        return rulesets.get_rulesets_for_user(user_id)
    else:
        returned_rulesets = rulesets.get_rulesets(
            admin, userlist, tagslist, nameslist, pageoffset, perpage)
        count = rulesets.get_public_rulesets_count(
            admin, userlist, tagslist, nameslist)
        return {
            "body": returned_rulesets,
            "Success": "Successfully retreived rulesets",
            "page": page,
            "per_page": per_page,
            "count": count
        }


def update_rulesets(rulesets_data):
    return rulesets.update_rulesets(rulesets_data)


def validate_update_ruleset(ruleset_ids, user_id):
    ruleset_list = rulesets.get_list_of_rulesets(ruleset_ids)
    for ruleset in ruleset_list:
        if ruleset["user_id"] != user_id:
            return False
    return True
