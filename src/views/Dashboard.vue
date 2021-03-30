<template>
 
     <v-container width=80 justify-center>

      <Header header_title="Dashboard" header_background='dashboard' />


      <Miniboard title="Top Artists" background='cool' route='/top-artists' />
      <Miniboard title="Top Tracks" background='cool' route='/top-tracks' />
      <Miniboard title="Recents" background='cool' route='/recently-played' />
      <Miniboard title="Discover Artists" background='cool' route='/discover-artists' />

    </v-container>



</template>

<script>

  import Header from '../components/Header';
  import Miniboard from '../components/Miniboard';

  export default {
    components: {Header, Miniboard},
    data() {
      return {
      }
    },
    async mounted(){
      if(!localStorage.access_token){
        this.$router.push('/');
      }
    }
  }
</script>