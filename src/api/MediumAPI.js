import { mediumApi } from "./axiosConfig"

export const MediumAPI = {
  getLanguageHubStories: async function (storyStatus, limit = 20) {
    const response = await mediumApi.request({
      url: `/language-hub/stories/${storyStatus}/loadMore`,
      method: "GET",
      params: {
        limit: limit,
      },
    })

    const responseData = JSON.parse(response.data.replace("])}while(1);</x>", ""))

    const posts = []

    if (responseData.payload.references && responseData.payload.references["Post"]) {
      const user = responseData.payload.references["User"]
      const users = Object.keys(user).map((userId) => {
        return user[userId]
      })
      const post = responseData.payload.references["Post"]
      Object.keys(post).forEach((postId) => {
        const postData = post[postId]

        const creatorData = users.find((user) => user.userId === postData.creatorId)

        const scheduledAt = responseData.payload.streamItems.find((s) => s.collectionManagerPost.postId === postId)
          ?.collectionManagerPost?.scheduledAt

        posts.push({
          ...postData,
          creator: creatorData,
          status: storyStatus,
          scheduledAt,
        })
      })
    }

    return posts
  },
}
