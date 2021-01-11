<template>
  <div class="container">
    <h1>Login</h1>
    <b-alert variant="warning" :show="message != ''">
      {{ message }}
    </b-alert>
    <form @submit.prevent="login">
      <input
        v-model="user.email"
        type="text"
        placeholder="email"
        class="form-control my-2"
      />
      <input
        v-model="user.password"
        type="password"
        placeholder="password"
        class="form-control my-2"
      />
      <b-button type="submit" class="btn-block btn-info my-2">Log in</b-button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      user: { email: "", password: "" },
      message: "",
    };
  },
  methods: {
    ...mapActions(["setToken"]),
    login() {
      this.axios
        .post("/login", this.user)
        .then((res) => {
          this.message = "";
          this.setToken(res.data.token);
        })
        .catch(({ response }) => {
          console.error(response);
          this.message = response.data.message;
        });
    },
  },
};
</script>
