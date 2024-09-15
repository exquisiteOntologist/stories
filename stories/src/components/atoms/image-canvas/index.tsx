import React, { useEffect, useRef, useState } from 'react'
import { fetch } from '@tauri-apps/plugin-http';
import { ImageCanvasProps } from './interfaces';
import { ReadableStreamBYOBReader } from 'node:stream/web';

export const ImageCanvas: React.FC<ImageCanvasProps> = ({ className, src, style }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [img, setImg] = useState<ImageBitmap | null>(null)
    const [rendered, setRendered] = useState<boolean>(false)

    useEffect(() => {
        (async () => {
            if (rendered || img) return
            console.log('fetching img', src)
            const response = await fetch(src, {
                method: 'GET',
                connectTimeout: 30000,
                // proxy
            }).catch(e => console.error('e', e));
            console.log('response for image', response, src)
            if (!response || !response.blob || !response.arrayBuffer) return
            const blob = await response.blob()
            // const buffer = await response.arrayBuffer()
            const bitmap = await createImageBitmap(blob)
            // const img = new Image(bitmap.width, bitmap.height)
            console.log('bitmap', bitmap.width, bitmap.height)
            setImg(bitmap)
   
        })()
    }, [img])

    useEffect(() => {
        console.log('render cycle', img)

        if (rendered || !img || !canvasRef.current) return
        console.log('drawing image')

        canvasRef.current.width = img.width
        canvasRef.current.height = img.height

        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx) return
        ctx.fillStyle = '#fff'
        ctx?.fillRect(0, 0, img.width, img.height)
        ctx?.drawImage(img, 0, 0, img.width, img.height)
        // ctx?.transferFromImageBitmap(img)
        setRendered(true)
        img.close()
        console.log('img has been drawn', img)
    }, [img])

    console.log('hello', img)

    return (
        <canvas className={className} ref={canvasRef} style={style} />
    )
}
