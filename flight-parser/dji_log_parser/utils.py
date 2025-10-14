"""Utilidades auxiliares para o parser de logs DJI."""

from __future__ import annotations

import re

_WHITESPACE_RE = re.compile(r"\s+")


def clean_line(line: str) -> str:
    """Remove espaços em excesso e normaliza o conteúdo da linha."""
    normalized = _WHITESPACE_RE.sub(" ", line.strip())
    return normalized
