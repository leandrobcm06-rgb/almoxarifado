//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-V5evfO_R.js
var manifest = { "86f7d60c77271b3d676e77aa30534483ab69198078f4825902745be2b9b3091c": {
	functionName: "runOcrOnPhoto_createServerFn_handler",
	importer: () => import("./_ssr/ocr.functions-BoAV6UiY.mjs")
} };
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
