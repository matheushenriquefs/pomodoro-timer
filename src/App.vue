<script setup lang="ts">
import { TheTimer } from "./components/TheTimer";
</script>

<template>
  <div class="timer-wrapper">
    <TheTimer />
  </div>
</template>

<style>
.timer-wrapper {
  align-items: center;
  background-color: var(--red-300);
  display: flex;
  height: 100%;
  justify-content: center;
}
</style>
