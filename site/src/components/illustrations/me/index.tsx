export const Me: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 168 87" width="168">
    <g fill="none" fillRule="evenodd">
      <path
        d="M147 17c11.046 0 20 8.954 20 20v5c0 11.046-8.954 20-20 20H50.715L28.703 85V62H21C9.954 62 1 53.046 1 42v-5c0-11.046 8.954-20 20-20"
        stroke="currentColor"
      />
      <text
        opacity=".951"
        fontFamily="inherit"
        fontSize="28"
        fontWeight="500"
        fill="currentColor"
        transform="translate(1)"
      >
        {" "}
        <tspan x="28.456" y="29">
          “I’m me”
        </tspan>{" "}
      </text>
    </g>
  </svg>
);

export const MeDouble: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 267 232"
    width="267"
  >
    <defs>
      <radialGradient
        cx="50%"
        cy="0%"
        fx="50%"
        fy="0%"
        r="115.755%"
        gradientTransform="matrix(0 1 -.86846 0 .5 -.5)"
        id="bubbles-a"
      >
        <stop stopColor="#C097FF" stopOpacity=".126" offset="0%" />
        <stop stopColor="#4B99DE" stopOpacity=".122" offset="74.839%" />
        <stop stopColor="#BFBAFF" stopOpacity=".564" offset="100%" />
      </radialGradient>
      <filter
        x="-22%"
        y="-48.4%"
        width="143.9%"
        height="203.2%"
        filterUnits="objectBoundingBox"
        id="bubbles-b"
      >
        <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          stdDeviation="10.5"
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          in="shadowBlurOuter1"
        />
      </filter>
      <text
        id="bubbles-c"
        fontFamily="inherit"
        fontSize="52"
        fontWeight="400"
        fill="#738EFF"
      >
        <tspan x="46.048" y="56">
          I’m me
        </tspan>
      </text>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        d="M246 17c11.046 0 20 8.954 20 20v5c0 11.046-8.954 20-20 20h-96.285l-22.012 23V62H120c-11.046 0-20-8.954-20-20v-5c0-11.046 8.954-20 20-20"
        stroke="#2E2C2A"
      />
      <text
        opacity=".951"
        fontFamily="inherit"
        fontSize="28"
        fontWeight="500"
        fill="#2E2C2A"
        transform="translate(100)"
      >
        <tspan x="28.456" y="29">
          “I’m me”
        </tspan>
      </text>
      <path
        d="M203 0c20.435 0 37 16.565 37 37v1c0 20.435-16.565 37-37 37H37c-1.82 0-3.609-.131-5.358-.385-2.016.729-5.006 2.323-8.168 4.03l-.684.369C16.504 82.41 9.768 86.035 8.755 84.1c-2.257-4.308 5.738-2.505 9.388-14.26C7.28 63.394 0 51.548 0 38v-1C0 16.565 16.565 0 37 0h166Z"
        fill="url(#bubbles-a)"
        transform="translate(0 140)"
      />
      <g fill="#738EFF" transform="translate(0 140)">
        <use filter="url(#bubbles-b)" xlinkHref="#bubbles-c" />
        <use xlinkHref="#bubbles-c" />
      </g>
    </g>
  </svg>
);
