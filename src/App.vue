<script setup lang="ts">
const ok = someFn()
</script>

<template>
  <header>
    <p v-if="false">{{ ok }} | {{ someFn() }}</p>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
