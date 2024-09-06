document.getElementById('upload-button').addEventListener('click', function() {
    // Show the modal when upload button is clicked
    document.getElementById('upload-modal').style.display = 'flex';
});

document.getElementById('choose-storage').addEventListener('click', function() {
    // Trigger the file input for storage upload
    document.getElementById('upload-image').click();
    closeModal();
});

document.getElementById('choose-camera').addEventListener('click', function() {
    // Trigger the file input for camera capture
    document.getElementById('camera-image').click();
    closeModal();
});

document.getElementById('upload-image').addEventListener('change', function(event) {
    handleImageUpload(event.target.files[0]);
});

document.getElementById('camera-image').addEventListener('change', function(event) {
    handleImageUpload(event.target.files[0]);
});

function handleImageUpload(file) {
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                displayImageAndAnalyze(img);
            };
        };
        
        reader.readAsDataURL(file);
    }
}

function displayImageAndAnalyze(image) {
    const uploadedImageContainer = document.createElement('div');
    uploadedImageContainer.style.textAlign = 'center';
    uploadedImageContainer.style.marginTop = '20px';
    uploadedImageContainer.innerHTML = `<img src="${image.src}" style="max-width: 100%; max-height: 300px;" alt="Uploaded Waste Image">`;
    document.querySelector('.analysis-section').appendChild(uploadedImageContainer);

    // Simulate analysis (replace with actual analysis logic)
    analyzeImage(image);
}

function analyzeImage(image) {
    const wasteVolume = '25';  // Example value
    const pointsEarned = '10';         // Example value

    document.getElementById('waste-volume').innerText = wasteVolume;
    document.getElementById('points-earned').innerText = pointsEarned;
}

function closeModal() {
    document.getElementById('upload-modal').style.display = 'none';
}
