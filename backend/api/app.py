from flask import Flask, make_response, jsonify
from flask import request
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
from datetime import timedelta
import os

import api.services.rulesets as rulesets
import api.services.users as users
import api.services.articles as articles
import api.services.keywords as keywords
import api.services.invite_codes as invite_codes
import api.models.user


app = Flask(__name__)
app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
)
app.secret_key = os.getenv('API_SECRET_KEY')
login_manager: LoginManager = LoginManager()
login_manager.init_app(app)
CORS(app, supports_credentials=True)


@login_manager.user_loader
def load_user(id):
    user = users.load_user(id)
    return user


@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'POST':
        login_data = request.get_json()
        username = login_data["username"]
        password = login_data["password"]
        userdata = users.get_user_by_username(username)
        if "Failure" in userdata:
            return standard_response(userdata, 400)
        user = users.load_user(userdata["id"])

        if user is None or not user.check_password(password):
            return standard_response({'Failure': 'Invalid username or password'}, 401)

        login_user(user, remember=True, duration=timedelta.days(30))
        responsedata = {
            "username": userdata["username"],
            "id": userdata['id'],
            "email": userdata['email'],
            "activated": userdata['is_activated'],
            "admin": userdata['is_admin']
        }
        return standard_response(responsedata, 200)
    elif request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('access-control-allow-credentials', 'true')
        response.headers.add("access-control-allow-origin",
                             'http://localhost:80')
        response.headers.add(
            "access-control-allow-methods", "OPTIONS, POST")
        response.headers.add("access-control-allow-headers", "Content-type")
        return response


@app.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == 'POST':
        userdata = request.get_json()
        if not userdata:
            return standard_response({"Failure": "No account data was sent"}, 400)

        user, code = users.create_user(userdata)
        if (not isinstance(user, api.models.user.User)):
            return standard_response(user, code)

        response_data = {
            "username": user.username,
            'id': user.id,
            "email": user.email,
            "activated": user.is_active(),
            "admin": user.is_admin
        }
        login_user(user)
        return standard_response(response_data, 200)

    elif request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('access-control-allow-credentials', 'true')
        response.headers.add("access-control-allow-origin",
                             'http://localhost:80')
        response.headers.add(
            "access-control-allow-methods", "OPTIONS, POST")
        response.headers.add("access-control-allow-headers", "Content-type")
        return response


@app.route('/logout', methods=['POST', 'OPTIONS'])
@login_required
def logout():
    if request.method == 'POST':
        if current_user.is_anonymous():
            return standard_response({"Failure": "No user logged in to logout"}, 400)
        logout_user()
        return standard_response({"Success": "Successfully logged out"}, 200)
    elif request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('access-control-allow-credentials', 'true')
        response.headers.add("access-control-allow-origin",
                             'http://localhost:80')
        response.headers.add(
            "access-control-allow-methods", "OPTIONS, POST")
        response.headers.add("access-control-allow-headers", "Content-type")
        return response


@app.route("/user/<int:id>/changepassword", methods=['PUT', 'OPTIONS'], strict_slashes=True)
@login_required
def change_password(id: int):
    if request.method == 'PUT':
        if (id == current_user.id):
            body, code = users.change_user_password(
                current_user, request.get_json())
            return standard_response(body, code)
        else:
            return standard_response({"Failure": "Can't change the password of another user"}, 403)
    elif request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('access-control-allow-credentials', 'true')
        response.headers.add("access-control-allow-origin",
                             'http://localhost:80')
        response.headers.add(
            "access-control-allow-methods", "OPTIONS, PUT")
        response.headers.add("access-control-allow-headers", "Content-type")
        return response


@app.route("/user/<int:id>/deleteaccount", methods=['OPTIONS', 'DELETE'], strict_slashes=True)
@login_required
def delete_account(id: int):
    if request.method == 'DELETE':
        if (id == current_user.id):
            password = request.get_json()["password"]
            body, code = users.delete_account(current_user, password)
            return standard_response(body, code)
        else:
            return standard_response({"Failure": "Not allowed to delete another user's account"})
    elif request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('access-control-allow-credentials', 'true')
        response.headers.add("access-control-allow-origin",
                             'http://localhost:80')
        response.headers.add(
            "access-control-allow-methods", "OPTIONS, DELETE")
        response.headers.add("access-control-allow-headers", "Content-type")
        return response


@app.route("/user/<int:id>/changeusername", methods=['PUT', 'OPTIONS'], strict_slashes=True)
@login_required
def change_username(id: int):
    if request.method == 'PUT':
        if (id == current_user.id):
            body, code = users.change_username(
                current_user, request.get_json())
            return standard_response(body, code)
        else:
            return standard_response({"Failure": "Can't change the username of another user"}, 403)
    elif request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('access-control-allow-credentials', 'true')
        response.headers.add("access-control-allow-origin",
                             'http://localhost:80')
        response.headers.add(
            "access-control-allow-methods", "OPTIONS, PUT")
        response.headers.add("access-control-allow-headers", "Content-type")
        return response


@app.route("/user/<int:id>", methods=["GET"], strict_slashes=True)
@login_required
def get_user(id: int):
    if id == current_user.id:
        body = users.get_user(id)
        return standard_response(body, 200)
    else:
        return standard_response({"Failure": "Not allowed to request a user other than yourself"}, 403)


def standard_response(body, code):
    response = make_response(body, code)
    response.headers.add("access-control-allow-origin",
                         'http://localhost:80')
    response.headers.add("access-control-allow-credentials", "true")
    return response


@app.route("/rulesets/<int:id>", methods=['GET', 'DELETE', 'OPTIONS'], strict_slashes=True)
@login_required
def get_ruleset(id: int):
    ruleset = rulesets.get_ruleset(id)
    if (ruleset["user_id"] != current_user.id):
        return standard_response({"Failure": "Can't access ruleset belonging to someone else"}, 403)
    if request.method == 'GET':
        body = rulesets.get_ruleset(id)
        return standard_response(body, 200)
    elif request.method == 'DELETE':
        body = rulesets.delete_ruleset(id)
        return standard_response(body, 200)
    elif request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('access-control-allow-credentials', 'true')

        response.headers.add("access-control-allow-origin",
                             'http://localhost:80')
        response.headers.add(
            "access-control-allow-methods", "OPTIONS, DELETE, GET")
        response.headers.add("access-control-allow-headers", "Content-type")
        return response


@app.route("/rulesets", methods=['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'], strict_slashes=True)
@login_required
def get_rulesets():
    if request.method == 'GET':
        user_id = request.args.get("user")
        if (int(user_id) == current_user.id):
            body = rulesets.get_rulesets(user_id)
            return standard_response(body, 200)
        else:
            return standard_response({"Failure": "Can't access ruleset belonging to another user"}, 403)
    elif request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('access-control-allow-credentials', 'true')
        response.headers.add("access-control-allow-origin",
                             'http://localhost:80')
        response.headers.add(
            "access-control-allow-methods", "POST, OPTIONS, PUT, DELETE, GET")
        response.headers.add("access-control-allow-headers", "Content-type")
        return response
    elif request.method == 'POST':
        if int(request.get_json()["user_id"]) == current_user.id:
            body = rulesets.create_ruleset(request.get_json())
            return standard_response(body, 200)
        else:
            return standard_response({"Failure": "Can't create a ruleset belonging to someone else"}, 403)
    elif request.method == 'PUT':
        if (rulesets.validate_update_ruleset([r["id"] for r in request.get_json()], current_user.id) or current_user.is_admin):
            body = rulesets.update_rulesets(request.get_json())
            return standard_response(body, 200)
        else:
            return standard_response({"Failure": "Can't edit a ruleset belonging to someone else"}, 403)


@app.route("/rulesets/<int:id>/articles", methods=['GET'])
@login_required
def get_articles_for_ruleset(id):
    user_id = current_user.id
    body = articles.get_articles_for_ruleset(id)
    if (len(body) == 0 or articles.validate_get_articles(body, user_id) or current_user.is_admin):
        return standard_response(body, 200)
    else:
        return standard_response({"Failure": "Not allowed to access articles from another ruleset"}, 403)


@app.route("/rulesets/<int:id>/keywords", methods=['GET'])
@login_required
def get_keywords_for_ruleset(id):
    user_id = current_user.id
    body = keywords.get_keywords_for_ruleset(id)
    if (len(body) == 0 or keywords.validate_get_keywords(body, user_id) or current_user.is_admin):
        return standard_response(body, 200)
    else:
        return standard_response({"Failure": "Not allowed to access keywords from another ruleset"}, 403)


@app.route("/articles", methods=['POST', 'OPTIONS', 'PUT', 'DELETE'])
@login_required
def create_article():
    if request.method == 'POST':
        user_id = current_user.id
        new_articles = request.get_json()
        if (articles.validate_new_articles(new_articles, user_id) or current_user.is_admin):
            body = articles.create_article(request.get_json())
            return standard_response(body, 200)
        else:
            return standard_response({"Failure": "Not allowed to add articles to a ruleset that doesn't belong to you"}, 200)
    elif request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('access-control-allow-credentials', 'true')
        response.headers.add("access-control-allow-origin",
                             'http://localhost:80')
        response.headers.add(
            "access-control-allow-methods", "POST, OPTIONS, PUT, DELETE")
        response.headers.add("access-control-allow-headers", "Content-type")
        return response
    elif request.method == 'PUT':
        user_id = current_user.id
        editing_articles = request.get_json()
        if (articles.validate_edit_articles(editing_articles, user_id) or current_user.is_admin):
            body = articles.update_articles(editing_articles)
            return standard_response(body, 200)
        else:
            return standard_response({"Failure": "Not allowed to edit articles from a ruleset that doesn't belong to you"}, 200)
    elif request.method == 'DELETE':
        user_id = current_user.id
        deleted_ids = request.get_json()
        if (articles.validate_delete_keywords(deleted_ids, user_id) or current_user.is_admin):
            body = articles.delete_articles(request.get_json())
            return standard_response(body, 200)
        else:
            return standard_response({"Failure": "Not allowed to delete articles from a ruleset that doesn't belong to you"}, 200)


@app.route("/admin/invitecodes", methods=['POST'], strict_slashes=True)
@login_required
def generate_invite_codes():
    if (current_user.is_admin != True):
        return standard_response({"Failure": "You are not a recognized admin"}, 403)
    if request.method == 'POST':
        number_codes = int(request.args.get('number'))
        body = invite_codes.create_codes(number_codes)
        return standard_response(body, 200)


@app.route("/keywords", methods=['POST', 'OPTIONS', 'PUT', 'DELETE'])
@login_required
def create_keyword():
    if request.method == 'POST':
        user_id = current_user.id
        new_keywords = request.get_json()
        if (keywords.validate_new_keywords(new_keywords, user_id) or current_user.is_admin):
            body = keywords.create_keywords(new_keywords)
            return standard_response(body, 200)
        else:
            return standard_response({"Failure": "Not allowed to add keywords to a ruleset that doesn't belong to you"}, 403)
    elif request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('access-control-allow-credentials', 'true')

        response.headers.add("access-control-allow-origin",
                             'http://localhost:80')
        response.headers.add("access-control-allow-methods",
                             "POST, OPTIONS, PUT, DELETE")
        response.headers.add("access-control-allow-headers", "Content-type")
        return response
    elif request.method == 'PUT':
        user_id = current_user.id
        new_keywords = request.get_json()
        if (keywords.validate_edit_keywords(new_keywords, user_id) or current_user.is_admin):
            body = keywords.update_keywords(new_keywords)
            return standard_response(body, 200)
        else:
            return standard_response({"Failure": "Not allowed to edit keywords of a ruleset that doesn't belong to you"}, 403)
    elif request.method == 'DELETE':
        user_id = current_user.id
        keywordidlist = request.get_json()
        if (keywords.validate_delete_keywords(keywordidlist, user_id) or current_user.is_admin):
            body = keywords.delete_keywords(keywordidlist)
            return standard_response(body, 200)
        else:
            return standard_response({"Failure": "Not allowed to delete keywords of a ruleset that doesn't belong to you"}, 403)
