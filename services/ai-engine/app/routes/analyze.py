import time
from fastapi import APIRouter
from app.schemas import AnalyzeRequest, AnalyzeResponse

router = APIRouter()

STUB_OUTPUT = """\
PRODUTO_ALVO: Não identificado
CATEGORIA_MERCADO: Não identificado
TERMO_CONCORRENTE: Não identificado
INTENCAO_ANALISE: Não identificado
METRICA_MONITORAMENTO: Não identificado
FAIXA_PRECO_ALVO: Não identificado"""


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    """
    Stub endpoint — returns placeholder extraction fields.
    Replace the body of this function with real LLM logic when ready.
    The response contract (raw_output, model, latency_ms) must remain stable.
    """
    started = time.monotonic()

    raw_output = STUB_OUTPUT
    latency_ms = int((time.monotonic() - started) * 1000)

    return AnalyzeResponse(raw_output=raw_output, model="stub", latency_ms=latency_ms)
