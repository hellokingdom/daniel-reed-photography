export async function getBlurHash(image: string) {
  try {
    if (!image) return
    const res = await fetch(`${image}&fm=blurhash`, {
      next: { revalidate: false },
    })
    const hash = await res.text()
    return hash
  } catch (error) {
    // Handle the error here
    console.error('An error occurred while fetching the image hash:', error)
    // You can choose to return a default value or rethrow the error
    throw error
  }
}
