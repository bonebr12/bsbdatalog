"""Implementação simplificada do FlightRecorder."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List

from .parser import parse_flight_log


class FlightRecorder:
    """Representa um arquivo de log de voo da DJI."""

    def __init__(self, filepath: str | Path) -> None:
        self.filepath = Path(filepath)
        if not self.filepath.exists():
            raise FileNotFoundError(f"Arquivo não encontrado: {self.filepath}")
        self._data = parse_flight_log(self.filepath)

    def to_dict(self) -> Dict[str, Any]:
        """Retorna os dados do log como um dicionário pronto para serialização."""
        return self._data

    def records(self) -> List[Dict[str, Any]]:
        """Convenience wrapper para acessar a lista de registros."""
        return self._data.get("records", [])
