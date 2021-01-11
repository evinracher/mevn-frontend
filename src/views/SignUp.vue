<template>
  <div class="container">
    <h1>Sign up</h1>
    <b-alert variant="warning" :show="message.text != ''">
      {{ message.text }}
    </b-alert>
    <form @submit.prevent="signUp">
      <input
        v-model.lazy="$v.name.$model"
        type="text"
        placeholder="name"
        class="form-control my-2"
        :class="{ 'is-invalid': $v.name.$error }"
      />
      <p class="text-danger" v-if="$v.$error && !$v.name.required">
        This field is required
      </p>
      <input
        v-model.lazy="$v.email.$model"
        type="email"
        placeholder="email"
        class="form-control my-2"
        :class="{ 'is-invalid': $v.email.$error }"
      />
      <p class="text-danger" v-if="$v.$error && !$v.email.email">
        This email is incorrect
      </p>
      <p class="text-danger" v-if="$v.$error && !$v.email.required">
        This field is required
      </p>
      <input
        v-model.lazy="$v.password.$model"
        type="password"
        placeholder="password"
        class="form-control my-2"
        :class="{ 'is-invalid': $v.password.$error }"
      />
      <p class="text-danger" v-if="$v.$error && !$v.password.required">
        This field is required
      </p>
      <p class="text-danger" v-if="$v.$error && !$v.password.minLength">
        Password must have at least
        {{ $v.password.$params.minLength.min }} letters.
      </p>
      <input
        v-model.lazy="$v.confirmPassword.$model"
        type="password"
        placeholder="confirm password"
        class="form-control my-2"
        :class="{ 'is-invalid': $v.confirmPassword.$error }"
      />
      <p
        class="text-danger"
        v-if="$v.$error && !$v.confirmPassword.sameAsPassword"
      >
        Passwords must be identical.
      </p>
      <b-button type="submit" class="btn-block btn-info my-2">Sign up</b-button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { required, email, sameAs, minLength } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  },
  computed: {
    ...mapState(["message"]),
  },
  validations: {
    name: {
      required,
    },
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(6),
    },
    confirmPassword: {
      sameAsPassword: sameAs("password"),
    },
  },
  methods: {
    ...mapActions(["setErrorMessage"]),
    signUp() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.setErrorMessage(null);
        this.axios
          .post("/users", {
            name: this.name,
            email: this.email,
            password: this.password,
          })
          .then((res) => {
            this.$router.push({ name: "Login" });
          })
          .catch(({ response }) => {
            let text = "Error system";
            console.error(response.data.error.message);
            if (response.data.error?.message) {
              text = response.data.error.message;
            }
            this.setErrorMessage(text);
          });
      }
    },
  },
};
</script>
