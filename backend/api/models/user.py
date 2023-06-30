import werkzeug.security
from api.models.models import Users


class User:
    def __init__(self, jsondata=None, tabledata=None):
        self.id = 0
        self.email = ''
        self.username = ''
        self.passhash = ''
        self.created_date = None
        self.authenticated = False
        self.active = False
        self.anonymous = False
        self.is_admin = False
        if jsondata:
            self.id = jsondata['id']
            self.email = jsondata['email']
            self.username = jsondata['username']
            self.passhash = jsondata['passhash']
            self.created_date = jsondata['created_date']
            self.is_admin = jsondata['is_admin']
            self.active = jsondata['is_activated']

    def get_id(self):
        return str(self.id)

    def is_authenticated(self):
        return self.authenticated

    def is_anonymous(self):
        return self.anonymous

    def is_active(self):
        return self.active

    def set_password(self, password):
        self.passhash = werkzeug.security.generate_password_hash(password)

    def check_password(self, password):
        return werkzeug.security.check_password_hash(self.passhash, password)

    def convertToDict(self):
        return {
            "username": self.username,
            "passhash": self.passhash,
            "email": self.email,
            "id": self.id,
            "is_admin": self.is_admin,
            "is_active": self.is_active
        }

    def convertToDatabaseObject(self):
        return Users(id=self.id, email=self.email, username=self.username, passhash=self.passhash, is_activated=self.is_active)
