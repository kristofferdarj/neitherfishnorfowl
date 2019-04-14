<template>
  <div class="container" v-bind:style="containerStyles">
    <button v-on:click="newLocation" class="new-location">Ny plats</button>
    <p>{{distance}} meter kvar</p>
    <p>{{stringDistance}}</p>
    <p class="aux">Precision: {{accuracy}} meter</p>
  </div>
</template>

<script>
export default {
  name: 'vHome',
  data: function() {
    return {
      userLatitude: '',
      userLongitude: '',
      accuracy: '',
      targetLatitude: 63.1802074,
      targetLongitude: 14.6412153,
      distance: 0,
      percentageLeft: 0,
      bearing: 0,
      audioSuccess: false,
    }
  },
  props: {
    msg: String
  },
  computed: {
    containerStyles: function() {
      return {
        'background': 'linear-gradient(' + this.bearing + 'deg, blue, red ' + this.percentageLeft + '%)',
      };
    },
    stringDistance: function() {
      let percentage = this.percentageLeft;
      switch(true) {
        case percentage < 2:
          return 'DU BRINNER UPP!';

        case percentage < 5:
          return 'Supervarmt';

        case percentage < 10:
          return 'Ganska varmt';

        case percentage < 15:
          return 'Börjar bli varmt';

        case percentage < 25:
          return 'Ganska kallt';

        case percentage < 50:
          return 'Kallt';

        case percentage < 75:
          return 'Svinkallt';

        case percentage >= 75:
          return 'DU FRYSER TILL IS!';
      }
    }
  },
  methods: {
    newLocation() {
      this.targetLatitude = this.userLatitude;
      this.targetLongitude = this.userLongitude;
    },
    playSuccess: function() {
      this.audioSuccess.addEventListener('loadeddata', () => {
        this.audioSuccess.play();
      });
    },
    calculateDistance(lat1, lon1, lat2, lon2) {
      let R = 6371; // Radius of the earth in km
      let dLat = this.toRad(lat2-lat1);
      let dLon = this.toRad(lon2-lon1);
      let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      let d = R * c; // Distance in km
      d = d * 1000; // Distance in meters
      d = Math.round(d);

      return d;
    },
    toRad(val) {
      return val * Math.PI / 180;
    },
    percentageToTarget(distance) {
      return Math.min(100,distance);
    },
    getBearing(event) {
      this.bearing = event.alpha;
    },
    getPosition(position) {
      let coordinates = position.coords;
      this.userLatitude = coordinates.latitude;
      this.userLongitude = coordinates.longitude;
      this.accuracy = coordinates.accuracy;

      this.distance = this.calculateDistance(this.userLatitude, this.userLongitude, this.targetLatitude, this.targetLongitude )

      this.percentageLeft = this.percentageToTarget(this.distance);

      if(this.distance < 2) {
        this.playSuccess();
      }
    },
    geoError(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
  },
  beforeMount() {
    let options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000,
        };
    setInterval(function() {
      navigator.geolocation.getCurrentPosition(this.getPosition,this.error,options);
    }.bind(this), 3000);

    window.addEventListener('deviceorientation', this.getBearing, false);

    this.audioSuccess = new Audio('https://static.eljest.se/oot_fanfare_item.wav');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  align-items: center;
  color: #FFF;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
}
.aux {
  font-size: 1rem;
}
.new-location {
  background-color: rgba(0,188,212,0.8);
  border: 0;
  color: #FFF;
  border-radius: 5px;
  font-size: 1rem;
  padding: 10px 16px;
  text-transform: uppercase;
}
</style>
