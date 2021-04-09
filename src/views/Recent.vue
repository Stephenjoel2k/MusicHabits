<template>
    <v-container width=80 justify-center>
 
      <Header header_title="Your Recents" header_background='recent' />
      <Recent />
      <Redirect />

    </v-container>

</template>

<script>

  import Header from '@/components/common/Header';
  import Redirect from '@/components/common/Redirect';

  import Recent from '@/components/recent/Recent';

  export default {
    components: {Header, Recent, Redirect},
    data(){
      return{

      }
    }
  }
</script>


<style scoped>
  .container{
    padding: 0!important;
  }
</style>