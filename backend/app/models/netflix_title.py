from sqlalchemy import Column, Integer, String, Text
from ..core.db import Base


class NetflixTitle(Base):
    """Netflix titles table.

    This is used to back the analytics endpoint with real database values.
    """

    __tablename__ = "netflix_titles"

    id = Column(Integer, primary_key=True, index=True)

    # Unique show identifier from the dataset
    show_id = Column(String(50), unique=True, index=True, nullable=False)

    type = Column(String(20), index=True, nullable=True)
    title = Column(String(255), index=True, nullable=True)

    director = Column(String(255), nullable=True)
    cast = Column(String(500), nullable=True)
    country = Column(String(255), nullable=True)

    # Keep as string since source column is textual (dataset varies)
    date_added = Column(String(50), nullable=True)

    release_year = Column(String(10), index=True, nullable=True)

    rating = Column(String(20), nullable=True)

    duration = Column(String(50), nullable=True)
    listed_in = Column(String(500), nullable=True)

    description = Column(Text, nullable=True)

