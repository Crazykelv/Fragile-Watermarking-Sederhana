document.getElementById('uploadOriginal').addEventListener('change', handleOriginalImageUpload);
document.getElementById('applyButton').addEventListener('click', applyWatermarkAndDisplay);
document.getElementById('extractButton').addEventListener('click', extractWatermark);

let originalImageData, watermarkImageData;
let originalImageWidth, originalImageHeight;

function handleOriginalImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            originalImageWidth = img.width;
            originalImageHeight = img.height;
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
            document.getElementById('uploadWatermark').style.display = 'inline';
            document.getElementById('uploadWatermark').addEventListener('change', handleWatermarkImageUpload);
        }
        img.src = e.target.result;
    }
    
    reader.readAsDataURL(file);
}

function handleWatermarkImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = originalImageWidth;
            canvas.height = originalImageHeight;
            context.drawImage(img, 0, 0, originalImageWidth, originalImageHeight);
            watermarkImageData = context.getImageData(0, 0, originalImageWidth, originalImageHeight);
        }
        img.src = e.target.result;
    }
    
    reader.readAsDataURL(file);
}

function applyWatermarkAndDisplay() {
    if (!originalImageData || !watermarkImageData) {
        alert("Please upload both original and watermark images.");
        return;
    }
    
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const imageData = originalImageData;
    const watermarkData = watermarkImageData.data;
    
    for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = (imageData.data[i] & 0xFE) | ((watermarkData[i] & 0x80) >> 7);
        imageData.data[i + 1] = (imageData.data[i + 1] & 0xFE) | ((watermarkData[i + 1] & 0x80) >> 7);
        imageData.data[i + 2] = (imageData.data[i + 2] & 0xFE) | ((watermarkData[i + 2] & 0x80) >> 7);
    }
    
    context.putImageData(imageData, 0, 0);
    const watermarkedImg = document.getElementById('watermarkedImage');
    watermarkedImg.src = canvas.toDataURL();
    watermarkedImg.style.display = 'block';
}

function extractWatermark() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const watermarkCanvas = document.getElementById('watermarkCanvas');
    const watermarkContext = watermarkCanvas.getContext('2d');
    watermarkCanvas.width = canvas.width;
    watermarkCanvas.height = canvas.height;
    const watermarkData = watermarkContext.createImageData(canvas.width, canvas.height);
    
    for (let i = 0; i < data.length; i += 4) {
        watermarkData.data[i] = (data[i] & 1) ? 255 : 0;
        watermarkData.data[i + 1] = (data[i + 1] & 1) ? 255 : 0;
        watermarkData.data[i + 2] = (data[i + 2] & 1) ? 255 : 0;
        watermarkData.data[i + 3] = 255;
    }

    watermarkContext.putImageData(watermarkData, 0, 0);
    const extractedWatermark = document.getElementById('extractedWatermark');
    extractedWatermark.src = watermarkCanvas.toDataURL();
    extractedWatermark.style.display = 'block';
}
