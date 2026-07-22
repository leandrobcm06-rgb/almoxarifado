import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Input = z.object({ photoId: z.string().uuid() });

export const runOcrOnPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data, context }) => {
    // const apiKey = process.env.GEMINI_API_KEY;
    // if (!apiKey) throw new Error("API Key da IA ausente");

    const { supabase } = context;
    const { data: photo, error: pErr } = await supabase.from("count_photos").select("*").eq("id", data.photoId).single();
    if (pErr) throw pErr;

    await supabase.from("count_photos").update({ ocr_status: "processando" }).eq("id", data.photoId);

    const { data: file, error: dlErr } = await supabase.storage.from("count-photos").download(photo.storage_path);
    if (dlErr) throw dlErr;
    const buf = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type || "image/jpeg"};base64,${buf.toString("base64")}`;

    const { callAiVision } = await import("./ai-gateway.server");
    const raw = await callAiVision({
      apiKey: "dummy-key",
      systemPrompt: "Você é um assistente que extrai pares (código_do_produto, quantidade_contada) de fotos de listas manuscritas ou impressas de contagem de estoque. Retorne SOMENTE JSON no formato {\"items\":[{\"codigo\":string,\"qty\":number}]}. Ignore cabeçalhos e linhas em branco. Quantidades em decimal usam ponto.",
      userPrompt: "Extraia todos os itens da lista de contagem desta foto.",
      imageDataUrl: dataUrl,
    });

    let parsed: { items: { codigo: string; qty: number }[] } = { items: [] };
    try {
      const obj = JSON.parse(raw);
      if (Array.isArray(obj.items)) parsed = obj;
    } catch { /* keep empty */ }

    await supabase.from("count_photos").update({ ocr_status: "concluido", ocr_result: parsed }).eq("id", data.photoId);
    return parsed;
  });
