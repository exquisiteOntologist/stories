export const loadImage = (imageUrl: string): Promise<HTMLImageElement> => new Promise((res, rej) => {
    const img = new Image()

    img.crossOrigin = 'anonymous'
    img.onload = () => res(img)
    img.onerror = () => rej()
    img.src = imageUrl
})
