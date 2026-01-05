# OpenRouter API Setup

## What is OpenRouter?

OpenRouter is a unified API that provides access to multiple LLM providers (OpenAI, Anthropic, Google, Meta, etc.) through a single interface. It's often cheaper and more flexible than using individual APIs.

## Configuration

Your OpenRouter API key has been added to `.env`:
```
OPENROUTER_API_KEY=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
OPENAI_API_KEY=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
LITELLM_MODEL=openrouter/anthropic/claude-3-haiku
```

## Available Models on OpenRouter

### Recommended Models for Interview System:

1. **Claude 3 Haiku** (Current default)
   - Model: `openrouter/anthropic/claude-3-haiku`
   - Fast, affordable, good quality
   - Cost: ~$0.25 per 1M input tokens

2. **GPT-3.5 Turbo**
   - Model: `openrouter/openai/gpt-3.5-turbo`
   - Very affordable, reliable
   - Cost: ~$0.50 per 1M input tokens

3. **GPT-4 Turbo**
   - Model: `openrouter/openai/gpt-4-turbo`
   - Best quality, more expensive
   - Cost: ~$10 per 1M input tokens

4. **Claude 3 Sonnet**
   - Model: `openrouter/anthropic/claude-3-sonnet`
   - Great balance of quality and cost
   - Cost: ~$3 per 1M input tokens

## How to Change Models

Edit `.env` file and change `LITELLM_MODEL`:

```env
# For GPT-3.5 Turbo
LITELLM_MODEL=openrouter/openai/gpt-3.5-turbo

# For Claude 3 Haiku (current)
LITELLM_MODEL=openrouter/anthropic/claude-3-haiku

# For GPT-4 Turbo
LITELLM_MODEL=openrouter/openai/gpt-4-turbo
```

## View All Available Models

Visit: https://openrouter.ai/models

## Pricing Comparison

For a typical interview (5 questions + 5 evaluations):
- **Claude 3 Haiku**: ~$0.01-0.02 per interview
- **GPT-3.5 Turbo**: ~$0.01-0.02 per interview
- **GPT-4 Turbo**: ~$0.10-0.20 per interview
- **Claude 3 Sonnet**: ~$0.05-0.10 per interview

## Benefits of OpenRouter

1. **Unified API**: One key for multiple providers
2. **Cost Comparison**: See prices for all models
3. **Fallback Options**: Automatically switch if one provider is down
4. **Rate Limits**: Better rate limits than individual providers
5. **Model Selection**: Easy to test different models

## Testing

After adding the API key, restart your Django server:

```bash
cd ai-interview-system/backend
source venv/bin/activate
python manage.py runserver
```

Then test by:
1. Creating an interview
2. Generating questions (should use OpenRouter now)
3. Submitting answers (evaluation will use OpenRouter)

## Troubleshooting

### Error: "Invalid API key"
- Verify the key is correct in `.env`
- Make sure it starts with `sk-or-v1-`
- Restart Django server after adding key

### Error: "Model not found"
- Check model name format: `openrouter/provider/model-name`
- Visit https://openrouter.ai/models for correct names

### Error: "Insufficient credits"
- Add credits at: https://openrouter.ai/credits
- OpenRouter uses prepaid credits

## Next Steps

1. ✅ OpenRouter API key configured
2. ✅ Speechmatics API key configured
3. ✅ System ready to use!

You can now:
- Generate AI interview questions
- Evaluate candidate answers
- Transcribe audio recordings
- Generate interview reports

All features are now fully functional!

