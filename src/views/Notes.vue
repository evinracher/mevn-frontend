<template>
  <div class="container pt-4">
    <b-alert
      :show="dismissCountDown"
      dismissible
      :variant="message.color"
      @dismissed="dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
    >
      {{ message.text }}
    </b-alert>
    <form @submit.prevent="editNote" v-if="editing">
      <h4>Edit note</h4>
      <input
        v-model="note.name"
        type="text"
        placeholder="Name"
        class="form-control my-2"
      />
      <input
        v-model="note.description"
        type="text"
        placeholder="Description"
        class="form-control my-2"
      />
      <b-button @click.prevent="deactiveEditForm" class="mx-2"
        >Cancelar</b-button
      >
      <b-button type="submit" class="btn-info">Save</b-button>
    </form>
    <form @submit.prevent="addNote" v-else>
      <h4>New note</h4>
      <input
        v-model="note.name"
        type="text"
        placeholder="Name"
        class="form-control my-2"
      />
      <input
        v-model="note.description"
        type="text"
        placeholder="Description"
        class="form-control my-2"
      />
      <b-button type="submit" class="btn-success my-2 btn-block">Add</b-button>
    </form>
    <table class="table mt-5">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="note in notes" :key="note.id">
          <th scope="row">{{ note._id }}</th>
          <td>{{ note.name }}</td>
          <td>{{ note.description }}</td>
          <td>
            <b-button @click="deleteNote(note._id)" class="btn-sm btn-danger">
              Delete
            </b-button>
            <b-button
              @click="activeEditForm(note._id)"
              class="btn-sm btn-warning mx-2"
            >
              Edit
            </b-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      notes: [],
      note: { name: "", description: "" },
      message: { color: "success", text: "" },
      dismissSecs: 5,
      dismissCountDown: 0,
      editing: false,
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  created() {
    this.listNotes();
  },
  methods: {
    listNotes() {
      let config = {
        headers: {
          token: this.token,
        },
      };
      // using VueAxios
      this.axios
        .get("/notes", config)
        .then((res) => {
          this.notes = res.data;
        })
        .catch(({ response }) => console.error(response));
    },
    addNote() {
      let config = {
        headers: {
          token: this.token,
        },
      };
      this.axios
        .post("/notes", this.note, config)
        .then((res) => {
          this.notes.push(res.data);
          this.note = { name: "", description: "" };
          this.message.text = "Note added";
          this.message.color = "success";
          this.showAlert();
        })
        .catch(({ response }) => {
          if (response.data.error.errors.name.message) {
            this.message.text = response.data.error.errors.name.message;
          } else {
            this.message.text = "Error system";
          }
          this.message.color = "danger";
          this.showAlert();
          console.error(response);
        });
    },
    deleteNote(id) {
      let config = {
        headers: {
          token: this.token,
        },
      };
      this.axios
        .delete("/notes/" + id, config)
        .then((res) => {
          this.notes = this.notes.filter((item) => item._id != id);
          this.note = { name: "", description: "" };
          this.message.text = "Note deleted";
          this.message.color = "warning";
          this.showAlert();
        })
        .catch(({ response }) => {
          if (response.data.error?.errors.name.message) {
            this.message.text = response.data.error.errors.name.message;
          } else {
            this.message.text = "Error system";
          }
          this.message.color = "danger";
          this.showAlert();
          console.error(response);
        });
    },
    activeEditForm(id) {
      this.editing = true;
      let config = {
        headers: {
          token: this.token,
        },
      };
      this.axios
        .get("/notes/" + id, config)
        .then((res) => {
          this.note = res.data;
        })
        .catch(({ response }) => console.error(response));
    },
    deactiveEditForm() {
      this.editing = false;
      this.note = { name: "", description: "" };
    },
    editNote() {
      let config = {
        headers: {
          token: this.token,
        },
      };
      const note = this.note;
      this.axios
        .put("/notes/" + note._id, note, config)
        .then((res) => {
          this.notes = this.notes.map((item) =>
            item._id === note._id ? note : item
          );
          this.note = { name: "", description: "" };
          this.editing = false;
          this.message.text = "Note edited";
          this.message.color = "success";
          this.showAlert();
        })
        .catch(({ response }) => {
          if (response.data.error.errors.name.message) {
            this.message.text = response.data.error.errors.name.message;
          } else {
            this.message.text = "Error system";
          }
          this.message.color = "danger";
          this.showAlert();
          console.error(response);
        });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
  },
};
</script>

<style>
</style>