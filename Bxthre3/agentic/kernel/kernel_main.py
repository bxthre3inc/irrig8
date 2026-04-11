"""
kernel_main.py — agentic Kernel Entry Point
Single canonical entry point for all agentic operations.
"""
import argparse
import asyncio
import logging
import sys
from pathlib import Path
from .task_context import TaskContext
from .inference_node import process as infer_task
from .resource_monitor import get_current_profile, PerformanceProfile, throttle as apply_throttle
from .registry import registry

MANIFEST = Path(__file__).parent.parent / 'system_manifest.json'
INBOX = Path(__file__).parent.parent / 'runtime/tasks/pending'
PROVENANCE = 'agentic kernel/main.py'

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(name)s] %(levelname)s %(message)s',
    datefmt='%Y-%mT%H:%M:%S%z'
)
logger = logging.getLogger('agentic.kernel.main')

def scan_inbox() -> list[Path]:
    if not INBOX.exists():
        return []
    return sorted(INBOX.glob('*.json'))

def process_all(dry_run: bool = False) -> int:
    pending = scan_inbox()
    logger.info('%d pending task(s) in inbox.', len(pending))
    if not pending:
        logger.info('Kernel idle — nothing to process.')
        return 0
    ok, fail = 0, 0
    for path in pending:
        try:
            task = TaskContext.from_file(path)
            if dry_run:
                logger.info('[DRY-RUN] Would process %s (tenant=%s, priority=%s)',
                            path.name, task.tenant, task.priority)
                continue
            logger.info('Processing %s [tenant=%s, priority=%s]', path.name, task.tenant, task.priority)
            profile = get_current_profile()
            if profile in (PerformanceProfile.LOW, PerformanceProfile.CRITICAL):
                logger.info('Pressure=%s — deferring to apply_throttle()', profile.value)
                apply_throttle()
            result = asyncio.run(infer_task(task))
            logger.info('Result for %s: status=%s', path.name, result.get('status','?'))
            path.unlink(missing_ok=True)
            ok += 1
        except Exception as exc:
            logger.error('FAILED %s: %s', path.name, exc)
            fail += 1
    logger.info('Done — %d ok, %d failed', ok, fail)
    return fail

def main():
    p = argparse.ArgumentParser(description='agentic kernel')
    p.add_argument('--dry-run', action='store_true')
    p.add_argument('--task', metavar='FILE', help='Process single TCO file')
    args = p.parse_args()
    manifest = {}
    if MANIFEST.exists():
        import json
        manifest = json.loads(MANIFEST.read_text())
        logger.info('Manifest loaded v%s', manifest.get('version','?'))
    else:
        logger.warning('system_manifest.json not found at %s', MANIFEST)
    from .db import db as _db
    asyncio.run(_db.init_pool())
    asyncio.run(_db.migrate())
    if args.task:
        path = Path(args.task)
        if not path.exists():
            logger.error('Task file not found: %s', path)
            sys.exit(1)
        result = asyncio.run(infer_task(TaskContext.from_file(path)))
        print(result)
        sys.exit(0)
    code = process_all(dry_run=args.dry_run)
    asyncio.run(_db.close_pool())
    sys.exit(code)

if __name__ == '__main__':
    main()
KERNEL_MAIN_EOF"
