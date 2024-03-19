import OpenAI from "openai"
import { Client } from "@notionhq/client"
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

const completion = await OpenAiSource.chat.completions.create({
  messages: [
    {
      "role": "system", "content": `
英語日記の添削をしてください。添削は、文法が正しいか、スペルミスがないか、自然な英語になっているか、という観点でチェックしてください。
添削結果は、以下の形式で返信してください。説明は日本語で行ってください。

## 添削結果
添削結果は、以下の通りです。
- 修正前の文章
- 修正後の文章
- 修正箇所の説明
` },
    { "role": "user", "content": `英語日記の本文は「${content}」です。` },
  ],
  model: "gpt-3.5-turbo-1106",
  max_tokens: 300,
});

console.log(completion.choices[0]);