// lib/huggingface.ts
export async function runHuggingFace(prompt: string) {
  const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-small', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  const result = await response.json();
  return result?.[0]?.generated_text || 'No response from model';
}
