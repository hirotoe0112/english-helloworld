import OpenAI from "openai"
import 'dotenv/config'


/**
 * 自動添削を行い結果を返す
 * @param {string} originalContent
 * @returns
 */
const getCorrection = async (originalContent) => {
  const OpenAiSource = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const system_message = `
あなたは、英語を母国語とするアメリカ人英会話講師です。生徒が書いた英語日記の添削をしてください。
添削は、文法が正しいか、スペルミスがないか、自然な英語になっているか、という観点でチェックしてください。
添削結果は、以下の形式で返信してください。{}で示した箇所はあなたが修正する箇所です。その他の部分は全く変えずにそのまま返信してください。

<h2 class="wp-block-heading">AIによる自動添削結果</h2>
添削結果は、以下の通りです。
<h3 class="wp-block-heading">総評</h3>
{ここに日記の内容について、英会話教師が生徒に向けた感想や意見などを日本語で書いてください。}
<h3 class="wp-block-heading">修正後の文章</h3>
{ここに修正後の文章全体をそのまま書いてください。}
<h3 class="wp-block-heading">修正箇所の説明</h3>
{ここに修正箇所の説明を日本語で行ってください。英語初心者の今後の学習に役立つように、関連する知識やネイティブの慣習なども含めつつわかりやすく説明をしてください。}
`

  const user_message = `英語日記の本文は「${originalContent}」です。`
  const messages = [
    {
      "role": "system", "content": system_message
    },
    { "role": "user", "content": user_message },
  ]

  const result = []
  let completion = undefined
  while (completion?.choices[0].finish_reason !== 'stop') {
    completion = await OpenAiSource.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo-1106",
      max_tokens: 300,
      temperature: 0,
    });
    result.push(completion.choices[0].message.content)
    messages.push({
      "role": "assistant", "content": completion.choices[0].message.content
    })
  }
  return result.join('')
}

/**
 * wordpressに投稿する
 * @param {string} title
 * @param {string} postBody
 */
const postToWordpress = async (title, postBody) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization:
      "Basic " + Buffer.from(`${process.env.WP_USERNAME}:${process.env.WP_APPLICATION_PASSWORD}`).toString("base64"),
  };
  const body = JSON.stringify({
    title: title,
    content: postBody,
    status: "publish",
  });
  const response = await fetch("https://english-helloworld.net/wp-json/wp/v2/posts", {
    method: "POST",
    headers,
    body,
  });
  console.log(response.status)
}

// front matterを除いた本文を取得
const originalContent = process.env.MD_CONTENT.replace(/---[\s\S]*---/, '')
// front matter部分からtitleを取得
const title = process.env.MD_CONTENT.match(/title: (.*)/)[1]

getCorrection(originalContent).then(async correctionResult => {
  await postToWordpress(title, originalContent + "\n" + correctionResult)
})
