"""
Server for webapi
"""
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

from typings import Payload
from database import cnx, activist_actions
from normalize import to_payload

app = FastAPI()

@app.post("/webhook/activist_action")
def webhook_activist_action(body: Payload):
    """Webhook for integration Bonde activist actions to Action Network"""
    # Normalize hasura event payload
    result = to_payload(body)

    try:
        # Insert normalized action in database
        cnx.execute(activist_actions.insert(), result)
    except IntegrityError:
        # Continue process don't stop workflow
        # Database is responsible not duplicate
        pass

    return result
