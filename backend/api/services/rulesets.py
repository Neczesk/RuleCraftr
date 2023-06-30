import api.dao.rulesets as rulesets


def create_ruleset(ruleset_data):
    return rulesets.insert_ruleset(ruleset_data)


def delete_ruleset(id):
    return rulesets.delete_ruleset(id)


def get_ruleset(ruleset_id):
    return rulesets.get_ruleset(int(ruleset_id))


def get_rulesets(user_id):
    if user_id:
        return rulesets.get_rulesets_for_user(user_id)
    else:
        return rulesets.get_rulesets()


def update_rulesets(rulesets_data):
    return rulesets.update_rulesets(rulesets_data)


def validate_update_ruleset(ruleset_ids, user_id):
    ruleset_list = rulesets.get_list_of_rulesets(ruleset_ids)
    for ruleset in ruleset_list:
        if ruleset["user_id"] != user_id:
            return False
    return True
