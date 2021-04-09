<template>
  <v-app>
    <Navbar />   
    <v-main>
      <v-banner
        v-if="deferredPrompt" color="info" dark class="text-left">
        Get our free app. It won't take up space on your phone and also works offline!
        <template v-slot:actions>
          <v-btn text @click="dismiss">Dismiss</v-btn>
          <v-btn text @click="install">Install</v-btn>
        </template>
    </v-banner>   
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
      deferredPrompt: null
    };
  },
  created() {
    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
    });
  },
  methods: {
    async dismiss() {
      this.deferredPrompt = null;
    },
    async install() {
      this.deferredPrompt.prompt();
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
    background: #EAEBEB;
    overflow-x: hidden;
  }
</style>