# ws/ws_services/crypto_utils.py
import os
from cryptography.fernet import Fernet, InvalidToken

def _get_fernet():
    """
    Retrieve a Fernet instance using FERNET_KEY from environment variables.
    Raises RuntimeError if the key is missing.
    """
    key = os.environ.get("FERNET_KEY")
    if not key:
        raise RuntimeError("FERNET_KEY environment variable is not set")
    return Fernet(key.encode())

def encrypt_token(plain_token: str) -> str:
    """
    Encrypts a plain token string.
    Returns the encrypted token as a base64 string (safe to store or send).
    """
    if plain_token is None:
        return None
    f = _get_fernet()
    return f.encrypt(plain_token.encode()).decode()

def decrypt_token(enc_token: str) -> str:
    """
    Decrypts an encrypted token back to plain text.
    Returns None if invalid or cannot decrypt.
    """
    if not enc_token:
        return None
    f = _get_fernet()
    try:
        return f.decrypt(enc_token.encode()).decode()
    except InvalidToken:
        return None
