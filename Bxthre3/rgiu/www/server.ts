// RGIU Website Server
export async function serve() {
  const server = Bun.serve({
    port: 3000,
    async fetch(req) {
      const url = new URL(req.url);
      
      if (url.pathname === "/") {
        return new Response(await Bun.file("./www/index.html").text(), {
          headers: { "Content-Type": "text/html" }
        });
      }
      
      if (url.pathname === "/api/properties") {
        const { State } = await import("../core/state.ts");
        const state = new State("./data/rgiu.sqlite");
        const props = state.query("SELECT * FROM properties WHERE status = 'hot' ORDER BY score DESC LIMIT 10");
        return new Response(JSON.stringify(props), {
          headers: { "Content-Type": "application/json" }
        });
      }
      
      if (url.pathname === "/api/stats") {
        const { State } = await import("../core/state.ts");
        const state = new State("./data/rgiu.sqlite");
        const stats = state.query(`
          SELECT 
            (SELECT COUNT(*) FROM properties WHERE status = 'hot') as hot_deals,
            (SELECT COUNT(*) FROM leads) as investor_count,
            (SELECT SUM(amount) FROM fees WHERE status = 'pending') as pending_revenue
        `)[0];
        return new Response(JSON.stringify(stats), {
          headers: { "Content-Type": "application/json" }
        });
      }
      
      return new Response("Not found", { status: 404 });
    }
  });

  console.log(`[RGIU] Website live at http://localhost:${server.port}`);
  return server;
}
