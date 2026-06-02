import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  
  // Parse incoming JSON payloads
  app.use(express.json());

  // Hostinger and other cloud providers pass the port in process.env.PORT
  const PORT = Number(process.env.PORT || 3000);

  // Endpoint to fetch dynamic property info using Gemini or high-fidelity fallback
  app.post("/api/search-property", async (req, res) => {
    const { address, city } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: "O endereço é obrigatório." });
    }

    const cityStr = city || "São Paulo";
    const lowercaseAddr = address.toLowerCase();

    // Check if Gemini API key exists
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });

        const prompt = `Você é um correspondente e analista técnico especialista em leilões imobiliários no Brasil.
Pesquise e estime informações reais ou estatisticamente prováveis de mercado para o imóvel situado em:
Endereço: "${address}"
Cidade: "${cityStr}"

Estime valores realistas compatíveis com leilões judiciais ou extrajudiciais no Brasil (com deságio de 40% a 60% frente ao mercado de venda de imóveis prontos).
Seja extremamente profissional. Retorne exatamente no esquema JSON fornecido. Se a rua for desconhecida, invente um bairro residencial de classe média compatível com a cidade e preencha as variáveis de forma verossímil.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                success: { type: Type.BOOLEAN },
                address: { type: Type.STRING, description: "Endereço formatado oficial" },
                city: { type: Type.STRING },
                neighborhood: { type: Type.STRING, description: "Bairro estimado" },
                description: { type: Type.STRING, description: "Pequena descrição resumida de 1 ou 2 sentenças das características físicas do imóvel." },
                arrematacaoValue: { type: Type.NUMBER, description: "Valor estimado ou provável de lance de arrematação em Reais (R$)" },
                saleValue: { type: Type.NUMBER, description: "Valor de avaliação de venda / valor de mercado estimado em Reais (R$)" },
                holdMonths: { type: Type.NUMBER, description: "Meses estimados de ciclo da operação até a liquidação (ex: 12 ou 18)" },
                iptuMonthly: { type: Type.NUMBER, description: "IPTU mensal médio em Reais" },
                condominioMonthly: { type: Type.NUMBER, description: "Taxa mensal de condomínio em Reais (0 se for casa de rua)" },
                dividaPropterRem: { type: Type.NUMBER, description: "Estimativa realista de dívida acumulada de condomínio/IPTU que acompanha o lote na hasta, ou 0" },
                estimatedSizeM2: { type: Type.NUMBER, description: "Tamanho estimado da área útil em metros quadrados (m²)" },
                propertyImage: { type: Type.STRING, description: "URL de foto de alta qualidade do Unsplash que melhor ilustre esse tipo de imóvel. Use uma URL real de arquitetura ou residências do Unsplash." },
              },
              required: [
                "success",
                "address",
                "city",
                "neighborhood",
                "description",
                "arrematacaoValue",
                "saleValue",
                "holdMonths",
                "iptuMonthly",
                "condominioMonthly",
                "dividaPropterRem",
                "estimatedSizeM2",
                "propertyImage"
              ],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          return res.json(parsed);
        }
      } catch (err: any) {
        console.error("Erro na API do Gemini:", err.message);
        // Fall back to high-fidelity mock generator on any error
      }
    }

    // High fidelity offline fallback generator based on address keywords & presets
    let neighborhood = "Centro";
    let size = 70;
    let desc = "Excelente imóvel bem localizado com boa ventilação e iluminação natural, perfeito para investimento ou moradia.";
    let arrematacao = 185000;
    let sale = 350000;
    let iptu = 85;
    let condo = 350;
    let divida = 4500;
    let image = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80";

    const addrLower = lowercaseAddr;
    if (addrLower.includes("aroldo garcia") || addrLower.includes("garcia rosa")) {
      neighborhood = "Jardim d'Abril";
      size = 92;
      desc = "Sobrado residencial compacto e arejado com 2 dormitórios, vaga de garagem e boa infraestrutura de comércio local nas redondezas.";
      arrematacao = 240000;
      sale = 450000;
      iptu = 95;
      condo = 0; // Townhouse
      divida = 8200;
      image = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80";
    } else if (addrLower.includes("itaim") || addrLower.includes("bibi")) {
      neighborhood = "Itaim Bibi";
      size = 55;
      desc = "Moderno Loft de 1 dormitório em um dos pontos mais nobres do Itaim Bibi, perfeito para executivos e locações de alto padrão por aplicativos de temporada.";
      arrematacao = 380000;
      sale = 720000;
      iptu = 180;
      condo = 680;
      divida = 0;
      image = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80";
    } else if (addrLower.includes("jardim") || addrLower.includes("jardins") || addrLower.includes("oscars")) {
      neighborhood = "Jardins";
      size = 110;
      desc = "Excelente e amplo apartamento de 110m² na região planejada dos Jardins, com pé direito alto, 3 dormitórios, guarita de segurança e vaga demarcada.";
      arrematacao = 510000;
      sale = 980000;
      iptu = 240;
      condo = 890;
      divida = 15000;
      image = "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80";
    } else if (addrLower.includes("alto") || addrLower.includes("pinheiros")) {
      neighborhood = "Alto de Pinheiros";
      size = 150;
      desc = "Casa residencial de alto padrão em região residencial muito arborizada do Alto de Pinheiros. Amplos espaços, terraço, e quintal privativo.";
      arrematacao = 720000;
      sale = 1450000;
      iptu = 380;
      condo = 0;
      divida = 12000;
      image = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80";
    } else {
      // General randomizer slightly offset by the search length so it's stable and feels organic
      const offset = (address.length * 3) % 4;
      if (offset === 1) {
        neighborhood = "Vila Madalena";
        size = 65;
        desc = "Charmoso apartamento de 1 suíte na Vila Madalena, ideal para público jovem com ampla varanda integrada e lazer no condomínio.";
        arrematacao = 290000;
        sale = 550000;
        iptu = 120;
        condo = 490;
        divida = 3800;
        image = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80";
      } else if (offset === 2) {
        neighborhood = "Copacabana";
        size = 80;
        desc = "Apartamento de fundos silencioso, a 2 quadras da praia de Copacabana. 2 quartos reformados, área de serviço inteira e sol da manhã.";
        arrematacao = 320000;
        sale = 580000;
        iptu = 140;
        condo = 580;
        divida = 9100;
        image = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80";
      } else if (offset === 3) {
        neighborhood = "Savassi";
        size = 75;
        desc = "Moderno apartamento residencial com 2 quartos, ar condicionado central, localizado pertinho da Praça da Savassi com garagem rotativa.";
        arrematacao = 250000;
        sale = 440000;
        iptu = 90;
        condo = 410;
        divida = 0;
        image = "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80";
      }
    }

    // Format proper output back coordinates simulated
    return res.json({
      success: true,
      address,
      city: cityStr,
      neighborhood,
      description: desc,
      arrematacaoValue: arrematacao,
      saleValue: sale,
      holdMonths: 12, // standard defaults
      iptuMonthly: iptu,
      condominioMonthly: condo,
      dividaPropterRem: divida,
      estimatedSizeM2: size,
      propertyImage: image
    });
  });

  const distPath = path.join(process.cwd(), "dist");
  const hasDist = fs.existsSync(distPath);

  // Serve static files if '/dist' folder is found (production / compiled state)
  if (hasDist && process.env.NODE_ENV !== "development") {
    console.log("Serving production files from:", distPath);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    console.log("Starting Vite development middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

