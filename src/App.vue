<template>
  <div class="content-container" id="app">
    <v-home id="home"></v-home>
  </div>
</template>

<script>
import vHome from './components/v-home'

export default {
  name: 'app',
  components: {
    'v-home': vHome,
  }
}
</script>

<style>
.content-container {
  color: #FFF;
  display: flex;
  flex-direction: column;
  font-display: swap;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 2rem;
  min-height: 100vh;
}
</style>
