import React from 'react'

export interface HeadingProps {
    children: React.ReactNode
}

export const H2: React.FC<HeadingProps> = ({ children }) => (
    <h2 className="text-2xl font-semibold mb-2">{children}</h2>
)

export type ColourNames = 'green' | 'yellow' | 'blue' | 'red'

export interface LightProps {
    children: React.ReactNode
    colour: ColourNames
}

export const Light: React.FC<LightProps> = ({ children, colour }) => (
    <span className={`text-${colour}-500`}>{children}</span>
)

export interface HintProps {
    title: String
    text: String
}

export const Hint: React.FC<HintProps> = ({ title, text }) => (
    <p className="text-gray-300"><span className="font-semibold">{title}:</span> {text}</p>
)
