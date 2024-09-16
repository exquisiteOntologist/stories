import React, { useEffect, useRef, useState } from 'react'
import { fetch } from '@tauri-apps/plugin-http';
import { ImageCanvasProps } from './interfaces';

export const ImageCanvas: React.FC<ImageCanvasProps> = ({ className, src, style }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [img, setImg] = useState<ImageBitmap | null>(null)
    const [rendered, setRendered] = useState<boolean>(false)

    useEffect(() => {
        (async () => {
            if (rendered || img || !src) return
            const response = await fetch(src, {
                method: 'GET',
                connectTimeout: 30000,
                // proxy
                cache: 'force-cache'
            }).catch(e => console.error('e', e));
            if (!response || !response.blob) return
            const blob = await response.blob()
            const bitmap = await createImageBitmap(blob)
            setImg(bitmap)
        })()
    }, [img])

    useEffect(() => {
        if (rendered || !img || !canvasRef.current) return

        canvasRef.current.width = img.width
        canvasRef.current.height = img.height

        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx) return
        ctx.fillStyle = '#fff'
        ctx?.fillRect(0, 0, img.width, img.height)
        ctx?.drawImage(img, 0, 0, img.width, img.height)
        setRendered(true)
        img.close()
    }, [img])

    return (
        <canvas className={className} ref={canvasRef} style={style} />
    )
}
