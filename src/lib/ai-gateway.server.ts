// Server-only helper para IA (temporariamente desabilitado)

export async function callAiVision({
  apiKey,
  systemPrompt,
  userPrompt,
  imageDataUrl,
}: {
  apiKey: string;
  systemPrompt: string;
  userPrompt: string;
  imageDataUrl: string;
}): Promise<string> {
  throw new Error("O recurso de leitura de fotos (OCR) foi temporariamente desabilitado após a remoção do Lovable. Para reativar, você precisará configurar a chave de API do Google Gemini ou OpenAI no código.");
}
