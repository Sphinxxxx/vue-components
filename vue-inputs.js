Vue.component('slider', {
    template: `
        <label class="slider" :class="classes">
            <span class="caption">{{ caption }}</span>
            <input :value="proxy" type="range" v-bind="attr" @input="handleInput" />
            <input :value="proxy" type="number" :step="attr && attr.step" @change="handleInput" />
            <span class="message" v-show="msg">{{ msg }}</span>
        </label>
    `,
    props: ['caption', 'val', 'attr', 'validator'],
    data() {
        return {
            forceUpdateHack: 0,
            error: null,
        };
    },
    computed: {
        proxy: {
            get() {
                if (this.forceUpdateHack < 0) { return 58008; }
                //console.log('get', this.val);
                return this.val;
            },
        },
        classes() {
            const co = this.error && this.error.coerced;
            return {
                error: this.error,
                coerced: (co || (co === 0)),
            };
        },
        msg() {
            return this.error?.message;
        }
        //out() {
        //    const step = this.attr?.step || 1;
        //    return (step < 1) ? this.val.toFixed(1) : this.val;
        //},
    },
    model: {
        prop: 'val',
        event: 'do_it',
    },
    methods: {
        handleInput(e) {
            const str = e.target.value;
            //console.log('in', JSON.stringify(str));
            let num;
            if(str) {
                num = Number(str);
            }
            //https://github.com/vuejs/vue/issues/4742
            else {
                const def = this.default;
                if (def || (def === 0)) {
                    num = def;
                }
                else {
                    num = null;
                }
            }
            this.update(num);
        },
        update(newVal) {
            const err = this.validator && this.validator(newVal);
            this.error = err;

            if(err) {
                //If there is a validation error we have three options, depending on `err.coerced`:
                //  #1: Use the value anyway, but display an error (no err.coerced)
                //  #2: Correct the value into something usable (err.coerced !== newVal),
                //  #3: Discard the value and display an error (err.coerced === newVal)
                const co = err.coerced;
                if(co || (co === 0)) {
                    if(co !== newVal) {
                        // #2
                        newVal = co;
                        //By Vue reactivity, this forces the input fields to revert to the coerced value:
                        this.forceUpdateHack++;
                    }
                    else {
                        // #3
                        //Remove the `coerced` property so our CSS classes update correctly:
                        err.coerced = undefined;
                        return;
                    }
                }
            }
            this.$emit('do_it', newVal);
        },
    },
});
