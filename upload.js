// upload.js

// To hold selected files in memory
let selectedFiles = [];

document.getElementById('fileInput').addEventListener('change', handleFiles);

document.getElementById('dropZone').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('dropZone').addEventListener('dragover', function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.classList.add('dragging');
});

document.getElementById('dropZone').addEventListener('dragleave', function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.classList.remove('dragging');
});

document.getElementById('dropZone').addEventListener('drop', function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.classList.remove('dragging');
    handleFiles(event);
});

function handleFiles(event) {
    let files;
    if (event.type === 'drop') {
        files = event.dataTransfer.files;
    } else {
        files = event.target.files;
    }

    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = ""; // Clear previous previews
    selectedFiles = []; // Reset the selected files

    for (let file of files) {
        if (file.type.startsWith('image/')) {
            selectedFiles.push(file);

            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.onload = function() {
                URL.revokeObjectURL(this.src);
            }
            imagePreview.appendChild(img);
        }
    }
}

function uploadImages() {
    if (selectedFiles.length === 0) {
        alert("No files selected for upload");
        return;
    }
    // Modify this part to send each image as a sperate request

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file);
    });

    const xhr = new XMLHttpRequest();
    //xhr.open('PUT', 'http://localhost:8010/proxy/api/upload/'); // LocalHost endpoint
    xhr.open('PUT', 'https://filehaus.top/api/upload/');
    xhr.setRequestHeader("Access-Control-Allow-Origin", '*');
    xhr.onload = function() {
        if (xhr.status === 200) {
            alert('Files uploaded successfully');
        } else {
            alert('Failed to upload files');
        }
    };
    xhr.onerror = function() {
        alert('An error occurred while uploading the files');
    };
    xhr.send(formData);
}
