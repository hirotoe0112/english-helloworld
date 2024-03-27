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
You are an American English conversation instructor whose native language is English. Please provide feedback on English diaries written by students.
Check the diaries for correct grammar, absence of spelling errors, and natural-sounding English.
Please reply with the correction results in the following format. The parts indicated by {} are the areas you need to correct. Please leave the other parts unchanged and reply as they are.

<h2 class="wp-block-heading">Automatic Correction Results by AI</h2>
The correction results are as follows:
<h3 class="wp-block-heading">Overall Comments</h3>
{Write feedback or comments to the student about the content of the diary in English from the perspective of an English conversation teacher.}
<h3 class="wp-block-heading">Revised Diary</h3>
{Please write the entire revised diary in English here.}
<h3 class="wp-block-heading">Explanation of Corrections</h3>
{Please provide explanations for the corrections in English. Make the explanations clear and easy to understand, including relevant knowledge and native customs to help beginner English learners in their future studies.}
`

  const user_message = `英語日記の本文は「${originalContent}」です。`
  const messages = [
    {
      "role": "system", "content": system_message
    },
    { "role": "user", "content": user_message },
  ]

  const completion = await OpenAiSource.chat.completions.create({
    messages,
    model: "gpt-3.5-turbo",
  });
  const status = completion?.choices[0].finish_reason === 'stop' ? 'complete' : 'incomplete'
  return `${completion.choices[0].message.content} (${status})`
}

/**
 * 既存の記事を取得しあればIDを返す
 * @param {string} year
 * @param {string} month
 * @param {string} day
 * @returns
 */
const getExistingPost = async (year, month, day) => {
  const response = await fetch(`https://english-helloworld.net/wp-json/wp/v2/posts?after=${year}-${month}-${day}T00:00:00&before=${year}-${month}-${day}T23:59:59`)
  const data = await response.json()
  if (data.length > 0) return data[0].id
  return undefined
}

/**
 * wordpressに投稿する
 * @param {number} id
 * @param {string} title
 * @param {string} postBody
 */
const postToWordpress = async (id, title, postBody) => {
  const path = id ? `/${id}` : ""
  const body = JSON.stringify({
    title: title,
    content: postBody,
    status: "publish",
  });
  const response = await fetch(`https://english-helloworld.net/wp-json/wp/v2/posts${path}`, {
    method: "POST",
    headers,
    body,
  });
  console.log(response.status)
}

const headers = {
  "Content-Type": "application/json",
  Authorization:
    "Basic " + Buffer.from(`${process.env.WP_USERNAME}:${process.env.WP_APPLICATION_PASSWORD}`).toString("base64"),
}

const mdContent = process.env.MD_CONTENT

// front matterを除いた本文を取得
const originalContent = mdContent.replace(/---[\s\S]*---/, '')
// front matter部分からyear, month, day, titleを取得
const year = mdContent.match(/year: (\d{4})/)[1]
const month = mdContent.match(/month: (\d{1,2})/)[1].toString().padStart(2, '0')
const day = mdContent.match(/day: (\d{1,2})/)[1].toString().padStart(2, '0')
const title = mdContent.match(/title: (.*)/)[1]

getCorrection(originalContent).then(async correctionResult => {
  const id = await getExistingPost(year, month, day)
  await postToWordpress(id, title, originalContent + "\n" + correctionResult)
})