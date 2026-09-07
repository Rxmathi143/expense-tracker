from datetime import datetime, timezone
from decimal import Decimal

from .firebase import db


TRANSACTIONS_COLLECTION = "transactions"


def transaction_to_dict(doc):
    """
    Convert a Firestore transaction document into the
    same basic structure expected by the existing API.
    """

    data = doc.to_dict() or {}

    amount = data.get("amount", 0)

    try:
        amount = float(Decimal(str(amount)))
    except (ValueError, TypeError, ArithmeticError):
        amount = 0.0

    created_at = data.get("created_at")

    if hasattr(created_at, "isoformat"):
        created_at = created_at.isoformat()

    return {
        "id": doc.id,
        "user": data.get("user_id"),
        "title": data.get("title", ""),
        "amount": amount,
        "transaction_type": data.get("transaction_type", ""),
        "category": data.get("category_id"),
        "description": data.get("description", ""),
        "date": data.get("date"),
        "created_at": created_at,
    }


def create_transaction(
    user_id,
    title,
    amount,
    transaction_type,
    category_id,
    description,
    date,
):
    transaction_ref = db.collection(
        TRANSACTIONS_COLLECTION
    ).document()

    transaction_ref.set({
        "user_id": user_id,
        "title": title,
        "amount": str(amount),
        "transaction_type": transaction_type,
        "category_id": category_id,
        "description": description,
        "date": date,
        "created_at": datetime.now(timezone.utc),
    })

    return transaction_to_dict(
        transaction_ref.get()
    )


def get_transactions(user_id):
    query = (
        db.collection(TRANSACTIONS_COLLECTION)
        .where("user_id", "==", user_id)
    )

    documents = query.stream()

    transactions = []

    for doc in documents:
        transactions.append(
            transaction_to_dict(doc)
        )

    transactions.sort(
        key=lambda item: item.get("created_at") or "",
        reverse=True
    )

    return transactions


def get_transaction(user_id, transaction_id):
    doc_ref = db.collection(
        TRANSACTIONS_COLLECTION
    ).document(transaction_id)

    doc = doc_ref.get()

    if not doc.exists:
        return None

    data = transaction_to_dict(doc)

    if data["user"] != user_id:
        return None

    return data


def update_transaction(
    user_id,
    transaction_id,
    title,
    amount,
    transaction_type,
    category_id,
    description,
    date,
):
    doc_ref = db.collection(
        TRANSACTIONS_COLLECTION
    ).document(transaction_id)

    doc = doc_ref.get()

    if not doc.exists:
        return None

    existing_data = doc.to_dict() or {}

    if existing_data.get("user_id") != user_id:
        return None

    doc_ref.update({
        "title": title,
        "amount": str(amount),
        "transaction_type": transaction_type,
        "category_id": category_id,
        "description": description,
        "date": date,
    })

    return get_transaction(
        user_id,
        transaction_id
    )


def delete_transaction(user_id, transaction_id):
    doc_ref = db.collection(
        TRANSACTIONS_COLLECTION
    ).document(transaction_id)

    doc = doc_ref.get()

    if not doc.exists:
        return False

    data = doc.to_dict() or {}

    if data.get("user_id") != user_id:
        return False

    doc_ref.delete()

    return True