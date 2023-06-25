import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import { selectColours } from "../../../../redux/features/themeSlice";
import { useAppSelector } from "../../../../redux/hooks";
import { buttonClassesPadding } from "../../button";

const generateCanvasEye = (progress: number, outputCanvas?: HTMLCanvasElement | null, colour: string = 'currentColor') => {
    if (!outputCanvas) return

    const canvas = document.createElement('canvas')

    canvas.width = 160
    canvas.height = 160

    const ctx = canvas.getContext('2d')
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.lineWidth = 2
    // Density
    ctx.scale(4,4)

    // Lid
    ctx.moveTo(0, 0);
    ctx.beginPath();
    ctx.bezierCurveTo(0, 20, 40 / 2, (40 * progress), 40, 20);
    ctx.strokeStyle = colour
    ctx.stroke()

    // Iris
    ctx.moveTo(20, 20);
    ctx.beginPath();
    ctx.arc(20,24 , ((1 - progress) * 5), 2 * Math.PI, 0);
    ctx.strokeStyle = colour.replace('1)', String(1 - progress))
    ctx.stroke();

    const outCtx = outputCanvas.getContext('2d')
    if (!outCtx) return;
    outCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height)
    outCtx.drawImage(canvas, 0, 0, outputCanvas.width, outputCanvas.height)
}

export const ShutEye: React.FC = () => {
    const colours = useAppSelector(selectColours)
    const [active, setActive] = useState<boolean>(false)
    const [rand, setRand] = useState<number>(Math.random())
    const { progress } = useSpring({
        config: { duration: 150 },
        from: {
            progress: active ? 1 : 0,
        },
        to: {
            progress: active ? 0 : 1
        },
        progress: active ? 0 : 1,
    });

    // progress.reset()

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const useDarkColour = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const genericColour = useDarkColour ? 'white' : 'black'
    const colour = canvasRef.current ? getComputedStyle(canvasRef.current as HTMLCanvasElement).color : 'currentColor'
    // const colour = colours.primaryLightnessAdjusted ?? genericColour //!!canvasRef.current ? getComputedStyle(canvasRef.current as HTMLCanvasElement).color : 'rgba(0,0,0,1)' // 'currentColor' // 'rgba(0,0,0,1)'
    // console.log('colour', colour)

    useEffect(() => {
        setActive(false);
        const handleDarkMode = () => window.setTimeout(() => {
            progress.reset()
            setActive(true)
            setActive(false)
            setRand(Math.random())
        }, 500)
        const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)")
        darkModePreference.addEventListener("change", handleDarkMode)
        const lightModePreference = window.matchMedia("(prefers-color-scheme: light)")
        lightModePreference.addEventListener("change", handleDarkMode)
        window.addEventListener('focus', handleDarkMode)

        return () => {
            // return for unmount lifecycle step
            darkModePreference.removeEventListener('change', handleDarkMode);
            lightModePreference.removeEventListener('change', handleDarkMode);
            window.removeEventListener('focus', handleDarkMode)
        }
    }, [])

    const onHover = () => setActive(true)
    const onLeave = () => setActive(false)

    return (
        <div
            className={buttonClassesPadding}
            onMouseOver={onHover}
            onMouseLeave={onLeave}
        >
            <animated.canvas
                key={rand}
                ref={canvasRef}
                width="160"
                height="160"
                style={{ width: 40, height: 40 }}
            >
                {progress.to(p => generateCanvasEye(Number(p.toFixed(2)), canvasRef.current, colour))}
            </animated.canvas>
        </div>
    );
};
