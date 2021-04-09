<template>
    <!-- This page should display the member's history with the app -->
     <v-container width=80 justify-center>
        <Profile />
        <Stats />


        <Redirect />
    </v-container>



</template>

<script>

  import Redirect from '@/components/common/Redirect';
  import Profile from '@/components/profile/Profile';
  import Stats from '@/components/profile/Stats';

  export default {
    components: {Redirect, Profile, Stats},

  }
</script>

<style scoped>
  .container{
    padding: 0!important;
  }
</style>