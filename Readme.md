# ⚡ RLC Circuit Simulator

An advanced, interactive web-based simulator for analyzing RLC (Resistor, Inductor, Capacitor) circuits. Designed for electrical engineering students and enthusiasts, this tool provides real-time waveform visualization, automatic parameter calculation, and dynamic circuit diagrams with a premium, modern aesthetic.

![Aesthetics Mode](https://img.shields.io/badge/Aesthetics-Premium-blueviolet)
![Tech](https://img.shields.io/badge/Tech-HTML5_/_CSS3_/_JS-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **Interactive Circuit Selection**: Choose from 6 different circuit types:
  - **R**: Pure Resistive
  - **L**: Pure Inductive
  - **C**: Pure Capacitive
  - **RL**: Series Resistor-Inductor
  - **RC**: Series Resistor-Capacitor
  - **RLC**: Series Resistor-Inductor-Capacitor
- **Real-Time Waveform Visualization**: 
  - Dynamic 2D Canvas animation of Voltage, Current, and Power waves.
  - Interactive Phase Difference indicators.
  - High-fidelity glowing waveforms with semi-transparent grid overlays.
- **Advanced Calculations**:
  - Automatic calculation of Impedance (Z), Reactance (XL, XC), and Phase Angle (φ).
  - Power analysis (Real, Reactive, Apparent Power, and Power Factor).
  - Resonant Frequency detection for RLC circuits.
  - Displays formulas for academic clarity.
- **Dynamic Circuit Diagrams**: Real-time SVG rendering of the circuit based on selected components.
- **Premium Design**: Dark-mode glassmorphic UI with electric blue accents and smooth micro-animations.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic structure and layout.
- **Vanilla CSS3**: Modern styling with custom properties, Flexbox/Grid, and keyframe animations.
- **Pure JavaScript (ES6+)**: Core logic for circuit physics, SVG rendering, and Canvas animations.
- **Canvas API**: High-performance waveform rendering.
- **SVG**: Dynamic circuit diagram generation.
- **Google Fonts**: Inter and JetBrains Mono for a professional typography experience.

---

## 🚀 Getting Started

No installation or dependencies required. This is a pure client-side application.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/RLC_simulator.git
   ```
2. **Open the project**:
   Simply open `index.html` in any modern web browser.

---

## 📖 How to Use

1. **Select Circuit Type**: Click on one of the circuit types at the top (e.g., RLC).
2. **Input Parameters**: Enter the RMS Voltage, Frequency, and component values (Resistance, Inductance, Capacitance).
3. **Calculate**: Click the **Calculate & Simulate** button.
4. **Observe**: 
   - View the calculated values and their corresponding formulas in the results grid.
   - Watch the live waveforms in the visualization section.
   - Use the **Play/Pause** and **Reset** buttons to control the animation.
   - Check the **Circuit Diagram** to see the configured circuit.

---

## 🔗 Deployment

This project is optimized for deployment on platforms like Vercel or GitHub Pages.

For detailed deployment instructions, please refer to [DEPLOYMENT.md](file:///d:/vscod/web/RLC_simulator/DEPLOYMENT.md).

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ⚡ for electrical engineering education.
