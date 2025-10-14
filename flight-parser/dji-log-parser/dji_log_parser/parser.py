"""Parser simplificado para arquivos TXT de voo da DJI."""

from __future__ import annotations

from pathlib import Path
from typing import Dict, List

from .utils import clean_line


def parse_flight_log(filepath: Path) -> Dict[str, object]:
    """Converte um arquivo de log em um dicionário estruturado.

    Esta implementação é simplificada para fins de demonstração.
    """

    lines: List[str] = filepath.read_text(encoding="utf-8", errors="ignore").splitlines()

    processed = [clean_line(line) for line in lines if line.strip()]
    records = []
    for index, line in enumerate(processed):
        parts = [part.strip() for part in line.split(",") if part.strip()]
        records.append({
            "line": index + 1,
            "raw": line,
            "values": parts,
        })

    return {
        "file": filepath.name,
        "total_lines": len(processed),
        "records": records,
    }
