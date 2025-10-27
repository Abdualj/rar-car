// Car inventory - loaded from Google Sheets
let carInventory = [];

// Image helper function
function getCarImage(car) {
    const imageUrl = car.image || car.Image || '';
    
    // If it's a valid URL, use it
    if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('/images/'))) {
        console.log('Using real image:', imageUrl);
        return imageUrl;
    }
    
    // Otherwise use the car-shaped placeholder
    return `data:image/svg+xml;base64,${btoa(`
        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f8f8f8"/>
            <rect width="80%" height="60%" x="10%" y="20%" fill="#e0e0e0" rx="5"/>
            <circle cx="25%" cy="80%" r="8%" fill="#333"/>
            <circle cx="75%" cy="80%" r="8%" fill="#333"/>
            <text x="50%" y="15%" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle" font-weight="bold">${car.make || car.Make || ''} ${car.model || car.Model || ''}</text>
            <text x="50%" y="90%" font-family="Arial, sans-serif" font-size="12" fill="#999" text-anchor="middle">${car.year || car.Year || ''}</text>
        </svg>
    `)}`;
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - starting car load');
    loadCarData();
    
    // Your existing smooth scrolling code
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Your existing form handling code
    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });

    // Your existing scroll animation code
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .stat-box, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Modal handling for car details
    const modal = document.getElementById('car-modal');
    const closeModal = document.getElementById('close-modal');
    
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Load car data from Google Sheets
async function loadCarData() {
    const inventoryContainer = document.getElementById('car-inventory');
    
    try {
        console.log('Starting to load car data...');
        inventoryContainer.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                Loading our latest inventory...
            </div>
        `;

        const scriptUrl = 'https://script.google.com/macros/s/AKfycbwHXsrMIT_W_NSqB48_Tt87jduNxr3MpILbN4Wx0a4PMBOEw134GnvSe2hg9JH2iOyJLQ/exec';
        console.log('Fetching from:', scriptUrl);
        
        const response = await fetch(scriptUrl);
        console.log('Response status:', response.status);
        
        const responseText = await response.text();
        console.log('Raw response text:', responseText);
        
        let cars;
        try {
            cars = JSON.parse(responseText);
            console.log('Parsed JSON cars:', cars);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error('Invalid JSON response');
        }
        
        if (!Array.isArray(cars)) {
            console.error('Response is not an array:', cars);
            throw new Error('Response is not an array');
        }
        
        console.log('Number of cars received:', cars.length);
        
        // Process the data from Google Sheets
        carInventory = cars
            .filter(car => {
                const isAvailable = car.status === 'Available' || !car.status;
                return isAvailable;
            })
            .map(car => {
                return {
                    id: parseInt(car.id) || parseInt(car.ID) || 0,
                    make: car.make || car.Make || car.Brand || '',
                    model: car.model || car.Model || '',
                    year: parseInt(car.year) || parseInt(car.Year) || 0,
                    price: parseInt(car.price) || parseInt(car.Price) || parseInt(car['Price (€)']) || 0,
                    mileage: parseInt(car.mileage) || parseInt(car.Mileage) || parseInt(car['Mileage (km)']) || 0,
                    fuelType: car.fuelType || car['Fuel Type'] || car.fuel || 'Petrol',
                    transmission: car.transmission || car.Transmission || 'Automatic',
                    images: [getCarImage(car)],
                    description: car.description || car.Description || 'Quality vehicle in excellent condition.',
                    features: car.features ? car.features.split(',').map(f => f.trim()) : []
                };
            });

        console.log('Processed carInventory:', carInventory);
        
        if (carInventory.length === 0) {
            console.log('No available cars found, using fallback');
            useFallbackData();
            return;
        }

        // Initialize the inventory with loaded data
        initializeInventory();
        console.log('Inventory initialized successfully');
        
    } catch (error) {
        console.error('Error loading car data:', error);
        console.error('Error details:', error.message);
        
        // Fallback to sample data
        useFallbackData();
    }
}

// Fallback data in case Google Sheets is unavailable
function useFallbackData() {
    console.log('Using fallback data');
    carInventory = [
        {
            id: 1,
            make: "Toyota",
            model: "Corolla",
            year: 2020,
            price: 18900,
            mileage: 45000,
            fuelType: "Petrol",
            transmission: "Automatic",
            images: [getCarImage({make: "Toyota", model: "Corolla", year: 2020})],
            description: "Well-maintained Toyota Corolla with low mileage. Perfect condition with full service history.",
            features: ["Air Conditioning", "Bluetooth", "Parking Sensors", "Cruise Control"]
        },
        {
            id: 2,
            make: "Volkswagen",
            model: "Golf",
            year: 2019,
            price: 16900,
            mileage: 52000,
            fuelType: "Diesel",
            transmission: "Manual",
            images: [getCarImage({make: "Volkswagen", model: "Golf", year: 2019})],
            description: "Reliable Volkswagen Golf with excellent fuel economy. Recent service completed.",
            features: ["Air Conditioning", "Touch Screen", "Parking Camera", "Heated Seats"]
        }
    ];
    
    initializeInventory();
    
    // Show warning message
    const inventoryContainer = document.getElementById('car-inventory');
    const warning = document.createElement('div');
    warning.className = 'error-message';
    warning.innerHTML = `
        <p><strong>Note:</strong> Showing sample data. Live inventory updates are temporarily unavailable.</p>
        <p>Please contact us for current inventory.</p>
    `;
    inventoryContainer.parentNode.insertBefore(warning, inventoryContainer);
}

function initializeInventory() {
    console.log('Initializing inventory with', carInventory.length, 'cars');
    
    // Populate filter dropdowns
    populateFilters();
    
    // Display all cars initially
    filterCars();
    
    // Add event listeners to filters
    document.getElementById('make-filter').addEventListener('change', filterCars);
    document.getElementById('model-filter').addEventListener('change', filterCars);
    document.getElementById('price-filter').addEventListener('change', filterCars);
    document.getElementById('year-filter').addEventListener('change', filterCars);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
}

function populateFilters() {
    const makeFilter = document.getElementById('make-filter');
    const modelFilter = document.getElementById('model-filter');
    
    // Clear existing options
    makeFilter.innerHTML = '<option value="">All Makes</option>';
    modelFilter.innerHTML = '<option value="">All Models</option>';
    
    // Get unique makes
    const makes = [...new Set(carInventory.map(car => car.make))].sort();
    console.log('Available makes:', makes);
    
    // Populate make filter
    makes.forEach(make => {
        const option = document.createElement('option');
        option.value = make;
        option.textContent = make;
        makeFilter.appendChild(option);
    });
    
    // Update models when make changes
    makeFilter.addEventListener('change', function() {
        const selectedMake = this.value;
        modelFilter.innerHTML = '<option value="">All Models</option>';
        
        if (selectedMake) {
            const models = [...new Set(
                carInventory
                    .filter(car => car.make === selectedMake)
                    .map(car => car.model)
            )].sort();
            
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                modelFilter.appendChild(option);
            });
        }
    });
}

function filterCars() {
    const makeFilter = document.getElementById('make-filter').value;
    const modelFilter = document.getElementById('model-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    const yearFilter = document.getElementById('year-filter').value;
    
    let filteredCars = carInventory.filter(car => {
        return (!makeFilter || car.make === makeFilter) &&
               (!modelFilter || car.model === modelFilter) &&
               (!priceFilter || car.price <= parseInt(priceFilter)) &&
               (!yearFilter || car.year >= parseInt(yearFilter));
    });
    
    console.log('Filtered cars:', filteredCars.length);
    displayCars(filteredCars);
}

function resetFilters() {
    document.getElementById('make-filter').value = '';
    document.getElementById('model-filter').value = '';
    document.getElementById('price-filter').value = '';
    document.getElementById('year-filter').value = '';
    filterCars();
}

function displayCars(cars) {
    const inventoryContainer = document.getElementById('car-inventory');
    const carsCount = document.getElementById('cars-count');
    const totalCars = document.getElementById('total-cars');
    
    // Update counters
    carsCount.textContent = cars.length;
    totalCars.textContent = carInventory.length;
    
    console.log('Displaying', cars.length, 'cars');
    
    if (cars.length === 0) {
        inventoryContainer.innerHTML = `
            <div class="no-results">
                <h3>No cars match your filters</h3>
                <p>Try adjusting your search criteria or <a href="#" id="reset-link">reset the filters</a>.</p>
            </div>
        `;
        
        document.getElementById('reset-link').addEventListener('click', function(e) {
            e.preventDefault();
            resetFilters();
        });
        return;
    }
    
    inventoryContainer.innerHTML = '';
    
    cars.forEach(car => {
        const carCard = document.createElement('div');
        carCard.className = 'car-card';
        carCard.addEventListener('click', () => openCarModal(car));
        
        carCard.innerHTML = `
            <img src="${car.images[0]}" alt="${car.make} ${car.model}">
            <div class="car-info">
                <h3>${car.make} ${car.model}</h3>
                <p>${car.year} • ${car.mileage.toLocaleString()} km • ${car.fuelType}</p>
                <p><strong>${car.price.toLocaleString()} €</strong></p>
            </div>
        `;
        
        inventoryContainer.appendChild(carCard);
    });
}

function openCarModal(car) {
    const modal = document.getElementById('car-modal');
    const modalImage = document.getElementById('modal-car-image');
    const modalTitle = document.getElementById('modal-car-title');
    const modalPrice = document.getElementById('modal-car-price');
    const modalDescription = document.getElementById('modal-car-description');
    const modalSpecs = document.getElementById('modal-car-specs');
    const inquiryBtn = document.getElementById('inquiry-btn');
    
    // Set modal content
    modalImage.src = car.images[0];
    modalImage.alt = `${car.make} ${car.model}`;
    modalTitle.textContent = `${car.year} ${car.make} ${car.model}`;
    modalPrice.textContent = `${car.price.toLocaleString()} €`;
    modalDescription.textContent = car.description;
    
    // Build specifications
    modalSpecs.innerHTML = `
        <div class="spec-item">
            <span>Year:</span>
            <span>${car.year}</span>
        </div>
        <div class="spec-item">
            <span>Mileage:</span>
            <span>${car.mileage.toLocaleString()} km</span>
        </div>
        <div class="spec-item">
            <span>Fuel Type:</span>
            <span>${car.fuelType}</span>
        </div>
        <div class="spec-item">
            <span>Transmission:</span>
            <span>${car.transmission}</span>
        </div>
        ${car.features.map(feature => `
            <div class="spec-item">
                <span>${feature}</span>
                <span>✓</span>
            </div>
        `).join('')}
    `;
    
    // Set button action
    inquiryBtn.href = `#contact?car=${encodeURIComponent(car.make + ' ' + car.model)}`;
    
    // Show modal
    modal.style.display = 'block';
}