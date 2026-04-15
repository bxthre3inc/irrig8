"""
Auth Service — AgentOS Access Control
Bxthre3/agentic/kernel/auth_service.py

PIN/password auth, role-based sessions, API keys.
Roles: admin | operator | viewer
"""
import hashlib, hmac, uuid, secrets
import sqlite3
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Optional

DB = Path(__file__).parent.parent / "store" / "auth.db"

def _db():
    DB.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB))
    conn.execute("""CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        pin_hash TEXT NOT NULL,
        password_hash TEXT,
        role TEXT NOT NULL DEFAULT 'viewer',
        created_at TEXT NOT NULL,
        last_login TEXT
    )""")
    conn.execute("""CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )""")
    conn.execute("""CREATE TABLE IF NOT EXISTS api_keys (
        key_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        key_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'operator',
        created_at TEXT NOT NULL,
        last_used TEXT,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )""")
    conn.execute("CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT, key_id TEXT, user_id TEXT, role TEXT, action TEXT, resource TEXT, result TEXT, ts TEXT NOT NULL)")
    conn.commit()
    return conn

def _hash_pin(pin: str, salt: str = "agentos-salt-v1") -> str:
    return hashlib.sha256(f"{salt}{pin}".encode()).hexdigest()

def _hash_key(key: str) -> str:
    return hashlib.sha256(key.encode()).hexdigest()

def _pwhash(password: str) -> str:
    return hashlib.scrypt(password.encode(), salt=b"agentos-pw-v1", n=16384, r=8, p=1).hex()

def init_default_user():
    """Create default admin if no users exist."""
    conn = _db()
    if conn.execute("SELECT 1 FROM users").fetchone() is None:
        conn.execute("INSERT INTO users (user_id, name, pin_hash, role, created_at, last_login) VALUES (?,?,?,?,?,?)",
            ("admin", "Administrator", _hash_pin("0000"), "admin",
             datetime.now(timezone.utc).isoformat(), None))
        conn.execute("INSERT INTO users (user_id, name, pin_hash, role, created_at, last_login) VALUES (?,?,?,?,?,?)",
            ("operator", "Operator", _hash_pin("0000"), "operator",
             datetime.now(timezone.utc).isoformat(), None))
        conn.commit()
        print("DEFAULT USERS CREATED — admin:0000 | operator:0000")
    conn.close()

def verify_pin(pin: str, user_id: str = "admin") -> bool:
    conn = _db()
    row = conn.execute("SELECT pin_hash FROM users WHERE user_id=?", (user_id,)).fetchone()
    conn.close()
    if not row: return False
    return hmac.compare_digest(row[0], _hash_pin(pin))

def verify_password(password: str, user_id: str = "admin") -> bool:
    conn = _db()
    row = conn.execute("SELECT password_hash FROM users WHERE user_id=?", (user_id,)).fetchone()
    conn.close()
    if not row or not row[0]: return False
    return hmac.compare_digest(row[0], _pwhash(password))

def login(user_id: str, pin: str = None, password: str = None) -> Optional[dict]:
    conn = _db()
    row = conn.execute("SELECT user_id, name, pin_hash, password_hash, role FROM users WHERE user_id=?",
                       (user_id,)).fetchone()
    if not row:
        conn.close()
        return None
    name, stored_pin_hash, stored_pw_hash, role = row[1], row[2], row[3], row[4]
    if pin and hmac.compare_digest(stored_pin_hash, _hash_pin(pin)):
        pass
    elif password and stored_pw_hash and hmac.compare_digest(stored_pw_hash, _pwhash(password)):
        pass
    else:
        conn.close()
        return None
    session_id = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + timedelta(days=1)
    conn.execute("INSERT INTO sessions VALUES (?,?,?,?,?)",
                 (session_id, user_id, role, datetime.now(timezone.utc).isoformat(), expires.isoformat()))
    conn.execute("UPDATE users SET last_login=? WHERE user_id=?", (datetime.now(timezone.utc).isoformat(), user_id))
    conn.commit()
    conn.close()
    return {"session_id": session_id, "user_id": user_id, "name": name, "role": role, "expires_at": expires.isoformat()}

def get_session(session_id: str) -> Optional[dict]:
    conn = _db()
    row = conn.execute("""SELECT s.session_id, s.user_id, u.name, s.role, s.expires_at
                          FROM sessions s JOIN users u ON s.user_id=u.user_id
                          WHERE s.session_id=? AND s.expires_at > ?""",
                       (session_id, datetime.now(timezone.utc).isoformat())).fetchone()
    conn.close()
    if not row: return None
    return {"session_id": row[0], "user_id": row[1], "name": row[2], "role": row[3], "expires_at": row[4]}

def logout(session_id: str) -> bool:
    conn = _db()
    n = conn.execute("DELETE FROM sessions WHERE session_id=?", (session_id,)).rowcount
    conn.commit()
    conn.close()
    return n > 0

def create_api_key(user_id: str, name: str, role: str = "operator") -> tuple[str, str]:
    key = f"aosk_{secrets.token_urlsafe(24)}"
    key_hash = _hash_key(key)
    key_id = f"key_{uuid.uuid4().hex[:12]}"
    conn = _db()
    conn.execute("INSERT INTO api_keys VALUES (?,?,?,?,?,?,?)",
                 (key_id, user_id, name, key_hash, role, datetime.now(timezone.utc).isoformat(), None))
    conn.commit()
    conn.close()
    return key_id, key  # return raw key ONLY on creation

def verify_api_key(key: str) -> Optional[dict]:
    if not key.startswith("aosk_"): return None
    key_hash = _hash_key(key)
    conn = _db()
    row = conn.execute("""SELECT key_id, user_id, name, role FROM api_keys WHERE key_hash=?""",
                       (key_hash,)).fetchone()
    if row:
        conn.execute("UPDATE api_keys SET last_used=? WHERE key_id=?", (datetime.now(timezone.utc).isoformat(), row[0]))
        conn.commit()
    conn.close()
    if not row: return None
    return {"key_id": row[0], "user_id": row[1], "name": row[2], "role": row[3]}

def require_role(session_or_key: dict, required: str) -> bool:
    hierarchy = {"admin": 3, "operator": 2, "viewer": 1}
    return hierarchy.get(session_or_key.get("role", ""), 0) >= hierarchy.get(required, 0)

def audit_log(session_id: str = None, key_id: str = None, user_id: str = None,
              role: str = None, action: str = None, resource: str = None, result: str = None):
    conn = _db()
    conn.execute("INSERT INTO audit_log VALUES (NULL,?,?,?,?,?,?,?,?)",
                 (session_id, key_id, user_id, role, action, resource, result,
                  datetime.now(timezone.utc).isoformat()))
    conn.commit()
    conn.close()

def get_audit_log(limit: int = 100) -> list:
    conn = _db()
    rows = conn.execute("SELECT * FROM audit_log ORDER BY ts DESC LIMIT ?", (limit,)).fetchall()
    conn.close()
    cols = ["id", "session_id", "key_id", "user_id", "role", "action", "resource", "result", "ts"]
    return [dict(zip(cols, r)) for r in rows]

def list_api_keys() -> list:
    conn = _db()
    rows = conn.execute("SELECT key_id, user_id, name, role, created_at, last_used FROM api_keys").fetchall()
    conn.close()
    return [dict(key_id=r[0], user_id=r[1], name=r[2], role=r[3], created_at=r[4], last_used=r[5]) for r in rows]

def delete_api_key(key_id: str) -> bool:
    conn = _db()
    n = conn.execute("DELETE FROM api_keys WHERE key_id=?", (key_id,)).rowcount
    conn.commit()
    conn.close()
    return n > 0

def list_users() -> list:
    conn = _db()
    rows = conn.execute("SELECT user_id, name, role, created_at, last_login FROM users").fetchall()
    conn.close()
    return [dict(user_id=r[0], name=r[1], role=r[2], created_at=r[3], last_login=r[4]) for r in rows]

init_default_user()
