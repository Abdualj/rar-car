// Car inventory - loaded from Google Sheets
let carInventory = [];

// Image helper function
function getCarImage(car) {
    // Try to get image URL from various possible column names
    const imageUrl = car.image || car.Image || car.imageUrl || car.ImageUrl || car['Image URL'] || '';
    
    console.log('Car:', car.make || car.Make, car.model || car.Model, '- Image URL from sheet:', imageUrl);
    
    // If we have a valid URL from the sheet, use it
    if (imageUrl && imageUrl.trim() !== '') {
        // Check if it's a valid URL or local path
        if (imageUrl.startsWith('http') || imageUrl.startsWith('https') || imageUrl.startsWith('/')) {
            console.log('✓ Using image from Google Sheets:', imageUrl);
            return imageUrl;
        }
    }
    
    // Fallback: Use placeholder if no valid image URL
    const make = car.make || car.Make || 'Car';
    const model = car.model || car.Model || '';
    const year = car.year || car.Year || '';
    
    console.log('⚠ No valid image URL found, using placeholder for:', make, model, year);
    return `https://via.placeholder.com/400x300/1a1a1a/ff6b6b?text=${encodeURIComponent(make + ' ' + model + ' ' + year)}`;
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
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Inquiry modal handling
    const inquiryModal = document.getElementById('inquiry-modal');
    const closeInquiryModal = document.getElementById('close-inquiry-modal');
    const inquiryBtn = document.getElementById('inquiry-btn');
    let selectedCarForInquiry = null;

    if (closeInquiryModal) {
        closeInquiryModal.addEventListener('click', function() {
            inquiryModal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === inquiryModal) {
            inquiryModal.style.display = 'none';
        }
    });

    // Handle inquiry button click from car modal
    if (inquiryBtn) {
        inquiryBtn.addEventListener('click', function() {
            // Get the currently displayed car from the car modal
            const carTitle = document.getElementById('modal-car-title').textContent;
            const carPrice = document.getElementById('modal-car-price').textContent;
            
            // Find the full car object from the inventory
            const carTitleParts = carTitle.split(' ');
            const year = parseInt(carTitleParts[0]);
            const make = carTitleParts[1];
            const model = carTitleParts.slice(2).join(' ');
            
            const currentCar = carInventory.find(c => 
                c.year === year && c.make === make && c.model === model
            );
            
            // Store selected car info with all details
            selectedCarForInquiry = currentCar || {
                make: make,
                model: model,
                year: year,
                price: carPrice.replace(' €', '').replace(',', ''),
                mileage: 0,
                registerNumber: 'N/A'
            };

            // Populate inquiry modal with car info
            const inquiryCarInfo = document.getElementById('inquiry-car-info');
            inquiryCarInfo.innerHTML = `
                <h3 style="color: #ff6b6b; margin-bottom: 0.5rem;">${selectedCarForInquiry.make} ${selectedCarForInquiry.model} (${selectedCarForInquiry.year})</h3>
                <p style="color: #ff6b6b; font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem;">€${typeof selectedCarForInquiry.price === 'number' ? selectedCarForInquiry.price.toLocaleString() : selectedCarForInquiry.price}</p>
                <p style="color: #ccc; font-size: 0.9rem;">Mileage: ${typeof selectedCarForInquiry.mileage === 'number' ? selectedCarForInquiry.mileage.toLocaleString() : selectedCarForInquiry.mileage} km</p>
                <p style="color: #ccc; font-size: 0.9rem;">Register Number: ${selectedCarForInquiry.registerNumber}</p>
            `;

            // Close car modal and open inquiry modal
            modal.style.display = 'none';
            inquiryModal.style.display = 'block';
        });
    }

    // Handle inquiry form submission
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('inquiry-name').value;
            const email = document.getElementById('inquiry-email').value;
            const phone = document.getElementById('inquiry-phone').value;
            const message = document.getElementById('inquiry-message').value;
            const preferEmail = document.getElementById('inquiry-by-email').checked;
            const preferPhone = document.getElementById('inquiry-by-phone').checked;

            // Build preferred contact method string
            let contactPreference = '';
            if (preferEmail && preferPhone) {
                contactPreference = 'Sähköposti tai puhelin';
            } else if (preferEmail) {
                contactPreference = 'Sähköposti';
            } else if (preferPhone) {
                contactPreference = 'Puhelin';
            } else {
                contactPreference = 'Ei määritelty';
            }

            // Build email body with car information first
            let emailBody = '';

            if (selectedCarForInquiry) {
                const price = typeof selectedCarForInquiry.price === 'number' 
                    ? selectedCarForInquiry.price 
                    : parseInt(selectedCarForInquiry.price.replace(/[^0-9]/g, ''));
                const mileage = typeof selectedCarForInquiry.mileage === 'number'
                    ? selectedCarForInquiry.mileage
                    : parseInt(selectedCarForInquiry.mileage);

                emailBody = `AUTO JOSTA OLEN KIINNOSTUNUT:\n` +
                    `Merkki: ${selectedCarForInquiry.make}\n` +
                    `Malli: ${selectedCarForInquiry.model}\n` +
                    `Vuosimalli: ${selectedCarForInquiry.year}\n` +
                    `Hinta: €${price.toLocaleString()}\n` +
                    `Mittarilukema: ${mileage.toLocaleString()} km\n` +
                    `Rekisterinumero: ${selectedCarForInquiry.registerNumber}\n\n` +
                    `${'='.repeat(40)}\n\n`;
            }

            emailBody += `VIESTI:\n${message}\n\n` +
                `${'='.repeat(40)}\n\n` +
                `YHTEYSTIEDOT:\n` +
                `Nimi: ${name}\n` +
                `Sähköposti: ${email}\n` +
                `Puhelin: ${phone}\n` +
                `Toivottu yhteydenottotapa: ${contactPreference}`;

            // Create mailto link
            const mailtoLink = `mailto:rar.car.autoliike@gmail.com?subject=Autokysely: ${encodeURIComponent(name)}&body=${encodeURIComponent(emailBody)}`;

            // Open email client
            window.location.href = mailtoLink;

            // Close modal
            inquiryModal.style.display = 'none';

            // Reset form
            inquiryForm.reset();
            document.getElementById('inquiry-by-email').checked = true; // Reset email checkbox to checked
        });
    }
});

// Load car data from Google Sheets
async function loadCarData() {
    const inventoryContainer = document.getElementById('car-inventory');
    
    // Only run on inventory page - if container doesn't exist, we're on a different page
    if (!inventoryContainer) {
        console.log('Not on inventory page, skipping car data load');
        return;
    }
    
    try {
        console.log('Starting to load car data...');
        inventoryContainer.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                Loading our latest inventory...
            </div>
        `;

        const scriptUrl = 'https://script.google.com/macros/s/AKfycbybGc5LwIGHV8CGiv4LskOTGA4C_xSzI8238NviGb5D9x3I707YR72RVDhEa-L2fGEOpw/exec';
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
                const isAvailable = car.status === 'Available' || car.Status === 'Available' || !car.status;
                return isAvailable;
            })
            .map(car => {
                // Handle year/mileage if combined (e.g., "2009, 214 000 km")
                let year = parseInt(car.year) || parseInt(car.Year) || 0;
                let mileage = parseInt(car.mileage) || parseInt(car.Mileage) || parseInt(car['Mileage (km)']) || 0;
                
                // Try to parse combined year/mileage format
                const combinedField = car['Year, Mileage'] || car.yearMileage || '';
                if (!year && !mileage && combinedField) {
                    const parts = combinedField.split(',');
                    if (parts.length >= 2) {
                        year = parseInt(parts[0].trim()) || 0;
                        mileage = parseInt(parts[1].replace(/[^0-9]/g, '')) || 0;
                    }
                }
                
                // Extract make/model from title if needed
                let make = car.make || car.Make || car.Brand || '';
                let model = car.model || car.Model || '';
                
                if (!make && !model && car.title) {
                    const titleParts = car.title.split(' ');
                    make = titleParts[0] || '';
                    model = titleParts.slice(1).join(' ') || '';
                }
                
                // Clean price (remove any non-numeric characters)
                let price = parseInt(car.price) || parseInt(car.Price) || parseInt(car['Price (€)']) || 0;
                if (!price && car.price) {
                    price = parseInt(car.price.toString().replace(/[^0-9]/g, '')) || 0;
                }
                
                // Create processed car object first
                const processedCar = {
                    id: parseInt(car.id) || parseInt(car.ID) || 0,
                    make: make,
                    model: model,
                    year: year,
                    price: price,
                    mileage: mileage,
                    registerNumber: car.registerNumber || car['Register Number'] || car.registration || 'N/A',
                    fuelType: car.fuelType || car['Fuel Type'] || car.fuel || 'Petrol',
                    transmission: car.transmission || car.Transmission || 'Automatic',
                    image: car.image || car.Image || car.imageUrl || car.ImageUrl || car['Image URL'] || '',
                    description: car.description || car.Description || 'Quality vehicle in excellent condition.',
                    features: car.features ? car.features.split(',').map(f => f.trim()) : [],
                    nettiautoUrl: car['Nettiauto URL'] || car.nettiautoUrl || car.nettiauto || car.url || ''
                };
                
                console.log('Processing car:', processedCar.make, processedCar.model, '- Raw image field:', car.image || car.Image || car.imageUrl || car.ImageUrl || car['Image URL']);
                
                // Now generate image using processed car data
                processedCar.images = [getCarImage(processedCar)];
                
                return processedCar;
            })
            .filter(car => car.make && car.model && car.year); // Only keep cars with essential data

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
            features: ["Air Conditioning", "Bluetooth", "Parking Sensors", "Cruise Control"],
            nettiautoUrl: "https://www.nettiauto.com/en/toyota/corolla"
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
            features: ["Air Conditioning", "Touch Screen", "Parking Camera", "Heated Seats"],
            nettiautoUrl: "https://www.nettiauto.com/en/volkswagen/golf"
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
    
    // Check if we're on the inventory page
    const inventoryContainer = document.getElementById('car-inventory');
    if (!inventoryContainer) {
        console.log('Not on inventory page, skipping inventory initialization');
        return;
    }
    
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
    
    // Check if filter elements exist (only on inventory page)
    if (!makeFilter || !modelFilter) {
        console.log('Filter elements not found, skipping filter population');
        return;
    }
    
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
    const nettiautoBtn = document.getElementById('nettiauto-btn');
    
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
    
    // Debug: Log the car object and nettiautoUrl
    console.log('Car object in modal:', car);
    console.log('Nettiauto URL:', car.nettiautoUrl);
    
    // Set Nettiauto button action
    if (car.nettiautoUrl && car.nettiautoUrl.trim() !== '') {
        console.log('Showing Nettiauto button with URL:', car.nettiautoUrl);
        nettiautoBtn.style.display = 'inline-block';
        nettiautoBtn.onclick = function() {
            window.open(car.nettiautoUrl, '_blank');
        };
    } else {
        // Hide button if no Nettiauto URL available
        console.log('Hiding Nettiauto button - no URL found');
        nettiautoBtn.style.display = 'none';
    }
    
    // Show modal
    modal.style.display = 'block';
}