<script setup lang="ts"></script>

<template>
  <header>
    <div class="navbar bg-base-100">
      <div class="flex-1">
        <RouterLink to="/" class="font-serif text-xl font-light btn btn-ghost"
          >Art Gallery</RouterLink
        >
      </div>
      <div class="flex-none gap-2">
        <!-- TODO: form to search -->
        <div class="form-control">
          <input
            type="text"
            placeholder="Search Artworks"
            class="w-24 input input-bordered md:w-auto"
          />
        </div>
        <ul class="px-1 menu menu-horizontal">
          <li>
            <details>
              <summary>Art & Artists</summary>
              <ul class="p-2 rounded-t-none bg-base-100">
                <li><RouterLink to="#TODO:">Artworks</RouterLink></li>
                <li><RouterLink to="#TODO:">Artists</RouterLink></li>
              </ul>
            </details>
          </li>
          <li><RouterLink to="/about">About</RouterLink></li>
        </ul>
      </div>
    </div>
  </header>

  <RouterView />
</template>
