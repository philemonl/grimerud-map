# Shared locations for the pipeline. Everything fetched or generated goes under build/ (gitignored).
import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
CONTENT = ROOT / "src" / "content"
BUILD = ROOT / "build"
DIST = ROOT / "dist"
B = str(BUILD) + "/"          # prefix for build files, e.g. B + "style/terrain.json"
for d in ("tiles", "dtm", "ref", "style"):
    (BUILD / d).mkdir(parents=True, exist_ok=True)
if str(CONTENT) not in sys.path:
    sys.path.insert(0, str(CONTENT))
