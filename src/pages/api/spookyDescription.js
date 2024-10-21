// src/pages/api/describe-image.js
export async function POST({ request }) {
    try {
      const { imageUrl, info } = await request.json();
      const res = await fetch(imageUrl);
      const arrayBuffer = await res.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);
      const base64Image = imageBuffer.toString('base64');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: `Esta imagen es parte de una aplicacion para halloween que detecta cosas paranormales en los objetos de la imagen, la imagen fue tomada por el usuario. La imagen fue transformada para tener la aparencia de algo ${info}. Genera una historia de maximo dos parrafos para que sea parte del almanaque de cosas embrujadas junto con la foto. Centrate en la historia, no en la aplicacion. Dame un json con la historia con nombre de propiedad de historia y un nombre corto para el objeto en la propiedad nombre.` },
                {
                    type: "image_url",
                    image_url: {
                      url: `data:image/jpeg;base64,${base64Image}`
                    }
                  }
              ]
            }
          ],
          max_tokens: 300
        })
      });
  
      if (!response.ok) {
        console.log(response)
        throw new Error('Failed to get response');
      }
  
      const data = await response.json();
      const validJsonString = formatToJsonString(data.choices[0].message.content);

console.log(validJsonString)

      const parsedResponse = JSON.parse(formatToJsonString(validJsonString));

      return new Response(JSON.stringify(parsedResponse), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
        console.log(error)
      return new Response(JSON.stringify({
        error: 'Failed to generate image description'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }

  function formatToJsonString(jsonLikeString) {
    try {
        // Remove markdown json formatting if present
        let cleanString = jsonLikeString.match(/\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/g)?.[0] || '';
        
        // If it's already a string (rather than an object), try to parse it first
        if (typeof cleanString === 'string') {
            try {
                cleanString = JSON.parse(cleanString);
            } catch (e) {
                // If parsing fails, it might be because it's already a stringified JSON
                console.log("Initial parse failed, continuing with cleaning...");
            }
        }

        // If it's an object, stringify it properly
        if (typeof cleanString === 'object' && cleanString !== null) {
            return JSON.stringify(cleanString);
        }

        // Clean up any problematic characters while preserving intended newlines
        cleanString = cleanString
            // Replace actual newlines with escaped newlines
            .replace(/\n/g, '\\n')
            // Remove any extra backslashes before quotes
            .replace(/\\"/g, '"')
            // Ensure quotes around property names
            .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');

        // Parse and stringify to ensure valid JSON format
        const parsed = JSON.parse(cleanString);
        return JSON.stringify(parsed);
    } catch (error) {
        // Log the error and the problematic string for debugging
        console.error("Error details:", error);
        console.error("Problematic string:", jsonLikeString);
        throw new Error(`Failed to format JSON string: ${error.message}`);
    }

}