<template>
    <Header :v-if="profile" :header_title=profile.display_name header_background="profile" />
</template>

<script>

import axios from 'axios';
import Header from '../common/Header'

export default {
    components: {Header},
    data() {
      return {
          profile: null
      }
    },
    methods : {
        async getUser(){
            if(localStorage.profile){
              await this.getUserFromLocal();
            }else{
              await this.getUserFromAPI();
            }
        },
        async getUserFromAPI(){
          const url = "https://yourmusichabit.herokuapp.com/api/user"
            const response = await axios.get(url, {
                headers: {
                    Authorization: "Bearer " + localStorage.access_token,
                    "Access-Control-Allow-Origin": "*",
                }
            });
            const profile = response.data.data;
            this.profile = profile
            localStorage.setItem('profile', JSON.stringify(profile));
        },
        async getUserFromLocal(){
          this.profile = JSON.parse(localStorage.getItem('profile'));
        }
    },
    async mounted(){
      await this.getUser(this.term);
    }
}
</script>