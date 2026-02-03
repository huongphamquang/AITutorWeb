// ===== AI Tutor Web App =====
// Main Application Logic

class AITutorApp {
    constructor() {
        this.currentImage = null;
        this.currentImageData = null;
        this.currentResult = null;
        this.selectedGrade = '5';
        this.selectedProvider = 'gemini';

        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.checkServiceWorker();
    }

    // ===== Event Listeners =====
    setupEventListeners() {
        // Image upload
        const imageUploadArea = document.getElementById('imageUploadArea');
        const imageInput = document.getElementById('imageInput');

        imageUploadArea.addEventListener('click', (e) => {
            if (!e.target.closest('.remove-image-btn')) {
                // Ensure no capture attribute when clicking the main area
                imageInput.removeAttribute('capture');
                // Small delay to ensure state is clear
                setTimeout(() => {
                    imageInput.click();
                }, 50);
            }
        });

        imageInput.addEventListener('change', (e) => {
            this.handleImageSelect(e);
            imageInput.removeAttribute('capture');
        });

        // Grade selection
        document.getElementById('gradeSelect').addEventListener('change', (e) => {
            this.selectedGrade = e.target.value;
            this.saveSettings();
        });

        // Provider toggle
        document.querySelectorAll('.provider-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.provider-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.selectedProvider = e.target.dataset.provider;
                this.saveSettings();
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSettings();
            }
        });
    }

    // ===== Image Handling =====
    handleImageSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showError('Vui lòng chọn file ảnh!');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImageData = e.target.result;
            this.displayImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    displayImage(imageData) {
        const previewImage = document.getElementById('previewImage');
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        const removeBtn = document.getElementById('removeImageBtn');
        const promptSection = document.getElementById('promptSection');
        const solveBtn = document.getElementById('solveBtn');

        previewImage.src = imageData;
        previewImage.style.display = 'block';
        uploadPlaceholder.style.display = 'none';
        removeBtn.style.display = 'flex';
        promptSection.style.display = 'block';
        solveBtn.disabled = false;
    }

    removeImage() {
        const previewImage = document.getElementById('previewImage');
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        const removeBtn = document.getElementById('removeImageBtn');
        const promptSection = document.getElementById('promptSection');
        const solveBtn = document.getElementById('solveBtn');
        const imageInput = document.getElementById('imageInput');
        const initialPrompt = document.getElementById('initialPrompt');

        previewImage.style.display = 'none';
        uploadPlaceholder.style.display = 'block';
        removeBtn.style.display = 'none';
        promptSection.style.display = 'none';
        solveBtn.disabled = true;
        imageInput.value = '';
        initialPrompt.value = '';
        this.currentImageData = null;
    }

    openCamera() {
        const imageInput = document.getElementById('imageInput');
        imageInput.setAttribute('capture', 'environment');
        setTimeout(() => {
            imageInput.click();
        }, 50);
    }

    // ===== AI Processing =====
    async solveImage() {
        if (!this.currentImageData) {
            this.showError('Vui lòng chọn ảnh trước!');
            return;
        }

        // Check API Key
        const apiKey = this.selectedProvider === 'gemini'
            ? localStorage.getItem('geminiApiKey')
            : localStorage.getItem('openaiApiKey');

        if (!apiKey) {
            this.showSettings();
            this.showError('Vui lòng nhập API Key trong phần Cài đặt!');
            return;
        }

        const initialPrompt = document.getElementById('initialPrompt').value;

        this.setLoading(true);
        this.hideError();

        try {
            let result;
            if (this.selectedProvider === 'gemini') {
                result = await this.analyzeWithGemini(this.currentImageData, initialPrompt);
            } else {
                result = await this.analyzeWithChatGPT(this.currentImageData, initialPrompt);
            }

            if (result) {
                this.currentResult = result;
                this.displayResult(result);
                this.showResultScreen();
            }
        } catch (error) {
            this.showError(`Lỗi: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }

    async analyzeWithGemini(imageData, customPrompt = '') {
        const apiKey = localStorage.getItem('geminiApiKey');

        let prompt = `Bạn là một gia sư AI cho học sinh Lớp ${this.selectedGrade}.
Phân tích hình ảnh này.
1. Nếu có bài toán (Toán, Lý, Hóa): Giải chi tiết từng bước bằng Tiếng Việt, phù hợp với trình độ Lớp ${this.selectedGrade}. Sử dụng định dạng của 'math_problems'.
2. Nếu có tiếng Anh: Trích xuất từ vựng, cung cấp nghĩa Tiếng Việt và câu ví dụ phù hợp.

QUAN TRỌNG: Nếu là bài toán hình học, BẮT BUỘC phải tạo dữ liệu vẽ hình mô tả bài toán trong trường 'drawing'. Không được bỏ qua.`;

        if (customPrompt) {
            prompt += `\n\nYÊU CẦU BỔ SUNG CỦA NGƯỜI DÙNG: ${customPrompt}\nHãy điều chỉnh lời giải dựa trên yêu cầu này.`;
        }

        prompt += `

Trả về kết quả dưới dạng JSON theo định dạng sau:
{
    "subject": "math" hoặc "english",
    "math_problems": [
        {
            "question": "Tóm tắt câu hỏi",
            "steps": ["Bước 1...", "Bước 2..."],
            "answer": "Đáp án cuối cùng",
            "drawing": [ // Nếu là bài toán hình học (hình thang, tam giác, đường tròn...), hãy tạo dữ liệu vẽ. Hệ tọa độ 100x100.
                {
                    "type": "line" | "polygon" | "circle" | "text" | "point",
                    "points": [[x1, y1], [x2, y2]], // Cho line và polygon
                    "center": [x, y], // Cho circle và text
                    "radius": double, // Cho circle
                    "text": "Label", // Cho text element (tên đỉnh, độ dài...)
                    "label": "A" // Cho point
                }
            ]
        }
    ],
    "english_words": [
        {
            "word": "Word",
            "translation": "Nghĩa Tiếng Việt",
            "example": "Câu ví dụ."
        }
    ]
}`;

        // Convert base64 to blob for Gemini API
        const base64Data = imageData.split(',')[1];

        const requestBody = {
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: base64Data
                        }
                    }
                ]
            }],
            generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                topK: 40
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Gemini API error');
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;

        return this.parseJSONResponse(text);
    }

    async analyzeWithChatGPT(imageData, customPrompt = '') {
        const apiKey = localStorage.getItem('openaiApiKey');

        let prompt = `Bạn là một gia sư AI cho học sinh Lớp ${this.selectedGrade}.
Phân tích hình ảnh này.
1. Nếu có bài toán (Toán, Lý, Hóa): Giải chi tiết từng bước bằng Tiếng Việt, phù hợp với trình độ Lớp ${this.selectedGrade}.
2. Nếu có tiếng Anh: Trích xuất từ vựng, cung cấp nghĩa Tiếng Việt và câu ví dụ phù hợp.

QUAN TRỌNG: Nếu là bài toán hình học, BẮT BUỘC phải tạo dữ liệu vẽ hình.`;

        if (customPrompt) {
            prompt += `\n\nYÊU CẦU BỔ SUNG: ${customPrompt}`;
        }

        prompt += `\n\nTrả về JSON với format: {"subject": "math"|"english", "math_problems": [...], "english_words": [...]}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: prompt },
                            { type: 'image_url', image_url: { url: imageData } }
                        ]
                    }
                ],
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API error');
        }

        const data = await response.json();
        const text = data.choices[0].message.content;

        return this.parseJSONResponse(text);
    }

    parseJSONResponse(text) {
        // Clean JSON from markdown code blocks
        let cleaned = text.trim();
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith('```')) {
            cleaned = cleaned.substring(0, cleaned.length - 3);
        }
        cleaned = cleaned.trim();

        try {
            return JSON.parse(cleaned);
        } catch (error) {
            throw new Error('Không thể phân tích kết quả từ AI. Vui lòng thử lại!');
        }
    }

    // ===== Result Display =====
    displayResult(result) {
        const resultContent = document.getElementById('resultContent');
        resultContent.innerHTML = '';

        if (result.math_problems && result.math_problems.length > 0) {
            result.math_problems.forEach(problem => {
                resultContent.appendChild(this.createMathProblemCard(problem));
            });
        }

        if (result.english_words && result.english_words.length > 0) {
            result.english_words.forEach(word => {
                resultContent.appendChild(this.createEnglishWordCard(word));
            });
        }

        // Clear feedback input
        document.getElementById('feedbackInput').value = '';
    }

    createMathProblemCard(problem) {
        const card = document.createElement('div');
        card.className = 'math-problem';

        let html = `
            <h3>Câu hỏi:</h3>
            <p class="question">${this.escapeHtml(problem.question)}</p>
        `;

        // Add geometry drawing if available
        if (problem.drawing && problem.drawing.length > 0) {
            const canvasId = 'canvas-' + Math.random().toString(36).substr(2, 9);
            html += `<canvas id="${canvasId}" class="geometry-canvas"></canvas>`;

            // Draw after DOM insertion
            setTimeout(() => {
                this.drawGeometry(canvasId, problem.drawing);
            }, 100);
        }

        html += `<div class="steps"><h3>Các bước giải:</h3>`;
        problem.steps.forEach(step => {
            html += `
                <div class="step">
                    <span class="step-icon">➤</span>
                    <span class="step-text">${this.escapeHtml(step)}</span>
                </div>
            `;
        });
        html += `</div>`;

        html += `
            <div class="answer">
                <span class="answer-label">Đáp án:</span>
                <span class="answer-value">${this.escapeHtml(problem.answer)}</span>
            </div>
        `;

        card.innerHTML = html;
        return card;
    }

    createEnglishWordCard(word) {
        const card = document.createElement('div');
        card.className = 'english-word';

        card.innerHTML = `
            <div class="word-header">
                <div class="word-info">
                    <h3>${this.escapeHtml(word.word)}</h3>
                    <p class="word-translation">${this.escapeHtml(word.translation)}</p>
                </div>
                <button class="speak-btn" onclick="app.speak('${this.escapeHtml(word.word)}')">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                </button>
            </div>
            <p class="word-example">"${this.escapeHtml(word.example)}"</p>
        `;

        return card;
    }

    drawGeometry(canvasId, elements) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;

        canvas.width = width;
        canvas.height = height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Set styles
        ctx.strokeStyle = '#4A5568';
        ctx.fillStyle = '#4A5568';
        ctx.lineWidth = 2;
        ctx.font = '14px Inter, sans-serif';

        // Scale from 100x100 coordinate system
        const scaleX = width / 100;
        const scaleY = height / 100;

        elements.forEach(element => {
            switch (element.type) {
                case 'line':
                    if (element.points && element.points.length >= 2) {
                        ctx.beginPath();
                        ctx.moveTo(element.points[0][0] * scaleX, element.points[0][1] * scaleY);
                        ctx.lineTo(element.points[1][0] * scaleX, element.points[1][1] * scaleY);
                        ctx.stroke();
                    }
                    break;

                case 'polygon':
                    if (element.points && element.points.length >= 3) {
                        ctx.beginPath();
                        ctx.moveTo(element.points[0][0] * scaleX, element.points[0][1] * scaleY);
                        for (let i = 1; i < element.points.length; i++) {
                            ctx.lineTo(element.points[i][0] * scaleX, element.points[i][1] * scaleY);
                        }
                        ctx.closePath();
                        ctx.stroke();
                    }
                    break;

                case 'circle':
                    if (element.center && element.radius) {
                        ctx.beginPath();
                        ctx.arc(
                            element.center[0] * scaleX,
                            element.center[1] * scaleY,
                            element.radius * Math.min(scaleX, scaleY),
                            0,
                            2 * Math.PI
                        );
                        ctx.stroke();
                    }
                    break;

                case 'text':
                    if (element.center && element.text) {
                        ctx.fillText(
                            element.text,
                            element.center[0] * scaleX,
                            element.center[1] * scaleY
                        );
                    }
                    break;

                case 'point':
                    if (element.center) {
                        ctx.beginPath();
                        ctx.arc(
                            element.center[0] * scaleX,
                            element.center[1] * scaleY,
                            3,
                            0,
                            2 * Math.PI
                        );
                        ctx.fill();

                        if (element.label) {
                            ctx.fillText(
                                element.label,
                                element.center[0] * scaleX + 8,
                                element.center[1] * scaleY - 8
                            );
                        }
                    }
                    break;
            }
        });
    }

    // ===== Text-to-Speech =====
    speak(text) {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            utterance.pitch = 1;

            window.speechSynthesis.speak(utterance);
        } else {
            this.showError('Trình duyệt không hỗ trợ Text-to-Speech!');
        }
    }

    // ===== Feedback =====
    async submitFeedback() {
        const feedbackInput = document.getElementById('feedbackInput');
        const feedback = feedbackInput.value.trim();

        if (!feedback) return;

        if (!this.currentImageData) {
            this.showError('Không tìm thấy ảnh gốc!');
            return;
        }

        this.setFeedbackLoading(true);

        try {
            let result;
            if (this.selectedProvider === 'gemini') {
                result = await this.analyzeWithGemini(this.currentImageData, feedback);
            } else {
                result = await this.analyzeWithChatGPT(this.currentImageData, feedback);
            }

            if (result) {
                this.currentResult = result;
                this.displayResult(result);
                feedbackInput.value = '';
            }
        } catch (error) {
            this.showError(`Lỗi: ${error.message}`);
        } finally {
            this.setFeedbackLoading(false);
        }
    }

    // ===== Navigation =====
    showMainScreen() {
        document.getElementById('mainScreen').classList.add('active');
        document.getElementById('resultScreen').classList.remove('active');
    }

    showResultScreen() {
        document.getElementById('mainScreen').classList.remove('active');
        document.getElementById('resultScreen').classList.add('active');
    }

    // ===== Settings =====
    showSettings() {
        const modal = document.getElementById('settingsModal');
        modal.classList.add('active');

        // Load current keys
        document.getElementById('geminiKeyInput').value = localStorage.getItem('geminiApiKey') || '';
        document.getElementById('openaiKeyInput').value = localStorage.getItem('openaiApiKey') || '';
    }

    closeSettings() {
        document.getElementById('settingsModal').classList.remove('active');
    }

    saveApiKeys() {
        const geminiKey = document.getElementById('geminiKeyInput').value.trim();
        const openaiKey = document.getElementById('openaiKeyInput').value.trim();

        localStorage.setItem('geminiApiKey', geminiKey);
        localStorage.setItem('openaiApiKey', openaiKey);

        this.closeSettings();

        // Show success message
        const errorMsg = document.getElementById('errorMessage');
        errorMsg.textContent = '✓ Đã lưu API Keys thành công!';
        errorMsg.style.display = 'block';
        errorMsg.style.background = '#D4EDDA';
        errorMsg.style.color = '#155724';

        setTimeout(() => {
            errorMsg.style.display = 'none';
        }, 3000);
    }

    toggleKeyVisibility(inputId) {
        const input = document.getElementById(inputId);
        input.type = input.type === 'password' ? 'text' : 'password';
    }

    loadSettings() {
        const savedGrade = localStorage.getItem('selectedGrade');
        const savedProvider = localStorage.getItem('selectedProvider');

        if (savedGrade) {
            this.selectedGrade = savedGrade;
            document.getElementById('gradeSelect').value = savedGrade;
        }

        if (savedProvider) {
            this.selectedProvider = savedProvider;
            document.querySelectorAll('.provider-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.provider === savedProvider);
            });
        }
    }

    saveSettings() {
        localStorage.setItem('selectedGrade', this.selectedGrade);
        localStorage.setItem('selectedProvider', this.selectedProvider);
    }

    // ===== UI Helpers =====
    setLoading(isLoading) {
        const solveBtn = document.getElementById('solveBtn');
        const solveBtnText = document.getElementById('solveBtnText');

        if (isLoading) {
            solveBtn.classList.add('loading');
            solveBtn.disabled = true;
            solveBtnText.textContent = 'Đang xử lý...';
        } else {
            solveBtn.classList.remove('loading');
            solveBtn.disabled = !this.currentImageData;
            solveBtnText.textContent = 'Giải bài!';
        }
    }

    setFeedbackLoading(isLoading) {
        const feedbackBtn = document.getElementById('feedbackBtn');

        if (isLoading) {
            feedbackBtn.classList.add('loading');
            feedbackBtn.disabled = true;
        } else {
            feedbackBtn.classList.remove('loading');
            feedbackBtn.disabled = false;
        }
    }

    showError(message) {
        const errorMsg = document.getElementById('errorMessage');
        errorMsg.textContent = `Oops! ${message}`;
        errorMsg.style.display = 'block';
        errorMsg.style.background = '#FEE';
        errorMsg.style.color = '#C53030';
    }

    hideError() {
        document.getElementById('errorMessage').style.display = 'none';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===== Service Worker =====
    async checkServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('sw.js');
                console.log('Service Worker registered');
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }
}

// Initialize app
const app = new AITutorApp();
