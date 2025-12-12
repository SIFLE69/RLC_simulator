// ===========================
// Circuit Simulator Core Logic
// ===========================

class CircuitSimulator {
    constructor() {
        this.currentCircuitType = 'RLC';
        this.parameters = {};
        this.results = {};
        this.isAnimating = false;
        this.animationFrame = null;
        this.time = 0;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateInputFields();
        this.setupCanvas();
        this.drawCircuitDiagram();
    }

    setupEventListeners() {
        // Circuit type buttons
        document.querySelectorAll('.circuit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.circuit-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCircuitType = btn.dataset.type;
                this.updateInputFields();
                this.drawCircuitDiagram();
            });
        });

        // Calculate button
        document.getElementById('calculateBtn').addEventListener('click', () => {
            this.calculate();
        });

        // Play/Pause button
        document.getElementById('playPauseBtn').addEventListener('click', () => {
            this.toggleAnimation();
        });

        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetAnimation();
        });
    }

    updateInputFields() {
        const inputGrid = document.getElementById('inputGrid');
        inputGrid.innerHTML = '';

        const commonInputs = [
            { id: 'voltage', label: 'Voltage RMS (V_rms)', unit: 'V', default: 230 },
            { id: 'frequency', label: 'Frequency (f)', unit: 'Hz', default: 50 }
        ];

        const componentInputs = {
            'R': [{ id: 'resistance', label: 'Resistance (R)', unit: 'Ω', default: 100 }],
            'L': [{ id: 'inductance', label: 'Inductance (L)', unit: 'H', default: 0.1 }],
            'C': [{ id: 'capacitance', label: 'Capacitance (C)', unit: 'F', default: 0.0001 }],
            'RL': [
                { id: 'resistance', label: 'Resistance (R)', unit: 'Ω', default: 100 },
                { id: 'inductance', label: 'Inductance (L)', unit: 'H', default: 0.1 }
            ],
            'RC': [
                { id: 'resistance', label: 'Resistance (R)', unit: 'Ω', default: 100 },
                { id: 'capacitance', label: 'Capacitance (C)', unit: 'F', default: 0.0001 }
            ],
            'RLC': [
                { id: 'resistance', label: 'Resistance (R)', unit: 'Ω', default: 100 },
                { id: 'inductance', label: 'Inductance (L)', unit: 'H', default: 0.1 },
                { id: 'capacitance', label: 'Capacitance (C)', unit: 'F', default: 0.0001 }
            ]
        };

        const allInputs = [...commonInputs, ...componentInputs[this.currentCircuitType]];

        allInputs.forEach(input => {
            const inputGroup = this.createInputGroup(input);
            inputGrid.appendChild(inputGroup);
        });
    }

    createInputGroup(config) {
        const div = document.createElement('div');
        div.className = 'input-group';

        div.innerHTML = `
            <label for="${config.id}">${config.label}</label>
            <div class="input-wrapper">
                <input 
                    type="number" 
                    id="${config.id}" 
                    step="any" 
                    value="${config.default}"
                    placeholder="Enter ${config.label.toLowerCase()}"
                >
                <span class="input-unit">${config.unit}</span>
            </div>
        `;

        return div;
    }

    getInputValue(id) {
        const element = document.getElementById(id);
        return element ? parseFloat(element.value) || 0 : 0;
    }

    calculate() {
        // Add calculating animation
        const btn = document.getElementById('calculateBtn');
        btn.classList.add('calculating');

        setTimeout(() => {
            // Get input values
            const V = this.getInputValue('voltage');
            const f = this.getInputValue('frequency');
            const R = this.getInputValue('resistance');
            const L = this.getInputValue('inductance');
            const C = this.getInputValue('capacitance');

            this.parameters = { V, f, R, L, C };

            // Calculate based on circuit type
            switch (this.currentCircuitType) {
                case 'R':
                    this.calculateResistive();
                    break;
                case 'L':
                    this.calculateInductive();
                    break;
                case 'C':
                    this.calculateCapacitive();
                    break;
                case 'RL':
                    this.calculateRL();
                    break;
                case 'RC':
                    this.calculateRC();
                    break;
                case 'RLC':
                    this.calculateRLC();
                    break;
            }

            this.displayResults();
            this.startAnimation();
            btn.classList.remove('calculating');
        }, 500);
    }

    calculateResistive() {
        const { V, R, f } = this.parameters;
        const Vrms = V;
        const Vmax = V * Math.sqrt(2);
        const Irms = V / R;
        const Imax = Irms * Math.sqrt(2);
        const P = V * Irms;
        const Z = R;
        const ω = 2 * Math.PI * f;

        this.results = [
            { label: 'Voltage RMS', formula: 'V<sub>rms</sub> = Input', value: `${Vrms.toFixed(2)} V` },
            { label: 'Voltage Peak', formula: 'V<sub>max</sub> = V<sub>rms</sub> × √2', value: `${Vmax.toFixed(2)} V` },
            { label: 'Current RMS', formula: 'I<sub>rms</sub> = V<sub>rms</sub> / R', value: `${Irms.toFixed(3)} A` },
            { label: 'Current Peak', formula: 'I<sub>max</sub> = I<sub>rms</sub> × √2', value: `${Imax.toFixed(3)} A` },
            { label: 'Impedance', formula: 'Z = R', value: `${Z.toFixed(2)} Ω` },
            { label: 'Power', formula: 'P = V<sub>rms</sub> × I<sub>rms</sub>', value: `${P.toFixed(2)} W` },
            { label: 'Phase Angle', formula: 'φ = 0° (resistive)', value: `0°` },
            { label: 'Angular Frequency', formula: 'ω = 2πf', value: `${ω.toFixed(2)} rad/s` }
        ];
    }

    calculateInductive() {
        const { V, L, f } = this.parameters;
        const ω = 2 * Math.PI * f;
        const XL = ω * L;
        const Vrms = V;
        const Vmax = V * Math.sqrt(2);
        const Irms = V / XL;
        const Imax = Irms * Math.sqrt(2);
        const Q = V * Irms;

        this.results = [
            { label: 'Voltage RMS', formula: 'V<sub>rms</sub> = Input', value: `${Vrms.toFixed(2)} V` },
            { label: 'Voltage Peak', formula: 'V<sub>max</sub> = V<sub>rms</sub> × √2', value: `${Vmax.toFixed(2)} V` },
            { label: 'Current RMS', formula: 'I<sub>rms</sub> = V<sub>rms</sub> / X<sub>L</sub>', value: `${Irms.toFixed(3)} A` },
            { label: 'Current Peak', formula: 'I<sub>max</sub> = I<sub>rms</sub> × √2', value: `${Imax.toFixed(3)} A` },
            { label: 'Inductive Reactance', formula: 'X<sub>L</sub> = ωL = 2πfL', value: `${XL.toFixed(2)} Ω` },
            { label: 'Reactive Power', formula: 'Q = V<sub>rms</sub> × I<sub>rms</sub>', value: `${Q.toFixed(2)} VAR` },
            { label: 'Phase Angle', formula: 'φ = 90° (current lags voltage)', value: `90°` },
            { label: 'Angular Frequency', formula: 'ω = 2πf', value: `${ω.toFixed(2)} rad/s` }
        ];
    }

    calculateCapacitive() {
        const { V, C, f } = this.parameters;
        const ω = 2 * Math.PI * f;
        const XC = 1 / (ω * C);
        const Vrms = V;
        const Vmax = V * Math.sqrt(2);
        const Irms = V / XC;
        const Imax = Irms * Math.sqrt(2);
        const Q = V * Irms;

        this.results = [
            { label: 'Voltage RMS', formula: 'V<sub>rms</sub> = Input', value: `${Vrms.toFixed(2)} V` },
            { label: 'Voltage Peak', formula: 'V<sub>max</sub> = V<sub>rms</sub> × √2', value: `${Vmax.toFixed(2)} V` },
            { label: 'Current RMS', formula: 'I<sub>rms</sub> = V<sub>rms</sub> / X<sub>C</sub>', value: `${Irms.toFixed(3)} A` },
            { label: 'Current Peak', formula: 'I<sub>max</sub> = I<sub>rms</sub> × √2', value: `${Imax.toFixed(3)} A` },
            { label: 'Capacitive Reactance', formula: 'X<sub>C</sub> = 1/(ωC) = 1/(2πfC)', value: `${XC.toFixed(2)} Ω` },
            { label: 'Reactive Power', formula: 'Q = V<sub>rms</sub> × I<sub>rms</sub>', value: `${Q.toFixed(2)} VAR` },
            { label: 'Phase Angle', formula: 'φ = -90° (current leads voltage)', value: `-90°` },
            { label: 'Angular Frequency', formula: 'ω = 2πf', value: `${ω.toFixed(2)} rad/s` }
        ];
    }

    calculateRL() {
        const { V, R, L, f } = this.parameters;
        const ω = 2 * Math.PI * f;
        const XL = ω * L;
        const Z = Math.sqrt(R * R + XL * XL);
        const Vrms = V;
        const Vmax = V * Math.sqrt(2);
        const Irms = V / Z;
        const Imax = Irms * Math.sqrt(2);
        const φ = Math.atan(XL / R) * (180 / Math.PI);
        const P = Irms * Irms * R;
        const Q = Irms * Irms * XL;
        const S = V * Irms;

        this.results = [
            { label: 'Voltage RMS', formula: 'V<sub>rms</sub> = Input', value: `${Vrms.toFixed(2)} V` },
            { label: 'Voltage Peak', formula: 'V<sub>max</sub> = V<sub>rms</sub> × √2', value: `${Vmax.toFixed(2)} V` },
            { label: 'Current RMS', formula: 'I<sub>rms</sub> = V<sub>rms</sub> / Z', value: `${Irms.toFixed(3)} A` },
            { label: 'Current Peak', formula: 'I<sub>max</sub> = I<sub>rms</sub> × √2', value: `${Imax.toFixed(3)} A` },
            { label: 'Impedance', formula: 'Z = √(R² + X<sub>L</sub>²)', value: `${Z.toFixed(2)} Ω` },
            { label: 'Inductive Reactance', formula: 'X<sub>L</sub> = ωL = 2πfL', value: `${XL.toFixed(2)} Ω` },
            { label: 'Phase Angle', formula: 'φ = tan⁻¹(X<sub>L</sub>/R)', value: `${φ.toFixed(2)}°` },
            { label: 'Real Power', formula: 'P = I<sub>rms</sub>² × R', value: `${P.toFixed(2)} W` },
            { label: 'Reactive Power', formula: 'Q = I<sub>rms</sub>² × X<sub>L</sub>', value: `${Q.toFixed(2)} VAR` },
            { label: 'Apparent Power', formula: 'S = V<sub>rms</sub> × I<sub>rms</sub>', value: `${S.toFixed(2)} VA` },
            { label: 'Power Factor', formula: 'PF = P / S = cos(φ)', value: `${(P / S).toFixed(3)}` }
        ];
    }

    calculateRC() {
        const { V, R, C, f } = this.parameters;
        const ω = 2 * Math.PI * f;
        const XC = 1 / (ω * C);
        const Z = Math.sqrt(R * R + XC * XC);
        const Vrms = V;
        const Vmax = V * Math.sqrt(2);
        const Irms = V / Z;
        const Imax = Irms * Math.sqrt(2);
        const φ = -Math.atan(XC / R) * (180 / Math.PI);
        const P = Irms * Irms * R;
        const Q = Irms * Irms * XC;
        const S = V * Irms;

        this.results = [
            { label: 'Voltage RMS', formula: 'V<sub>rms</sub> = Input', value: `${Vrms.toFixed(2)} V` },
            { label: 'Voltage Peak', formula: 'V<sub>max</sub> = V<sub>rms</sub> × √2', value: `${Vmax.toFixed(2)} V` },
            { label: 'Current RMS', formula: 'I<sub>rms</sub> = V<sub>rms</sub> / Z', value: `${Irms.toFixed(3)} A` },
            { label: 'Current Peak', formula: 'I<sub>max</sub> = I<sub>rms</sub> × √2', value: `${Imax.toFixed(3)} A` },
            { label: 'Impedance', formula: 'Z = √(R² + X<sub>C</sub>²)', value: `${Z.toFixed(2)} Ω` },
            { label: 'Capacitive Reactance', formula: 'X<sub>C</sub> = 1/(ωC) = 1/(2πfC)', value: `${XC.toFixed(2)} Ω` },
            { label: 'Phase Angle', formula: 'φ = -tan⁻¹(X<sub>C</sub>/R)', value: `${φ.toFixed(2)}°` },
            { label: 'Real Power', formula: 'P = I<sub>rms</sub>² × R', value: `${P.toFixed(2)} W` },
            { label: 'Reactive Power', formula: 'Q = I<sub>rms</sub>² × X<sub>C</sub>', value: `${Q.toFixed(2)} VAR` },
            { label: 'Apparent Power', formula: 'S = V<sub>rms</sub> × I<sub>rms</sub>', value: `${S.toFixed(2)} VA` },
            { label: 'Power Factor', formula: 'PF = P / S = cos(φ)', value: `${(P / S).toFixed(3)}` }
        ];
    }

    calculateRLC() {
        const { V, R, L, C, f } = this.parameters;
        const ω = 2 * Math.PI * f;
        const XL = ω * L;
        const XC = 1 / (ω * C);
        const X = XL - XC;
        const Z = Math.sqrt(R * R + X * X);
        const Vrms = V;
        const Vmax = V * Math.sqrt(2);
        const Irms = V / Z;
        const Imax = Irms * Math.sqrt(2);
        const φ = Math.atan(X / R) * (180 / Math.PI);
        const P = Irms * Irms * R;
        const Q = Irms * Irms * Math.abs(X);
        const S = V * Irms;
        const fr = 1 / (2 * Math.PI * Math.sqrt(L * C));

        this.results = [
            { label: 'Voltage RMS', formula: 'V<sub>rms</sub> = Input', value: `${Vrms.toFixed(2)} V` },
            { label: 'Voltage Peak', formula: 'V<sub>max</sub> = V<sub>rms</sub> × √2', value: `${Vmax.toFixed(2)} V` },
            { label: 'Current RMS', formula: 'I<sub>rms</sub> = V<sub>rms</sub> / Z', value: `${Irms.toFixed(3)} A` },
            { label: 'Current Peak', formula: 'I<sub>max</sub> = I<sub>rms</sub> × √2', value: `${Imax.toFixed(3)} A` },
            { label: 'Impedance', formula: 'Z = √(R² + X²)', value: `${Z.toFixed(2)} Ω` },
            { label: 'Inductive Reactance', formula: 'X<sub>L</sub> = ωL = 2πfL', value: `${XL.toFixed(2)} Ω` },
            { label: 'Capacitive Reactance', formula: 'X<sub>C</sub> = 1/(ωC) = 1/(2πfC)', value: `${XC.toFixed(2)} Ω` },
            { label: 'Phase Angle', formula: 'φ = tan⁻¹(X/R)', value: `${φ.toFixed(2)}°` },
            { label: 'Real Power', formula: 'P = I<sub>rms</sub>² × R', value: `${P.toFixed(2)} W` },
            { label: 'Reactive Power', formula: 'Q = I<sub>rms</sub>² × |X|', value: `${Q.toFixed(2)} VAR` },
            { label: 'Apparent Power', formula: 'S = V<sub>rms</sub> × I<sub>rms</sub>', value: `${S.toFixed(2)} VA` },
            { label: 'Power Factor', formula: 'PF = P / S = cos(φ)', value: `${(P / S).toFixed(3)}` },
            { label: 'Resonant Frequency', formula: 'f<sub>r</sub> = 1/(2π√(LC))', value: `${fr.toFixed(2)} Hz` }
        ];
    }

    displayResults() {
        const resultsGrid = document.getElementById('resultsGrid');
        resultsGrid.innerHTML = '';

        // Results is now an array of objects with label, value, and formula
        this.results.forEach((result, index) => {
            const resultCard = document.createElement('div');
            resultCard.className = 'result-card';
            resultCard.style.animationDelay = `${index * 0.05}s`;
            resultCard.innerHTML = `
                <div class="result-card-header">
                    <span class="result-label">${result.label}</span>
                </div>
                <div class="result-formula">${result.formula}</div>
                <div class="result-value">${result.value}</div>
            `;
            resultsGrid.appendChild(resultCard);
        });
    }

    // Canvas and Animation
    setupCanvas() {
        this.canvas = document.getElementById('waveformCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.canvasWidth = rect.width;
        this.canvasHeight = rect.height;
    }

    startAnimation() {
        this.isAnimating = true;
        this.updatePlayPauseButton();
        this.animate();
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        this.updatePlayPauseButton();
        if (this.isAnimating) {
            this.animate();
        }
    }

    resetAnimation() {
        this.time = 0;
        this.clearCanvas();
    }

    updatePlayPauseButton() {
        const btn = document.getElementById('playPauseBtn');
        btn.innerHTML = this.isAnimating
            ? '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><rect x="5" y="3" width="3" height="14"/><rect x="12" y="3" width="3" height="14"/></svg>'
            : '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3l12 7-12 7V3z"/></svg>';
    }

    animate() {
        if (!this.isAnimating) return;

        this.clearCanvas();
        this.drawWaveforms();
        this.time += 0.02;

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    clearCanvas() {
        this.ctx.fillStyle = '#1a1a35';
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawGrid();
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;

        // Horizontal lines
        for (let y = 0; y < this.canvasHeight; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvasWidth, y);
            this.ctx.stroke();
        }

        // Vertical lines
        for (let x = 0; x < this.canvasWidth; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvasHeight);
            this.ctx.stroke();
        }

        // Draw X-axis (horizontal through center)
        const centerY = this.canvasHeight / 2;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, centerY);
        this.ctx.lineTo(this.canvasWidth, centerY);
        this.ctx.stroke();

        // X-axis arrow
        const arrowSize = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvasWidth - arrowSize, centerY - arrowSize / 2);
        this.ctx.lineTo(this.canvasWidth, centerY);
        this.ctx.lineTo(this.canvasWidth - arrowSize, centerY + arrowSize / 2);
        this.ctx.stroke();

        // X-axis label
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.font = '12px Inter';
        this.ctx.textAlign = 'right';
        this.ctx.fillText('t (time)', this.canvasWidth - 15, centerY - 10);

        // Draw Y-axis (vertical on left)
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(30, 0);
        this.ctx.lineTo(30, this.canvasHeight);
        this.ctx.stroke();

        // Y-axis arrow (up)
        this.ctx.beginPath();
        this.ctx.moveTo(30 - arrowSize / 2, arrowSize);
        this.ctx.lineTo(30, 0);
        this.ctx.lineTo(30 + arrowSize / 2, arrowSize);
        this.ctx.stroke();

        // Y-axis label
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.font = '12px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('V, I, P', 30, 25);
    }

    drawWaveforms() {
        const { f } = this.parameters;
        if (!f) return;

        const ω = 2 * Math.PI * f;
        const amplitude = this.canvasHeight / 3.5;
        const centerY = this.canvasHeight / 2;

        // Calculate phase angle (phase of current relative to voltage)
        let phase = 0;
        if (this.currentCircuitType === 'L') {
            // Pure inductive: current LAGS voltage by 90°
            phase = -Math.PI / 2;
        } else if (this.currentCircuitType === 'C') {
            // Pure capacitive: current LEADS voltage by 90°
            phase = Math.PI / 2;
        } else if (this.currentCircuitType === 'RL' || this.currentCircuitType === 'RC' || this.currentCircuitType === 'RLC') {
            const { R, L, C } = this.parameters;
            const XL = ω * (L || 0);
            const XC = C ? 1 / (ω * C) : 0;
            const X = XL - XC;
            // φ = atan(X/R)
            // If X > 0 (inductive): current lags, negative phase
            // If X < 0 (capacitive): current leads, positive phase
            phase = -Math.atan(X / R);
        }

        // Draw axis labels (0, π, 2π)
        this.drawAxisLabels();

        // Draw voltage waveform
        this.drawWave(amplitude, centerY, ω, 0, 'voltage');

        // Draw current waveform
        this.drawWave(amplitude * 0.8, centerY, ω, phase, 'current');

        // Draw power waveform (instantaneous power = v(t) × i(t))
        this.drawPowerWaveform(amplitude, centerY, ω, phase);

        // Draw phase difference indicator
        if (phase !== 0) {
            this.drawPhaseIndicator(phase);
        }
    }

    drawAxisLabels() {
        this.ctx.font = '14px Inter';
        this.ctx.fillStyle = '#a8a8c8';
        this.ctx.textAlign = 'center';

        // We show 2 complete cycles (0 to 4π), so labels at 0, π, 2π, 3π, 4π
        const labels = [
            { text: '0', position: 0 },
            { text: 'π', position: 0.25 },
            { text: '2π', position: 0.5 },
            { text: '3π', position: 0.75 },
            { text: '4π', position: 1 }
        ];

        labels.forEach(label => {
            const x = label.position * this.canvasWidth;
            const y = this.canvasHeight - 10;

            // Draw vertical marker line
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 20);
            this.ctx.lineTo(x, this.canvasHeight - 25);
            this.ctx.stroke();

            // Draw label
            this.ctx.fillText(label.text, x, y);
        });
    }

    drawPowerWaveform(amplitude, centerY, ω, phase) {
        const powerFactor = Math.cos(phase);

        // Draw instantaneous power waveform p(t) = v(t) × i(t)
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvasWidth, 0);
        gradient.addColorStop(0, '#43e97b');
        gradient.addColorStop(1, '#38f9d7');

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();

        for (let x = 0; x < this.canvasWidth; x++) {
            const t = (x / this.canvasWidth) * 4 * Math.PI - this.time;

            // Instantaneous values
            const v = Math.sin(t);
            const i = Math.sin(t + phase);

            // Instantaneous power
            const p = v * i;

            const y = centerY - (amplitude * 0.35 * p);

            if (x === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }

        this.ctx.stroke();
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#43e97b';
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;

        // Draw average power line (constant)
        // P_avg = (1/2) × cos(φ) in normalized form
        const avgPowerNorm = powerFactor / 2;
        const yAvg = centerY - (amplitude * 0.35 * avgPowerNorm);

        this.ctx.strokeStyle = '#ffa500';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([8, 4]);

        this.ctx.beginPath();
        this.ctx.moveTo(0, yAvg);
        this.ctx.lineTo(this.canvasWidth, yAvg);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Label
        this.ctx.fillStyle = '#ffa500';
        this.ctx.font = 'bold 11px Inter';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`P_avg (PF=${powerFactor.toFixed(2)})`, this.canvasWidth - 10, yAvg - 8);
    }

    drawWave(amplitude, centerY, ω, phase, type) {
        const colors = {
            voltage: { start: '#667eea', end: '#764ba2' },
            current: { start: '#f093fb', end: '#f5576c' }
        };

        const gradient = this.ctx.createLinearGradient(0, 0, this.canvasWidth, 0);
        gradient.addColorStop(0, colors[type].start);
        gradient.addColorStop(1, colors[type].end);

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();

        for (let x = 0; x < this.canvasWidth; x++) {
            const t = (x / this.canvasWidth) * 4 * Math.PI - this.time;
            const y = centerY - amplitude * Math.sin(t + phase);

            if (x === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }

        this.ctx.stroke();

        // Add glow effect
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = colors[type].start;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }

    drawPhaseIndicator(phase) {
        const phaseDegrees = (phase * 180 / Math.PI).toFixed(1);
        const text = `Phase Difference: ${phaseDegrees}°`;

        this.ctx.fillStyle = 'rgba(79, 172, 254, 0.2)';
        this.ctx.fillRect(this.canvasWidth - 220, 20, 200, 40);

        this.ctx.fillStyle = '#4facfe';
        this.ctx.font = '14px Inter';
        this.ctx.fillText(text, this.canvasWidth - 210, 45);
    }

    // Circuit Diagram Drawing
    drawCircuitDiagram() {
        const container = document.getElementById('circuitDiagram');
        container.innerHTML = '';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 700 350');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');

        const components = this.getCircuitComponents();

        // Circuit layout - creating a proper rectangular closed loop
        const leftX = 100;      // Left edge (voltage source position)
        const rightX = 600;     // Right edge
        const topY = 100;       // Top edge
        const bottomY = 250;    // Bottom edge
        const centerY = (topY + bottomY) / 2;

        // Each component has ±50 wire length (total 100px width)
        const componentWidth = 100;

        // Calculate spacing between component centers
        // If we have N components, we need space for N components plus gaps
        const availableWidth = rightX - leftX - 100; // Leave 100px for voltage source area
        const componentSpacing = components.length > 0 ?
            Math.max(componentWidth, availableWidth / (components.length + 1)) :
            100;

        // Draw voltage source on the left side
        this.drawVoltageSource(svg, leftX, centerY);

        // Top wire from voltage source (top of circle at centerY - 30) to top rail
        this.drawWire(svg, leftX, centerY - 30, leftX, topY);

        // Starting position for first component
        const firstComponentX = leftX + componentSpacing;

        // Wire from left edge to first component's left wire (which extends 50px left from center)
        this.drawWire(svg, leftX, topY, firstComponentX - 50, topY);

        // Draw all components with connecting wires between them
        components.forEach((component, index) => {
            const componentX = firstComponentX + (index * componentSpacing);
            this.drawComponent(svg, component, componentX, topY);

            // Draw connecting wire to next component (if not the last one)
            if (index < components.length - 1) {
                const nextComponentX = firstComponentX + ((index + 1) * componentSpacing);
                // Wire from this component's right end (+50) to next component's left end (-50)
                this.drawWire(svg, componentX + 50, topY, nextComponentX - 50, topY);
            }
        });

        // Wire from last component's right wire (extends 50px right from center) to right edge
        const lastComponentX = firstComponentX + ((components.length - 1) * componentSpacing);
        this.drawWire(svg, lastComponentX + 50, topY, rightX, topY);

        // Right vertical wire down
        this.drawWire(svg, rightX, topY, rightX, bottomY);

        // Bottom horizontal wire back
        this.drawWire(svg, rightX, bottomY, leftX, bottomY);

        // Left vertical wire back to voltage source (bottom of circle at centerY + 30)
        this.drawWire(svg, leftX, bottomY, leftX, centerY + 30);

        container.appendChild(svg);
    }

    getCircuitComponents() {
        const type = this.currentCircuitType;
        const components = [];

        if (type.includes('R')) components.push('R');
        if (type.includes('L')) components.push('L');
        if (type.includes('C')) components.push('C');

        return components;
    }

    drawVoltageSource(svg, x, y) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 30);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', '#667eea');
        circle.setAttribute('stroke-width', 2);
        svg.appendChild(circle);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#667eea');
        text.setAttribute('font-size', '20');
        text.setAttribute('font-weight', 'bold');
        text.textContent = 'V';
        svg.appendChild(text);
    }

    drawComponent(svg, type, x, y) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        switch (type) {
            case 'R':
                this.drawResistor(group, x, y);
                break;
            case 'L':
                this.drawInductor(group, x, y);
                break;
            case 'C':
                this.drawCapacitor(group, x, y);
                break;
        }

        svg.appendChild(group);
    }

    drawResistor(group, x, y) {
        // Left connection wire
        const leftWire = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftWire.setAttribute('x1', x - 50);
        leftWire.setAttribute('y1', y);
        leftWire.setAttribute('x2', x - 30);
        leftWire.setAttribute('y2', y);
        leftWire.setAttribute('stroke', '#a8a8c8');
        leftWire.setAttribute('stroke-width', 2);
        group.appendChild(leftWire);

        // Zigzag resistor pattern
        const zigzagPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const zigzagPoints = [
            [x - 30, y],
            [x - 25, y - 10],
            [x - 15, y + 10],
            [x - 5, y - 10],
            [x + 5, y + 10],
            [x + 15, y - 10],
            [x + 25, y + 10],
            [x + 30, y]
        ];
        let pathD = `M ${zigzagPoints[0][0]} ${zigzagPoints[0][1]}`;
        for (let i = 1; i < zigzagPoints.length; i++) {
            pathD += ` L ${zigzagPoints[i][0]} ${zigzagPoints[i][1]}`;
        }
        zigzagPath.setAttribute('d', pathD);
        zigzagPath.setAttribute('fill', 'none');
        zigzagPath.setAttribute('stroke', '#f5576c');
        zigzagPath.setAttribute('stroke-width', 2);
        zigzagPath.setAttribute('stroke-linejoin', 'miter');
        group.appendChild(zigzagPath);

        // Right connection wire
        const rightWire = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightWire.setAttribute('x1', x + 30);
        rightWire.setAttribute('y1', y);
        rightWire.setAttribute('x2', x + 50);
        rightWire.setAttribute('y2', y);
        rightWire.setAttribute('stroke', '#a8a8c8');
        rightWire.setAttribute('stroke-width', 2);
        group.appendChild(rightWire);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y - 25);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#f5576c');
        text.setAttribute('font-size', '18');
        text.setAttribute('font-weight', 'bold');
        text.textContent = 'R';
        group.appendChild(text);
    }

    drawInductor(group, x, y) {
        // Left connection wire
        const leftWire = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftWire.setAttribute('x1', x - 50);
        leftWire.setAttribute('y1', y);
        leftWire.setAttribute('x2', x - 30);
        leftWire.setAttribute('y2', y);
        leftWire.setAttribute('stroke', '#a8a8c8');
        leftWire.setAttribute('stroke-width', 2);
        group.appendChild(leftWire);

        // Helix coil - draw 5 loops
        const numLoops = 5;
        const loopWidth = 12;
        const loopHeight = 15;

        let path = `M ${x - 30} ${y}`;

        for (let i = 0; i < numLoops; i++) {
            const startX = x - 30 + (i * loopWidth);
            // Arc going up and over
            path += ` A ${loopWidth / 2} ${loopHeight} 0 0 1 ${startX + loopWidth} ${y}`;
        }

        const coil = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        coil.setAttribute('d', path);
        coil.setAttribute('fill', 'none');
        coil.setAttribute('stroke', '#43e97b');
        coil.setAttribute('stroke-width', 2.5);
        group.appendChild(coil);

        // Right connection wire
        const rightWire = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightWire.setAttribute('x1', x + 30);
        rightWire.setAttribute('y1', y);
        rightWire.setAttribute('x2', x + 50);
        rightWire.setAttribute('y2', y);
        rightWire.setAttribute('stroke', '#a8a8c8');
        rightWire.setAttribute('stroke-width', 2);
        group.appendChild(rightWire);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y - 25);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#43e97b');
        text.setAttribute('font-size', '18');
        text.setAttribute('font-weight', 'bold');
        text.textContent = 'L';
        group.appendChild(text);
    }

    drawCapacitor(group, x, y) {
        // Left connection wire
        const leftWire = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftWire.setAttribute('x1', x - 50);
        leftWire.setAttribute('y1', y);
        leftWire.setAttribute('x2', x - 5);
        leftWire.setAttribute('y2', y);
        leftWire.setAttribute('stroke', '#a8a8c8');
        leftWire.setAttribute('stroke-width', 2);
        group.appendChild(leftWire);

        // Capacitor plates
        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', x - 5);
        line1.setAttribute('y1', y - 20);
        line1.setAttribute('x2', x - 5);
        line1.setAttribute('y2', y + 20);
        line1.setAttribute('stroke', '#4facfe');
        line1.setAttribute('stroke-width', 3);
        group.appendChild(line1);

        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line2.setAttribute('x1', x + 5);
        line2.setAttribute('y1', y - 20);
        line2.setAttribute('x2', x + 5);
        line2.setAttribute('y2', y + 20);
        line2.setAttribute('stroke', '#4facfe');
        line2.setAttribute('stroke-width', 3);
        group.appendChild(line2);

        // Right connection wire
        const rightWire = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightWire.setAttribute('x1', x + 5);
        rightWire.setAttribute('y1', y);
        rightWire.setAttribute('x2', x + 50);
        rightWire.setAttribute('y2', y);
        rightWire.setAttribute('stroke', '#a8a8c8');
        rightWire.setAttribute('stroke-width', 2);
        group.appendChild(rightWire);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y - 30);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#4facfe');
        text.setAttribute('font-size', '18');
        text.setAttribute('font-weight', 'bold');
        text.textContent = 'C';
        group.appendChild(text);
    }

    drawWire(svg, x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#a8a8c8');
        line.setAttribute('stroke-width', 2);
        svg.appendChild(line);
    }
}

// Initialize the simulator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.simulator = new CircuitSimulator();
});
