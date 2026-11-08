export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('si-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
