document.getElementById('upload').addEventListener('change', handleImageUpload);
document.getElementById('applyButton').addEventListener('click', applyWatermarkAndDisplay);
document.getElementById('extractButton').addEventListener('click', extractWatermark);

let originalImageData;

function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            originalImageData = context.getImageData(0, 0, img.width, img.height);
            const watermarkedImg = document.getElementById('watermarkedImage');
            watermarkedImg.src = canvas.toDataURL();
            watermarkedImg.style.display = 'block';
            document.getElementById('applyButton').style.display = 'inline';
            document.getElementById('extractButton').style.display = 'inline';
        }
        img.src = e.target.result;
    }
    
    reader.readAsDataURL(file);
}

function applyWatermarkAndDisplay() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    applyWatermark(context, canvas.width, canvas.height);
    const watermarkedImg = document.getElementById('watermarkedImage');
    watermarkedImg.src = canvas.toDataURL();
}

function applyWatermark(context, width, height) {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        if (i % 8 === 0) {
            if (data[i] % 2 === 0) {
                data[i] = data[i] | 1;
            } else {
                data[i] = data[i] & ~1;
            }
        }
    }
    
    context.putImageData(imageData, 0, 0);
}

function extractWatermark() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    const watermarkCanvas = document.getElementById('watermarkCanvas');
    const watermarkContext = watermarkCanvas.getContext('2d');
    watermarkCanvas.width = width;
    watermarkCanvas.height = height;
    const watermarkData = watermarkContext.createImageData(width, height);
    
    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const watermarkBit = (i % 8 === 0) ? (red & 1) : 0;
        watermarkData.data[i] = watermarkBit * 255; // R
        watermarkData.data[i + 1] = watermarkBit * 255; // G
        watermarkData.data[i + 2] = watermarkBit * 255; // B
        watermarkData.data[i + 3] = 255; // A
    }

    watermarkContext.putImageData(watermarkData, 0, 0);
    const extractedWatermark = document.getElementById('extractedWatermark');
    extractedWatermark.src = watermarkCanvas.toDataURL();
    extractedWatermark.style.display = 'block';
}
