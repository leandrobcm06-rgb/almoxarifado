import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env", "utf-8")
    .split("\n")
    .map(line => {
      const [k, ...v] = line.split("=");
      return [k, v.join("=").replace(/^"|"$/g, "").trim()];
    })
);

const supabase = createClient(env.VITE_SUPABASE_URL?.trim(), env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim());

async function cleanLocs() {
  const { data: products } = await supabase.from("products").select("id, localizacao").not("localizacao", "is", null);
  
  if (!products) {
    console.log("No products found.");
    return;
  }
  
  let toUpdate = [];
  
  for (const p of products) {
    let loc = p.localizacao;
    loc = String(loc).trim().toUpperCase();
    
    const letterCount = (loc.match(/[A-Z]/g) || []).length;
    
    if (letterCount > 1 || loc === "UNICA") {
      toUpdate.push({ id: p.id, localizacao: null });
    }
  }
  
  console.log(`Found ${toUpdate.length} products to clean up.`);
  
  // Upsert in batches of 1000
  for (let i = 0; i < toUpdate.length; i += 1000) {
    const batch = toUpdate.slice(i, i + 1000);
    const { error } = await supabase.from("products").upsert(batch);
    if (error) {
      console.error("Error updating batch:", error);
    } else {
      console.log(`Updated batch ${i} to ${i + batch.length}`);
    }
  }
  
  console.log("Cleanup complete!");
}

cleanLocs();
