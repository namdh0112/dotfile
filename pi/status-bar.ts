/**
 * Custom Status Bar Extension
 *
 * Replaces the default footer:
 * - Left:  current working directory only
 * - Right: model name • thinking level • context usage (e.g. "10% of 1.0M")
 *
 * Enabled automatically on session start; toggle with /status-bar.
 */

import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";

function formatTokens(n: number): string {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
	return `${n}`;
}

function homeRelative(cwd: string): string {
	const home = process.env.HOME ?? "";
	return home && cwd.startsWith(home) ? `~${cwd.slice(home.length)}` : cwd;
}

export default function (pi: ExtensionAPI) {
	let enabled = false;
	let latestCtx: ExtensionContext | undefined;

	pi.registerCommand("status-bar", {
		description: "Toggle custom status bar footer",
		handler: async (_args, ctx) => {
			if (enabled) {
				enabled = false;
				ctx.ui.setFooter(undefined);
				ctx.ui.notify("Default footer restored", "info");
			} else {
				enable(ctx);
				ctx.ui.notify("Custom status bar enabled", "info");
			}
		},
	});

	function enable(ctx: ExtensionContext) {
		latestCtx = ctx;
		enabled = true;
		ctx.ui.setFooter((tui, theme) => {
			// Re-render whenever the model or thinking level changes
			const unsubs = [
				pi.on("model_select", () => tui.requestRender()),
				pi.on("thinking_level_select", () => tui.requestRender()),
			];
			return {
				dispose() {
					for (const u of unsubs) u();
				},
				invalidate() {},
				render(width: number): string[] {
					const ctx = latestCtx;
					if (!ctx) return [""];

					// Left side: current directory only
					const left = theme.fg("dim", homeRelative(ctx.cwd));

					// Right side: model • thinking level • context usage
					const parts: string[] = [ctx.model?.id ?? "no-model", ctx.thinkingLevel ?? "-"];
					const usage = ctx.getContextUsage();
					if (usage) {
						if (usage.tokens !== null) {
							parts.push(
								`${Math.round((usage.tokens / usage.contextWindow) * 100)}% of ${formatTokens(usage.contextWindow)}`,
							);
						} else {
							parts.push(`--% of ${formatTokens(usage.contextWindow)}`);
						}
					}
					const right = theme.fg("dim", parts.join(" • "));

					const pad = " ".repeat(Math.max(1, width - visibleWidth(left) - visibleWidth(right)));
					return [truncateToWidth(left + pad + right, width)];
				},
			};
		});
	}

	// Enable automatically on session start (TUI mode only)
	pi.on("session_start", async (_event, ctx) => {
		latestCtx = ctx;
		if (ctx.mode === "tui" && !enabled) enable(ctx);
	});
}
