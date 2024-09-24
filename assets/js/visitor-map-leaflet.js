document.addEventListener('DOMContentLoaded', () => {
    // Firebase Configuration (Your details)
    const firebaseConfig = {
      apiKey: "AIzaSyDCndwOT2p9FMdbnGO4hTy5tWHc47VRUIM",
      authDomain: "chikamaduabuchiportfolio.firebaseapp.com",
      databaseURL: "https://chikamaduabuchiportfolio-default-rtdb.firebaseio.com",
      projectId: "chikamaduabuchiportfolio",
      storageBucket: "chikamaduabuchiportfolio.appspot.com",
      messagingSenderId: "166750779899",
      appId: "1:166750779899:web:c05dac0c258fdea22e735e"
    };
  
    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
  
    // Initialize Leaflet map after DOM is loaded
    const map = L.map('map').setView([20, 0], 2);
  
    // Load and display map tiles from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  
    // Fetch visitor data from Firebase and display markers on the map
    database.ref('visitors').on('value', (snapshot) => {
      const visitors = snapshot.val();
      const visitorCount = Object.keys(visitors).length;
  
      // Display visitor count
      document.getElementById('visitor-count').textContent = visitorCount;
  
      // Add markers for each visitor location
      for (const visitorId in visitors) {
        const visitor = visitors[visitorId];
        L.marker([visitor.latitude, visitor.longitude]).addTo(map);
      }
    });
  
    // Log the visitor's IP location using IPinfo and save to Firebase
    fetch('https://ipinfo.io/json?token=60c4b822a58822')
      .then(response => response.json())
      .then(data => {
        const visitorLocation = data.loc.split(',');
        const longitude = parseFloat(visitorLocation[1]);
        const latitude = parseFloat(visitorLocation[0]);
  
        // Save the visitor location to Firebase
        database.ref('visitors').push({
          longitude,
          latitude,
          timestamp: Date.now()
        });
      })
      .catch(error => console.error('Error fetching IP location:', error));
  });
  