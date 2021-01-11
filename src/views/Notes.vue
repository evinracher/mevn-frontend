<template>
  <div class="container">
    <b-alert
      :show="dismissCountDown"
      dismissible
      :variant="message.color"
      @dismissed="dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
    >
      {{ message.text }}
    </b-alert>
    <form @submit.prevent="updateNote" v-if="editing">
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
    <Paginator />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import Paginator from "../../components/Paginator.vue";
export default {
  components: { Paginator },
  data() {
    return {
      note: { name: "", description: "" },
      dismissSecs: 5,
      dismissCountDown: 0,
      editing: false,
    };
  },
  computed: {
    ...mapState(["token", "notes", "message"]),
    ...mapGetters(["config"]),
  },
  methods: {
    ...mapActions(["addNoteAction", "deleteNoteAction", "updateNoteAction"]),
    addNote() {
      this.showAlert();
      this.addNoteAction(this.note);
      if (this.message.type !== "error") {
        this.note = { name: "", description: "" };
      }
    },
    deleteNote(id) {
      this.deleteNoteAction(id);
      this.showAlert();
      this.note = { name: "", description: "" };
      this.editing = false;
    },
    activeEditForm(id) {
      this.editing = true;
      this.axios
        .get("/notes/" + id, this.config)
        .then((res) => {
          this.note = res.data;
        })
        .catch(({ response }) => console.error(response));
    },
    deactiveEditForm() {
      this.editing = false;
      this.note = { name: "", description: "" };
    },
    updateNote() {
      this.updateNoteAction(this.note);
      if (this.message.type !== "error") {
        this.note = { name: "", description: "" };
        this.editing = false;
      }
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