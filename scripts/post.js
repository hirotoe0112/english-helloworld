import OpenAI from "openai"
import 'dotenv/config'

const OpenAiSource = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

console.log(process.env.MD_CONTENT)

// front matter部分からtitleを取得
const title = process.env.MD_CONTENT.match(/title: (.*)/)[1]
console.log(title)

// front matterを除いた本文を取得
const content = process.env.MD_CONTENT.replace(/---[\s\S]*---/, '')
console.log(content)

const system_message = `
あなたは、英語を母国語とする英会話講師です。生徒が書いた英語日記の添削をしてください。
添削は、文法が正しいか、スペルミスがないか、自然な英語になっているか、という観点でチェックしてください。
添削結果は、以下の形式で返信してください。
修正箇所の説明は日本語で行ってください。また、英語初心者の今後の学習に役立つように、関連する知識やネイティブの慣習なども含めつつわかりやすく説明をしてください。

## 添削結果
添削結果は、以下の通りです。
- 修正後の文章
- 修正箇所の説明
`

const user_message = `英語日記の本文は「${content}」です。`
const messages = [
  {
    "role": "system", "content": system_message
  },
  { "role": "user", "content": user_message },
]
const max_tokens = 300
const temperature = 0

const result = []

let completion = undefined
while (completion?.choices[0].finish_reason === 'length') {
  completion = await OpenAiSource.chat.completions.create({
    messages,
    model: "gpt-3.5-turbo-1106",
    max_tokens: max_tokens,
    temperature: temperature,
  });
  result.push(completion.choices[0].message)
  console.log(result.join(''))
  messages.push({
    "role": "assistant", "content": completion.choices[0].message
  })
  console.log(messages)
}
