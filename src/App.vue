<template>
  <v-app>
    <Navbar />   
    <v-main class="ma-5">
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
     <v-snackbar bottom right :value="updateExists" :timeout="0" color="primary">
    An update is available
    <v-btn text @click="refreshApp">
      Update
    </v-btn>
  </v-snackbar>
    <BottomNavbar />
  </v-app>
</template>

<script>
import update from './mixin/update'
import Navbar from './components/Navbar'
import BottomNavbar from './components/BottomNavbar'

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
  mixins: [update],
  methods: {
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
    async dismiss() {
      this.deferredPrompt = null;
    },
    async install() {
      this.deferredPrompt.prompt();
    }
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
  }
</style>