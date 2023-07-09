import api.dao.keywords as keywords
import api.services.rulesets as rulesets


def get_keywords_for_ruleset(id):
    return keywords.get_keywords_for_ruleset(id)


def create_keywords(keywordData):
    if isinstance(keywordData, list):
        return keywords.bulk_insert_keywords(keywordData)
    elif isinstance(keywordData, dict):
        return keywords.insert_article(keywordData)


def update_keywords(keywordData):
    return keywords.update_keywords(keywordData)


def delete_keywords(keywordData):
    return keywords.delete_keywords(keywordData)


def get_tags_in_ruleset(ruleset_id: int):
    return keywords.get_tags_in_ruleset(ruleset_id)


def validate_get_keywords(keyword_data, user_id):
    status = False
    are_all_rulesets_same = True
    area_all_rulesets_from_user = True
    current_ruleset = keyword_data[0]["ruleset"]
    ruleset_user = rulesets.get_ruleset(current_ruleset)["user_id"]
    for keyword in keyword_data:
        if keyword["ruleset"] != current_ruleset:
            are_all_rulesets_same = False
            break
        if user_id != ruleset_user:
            area_all_rulesets_from_user = False
    status = area_all_rulesets_from_user and are_all_rulesets_same
    return status


def validate_new_keywords(keywordlist, user_id):
    status = False
    are_all_rulesets_same = True
    are_all_rulesets_from_user = True
    current_ruleset = keywordlist[0]["ruleset"]
    ruleset_user = rulesets.get_ruleset(current_ruleset)["user_id"]
    for keyword in keywordlist:
        if keyword["ruleset"] != current_ruleset:
            are_all_rulesets_same = False
            break
        if user_id != ruleset_user:
            are_all_rulesets_from_user = False
    status = are_all_rulesets_from_user and are_all_rulesets_same
    return status


def validate_edit_keywords(keywordlist, user_id):
    status = False
    are_all_rulesets_same = True
    are_all_rulesets_from_user = True
    keywords_from_db = keywords.get_list_of_keywords(
        [k["id"] for k in keywordlist])
    current_ruleset = keywords_from_db[0]["ruleset"]
    ruleset_user = rulesets.get_ruleset(current_ruleset)["user_id"]
    if user_id != ruleset_user:
        are_all_rulesets_from_user = False
        return False
    for keyword in keywords_from_db:
        if keyword["ruleset"] != current_ruleset:
            are_all_rulesets_same = False
            break
    status = are_all_rulesets_from_user and are_all_rulesets_same
    return status


def validate_delete_keywords(keywordidlist, user_id):
    status = False
    are_all_rulesets_same = True
    are_all_rulesets_from_same_user = True
    keywords_from_db = keywords.get_list_of_keywords(keywordidlist)
    current_ruleset = keywords_from_db[0]["ruleset"]
    ruleset_user = rulesets.get_ruleset(current_ruleset)["user_id"]
    if user_id != ruleset_user:
        are_all_rulesets_from_same_user = False
        return False
    for keyword in keywords_from_db:
        if keyword["ruleset"] != current_ruleset:
            are_all_rulesets_same = False
            break
    status = are_all_rulesets_same and are_all_rulesets_from_same_user
    return status
