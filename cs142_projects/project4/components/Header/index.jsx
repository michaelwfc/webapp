// import React from "react";
// import "./styles.css";
// import wukong from "./wukong.jpg"; // webpack bundles the file and gives you a URL

// class Header extends React.Component {
//   render() {
//     return (
//       <header className="Header">
//         <img src={wukong} className="header-avatar" alt="logo" />
//         <span className="header-name">Wukong</span>
//       </header>
//     );
//   }
// }

// export default Header;

import React from "react";
import "./styles.css";

/**
 * Header - CS142 Project 4
 * A personalized header component displayed at the top of every view.
 * Uses only inline SVG and CSS — no external libraries or image files needed.
 */
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date().toLocaleTimeString(),
    };
  }

  componentDidMount() {
    // Tick the clock every second
    this.clockID = setInterval(() => {
      this.setState({ time: new Date().toLocaleTimeString() });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.clockID);
  }

  render() {
    return (
      <header className="Header">
        {/* ── Left: animated SVG avatar ── */}
        <div className="header-avatar-wrap">
          <svg
            className="header-avatar-svg"
            viewBox="0 0 80 80"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Orbit ring */}
            <ellipse
              cx="40"
              cy="40"
              rx="36"
              ry="14"
              fill="none"
              stroke="#a78bfa"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              className="orbit-ring"
            />
            {/* Planet body */}
            <circle cx="40" cy="40" r="18" fill="#6d28d9" />
            {/* Shine */}
            <ellipse
              cx="34"
              cy="34"
              rx="6"
              ry="4"
              fill="#c4b5fd"
              opacity="0.5"
            />
            {/* Orbiting dot */}
            <circle
              cx="76"
              cy="40"
              r="4"
              fill="#fbbf24"
              className="orbit-dot"
            />
            {/* Tiny stars */}
            <circle
              cx="10"
              cy="15"
              r="1.5"
              fill="#e9d5ff"
              className="star star1"
            />
            <circle
              cx="68"
              cy="10"
              r="1"
              fill="#e9d5ff"
              className="star star2"
            />
            <circle
              cx="18"
              cy="62"
              r="1.5"
              fill="#e9d5ff"
              className="star star3"
            />
            <circle
              cx="72"
              cy="65"
              r="1"
              fill="#e9d5ff"
              className="star star4"
            />
          </svg>
        </div>

        {/* ── Centre: name + tagline ── */}
        <div className="header-centre">
          <h1 className="header-title">
            <span className="header-title-first">Alex</span>
            <span className="header-title-last">Chen</span>
          </h1>
          <p className="header-tagline">CS142 · Web Applications</p>
        </div>

        {/* ── Right: live clock badge ── */}
        <div className="header-clock">
          <span className="header-clock-label">Local time</span>
          <span className="header-clock-time">{this.state.time}</span>
        </div>
      </header>
    );
  }
}

export default Header;
