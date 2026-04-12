// ─── Main Export ──────────────────────────────────────────────────────────────

export const stubFinder = {
  scan(targetPaths?: typeof SCAN_TARGETS): StubFinderReport {
    const targets = targetPaths ?? SCAN_TARGETS;
    const findings: StubFinding[] = [];

    for (const target of targets) {
      const files = findFiles(target.path, ['.ts', '.tsx', '.kt', '.java', '.py']);
      for (const fp of files) {
        scanFile(fp, findings);
      }
    }

    const ccrs = generateCCRs(findings);
    for (const ccr of ccrs) {
      routeCCR(ccr);
    }

    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    const byAgent: Record<string, number> = {};
    for (const f of findings) {
      byType[f.type] = (byType[f.type] || 0) + 1;
      bySeverity[f.severity] = (bySeverity[f.severity] || 0) + 1;
      byAgent[f.responsibleAgent] = (byAgent[f.responsibleAgent] || 0) + 1;
    }

    return {
      timestamp: new Date().toISOString(),
      scansCompleted: targets.map(t => t.description),
      findings,
      summary: { total: findings.length, byType, bySeverity, byAgent },
      codeChangeRequests: ccrs,
    };
  },

  run() {
    const report = this.scan();
    console.log(`[StubFinder] Scan complete: ${report.summary.total} findings`);
    return report;
  },
};

// Allow running directly: bun run core/employees/stub-finder.ts
if (process.argv[1]?.includes('stub-finder')) {
  const report = stubFinder.run();
  console.log(JSON.stringify(report.summary, null, 2));
}
