<template>
    <div class="Home">
      <v-container width=80 justify-center>
      <!-- Display if content is true -->
        <div v-if="content">
          <h2>Please Connect with spotify to continue!</h2>
          <!-- Placeholder until hosted -->
          <v-btn color="green" href= "https://yourmusichabit.herokuapp.com/auth/login"> 
            <v-icon left>mdi-import</v-icon>
            <span>Spotify</span>
          </v-btn>
        </div>
      </v-container>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        content: false
      }
    },
    methods: {
        isValid(){
          if(localStorage.expiry && localStorage.access_token){
          const time = new Date();
          const expiry = new Date(localStorage.expiry);
          if(expiry <= time){
            localStorage.removeItem("access_token");
            localStorage.removeItem("expiry");
            window.location.href = 'https://yourmusichabit.herokuapp.com/auth/login';
          }else{
            this.$router.push('/dashboard')
          }
        }
      }
    },
    async mounted(){

      this.isValid();

      if(this.$route.query.access_token != undefined && this.$route.query.access_token != null){
          const access_token = this.$route.query.access_token;
          localStorage.access_token = access_token;
          const time = new Date();
          time.setMinutes(time.getMinutes() + 59);
          localStorage.expiry = time;
          this.$router.push('dashboard');
      }
      this.content = true;
    }
  }
</script>