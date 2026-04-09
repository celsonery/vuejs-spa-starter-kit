<template>
  <router-link to="/dashboard">
    <div class="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shrink-0">
      <img
        src="/assets/logo.svg"
        alt="Oregon Tecnologia"
        class="h-8 w-8"
      >
    </div>
    <div class="flex flex-col leading-none ml-2 group-data-[state=collapsed]:hidden">
      <span class="text-[17px] font-black tracking-tighter uppercase italic">Oregon</span>
      <span class="text-[8px] text-blue-400 font-bold tracking-[0.2em] uppercase">Tecnologia</span>
    </div>
  </router-link>
</template>
