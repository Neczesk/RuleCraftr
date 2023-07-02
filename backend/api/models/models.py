from sqlalchemy import Boolean, Column, DateTime, ForeignKeyConstraint, Integer, JSON, PrimaryKeyConstraint, Table, Text, UniqueConstraint, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()
metadata = Base.metadata


t_schema_version = Table(
    'schema_version', metadata,
    Column('version', Integer, nullable=False)
)


class Users(Base):
    __tablename__ = 'users'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='users_pkey'),
        UniqueConstraint('username', name='users_username_key')
    )

    id = Column(Integer)
    username = Column(Text, nullable=False)
    passhash = Column(Text, nullable=False)
    created_date = Column(DateTime(True), nullable=False, server_default=text("(now() AT TIME ZONE 'utc'::text)"))
    email = Column(Text)
    is_admin = Column(Boolean, server_default=text('false'))
    is_activated = Column(Boolean, server_default=text('true'))

    invite_codes = relationship('InviteCodes', back_populates='users')
    rulesets = relationship('Rulesets', back_populates='user')


class InviteCodes(Base):
    __tablename__ = 'invite_codes'
    __table_args__ = (
        ForeignKeyConstraint(['user_used'], ['users.id'], name='invite_codes_user_used_fkey'),
        PrimaryKeyConstraint('id', name='invite_codes_pkey'),
        UniqueConstraint('key_value', name='invite_codes_key_value_key')
    )

    id = Column(Integer)
    key_value = Column(Text, nullable=False)
    created_date = Column(DateTime(True), nullable=False, server_default=text("(now() AT TIME ZONE 'utc'::text)"))
    used_date = Column(DateTime(True))
    user_used = Column(Integer)

    users = relationship('Users', back_populates='invite_codes')


class Rulesets(Base):
    __tablename__ = 'rulesets'
    __table_args__ = (
        ForeignKeyConstraint(['user_id'], ['users.id'], name='rulesets_user_id_fkey'),
        PrimaryKeyConstraint('id', name='rulesets_pkey')
    )

    id = Column(Integer)
    rn_name = Column(Text, nullable=False)
    public = Column(Boolean, nullable=False, server_default=text('false'))
    user_id = Column(Integer, nullable=False)
    created_date = Column(DateTime(True), nullable=False, server_default=text("(now() AT TIME ZONE 'utc'::text)"))
    description = Column(Text, server_default=text("'Your description here...'::text"))

    user = relationship('Users', back_populates='rulesets')
    articles = relationship('Articles', back_populates='rulesets')
    keywords = relationship('Keywords', back_populates='rulesets')


class Articles(Base):
    __tablename__ = 'articles'
    __table_args__ = (
        ForeignKeyConstraint(['parent'], ['articles.id'], name='articles_articles_parent_fkey'),
        ForeignKeyConstraint(['ruleset'], ['rulesets.id'], name='articles_ruleset_fkey'),
        PrimaryKeyConstraint('id', name='articles_pkey')
    )

    title = Column(Text, nullable=False)
    ruleset = Column(Integer, nullable=False)
    sort = Column(Integer, nullable=False, server_default=text('0'))
    created_date = Column(DateTime(True), nullable=False, server_default=text("(now() AT TIME ZONE 'utc'::text)"))
    id = Column(UUID, server_default=text('gen_random_uuid()'))
    content = Column(JSON)
    parent = Column(UUID)

    articles = relationship('Articles', remote_side=[id], back_populates='articles_reverse')
    articles_reverse = relationship('Articles', remote_side=[parent], back_populates='articles')
    rulesets = relationship('Rulesets', back_populates='articles')


class Keywords(Base):
    __tablename__ = 'keywords'
    __table_args__ = (
        ForeignKeyConstraint(['ruleset'], ['rulesets.id'], name='keywords_ruleset_fkey'),
        PrimaryKeyConstraint('id', name='keywords_pkey')
    )

    keyword = Column(Text, nullable=False)
    ruleset = Column(Integer, nullable=False)
    created_date = Column(DateTime(True), nullable=False, server_default=text("(now() AT TIME ZONE 'utc'::text)"))
    id = Column(UUID, server_default=text('gen_random_uuid()'))
    long_definition = Column(Text)
    short_definition = Column(Text)

    rulesets = relationship('Rulesets', back_populates='keywords')
