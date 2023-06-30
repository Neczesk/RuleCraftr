from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os


db_string = os.getenv("DB_DRIVER") + "://" + os.getenv("POSTGRES_USER") + \
    ":" + os.getenv("POSTGRES_PASSWORD") + "@" + \
    os.getenv("DB_URL") + ":" + os.getenv("POSTGRES_PORT") + \
    "/" + os.getenv("POSTGRES_DB")
engine = create_engine(
    db_string)
Session = sessionmaker(engine)
