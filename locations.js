// Vérifier l'authentification
if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
}

// Données des antennes de CAX Corporation
const locations = [
    {
        id: 1,
        city: 'Châteaurenard',
        country: 'France',
        latitude: 43.8879,
        longitude: 4.8434,
        type: 'Headquarters',
        employees: 425650,
        founded: '2005',
        phone: '+33 1 42 34 56 78',
        email: 'headquarters@cax.com',
        description: 'Main headquarters and administrative center - Provence'
    },
    {
        id: 2,
        city: 'London',
        country: 'United Kingdom',
        latitude: 51.5074,
        longitude: -0.1278,
        type: 'Regional Office',
        employees: 186500,
        founded: '2010',
        phone: '+44 20 7946 0958',
        email: 'london@cax.com',
        description: 'European operations hub'
    },
    {
        id: 3,
        city: 'New York',
        country: 'United States',
        latitude: 40.7128,
        longitude: -74.0060,
        type: 'Regional Office',
        employees: 489450,
        founded: '2008',
        phone: '+1 212 555 1234',
        email: 'newyork@cax.com',
        description: 'North American headquarters'
    },
    {
        id: 4,
        city: 'Tokyo',
        country: 'Japan',
        latitude: 35.6762,
        longitude: 139.6503,
        type: 'Regional Office',
        employees: 298750,
        founded: '2012',
        phone: '+81 3 1234 5678',
        email: 'tokyo@cax.com',
        description: 'Asian headquarters and tech hub'
    },
    {
        id: 5,
        city: 'Singapore',
        country: 'Singapore',
        latitude: 1.3521,
        longitude: 103.8198,
        type: 'Branch',
        employees: 312300,
        founded: '2014',
        phone: '+65 6234 5678',
        email: 'singapore@cax.com',
        description: 'Southeast Asia operations center'
    },
    {
        id: 6,
        city: 'Sydney',
        country: 'Australia',
        latitude: -33.8688,
        longitude: 151.2093,
        type: 'Branch',
        employees: 245600,
        founded: '2015',
        phone: '+61 2 8234 5678',
        email: 'sydney@cax.com',
        description: 'Oceania and Asia-Pacific hub'
    },
    {
        id: 7,
        city: 'Dubai',
        country: 'United Arab Emirates',
        latitude: 25.2048,
        longitude: 55.2708,
        type: 'Branch',
        employees: 178900,
        founded: '2016',
        phone: '+971 4 234 5678',
        email: 'dubai@cax.com',
        description: 'Middle East regional office'
    },
    {
        id: 8,
        city: 'Toronto',
        country: 'Canada',
        latitude: 43.6629,
        longitude: -79.3957,
        type: 'Branch',
        employees: 267450,
        founded: '2011',
        phone: '+1 416 555 1234',
        email: 'toronto@cax.com',
        description: 'Canada and Americas service center'
    },
    {
        id: 9,
        city: 'Berlin',
        country: 'Germany',
        latitude: 52.5200,
        longitude: 13.4050,
        type: 'Branch',
        employees: 287200,
        founded: '2013',
        phone: '+49 30 1234 5678',
        email: 'berlin@cax.com',
        description: 'Central European office'
    },
    {
        id: 10,
        city: 'São Paulo',
        country: 'Brazil',
        latitude: -23.5505,
        longitude: -46.6333,
        type: 'Branch',
        employees: 198750,
        founded: '2017',
        phone: '+55 11 3234 5678',
        email: 'saopaulo@cax.com',
        description: 'South American headquarters'
    },
    {
        id: 11,
        city: 'Hong Kong',
        country: 'Hong Kong',
        latitude: 22.2793,
        longitude: 114.1694,
        type: 'Branch',
        employees: 231800,
        founded: '2014',
        phone: '+852 2234 5678',
        email: 'hongkong@cax.com',
        description: 'Finance and trading center'
    },
    {
        id: 12,
        city: 'Amsterdam',
        country: 'Netherlands',
        latitude: 52.3676,
        longitude: 4.9041,
        type: 'Branch',
        employees: 110,
        founded: '2015',
        phone: '+31 20 1234 5678',
        email: 'amsterdam@cax.com',
        description: 'European distribution center'
    }
];

let activePopup = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser la carte
    initMap();
    
    // Afficher la liste des localisations
    displayLocationsList();

    // Fermer popup au clic ailleurs
    document.addEventListener('click', (e) => {
        if (activePopup && !e.target.closest('.map-marker') && !e.target.closest('.location-popup-box')) {
            closePopup();
        }
    });
});

// Convertir les coordonnées GPS en position sur la carte
function latLongToPercent(lat, lng) {
    // Calibrage manuel pour le fichier world.svg
    
    // Position X (longitude)
    const x = ((lng + 170) / 360) * 100;
    
    // Position Y (latitude) - compressé vers le centre
    const y = 68.5 + (lat * -0.425);
    
    return { x, y };
}

function initMap() {
    const markersContainer = document.getElementById('mapMarkers');

    locations.forEach(location => {
        const pos = latLongToPercent(location.latitude, location.longitude);
        
        const markerColor = location.type === 'Headquarters' ? '#dc3545' : 
                           location.type === 'Regional Office' ? '#1a1a1a' : 
                           '#666666';
        
        const markerSize = location.type === 'Headquarters' ? 14 : 10;

        const marker = document.createElement('div');
        marker.className = `map-marker ${location.type === 'Headquarters' ? 'headquarters' : ''}`;
        marker.style.cssText = `
            left: ${pos.x}%;
            top: ${pos.y}%;
            width: ${markerSize}px;
            height: ${markerSize}px;
            background: ${markerColor};
        `;
        marker.dataset.locationId = location.id;

        marker.addEventListener('click', (e) => {
            e.stopPropagation();
            // Animation au clic
            marker.classList.add('clicked');
            setTimeout(() => marker.classList.remove('clicked'), 300);
            showPopup(location, marker);
        });

        markersContainer.appendChild(marker);
    });
}

function showPopup(location, markerElement) {
    closePopup();
    
    const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    
    const popup = document.createElement('div');
    popup.className = 'location-popup-box';
    popup.innerHTML = `
        <div class="popup-header">
            <h3>${location.city}, ${location.country}</h3>
            <button class="popup-close">✕</button>
        </div>
        <div class="popup-body">
            <p class="popup-type">${location.type}</p>
            <p>👥 ${location.employees} employees</p>
            <p>📅 Founded: ${location.founded}</p>
            <p>${location.description}</p>
            <p>📧 ${location.email}</p>
            <p>📞 ${location.phone}</p>
            <a href="${googleMapsUrl}" target="_blank" class="btn-google-maps">View in Google Maps</a>
        </div>
    `;

    popup.querySelector('.popup-close').addEventListener('click', closePopup);

    // Positionner le popup à côté du marqueur
    const mapWrapper = document.querySelector('.world-map-wrapper');
    const markerRect = markerElement.getBoundingClientRect();
    const mapRect = mapWrapper.getBoundingClientRect();
    
    // Position relative au conteneur
    let left = markerRect.left - mapRect.left + markerRect.width + 10;
    let top = markerRect.top - mapRect.top - 50;
    
    // Vérifier si le popup dépasse à droite
    if (left + 280 > mapRect.width) {
        left = markerRect.left - mapRect.left - 290;
    }
    
    // Vérifier si le popup dépasse en haut
    if (top < 10) {
        top = 10;
    }
    
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    
    mapWrapper.appendChild(popup);
    activePopup = popup;
}

function closePopup() {
    if (activePopup) {
        activePopup.remove();
        activePopup = null;
    }
}

function displayLocationsList() {
    const listContainer = document.getElementById('locationsList');
    const sidebarH3 = document.querySelector('.locations-sidebar h3');
    
    // Mettre à jour le nombre de localisations
    sidebarH3.innerHTML = `Offices (${locations.length} locations)`;

    listContainer.innerHTML = '';

    locations.forEach(location => {
        const card = document.createElement('div');
        card.className = `location-card ${location.type === 'Headquarters' ? 'headquarters' : ''}`;
        card.innerHTML = `
            <div class="location-card-header">
                <h4>${location.city}</h4>
                <span class="location-type">${location.type}</span>
            </div>
            <div class="location-card-body">
                <p><strong>${location.country}</strong></p>
                <p>👥 ${location.employees} employees</p>
                <p>📅 Founded: ${location.founded}</p>
                <p>📧 ${location.email}</p>
                <p>📞 ${location.phone}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            // Centrer la carte sur cette localisation
            map.setView([location.latitude, location.longitude], 10);
        });

        listContainer.appendChild(card);
    });
}
