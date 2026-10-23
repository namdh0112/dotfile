/**
 * OpenRouter Web Fetch Extension (server-side tool)
 *
 * Injects { type: "openrouter:web_fetch" } into the outgoing request payload's
 * `tools` array. OpenRouter executes the search on its own servers and streams
 * the results back inline (with citations) — nothing runs locally.
 *
 * IMPORTANT: do NOT register this as a local pi.registerTool() tool. A locally
 * registered tool is executed on this machine, so the model's tool call would
 * hit a local stub instead of OpenRouter's server-side search.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function openRouterWebSearch(pi: ExtensionAPI) {
	pi.on("before_provider_request", (event, _ctx) => {
		const payload = event.payload as Record<string, any> | undefined;
		if (!payload || typeof payload !== "object") return;

		// Only touch OpenRouter chat-completions requests.
		const model = payload.model;
		if (typeof model !== "string") return;

		// Make sure the tools array exists, then append the server-side tool.
		const tools = Array.isArray(payload.tools) ? payload.tools : [];
		if (tools.some((t: any) => t?.type === "openrouter:web_fetch")) return;

		return {
			...payload,
			tools: [...tools, { type: "openrouter:web_fetch" }],
		};
	});
}
