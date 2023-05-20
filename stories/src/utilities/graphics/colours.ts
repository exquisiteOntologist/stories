import ColorThief from "./color-thief"
import { loadImage } from "./image"

type PaletteRGB = [number, number, number]

export const imageColoursPalette = async (imageUrl: string): Promise<PaletteRGB[]> => {
    const img = await loadImage(imageUrl)
    const palette = ColorThief.getPalette(img, 5, 1)

    return palette;
}

export const createRgbString = (palette: PaletteRGB, alpha: number = 1) => `rgba(${palette.join(',')},${alpha})`

export const changeRgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    // Calculate hue
    // No difference
    if (delta == 0)
    h = 0;
    // Red is max
    else if (cmax == r)
    h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
    h = (b - r) / delta + 2;
    // Blue is max
    else
    h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        
    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [h, s, l]
}

export const createHslaString = (h: number, s: number, l: number, a: number = 1) => "hsla(" + h + "," + s + "%," + l + "%," + a + ")"

export interface ContentColours {
    primary?: string | null,
    primaryHslVals?: [number, number, number],
    primaryLightnessAdjusted?: string | null,
    title?: string | null,
    text?: string | null,
    background?: string | null,
    backgroundLightnessAdjusted?: string | null,
}

export const generateContentColours = async (imageUrl: string): Promise<ContentColours> => {
    const colours = await imageColoursPalette(imageUrl);

    const primary = colours[0]
    const secondary = colours[1]

    const primaryHslVals = changeRgbToHsl(...primary)
    const primaryLightnessAdjustedVals = [primaryHslVals[0], primaryHslVals[1], 40]

    const bgHslVals = changeRgbToHsl(...secondary)
    const bgLightnessAdjustedVals = [bgHslVals[0], bgHslVals[1], 95]

    const contentColours = {
        primary: createRgbString(primary),
        primaryHslVals: primaryHslVals,
        primaryLightnessAdjusted: createHslaString(primaryLightnessAdjustedVals[0], primaryLightnessAdjustedVals[1], primaryLightnessAdjustedVals[2]),
        title: createRgbString(primary),
        text: createRgbString(primary),
        background: createRgbString(secondary, 0.05),
        backgroundLightnessAdjusted: createHslaString(bgLightnessAdjustedVals[0], bgLightnessAdjustedVals[1], bgLightnessAdjustedVals[2])
    }

    return contentColours
}

export const setBodyBackground = (backgroundColour?: string) => {
    if (!backgroundColour) return

    document.body.parentElement.style.background = backgroundColour
}
