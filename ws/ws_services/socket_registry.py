
# ws_services/socket_registry.pyfrom typing import Optional
from typing import Optional
import asyncio
# Registry: client_id -> {"websocket": DerivWebSocket, "tasks": {}}
active_websockets: dict[str, dict] = {}

def has_socket(client_id: str) -> bool:
    """Check if this client_id already has a websocket registered."""
    return client_id in active_websockets and active_websockets[client_id].get("websocket") is not None


def register_socket(client_id: str, websocket):
    """Register or replace the websocket for a client."""
    active_websockets[client_id] = {"websocket": websocket, "tasks": {}}


def get_socket(client_id: str):
    """Get full client record (websocket + tasks)."""
    return active_websockets.get(client_id)


def get_websocket(client_id: str):
    """Get only the websocket for a client."""
    return active_websockets.get(client_id, {}).get("websocket")

def update_task(client_id: str, name: str, task: Optional[asyncio.Task]):
    """Attach a task (bot_task, chart_task, etc.) to a client."""
    if client_id not in active_websockets:
        active_websockets[client_id] = {"websocket": None, "tasks": {}}
    active_websockets[client_id]["tasks"][name] = task

def get_task(client_id: str, name: str):
    """Get a specific task by name for a client."""
    return active_websockets.get(client_id, {}).get("tasks", {}).get(name)


def cancel_task(client_id: str, name: str) -> bool:
    """Cancel one task for this client_id by name."""
    task = get_task(client_id, name)
    if task and not task.done():
        task.cancel()
        return True
    return False


def cancel_all_tasks(client_id: str):
    """Cancel all tasks associated with this client_id."""
    tasks = active_websockets.get(client_id, {}).get("tasks", {})
    for task in tasks.values():
        if task and not task.done():
            task.cancel()


def remove_socket(client_id: str):
    """Completely remove the client and cancel all tasks."""
    cancel_all_tasks(client_id)
    return active_websockets.pop(client_id, None)
