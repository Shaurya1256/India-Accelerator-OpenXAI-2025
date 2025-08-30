import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { topic } = req.body
  if (!topic) return res.status(400).json({ error: 'Missing topic' })

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a witty and humorous article writer.' },
        { role: 'user', content: `Write a long, humorous, engaging article about "${topic}". Keep it entertaining.` }
      ],
      max_tokens: 700,
      temperature: 0.8
    })

    const text = completion.choices?.[0]?.message?.content
    return res.status(200).json({ article: text })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to generate article' })
  }
}
