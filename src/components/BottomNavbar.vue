<template>
  <v-card
  >
    <v-bottom-navigation dark app class="d-md-none black" fixed grow>
      
      <v-btn to=/profile text>
        <span>Profile</span>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>

      <v-btn to=/dashboard text>
        <span>Dashboard</span>
        <v-icon>mdi-chart-histogram</v-icon>
      </v-btn>
      

    </v-bottom-navigation>
  </v-card>
</template>

<script>
export default {
   data() {
    return {
    }
  }
}
</script>