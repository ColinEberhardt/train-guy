async function emitText(text, callback, done) {
  const parts = text.split(" ");
  let index = 0;
  let pause = false;

  const interval = setInterval(() => {
    if (pause) {
      pause = false;
      return;
    }
    if (index < parts.length - 1) {
      const word = parts[index];
      callback(word + " ");
      index++;
      const lastChar = word.slice(-1);
      if (lastChar === "." || lastChar === ",") pause = true;
    } else {
      done();
      clearInterval(interval);
    }
  }, 50);
}

const app = Vue.createApp({});

const pickRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

app.component("train-guy", {
  data() {
    return {
      submitted: false,
      finished: false,
      wearing: "",
      location: "",
      context: "",
      summary: "",
      output: "",
      message: "Hello Vue!",
      wearingOptions: [
        "an orange polo neck",
        "a flat cap",
        "a JavaScript T-Shirt",
        "a balaclava",
        "a moustache",
        "NHS glasses",
        "a snazzy blazor",
        "a pin-striped suit",
      ],
      locationOptions: [
        "isolating",
        "at the gym",
        "in New York",
        "on the train to London",
        "in starbucks",
        "stuck in traffic",
        "on the golf course",
      ],
      contextOptions: [
        "pivot to blockchain",
        "get some VC funding",
        "take bitcoin payments",
        "build brand awareness",
        "create a startup",
        "cut costs",
        "think bigger",
      ],
    };
  },
  created() {
    this.wearing = pickRandomElement(this.wearingOptions);
    this.location = pickRandomElement(this.locationOptions);
    this.context = pickRandomElement(this.contextOptions);
  },
  methods: {
    reset: function () {
      this.wearing = pickRandomElement(this.wearingOptions);
      this.location = pickRandomElement(this.locationOptions);
      this.context = pickRandomElement(this.contextOptions);
      this.finished = false;
      this.output = "";
      this.summary = "";
      this.submitted = false;
    },
    generate: async function () {
      console.log("generate", this.wearing, this.location, this.context);
      this.submitted = true;
      this.summary = `${this.wearing}, ${this.location}, ${this.context}`;
      this.output = "...";
      const response = pickRandomElement(
        responses.filter((d) => d.key === this.summary)
      );
      emitText(
        response.response,
        (text) => {
          if (this.output === "...") {
            this.output = text;
          } else {
            this.output += text;
          }
        },
        () => {
          this.finished = true;
        }
      );
    },
  },
  template: `
<div>
  <div class="input" v-if="!submitted">
    <label>Train guy is:</label>
    <select v-model="location">
      <option v-for="option in locationOptions">
        {{ option }}
      </option>
    </select>, 

    <label>Col is wearing:</label>
    <select v-model="wearing">
      <option v-for="option in wearingOptions">
        {{ option }}
      </option>
    </select>, 

    <label>Jeff Lynton wants us to:</label>
    <select v-model="context">
      <option v-for="option in contextOptions">
        {{ option }}
      </option>
    </select>,

    

    <button v-on:click="generate">Generate ...</button>
  </div>
  <div class="context" v-if="submitted">{{ summary }}</div>
  <div class="output" v-if="submitted">{{ output }}</div>
  <div class="output" v-if="finished">Would you like to <button v-on:click="reset">Have another go?</button></div>
</div>
`,
});

app.mount("#app");
