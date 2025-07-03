import express from "express";
import Anthropic from "@anthropic-ai/sdk";

// Create a router for Anthropic API endpoints
const router = express.Router();

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Define route for Claude completions (non-streaming - kept for compatibility)
router.post("/claude-completion", async (req, res) => {
  try {
    const { prompt, max_tokens = 2000, temperature = 0.7 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt in request body" });
    }

    const response = await anthropic.messages.create({
      model: "claude-4-sonnet", // Claude 4 Sonnet - the latest and most advanced AI model
      max_tokens: max_tokens,
      temperature: temperature,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return res.json({ completion: response });
  } catch (error: any) {
    console.error("Error calling Claude API:", error);
    return res.status(500).json({ 
      error: "Error calling Claude API", 
      message: error.message,
      details: error.toString()
    });
  }
});

// New streaming endpoint for chat messages
router.post("/claude-stream", async (req, res) => {
  try {
    const { prompt, max_tokens = 2000, temperature = 0.7, mode = "chat" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt in request body" });
    }

    // Set up Server-Sent Events headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Create system prompt based on mode
    let systemPrompt = "";
    if (mode === "debug") {
      systemPrompt = `You are a debugging assistant. When provided with error messages, code snippets, or bug reports, provide clear, step-by-step solutions. Format your response with:
1. **Problem Analysis**: What's causing the issue
2. **Solution**: Specific steps to fix it
3. **Prevention**: How to avoid this in the future

Be concise but thorough. Focus on practical solutions.`;
    } else {
      systemPrompt = `You are a helpful coding assistant. Provide clear, concise answers about programming, web development, and software engineering. Use examples when helpful, and format code snippets properly.`;
    }

    // Create streaming request
    const stream = await anthropic.messages.stream({
      model: "claude-4-sonnet",
      max_tokens: max_tokens,
      temperature: temperature,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Send initial connection event
    res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`);

    let fullResponse = '';

    // Process the stream
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta && 'text' in chunk.delta) {
        const text = chunk.delta.text;
        fullResponse += text;
        
        // Send the text chunk
        res.write(`data: ${JSON.stringify({ 
          type: 'chunk', 
          text: text 
        })}\n\n`);
      }
    }

    // Send completion event
    res.write(`data: ${JSON.stringify({ 
      type: 'complete', 
      fullResponse: fullResponse 
    })}\n\n`);

    res.end();

  } catch (error: any) {
    console.error("Error in Claude streaming:", error);
    
    // Send error event
    res.write(`data: ${JSON.stringify({ 
      type: 'error', 
      message: error.message || 'Unknown error occurred' 
    })}\n\n`);
    
    res.end();
  }
});

export default router;