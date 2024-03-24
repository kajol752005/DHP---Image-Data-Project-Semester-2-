from flask import Flask, render_template, request, redirect, url_for, flash
from PIL import Image, ImageFilter, ImageEnhance
import os
import secrets

app = Flask(__name__)                                                       # Create a Flask application instance
app.secret_key = 'supersecretkey'                                           # Set a secret key for the application
app.config['UPLOAD_FOLDER'] = 'uploads'                                     # Set the upload folder for uploaded images

def apply_filters(image, filters):                                          # Apply various image filters based on the provided filter dictionary
    if 'crop' in filters:
        crop_values = filters['crop']                                       # Get crop values from the filter dictionary
        # Unpack crop values
        top, right, bottom, left = crop_values
        # Calculate new dimensions after cropping
        new_width = image.width - left - right
        new_height = image.height - top - bottom
        # Crop the image
        image = image.crop((left, top, left + new_width, top + new_height))
    if 'rotate' in filters:
        # Rotate the image by the specified angle
        image = image.rotate(filters['rotate'])
    if 'blur' in filters:
        # Apply Gaussian blur to the image with the specified radius
        image = image.filter(ImageFilter.GaussianBlur(radius=filters['blur']))
    if 'brightness' in filters:
        # Adjust the brightness of the image
        enhancer = ImageEnhance.Brightness(image)
        image = enhancer.enhance(filters['brightness'])
    if 'clarity' in filters:
        # Adjust the sharpness (clarity) of the image
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(filters['clarity'])
    if 'grayscale' in filters:
        # Convert the image to grayscale
        image = image.convert('L')
    return image

@app.route('/')                                                                 # Define a route for the home page
def index():
    return render_template('index.html')                                        # Render the index.html template

@app.route('/edit/<action>', methods=['GET', 'POST'])                           # Define a route for editing images
def edit(action):
    if request.method == 'POST':                                                # Check if the request method is POST
        if 'file' not in request.files:
            flash('No file part')                                               # Flash a message if no file part is found in the request
            return redirect(request.url)                                        # Redirect to the same URL
        file = request.files['file']                                            # Get the uploaded file from the request
        if file.filename == '':
            flash('No selected file')                                           # Flash a message if no file is selected
            return redirect(request.url)                                        # Redirect to the same URL
        image = Image.open(file)                                                # Open the uploaded image file
        image_format = image.format                                             # Get the format of the image (e.g., JPEG, PNG)
        filters = {}                                                            # Initialize an empty dictionary for image filters
        for filter_name in ['crop', 'rotate', 'blur', 'brightness', 'clarity', 'grayscale']:
            if filter_name in request.form:                                     # Check if the filter name is present in the form data
                if filter_name == 'crop':
                    # Get crop values from the form data and add them to the filters dictionary
                    crop_values = [
                        int(request.form['cropTop']),
                        int(request.form['cropRight']),
                        int(request.form['cropBottom']),
                        int(request.form['cropLeft'])
                    ]
                    filters['crop'] = crop_values
                elif filter_name in ['rotate', 'blur', 'brightness', 'clarity']:
                    # Convert filter values to float and add them to the filters dictionary
                    filters[filter_name] = float(request.form[filter_name])
                elif filter_name == 'grayscale':
                    filters['grayscale'] = True                             # Add a flag for grayscale filter to the filters dictionary
        edited_image = apply_filters(image, filters)                        # Apply filters to the image
        filename = secrets.token_hex(8) + '.jpg'                            # Generate a random filename for the edited image
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)     # Construct the file path
        edited_image.save(file_path)                                        # Save the edited image to the file path
        return render_template('edit.html', image_path=file_path)           # Render the edit.html template with the image path
    return render_template('edit.html')                                     # Render the edit.html template without processing the form

if __name__ == '__main__':
    app.run(debug=True)                                                     # Run the Flask application in debug mode
