<template>
  <div id="app">
    <div>
      <b-navbar toggleable="md" type="dark" variant="info">
        <b-navbar-brand href="#">Note taking App</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>
            <b-nav-item v-if="user" to="/notes">Notes</b-nav-item>
            <b-nav-item v-if="!user" to="/login">Log in</b-nav-item>
            <b-nav-item v-if="!user" to="/sign-up">Sign up</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown v-if="user" right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em class="mr-1">{{ user.name }}</em>
              </template>
              <b-dropdown-item @click="logOut">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <div class="pt-5">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  methods: {
    ...mapActions(["logOut", "getToken"]),
  },
  computed: {
    ...mapGetters(["user"]),
  },
  created() {
    this.getToken();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
