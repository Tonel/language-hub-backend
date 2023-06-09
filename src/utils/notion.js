import { DateTime } from "luxon"
export function toNotionValue(value, notionValue) {
  if (value === undefined || value === "") {
    return undefined
  }

  return notionValue
}
export function mediumDateToNotionFormat(date) {
  let notionDate = undefined

  if (date) {
    notionDate = DateTime.fromMillis(date).setZone("Europe/Rome").toISO()
  }

  return notionDate
}

export function stringToNotionText(content) {
  return toNotionValue(content, {
    rich_text: [
      {
        type: "text",
        text: {
          content: content,
          link: null,
        },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: "default",
        },
        plain_text: content,
        href: null,
      },
    ],
  })
}

export function mediumDateToNotionDate(mediumDate) {
  return toNotionValue(mediumDate, {
    date: {
      start: mediumDateToNotionFormat(mediumDate),
    },
  })
}

export function urlToNotionUrl(url) {
  return toNotionValue(url, {
    url: url,
  })
}

export function stringToNotionSelect(content) {
  return toNotionValue(content, {
    select: { name: content },
  })
}

export function stringToNotionStatus(content) {
  return toNotionValue(content, {
    status: { name: content },
  })
}

export function stringToNotionTitle(content) {
  return toNotionValue(content, {
    title: [
      {
        type: "text",
        text: {
          content: content,
        },
      },
    ],
  })
}
