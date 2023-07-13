import api.dao.tags as tags


def search_tags(search_term):
    return tags.search_tags(search_term)


def get_tags_for_ruleset(rid: int):
    return tags.get_tags_for_ruleset(rid)


def update_tags_for_ruleset(tag_names: list[str], rid: int):
    return tags.update_ruleset_tags(tag_names, rid)
