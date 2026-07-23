import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./esm-B5zcwdrx.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DKUiPm7z.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ocr.functions-BoAV6UiY.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var Input = objectType({ photoId: stringType().uuid() });
var runOcrOnPhoto_createServerFn_handler = createServerRpc({
	id: "86f7d60c77271b3d676e77aa30534483ab69198078f4825902745be2b9b3091c",
	name: "runOcrOnPhoto",
	filename: "src/lib/ocr.functions.ts"
}, (opts) => runOcrOnPhoto.__executeServer(opts));
var runOcrOnPhoto = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(runOcrOnPhoto_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { data: photo, error: pErr } = await supabase.from("count_photos").select("*").eq("id", data.photoId).single();
	if (pErr) throw pErr;
	await supabase.from("count_photos").update({ ocr_status: "processando" }).eq("id", data.photoId);
	const { data: file, error: dlErr } = await supabase.storage.from("count-photos").download(photo.storage_path);
	if (dlErr) throw dlErr;
	const buf = Buffer.from(await file.arrayBuffer());
	const dataUrl = `data:${file.type || "image/jpeg"};base64,${buf.toString("base64")}`;
	const { callAiVision } = await import("./ai-gateway.server-DDKyE_qv.mjs");
	const raw = await callAiVision({
		apiKey: "dummy-key",
		systemPrompt: "Você é um assistente que extrai pares (código_do_produto, quantidade_contada) de fotos de listas manuscritas ou impressas de contagem de estoque. Retorne SOMENTE JSON no formato {\"items\":[{\"codigo\":string,\"qty\":number}]}. Ignore cabeçalhos e linhas em branco. Quantidades em decimal usam ponto.",
		userPrompt: "Extraia todos os itens da lista de contagem desta foto.",
		imageDataUrl: dataUrl
	});
	let parsed = { items: [] };
	try {
		const obj = JSON.parse(raw);
		if (Array.isArray(obj.items)) parsed = obj;
	} catch {}
	await supabase.from("count_photos").update({
		ocr_status: "concluido",
		ocr_result: parsed
	}).eq("id", data.photoId);
	return parsed;
});
//#endregion
export { runOcrOnPhoto_createServerFn_handler };
