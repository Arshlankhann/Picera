document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const imageFileInput = document.getElementById('imageFile');
    const uploadStatus = document.getElementById('uploadStatus');
    const imagePreview = document.getElementById('imagePreview');
    const galleryLeft = document.getElementById('gallery-left');
    const galleryRight = document.getElementById('gallery-right');
    const galleryPlaceholder = document.getElementById('gallery-placeholder');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const pageInfo = document.getElementById('pageInfo');

    const IMAGES_PER_PAGE = 6;
    let currentPage = 1;
    
    let masterImageList = [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?q=80&w=1915&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1439853949127-fa647821eba0?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2076&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1431794062232-2a99a5431c6a?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?q=80&w=2070&auto=format&fit=crop'
    ];
    
    const renderGallery = () => {
        galleryLeft.innerHTML = '';
        galleryRight.innerHTML = '';

        if (masterImageList.length === 0) {
            galleryPlaceholder.classList.remove('hidden');
            galleryPlaceholder.style.display = 'block';
            updatePagination(0); 
            return;
        }
        galleryPlaceholder.classList.add('hidden');
        galleryPlaceholder.style.display = 'none'; 

        const totalPages = Math.ceil(masterImageList.length / IMAGES_PER_PAGE);
        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
        if (currentPage < 1 && totalPages > 0) currentPage = 1;
        if (totalPages === 0) currentPage = 1; // Rmages removed

        const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
        const endIndex = startIndex + IMAGES_PER_PAGE;
        const imagesForPage = masterImageList.slice(startIndex, endIndex);
        
        imagesForPage.forEach((src, index) => {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-item'; // Custom CSS class for aspect ratio and other base styles
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Gallery image ${startIndex + index + 1}`;
            
            
            img.onerror = function() {
                this.onerror=null; 
                this.src='https://placehold.co/600x600/eee/ccc?text=Image+Not+Found';
                this.alt = 'Image not found';
            };
            
            imageContainer.appendChild(img);

            if (index < IMAGES_PER_PAGE / 2) { 
                galleryLeft.appendChild(imageContainer);
            } else { 
                galleryRight.appendChild(imageContainer);
            }
        });

        updatePagination(totalPages);
    };

    const updatePagination = (totalPages) => {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages > 0 ? totalPages : 1}`;
        prevButton.disabled = currentPage <= 1;
        nextButton.disabled = currentPage >= totalPages; // Corrected logic
        if (totalPages === 0) { 
            prevButton.disabled = true;
            nextButton.disabled = true;
        }
    };

    const handleFilePreviewAndValidation = (file) => {
        if (!file) {
            uploadStatus.textContent = 'No file selected.';
            uploadStatus.className = 'upload-status text-red-600';
            imagePreview.innerHTML = '';
            return false;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            uploadStatus.textContent = 'Invalid file type. Please use JPG or PNG.';
            uploadStatus.className = 'upload-status text-red-600';
            imagePreview.innerHTML = '';
            return false;
        }
        
        const maxSize = 5 * 1024 * 1024; 
        if (file.size > maxSize) {
            uploadStatus.textContent = 'File is too large. Maximum size is 5MB.';
            uploadStatus.className = 'upload-status text-red-600';
            imagePreview.innerHTML = '';
            return false;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Image Preview">`;
        }
        reader.readAsDataURL(file);
        uploadStatus.textContent = 'File ready for upload preview.';
        uploadStatus.className = 'upload-status text-gray-700';
        return true;
    };

    imageFileInput.addEventListener('change', () => {
        const file = imageFileInput.files[0];
        handleFilePreviewAndValidation(file);
    });

    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const file = imageFileInput.files[0];
        
        if (!handleFilePreviewAndValidation(file)) { 
             if (!file) { 
                uploadStatus.textContent = 'Please select a file first.';
                uploadStatus.className = 'upload-status text-red-600';
            }
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            masterImageList.unshift(e.target.result); 
            currentPage = 1; 
            renderGallery();

            uploadStatus.textContent = 'Upload successful! Image added to gallery (simulation).';
            uploadStatus.className = 'upload-status text-green-600';
            uploadForm.reset(); 
            imagePreview.innerHTML = ''; 
        };
        reader.readAsDataURL(file);
    });

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderGallery();
        }
    });

    nextButton.addEventListener('click', () => {
        const totalPages = Math.ceil(masterImageList.length / IMAGES_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            renderGallery();
        }
    });

    renderGallery();
});