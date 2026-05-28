import { ApiReviewItem, ReviewItem } from '@/types/modules/dnd/pndReview'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
const { INDEX_ZERO } = COMMON_CONSTANTS

export const processApiData = (apiItems: ApiReviewItem[]): ReviewItem[] => {
  const groupedItems: { [key: number]: ApiReviewItem[] } = {}

  apiItems.forEach((item) => {
    if (!groupedItems[item.item_id]) {
      groupedItems[item.item_id] = []
    }
    groupedItems[item.item_id].push(item)
  })

  return Object.entries(groupedItems).map(([itemId, items]) => {
    const combinedValue = items
      .map((item) => item.value)
      .filter((value) => value !== null)
      .join(', ')

    const allSameComments = items.every(
      (item) => item.comments === items[INDEX_ZERO].comments
    )
    const combinedComments = allSameComments
      ? (items[INDEX_ZERO].comments ?? '')
      : items.map((item) => item.comments ?? '').join(', ')

    return {
      id: itemId.toString(),
      item: items[INDEX_ZERO].item_name,
      requirement: combinedValue,
      comment: combinedComments,
      reviewed: items[INDEX_ZERO].reviewed,
    }
  })
}

export const prepareItemsForSubmission = (
  reviewItems: ReviewItem[]
): ApiReviewItem[] => {
  return reviewItems.map((item) => ({
    item_id: parseInt(item.id),
    item_name: item?.item,
    value: item?.requirement,
    comments: item?.comment,
    reviewed: item?.reviewed,
  }))
}
