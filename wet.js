console.log("js ready");
cv['onRuntimeInitialized'] = () => {
    console.log("OpenCV is ready!");
    document.getElementById('upload-button').addEventListener('click', function() {
        document.getElementById('upload-modal').style.display = 'block';
    });

    document.getElementById('choose-storage').addEventListener('click', function() {
        document.getElementById('upload-image').click();
        closeModal();
    });

    document.getElementById('choose-camera').addEventListener('click', function() {
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

        analyzeImage(image);
    }

    function analyzeImage(image) {
        const volume = estimateWetWasteVolume(image);
        const points = calculateReward(volume);

        document.getElementById('waste-volume').innerText = `${volume.toFixed(2)} liters`;
        document.getElementById('points-earned').innerText = `${points}`;
    }

    function estimateWetWasteVolume(image) {
        let src = cv.imread(image);
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
        cv.threshold(src, src, 120, 255, cv.THRESH_BINARY);
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

        let maxContour = contours.get(0);
        let volume = cv.contourArea(maxContour);

        volume = volume * 0.01;
        return volume;
    }

    function calculateReward(volume) {
        const VOLUME_BENCHMARK = 1.5;
        let points = 0;

        if (volume < VOLUME_BENCHMARK) {
            points = 80;
        } else if (volume === VOLUME_BENCHMARK) {
            points = 50;
        } else {
            points = 0;
        }

        return points;
    }

    function closeModal() {
        document.getElementById('upload-modal').style.display = 'none';
    }
};
