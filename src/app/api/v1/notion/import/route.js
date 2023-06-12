import { NextResponse } from "next/server"
import { MediumAPI } from "@/api/MediumAPI"
import { NotionAPI } from "@/api/NotionAPI"
import {
  mediumDateToNotionDate,
  stringToNotionSelect,
  stringToNotionStatus,
  stringToNotionText,
  stringToNotionTitle,
  urlToNotionUrl,
} from "@/utils/notion"
import { Constants } from "@/constants/Constants"

export async function POST(request) {
  const mediumPublishedStories = await MediumAPI.getLanguageHubStories("published")
  const mediumSubmissionStories = await MediumAPI.getLanguageHubStories("submissions")
  const mediumScheduledStories = await MediumAPI.getLanguageHubStories("scheduled")

  const stories = [...mediumSubmissionStories, ...mediumScheduledStories, ...mediumPublishedStories]

  const notionData = await NotionAPI.databases.query({ database_id: Constants.NOTION_SUBMISSION_DATABASE_ID })

  for (const story of stories) {
    const mediumPostId = story.id
    const title = story.title
    const subtitle = story.virtuals.subtitle
    const createdAt = story.createdAt || undefined
    const updatedAt = story.updatedAt || undefined
    const scheduledFor = story.scheduledAt || undefined
    const publishedAt = story.latestPublishedAt || undefined
    const seoTitle = story.seoTitle
    let url = `https://medium.com/p/${mediumPostId}/edit`
    const tags = story.virtuals.tags.map((tag) => tag.name).join("; ")
    const seoMetaDescription = story.virtuals.metaDescription
    const author = story.creator.name

    let type = "Draft"
    if (story.status === "published" || (story.status === "submissions" && story.firstPublishedAt !== 0)) {
      type = "Story"
    }

    let status = "Received"
    if (story.virtuals.statusForCollection === "APPROVED") {
      status = "Published"
    }
    if (scheduledFor) {
      status = "Scheduled"
    }

    const notionPage = notionData.results.find(
      (record) => record.properties["Medium ID"].rich_text[0]?.text?.content === mediumPostId,
    )

    const notionPageId = notionPage?.id
    const notionPageStatus = notionPage?.properties["Status"]

    const notionBody = {
      "Medium ID": stringToNotionText(mediumPostId),
      Title: stringToNotionTitle(title),
      Subtitle: stringToNotionText(subtitle),
      Author: stringToNotionText(author),
      Url: urlToNotionUrl(url),
      Type: stringToNotionSelect(type),
      "Created At_": mediumDateToNotionDate(createdAt),
      "Updated At_": mediumDateToNotionDate(updatedAt),
      Tags: stringToNotionText(tags),
      "Scheduled For": mediumDateToNotionDate(scheduledFor),
      "Published At": mediumDateToNotionDate(publishedAt),
      "SEO Title": stringToNotionText(seoTitle),
      "SEO Meta Description": stringToNotionText(seoMetaDescription),
      Status: stringToNotionStatus(status),
    }

    // TODO: error handling with try catch not to break the loop

    if (notionPageId) {
      if (notionPageStatus.status.name !== "Published") {
        await NotionAPI.pages.update({
          page_id: notionPageId,
          properties: notionBody,
        })
      }
    } else {
      await NotionAPI.pages.create({
        parent: {
          database_id: Constants.NOTION_SUBMISSION_DATABASE_ID,
        },
        properties: notionBody,
      })
    }
  }

  return NextResponse.json(mediumScheduledStories)
}
