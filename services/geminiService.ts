import { GoogleGenAI } from "@google/genai";
import { FinancialSummary, Product, Transaction } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeFinancials = async (
  summary: FinancialSummary,
  recentTransactions: Transaction[],
  topProducts: Product[],
  userQuery: string
): Promise<string> => {
  if (!apiKey) {
    return "API Key tidak ditemukan. Harap konfigurasi API_KEY di environment.";
  }

  const contextData = JSON.stringify({
    summary,
    recentTransactions: recentTransactions.slice(0, 5), // Only send last 5 to save tokens
    topProducts: topProducts.slice(0, 5)
  });

  const prompt = `
    Bertindaklah sebagai Konsultan Akuntansi Senior untuk Toko Elektronik "ElectroLedger".
    
    Konteks Data Keuangan Saat Ini (JSON):
    ${contextData}

    Pertanyaan User: "${userQuery}"

    Instruksi:
    1. Jawablah dalam Bahasa Indonesia yang profesional namun mudah dimengerti.
    2. Berikan analisis mendalam berdasarkan data di atas.
    3. Jika user bertanya tentang keuntungan, hitung margin laba kotor.
    4. Berikan rekomendasi taktis (misal: restock barang, kurangi biaya operasional).
    5. Jangan gunakan markdown yang rumit, gunakan paragraf dan bullet points sederhana.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Maaf, tidak dapat menghasilkan analisis saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi layanan AI.";
  }
};