import * as React from 'react'
import { css, keyframes } from 'react-emotion'
import { GREEN } from '../../config'

const blob1Anim = keyframes`
  0% {
    transform: scale(calc(1/3)) translate(-150%, 150%);
  }
  50% {
    transform: scale(1.5) translate(0, 0);
  }
  100% {
    transform: scale(calc(1/3)) translate(-150%, 150%);
  }
`

const blob2Anim = keyframes`
  0% {
    transform: scale(1) translate(50%, -50%);
  }
  50% {
    transform: scale(1.5) translate(0, 0);
  }
  100% {
    transform: scale(1) translate(50%, -50%);
  }
`

interface LogoProps {
  style: React.CSSProperties
}

const Logo: React.FC<LogoProps> = ({ style }) => {
  return (
    <div
      className={css`
        height: 100%;
        width: 100%;
        position: relative;
      `}
      style={style}
    >
      <div
        className={css`
          filter: url('#goo');
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
        `}
      >
        <div
          className={css`
            position: absolute;
            background: ${GREEN};
            left: 50%;
            top: 50%;
            width: 30%;
            height: 30%;
            border-radius: 100%;
            margin-top: -15%;
            margin-left: -15%;
            animation: ${blob1Anim} cubic-bezier(0.77, 0, 0.175, 1) 3s forwards;
          `}
        />
        <div
          className={css`
            position: absolute;
            background: ${GREEN};
            left: 50%;
            top: 50%;
            width: 30%;
            height: 30%;
            border-radius: 100%;
            margin-top: -15%;
            margin-left: -15%;
            animation: ${blob2Anim} cubic-bezier(0.77, 0, 0.175, 1) 3s forwards;
          `}
        />
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" />
          </filter>
        </defs>
      </svg>
    </div>
  )
}

Logo.displayName = 'Logo'

export default Logo
