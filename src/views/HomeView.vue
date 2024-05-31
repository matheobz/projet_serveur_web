<template>
    <div id="home">
      <h1 class="main-title">Bienvenue sur Ubeer</h1>
      <p class="subtitle">Votre service de livraison de bière à domicile</p>
      
      <section class="features">
        <h2>Pourquoi choisir Ubeer ?</h2>
        <div class="feature">
          <h3 class="feature-title">Livraison Rapide</h3>
          <p class="feature-description">Profitez de votre bière préférée en un rien de temps.</p>
        </div>
        <div class="feature">
          <h3 class="feature-title">Large Sélection</h3>
          <p class="feature-description">Des centaines de bières artisanales et commerciales à choisir.</p>
        </div>
        <div class="feature">
          <h3 class="feature-title">Qualité Garantie</h3>
          <p class="feature-description">Nous garantissons la fraîcheur et la qualité de chaque commande.</p>
        </div>
      </section>
      
      <section class="how-it-works">
        <h2>Comment ça marche ?</h2>
        <ol>
          <li>Choisissez vos bières préférées sur notre site.</li>
          <li>Passez votre commande en ligne.</li>
          <li>Recevez votre livraison à domicile en moins de 30 minutes.</li>
        </ol>
      </section>
      
      <footer class="footer">
        <p>&copy; 2024 Ubeer. Tous droits réservés.</p>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomeView'
  }
  </script>
  
  <style scoped>
  #home {
    font-family: 'Arial', sans-serif;
    color: #fff;
    background-color: #000;
    text-align: center;
    padding: 40px;
  }
  
  .main-title {
    color: #00ff00;
    font-size: 4em;
    margin-bottom: 0.5em;
  }
  
  .subtitle {
    color: #ccc;
    font-size: 1.5em;
    margin-bottom: 2em;
  }
  
  .features {
    margin: 40px 0;
  }
  
  .features h2 {
    color: #00ff00;
    font-size: 2.5em;
    margin-bottom: 1em;
  }
  
  .feature {
    margin: 30px 0;
    padding: 20px;
    border: 1px solid #333;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.121);
  }
  
  .feature-title {
    color: #00ff00;
    font-size: 2em;
    margin-bottom: 0.5em;
  }
  
  .feature-description {
    color: #ccc;
    font-size: 1.2em;
  }
  
  .how-it-works {
    margin: 40px 0;
  }
  
  .how-it-works h2 {
    color: #00ff00;
    font-size: 2.5em;
    margin-bottom: 1em;
  }
  
  .how-it-works ol {
    list-style-type: decimal;
    color: #ccc;
    font-size: 1.2em;
    padding-left: 20px;
    text-align: left;
    display: inline-block;
  }
  
  .footer {
    background-color: #222;
    padding: 10px;
    margin-top: 40px;
  }
  
  .footer p {
    color: #ccc;
    margin: 0;
  }
  </style>
  