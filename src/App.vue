<script setup lang="ts">
import AppMnemo from './components/AppMnemo.vue'
import ActiveAlarm from './components/ActiveAlarm.vue'
</script>

<template>
  <header>
    <nav class="nav">
      <div class="nav-left">
        <a class="brand"><img src="./assets/logo.svg" />SCADA-симулятор</a>
      </div>
    </nav>
  </header>
  <main>
    <AppMnemo></AppMnemo>
  </main>
  <footer>
    <ActiveAlarm></ActiveAlarm>
  </footer>
</template>

<style scoped>
.brand {
  font-size: 1.2em;
}

nav {
  margin-top: 10px;
}
</style>
