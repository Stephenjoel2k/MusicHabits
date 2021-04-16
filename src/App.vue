<template>
  <v-app v-bind:style="bgc">
    <Navbar @toggleMode="toggleMode"/>   
    <v-main>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-main>
    <BottomNavbar />
  </v-app>
</template>

<script>
import Navbar from './components/navigation/Navbar'
import BottomNavbar from './components/navigation/BottomNavbar'

export default {
  name: 'App',
  components: { Navbar, BottomNavbar },
  data() {
    return {
      bgc: {
        backgroundColor: '',
      }
    };
  },
  methods: {
    applyTheme(){
      const theme = localStorage.getItem('theme');
      if(theme && theme == 'light'){
        this.bgc.backgroundColor = "#eaebeb";
      }else{
        this.bgc.backgroundColor = "#161b22";
        localStorage.setItem('theme', 'dark');
     }
    },
    toggleMode(mode){
      if(mode.lightMode){
        localStorage.setItem('theme', 'light') 
      }else{
        localStorage.setItem('theme', 'dark')
      }
      this.applyTheme();
    },
    isValidStorage() {
      //If user never logged in

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
    },
  },
  mounted: function () {
     this.applyTheme();
     if(!localStorage.access_token){
        this.$router.push('/');
      }
        this.$nextTick(function () {
            window.setInterval(() => {
                this.isValidStorage()
            },1000);
        })
    }
};
</script>


<style>
  #app{
    overflow-x: hidden;
  }

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

</style>