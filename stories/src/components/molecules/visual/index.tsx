import React, { useState } from 'react'
import { ImageCanvas } from '../../atoms/image-canvas'
import { VisualProps } from './interfaces'

/**
 * Visual displays an image.
 * It will use the standard <img> element unless the image fails to load,
 * where it will instead bypass content security and use a <canvas> element.
 * 
 * @param props - img tag props
 * @returns an image node
 */
export const Visual: React.FC<VisualProps> = (props) => {
    const [imageTagFailed, setImageTagFailed] = useState<boolean>(false)

    return imageTagFailed ? (
        <ImageCanvas {...props} />
    ) : (
        <img {...props} onError={() => setImageTagFailed(true)} />
    )
}
