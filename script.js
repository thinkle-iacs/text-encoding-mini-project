// Sample texts for auto-insertion
const sampleTexts = {
    shakespeare: `Shall I compare thee to a summer's day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer's lease hath all too short a date:
Sometime too hot the eye of heaven shines,
And often is his gold complexion dimm'd;
And every fair from fair sometime declines,
By chance or nature's changing course untrimm'd;
But thy eternal summer shall not fade
Nor lose possession of that fair thou owest;
Nor shall Death brag thou wander'st in his shade,
When in eternal lines to time thou growest:
So long as men can breathe or eyes can see,
So long lives this and this gives life to thee.`,
    
    lorem: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    
    alphabet: `ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz`,
    
    numbers: `0123456789 1234567890 The quick brown fox jumps over the lazy dog!`
};

// Encoding and decoding functions
const encoders = {
    base64: {
        encode: (text) => {
            // Use TextEncoder for proper UTF-8 encoding
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const binaryString = Array.from(data, byte => String.fromCharCode(byte)).join('');
            return btoa(binaryString);
        },
        decode: (text) => {
            try {
                // Use TextDecoder for proper UTF-8 decoding
                const binaryString = atob(text);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const decoder = new TextDecoder();
                return decoder.decode(bytes);
            } catch (e) {
                throw new Error('Invalid Base64 string');
            }
        }
    },
    
    hex: {
        encode: (text) => {
            let result = '';
            for (let i = 0; i < text.length; i++) {
                result += text.charCodeAt(i).toString(16).padStart(2, '0');
            }
            return result;
        },
        decode: (text) => {
            try {
                let result = '';
                for (let i = 0; i < text.length; i += 2) {
                    result += String.fromCharCode(parseInt(text.substring(i, i + 2), 16));
                }
                return result;
            } catch (e) {
                throw new Error('Invalid Hexadecimal string');
            }
        }
    },
    
    binary: {
        encode: (text) => {
            let result = '';
            for (let i = 0; i < text.length; i++) {
                result += text.charCodeAt(i).toString(2).padStart(8, '0') + ' ';
            }
            return result.trim();
        },
        decode: (text) => {
            try {
                const bytes = text.split(' ');
                let result = '';
                for (let byte of bytes) {
                    if (byte) {
                        result += String.fromCharCode(parseInt(byte, 2));
                    }
                }
                return result;
            } catch (e) {
                throw new Error('Invalid Binary string');
            }
        }
    },
    
    url: {
        encode: (text) => encodeURIComponent(text),
        decode: (text) => {
            try {
                return decodeURIComponent(text);
            } catch (e) {
                throw new Error('Invalid URL encoded string');
            }
        }
    },
    
    rot13: {
        encode: (text) => {
            return text.replace(/[a-zA-Z]/g, (char) => {
                const start = char <= 'Z' ? 65 : 97;
                return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
            });
        },
        decode: (text) => {
            // ROT13 is its own inverse
            return encoders.rot13.encode(text);
        }
    }
};

// DOM elements
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const inputCharCount = document.getElementById('inputCharCount');
const outputCharCount = document.getElementById('outputCharCount');
const schemeSelect = document.getElementById('schemeSelect');
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');
const insertButtons = document.querySelectorAll('.insert-btn');

// Update character count
function updateCharCount() {
    inputCharCount.textContent = inputText.value.length;
    outputCharCount.textContent = outputText.value.length;
}

// Insert sample text
insertButtons.forEach(button => {
    button.addEventListener('click', () => {
        const textType = button.getAttribute('data-text');
        inputText.value = sampleTexts[textType];
        updateCharCount();
    });
});

// Encode button
encodeBtn.addEventListener('click', () => {
    const scheme = schemeSelect.value;
    const input = inputText.value;
    
    if (!input) {
        alert('Please enter some text to encode');
        return;
    }
    
    try {
        outputText.value = encoders[scheme].encode(input);
        updateCharCount();
    } catch (error) {
        alert('Encoding error: ' + error.message);
    }
});

// Decode button
decodeBtn.addEventListener('click', () => {
    const scheme = schemeSelect.value;
    const input = inputText.value;
    
    if (!input) {
        alert('Please enter some text to decode');
        return;
    }
    
    try {
        outputText.value = encoders[scheme].decode(input);
        updateCharCount();
    } catch (error) {
        alert('Decoding error: ' + error.message);
    }
});

// Update character count on input
inputText.addEventListener('input', updateCharCount);

// Initialize
updateCharCount();
