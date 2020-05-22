<template>
  <v-card
    class="mx-auto"
    max-width="800"
  >
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline">New Service</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <form class="side-align">
    <v-text-field
      v-model="serv.officeCode"
      :error-messages="officeCodeErrors"
      :counter="3"
      label="Office Code"
      required
      @input="$v.serv.officeCode.$touch()"
      @blur="$v.serv.officeCode.$touch()"
    ></v-text-field>
    <v-text-field
      v-model="serv.billingCode"
      :error-messages="billingCodeErrors"
      label="Billing Code"
      required
      @input="$v.serv.billingCode.$touch()"
      @blur="$v.serv.billingCode.$touch()"
    ></v-text-field>
    <v-text-field
      v-model="serv.description"
      :counter="10"
      label="Description"
      required
      @input="$v.serv.description.$touch()"
      @blur="$v.serv.description.$touch()"
    ></v-text-field>
    <v-container fluid>
      <v-radio-group v-model="serv.uom" row label="UOM Type" margin-right="80">
        <v-radio label="Days" value="days"></v-radio>
        <v-radio label="Units" value="units"></v-radio>
      </v-radio-group>
    </v-container>
    <v-text-field
      type="number"
      v-model="serv.baseCharge"
      :error-messages="baseChargeErrors"
      label="Base Charge"
      required
      @input="$v.serv.baseCharge.$touch()"
      @blur="$v.serv.baseCharge.$touch()"
    ></v-text-field>
    <v-container fluid class="text-right">
      <v-radio-group v-model="serv.claim" row label="Claim Type" margin-right="80">
        <v-radio label="Professional" value="professional"></v-radio>
        <v-radio label="Institutional" value="institutional"></v-radio>
      </v-radio-group>
      <v-radio-group v-model="serv.service" row label="Service Type" margin-right="80">
        <v-radio label="Group" value="group"></v-radio>
        <v-radio label="Individual" value="individual"></v-radio>
      </v-radio-group>
    </v-container>
    <v-card
    class="mx-auto"
    max-width="800"
    outlined
  >
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline">Modifier</v-list-item-title>
      </v-list-item-content>
      <v-row>
      <v-col class="text-right">
        <div class="my-2">
          <v-btn @click="dialog=!dialog" fab small>
            <v-icon color="primary">mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    </v-list-item>
    <v-list-item two-line>
      <template v-for="item in addModifier" >
      <v-chip
        :key="item"
        :input-value="item"
        close
        @click:close="remove(item)"
      >
        <strong>{{ item }}</strong>&nbsp;
        <span></span>
      </v-chip>
    </template>
    </v-list-item>
  </v-card>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add Modifier</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-combobox
              v-model="chips"
              :items="items"
              chips
              clearable
              label="Your favorite hobbies"
              multiple
            >
          </v-combobox>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">CANCEL</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">ADD</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
   <v-col class="text-right">
    <v-btn class="mr-4" color="blue-grey" @click="clear">cancel</v-btn>
    <v-btn @click="submit" outlined color="indigo">save</v-btn>
   </v-col>
  </form>
  </v-card>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, minLength } from 'vuelidate/lib/validators'

  export default {
    name:"newService",
    mixins: [validationMixin],

    validations: {
      serv: {
        officeCode: { required, minLength: minLength(3) },
        billingCode: { required },
        description: { required, minLength: minLength(10) },
        baseCharge: { required, minLength: minLength(1) },
      }
    },

    data: () => ({
      serv: {
        officeCode: '',
        billingCode: '',
        description: '',
        baseCharge: '',
        uom: "days",
        claim: "professional",
        service: "group"
      },
      dialog: false,
      chips: [],
      items: ['Streaming', 'Eating'],
    }),

    computed: {
      officeCodeErrors () {
        const errors = []
        if (!this.$v.serv.officeCode.$dirty) return errors
        !this.$v.serv.officeCode.minLength && errors.push('officeCode must be at most 3 characters long')
        !this.$v.serv.officeCode.required && errors.push('officeCode is required.')
        return errors
      },
      billingCodeErrors () {
        const errors = []
        if (!this.$v.serv.billingCode.$dirty) return errors
        !this.$v.serv.billingCode.required && errors.push('Billing Code is required')
        return errors
      },
      baseChargeErrors () {
        const errors = []
        if (!this.$v.serv.baseCharge.$dirty) return errors
        !this.$v.serv.baseCharge.minLength && errors.push('Base Charge must be at most 1 characters long')
        !this.$v.serv.baseCharge.required && errors.push('description is required.')
        return errors
      },
      addModifier () {
        return this.chips;
      }
    },

    methods: {
      async submit () {
        var existing = localStorage.getItem('myServices');
        existing = JSON.parse(existing);
        existing.push(this.serv);
        localStorage.setItem('myServices', JSON.stringify(existing));
        this.$router.push('/');
        this.$v.serv.$touch()
      },
      remove (item) {
        this.chips.splice(this.chips.indexOf(item), 1)
        this.chips = [...this.chips]
      },
      clear () {
        this.$v.serv.$reset()
        this.officeCode = ''
        this.billingCode = ''
        this.description = ''
        this.baseCharge = ''
      },
    },
  }
</script>
<style scoped>
  .side-align{
    padding: 25px;
  }
</style>