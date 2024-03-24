const fileInput = document.getElementById('fileInput');                         // Get the file input element
const imagePreview = document.getElementById('imagePreview');                   // Get the image preview element
const originalImage = document.getElementById('originalImage');                 // Get the original image element
const filterOptions = document.getElementById('filterOptions');                 // Get the filter options element
const cropTopInput = document.getElementById('cropTop');                        // Get the crop top input element
const cropRightInput = document.getElementById('cropRight');                    // Get the crop right input element
const cropBottomInput = document.getElementById('cropBottom');                  // Get the crop bottom input element
const cropLeftInput = document.getElementById('cropLeft');                      // Get the crop left input element
const rotateSlider = document.getElementById('rotateSlider');                   // Get the rotate slider element
const blurSlider = document.getElementById('blurSlider');                       // Get the blur slider element
const brightnessSlider = document.getElementById('brightnessSlider');           // Get the brightness slider element
const claritySlider = document.getElementById('claritySlider');                 // Get the clarity slider element
const grayscaleSlider = document.getElementById('grayscaleSlider');             // Get the grayscale slider element
const applyFiltersBtn = document.getElementById('applyFiltersBtn');             // Get the apply filters button element
const filteredImage = document.getElementById('filteredImage');                 // Get the filtered image element
const filteredImg = document.getElementById('filteredImg');                     // Get the filtered image element
let cropper; // Declare a variable for cropper

fileInput.addEventListener('change', function() {                               // Add event listener for file input change event
    const file = fileInput.files[0];                                            // Get the selected file
    const reader = new FileReader();                                            // Create a new FileReader object

    reader.onload = (e) => {                                                    // Define onload event handler for FileReader
        originalImage.src = e.target.result;                                    // Set the source of the original image to the loaded file
        imagePreview.style.display = 'block';                                   // Display the image preview element
        filterOptions.style.display = 'block';                                  // Display the filter options element
    };

    reader.readAsDataURL(file);                                                 // Read the file as a data URL
});

applyFiltersBtn.addEventListener('click', function() {                          // Add event listener for apply filters button click event
    const cropTop = parseInt(cropTopInput.value);                               // Parse crop top input value to integer
    const cropRight = parseInt(cropRightInput.value);                           // Parse crop right input value to integer
    const cropBottom = parseInt(cropBottomInput.value);                         // Parse crop bottom input value to integer
    const cropLeft = parseInt(cropLeftInput.value);                             // Parse crop left input value to integer
    const rotateValue = parseInt(rotateSlider.value);                           // Parse rotate slider value to integer
    const blurValue = parseInt(blurSlider.value);                               // Parse blur slider value to integer
    const brightnessValue = parseFloat(brightnessSlider.value);                 // Parse brightness slider value to float
    const clarityValue = parseFloat(claritySlider.value);                       // Parse clarity slider value to float
    const grayscaleValue = parseInt(grayscaleSlider.value);                     // Parse grayscale slider value to integer

    const canvas = document.createElement('canvas');                            // Create a new canvas element
    const ctx = canvas.getContext('2d');                                        // Get 2D rendering context for the canvas
    canvas.width = originalImage.width;                                         // Set canvas width to original image width
    canvas.height = originalImage.height;                                       // Set canvas height to original image height

    ctx.drawImage(originalImage, 0, 0);                                         // Draw the original image on the canvas

    // Apply crop
    ctx.drawImage(originalImage, cropLeft, cropTop, originalImage.width - cropLeft - cropRight, originalImage.height - cropTop - cropBottom, 0, 0, canvas.width, canvas.height); // Draw cropped portion of the original image on the canvas

    // Apply rotation
    ctx.translate(originalImage.width / 2, originalImage.height / 2);            // Translate to the center of the image
    ctx.rotate((rotateValue * Math.PI) / 180);                                  // Rotate the canvas
    ctx.translate(-originalImage.width / 2, -originalImage.height / 2);         // Translate back to the original position
    ctx.drawImage(canvas, 0, 0);                                                // Draw the rotated image on the canvas

    // Apply blur
    ctx.filter = `blur(${blurValue}px)`;                                            // Set blur filter
    ctx.drawImage(canvas, 0, 0);                                                    // Draw the blurred image on the canvas
    ctx.filter = 'none';                                                            // Reset filter

    // Apply brightness
    ctx.filter = `brightness(${brightnessValue})`;                                  // Set brightness filter
    ctx.drawImage(canvas, 0, 0);                                                    // Draw the brightness-adjusted image on the canvas
    ctx.filter = 'none';                                                            // Reset filter

    // Apply clarity
    ctx.filter = `contrast(${clarityValue})`;                                       // Set clarity filter
    ctx.drawImage(canvas, 0, 0);                                                    // Draw the clarity-adjusted image on the canvas
    ctx.filter = 'none';                                                            // Reset filter

    // Apply grayscale
    ctx.filter = `grayscale(${grayscaleValue}%)`;                                   // Set grayscale filter
    ctx.drawImage(canvas, 0, 0);                                                   // Draw the grayscale image on the canvas
    ctx.filter = 'none';                                                            // Reset filter

    // Display filtered image
    filteredImg.src = canvas.toDataURL();                                           // Set the source of the filtered image to the canvas data URL
    filteredImage.style.display = 'block';                                          // Display the filtered image element
});

