<template>
  
  <v-app>
    <Navbar /> 
    <v-main class="ma-5">
      <router-view></router-view>
    </v-main>
    <BottomNavbar />
  </v-app>
</template>

<script>
import Navbar from './components/Navbar'
import BottomNavbar from './components/BottomNavbar'

export default {
  name: 'App',
  components: { Navbar, BottomNavbar },
  data: () => ({

  }),
  methods: {
    isValidStorage() {
      //if the user had previously logged in then handle token
      if(localStorage.expiry && localStorage.access_token){
        const time = new Date();
        const expiry = new Date(localStorage.expiry);
        if(expiry <= time){
          localStorage.removeItem("access_token");
          localStorage.removeItem("expiry");
          window.location.href = 'https://yourmusichabit.herokuapp.com/auth/login';
        }
      }
    }
  },
  mounted: function () {
        this.$nextTick(function () {
            window.setInterval(() => {
                this.isValidStorage()
            },100000);
        })
    }
};
</script>


<style>
  #app{
    background: #EAEBEB;
  }
</style>