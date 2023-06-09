import { Client } from "@notionhq/client"
import { Constants } from "@/constants/Constants"

const notion = new Client({ auth: Constants.NOTION_API_KEY })

export const NotionAPI = notion
