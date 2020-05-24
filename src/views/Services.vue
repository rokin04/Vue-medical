<template>
<div>
  <v-data-table
    :headers="headers"
    :items="this.services"
    :search="search"
    hide-default-footer
    class="elevation-1"
    :page.sync="page"
    :items-per-page="itemsPerPage"
    @page-count="pageCount = $event"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>{{`Services (${value.length})`}}</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
        ></v-text-field>
        <v-btn @click="newService()" class="mx-1" fab>
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-form
              ref="form"
              v-model="valid">
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field @input="$v.editedItem.officeCode.$touch()"
                      @blur="$v.editedItem.officeCode.$touch()" :error-messages="officeCodeErrors" v-model="editedItem.officeCode" label="Office code"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.description" label="Description"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field required @input="$v.editedItem.billingCode.$touch()"
                      @blur="$v.editedItem.billingCode.$touch()" :error-messages="billingCodeErrors" v-model="editedItem.billingCode" label="Billing code"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field required @input="$v.editedItem.baseCharge.$touch()"
                      @blur="$v.editedItem.baseCharge.$touch()" :error-messages="baseChargeErrors" v-model="editedItem.baseCharge" label="Base charge"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn :disabled="!valid" color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
  <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
</div>
</template>

<script>
  import { mapState, mapActions } from "vuex";
  import { validationMixin } from 'vuelidate'
  import { required, minLength } from 'vuelidate/lib/validators'

  export default {
    name: 'Services',
    mixins: [validationMixin],
    validations: {
      editedItem: {
        officeCode: { required, minLength: minLength(3) },
        billingCode: { required },
        description: { required, minLength: minLength(10) },
        baseCharge: { required, minLength: minLength(1) },
      }
    },

    data: () => ({
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      valid: true,
      value: [],
      search: '',
      dialog: false,
      headers: [
        {
          text: 'Office code',
          align: 'centre',
          sortable: false,
          value: 'officeCode',
        },
        { text: 'Description', value: 'description',
          sortable: false },
        { text: 'Billing code', value: 'billingCode', 
          sortable: false },
        { text: 'Base charge', value: 'baseCharge', class: 'icon',
          sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        officeCode: '',
        description: '',
        billingCode: '',
        baseCharge: 0
      },
      defaultItem: {
        officeCode: '',
        description: '',
        billingCode: '',
        baseCharge: 0
      },
    }),

    computed: {
      ...mapState({
      services: state => state.Services
    }),
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
      officeCodeErrors () {
        const errors = []
        if (!this.$v.editedItem.officeCode.$dirty) return errors
        !this.$v.editedItem.officeCode.minLength && errors.push('officeCode must be at most 3 characters long')
        !this.$v.editedItem.officeCode.required && errors.push('officeCode is required.')
        return errors
      },
      billingCodeErrors () {
        const errors = []
        if (!this.$v.editedItem.billingCode.$dirty) return errors
        !this.$v.editedItem.billingCode.required && errors.push('Billing Code is required')
        return errors
      },
      baseChargeErrors () {
        const errors = []
        if (!this.$v.editedItem.baseCharge.$dirty) return errors
        !this.$v.editedItem.baseCharge.minLength && errors.push('Base Charge must be at most 1 characters long')
        !this.$v.editedItem.baseCharge.required && errors.push('description is required.')
        return errors
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    async mounted() {
    this.value = localStorage.getItem('myServices') ? JSON.parse(localStorage.getItem('myServices')) : await fetch('serviceData.json')
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('myServices', JSON.stringify(data))
        return data;
      });
      this.initialUpdateService(this.value);
  },

    methods: {
      ...mapActions(["updateService", "initialUpdateService"]),
      newService() {
        this.$router.push('/newService');
      },

      editItem (item) {
        this.editedIndex = this.services.indexOf(item);
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.services.indexOf(item)
        confirm('Deleting item will not be removed from Local Storage, after refresh deleted entries will be displayed, this behaviour is just for POC purpose and intentional') && this.services.splice(index, 1)
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
      this.$v.$touch()
      if (this.editedIndex > -1) {
          this.editedItem = Object.assign(this.services[this.editedIndex], this.editedItem);
          this.value[this.editedIndex] = this.editedItem;
          localStorage.setItem('myServices', JSON.stringify(this.value));
          this.close();
        }
      },
    },
  }
</script>
<style scoped>
  .icon:before {
    content: url('/icon-dollar');
  }
</style>